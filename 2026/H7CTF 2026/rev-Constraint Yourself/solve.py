#!/usr/bin/env python3
"""
Cipherlock / "Constraint Yourself" - reverse engineering + constraint solving.

The binary reads a 16-byte key. It enforces three independent byte-level
constraints on the key:

  1) k[(i+3) & 15] ^ k[i]                 == A[i]   for i in 0..15
  2) (k[2i] * k[2i+1]) & 0xff             == B[i]   for i in 0..7
  3) (rol8(k[i], 3) + k[(i+5) & 15])      == C[i]   for i in 0..15   (mod 256)

If all three hold, the binary computes MD5(key) and uses it as a 128-bit
AES key to CBC-decrypt a 48-byte ciphertext (IV = 0). The plaintext is the
flag. So we solve the constraints with z3, derive the AES key, and decrypt.

The three constant tables below were read straight out of .rodata.
"""

from z3 import BitVec, Solver, sat
from hashlib import md5

# .rodata @ 0x2090 (constraint 1)
A = bytes([0x7e, 0x77, 0x64, 0x63, 0x10, 0x64, 0x1c, 0x67,
           0x1d, 0x1c, 0x60, 0x68, 0x79, 0x07, 0x15, 0x63])

# .rodata @ 0x2080 (constraint 2)
B = bytes([0xdc, 0xc4, 0x90, 0x4a, 0xe8, 0xd4, 0x98, 0x17])

# .rodata @ 0x2070 (constraint 3)
C = bytes([0xca, 0xef, 0xf5, 0xbd, 0x6c, 0xb5, 0xbb, 0xe8,
           0xf6, 0xb3, 0xd8, 0x9d, 0xa6, 0xf6, 0x36, 0xfc])

# .rodata @ 0x2040 (48-byte AES-CBC ciphertext, IV = 0)
CT = bytes([0x9e, 0x90, 0xd9, 0x98, 0x74, 0xa0, 0xe8, 0x79,
            0xe0, 0xbc, 0x46, 0x96, 0x77, 0x06, 0x1f, 0x20,
            0x6d, 0xc5, 0xee, 0x87, 0x73, 0xfe, 0x54, 0x88,
            0x77, 0xb5, 0xe9, 0xb6, 0xe3, 0xe5, 0x01, 0x12,
            0x7a, 0x3f, 0x73, 0xb4, 0xbe, 0xf3, 0x0f, 0xcf,
            0x45, 0x96, 0x85, 0xc0, 0x6e, 0x1d, 0x36, 0xc9])


def rol8(x, n):
    return ((x << n) | (x >> (8 - n))) & 0xff


def solve_key():
    k = [BitVec(f"k{i}", 8) for i in range(16)]
    s = Solver()

    # Constraint 1: k[(i+3) & 15] ^ k[i] == A[i]
    for i in range(16):
        s.add(k[(i + 3) & 15] ^ k[i] == A[i])

    # Constraint 2: (k[2i] * k[2i+1]) & 0xff == B[i]
    for i in range(8):
        s.add(k[2 * i] * k[2 * i + 1] == B[i])

    # Constraint 3: (rol8(k[i], 3) + k[(i+5) & 15]) & 0xff == C[i]
    for i in range(16):
        rotated = ((k[i] << 3) | (k[i] >> 5)) & 0xff
        s.add(rotated + k[(i + 5) & 15] == C[i])

    assert s.check() == sat, "constraints are unsatisfiable?!"
    m = s.model()
    return bytes(m[k[i]].as_long() for i in range(16))


def aes_cbc_decrypt(key, data, iv=b"\x00" * 16):
    """AES-128-CBC decrypt with no padding, via the openssl CLI."""
    from binascii import hexlify
    import subprocess
    proc = subprocess.run(
        ["openssl", "enc", "-d", "-aes-128-cbc", "-nopad",
         "-K", hexlify(key).decode(), "-iv", hexlify(iv).decode()],
        input=data, capture_output=True, check=True)
    return proc.stdout


def main():
    key = solve_key()
    print(f"[+] recovered 16-byte key : {key!r}")
    print(f"[+] key (hex)             : {key.hex()}")

    aes_key = md5(key).digest()
    print(f"[+] MD5(key) = AES key    : {aes_key.hex()}")

    pt = aes_cbc_decrypt(aes_key, CT)
    print(f"[+] raw plaintext (hex)   : {pt.hex()}")

    pad = pt[-1]
    if pad <= 0x2F:
        flag = pt[:48 - pad]
    else:
        flag = pt
    flag = flag.rstrip(b"\x00")
    print(f"[+] FLAG                  : {flag.decode(errors='replace')}")


if __name__ == "__main__":
    main()
