#!/usr/bin/env python3
"""
Lockstep / Interlock -- CTF reverse-engineering exploit.

The binary `interlock` implements a two-stage lock:

  Stage 1 (the "tumblers"):
      A 16x16 matrix A and a 16-byte target vector `expected` live in .rodata.
      The program reads a 16-character key `x` and accepts it iff, for every row i,

          expected[i] == ( sum_j A[i][j] * x[j] )  (mod 256)

      i.e. a coupled linear system over Z/256.  A has full rank mod 2, so the
      solution is unique.  We recover it with Gaussian elimination over Z/256
      (every pivot is an odd number, hence invertible modulo 256).

  Stage 2 (the token):
      key = MD5(x)                 (16 bytes -> 128-bit AES key)
      plaintext = AES-128-CBC-decrypt(ciphertext, key, IV = 0^16)

      The program then null-terminates the plaintext (with a small quirk when
      the final byte is <= 0x2f) and prints it as the flag/token.

This script reproduces both stages offline and does not depend on the binary
running.  Only `pycryptodome` is required (with an `openssl` CLI fallback).

Usage:
    python3 solve.py [--binary ./interlock]
"""

from __future__ import annotations

import argparse
import hashlib
import struct
import subprocess
import sys
from pathlib import Path

# --- Offsets inside the .rodata section (file virtual addresses) -------------
# .rodata lives at 0x2000; these are the hard-coded addresses used by main().
CT_ADDR = 0x2060        # 48-byte AES ciphertext
EXPECTED_ADDR = 0x2090  # 16 expected bytes (right-hand side of the system)
MATRIX_ADDR = 0x20A0    # 16*16 = 256-byte coefficient matrix, row-major
N = 16                  # key length / matrix dimension
CT_LEN = 48             # ciphertext length


# ---------------------------------------------------------------------------
# Minimal ELF64 .rodata extraction (no external dependencies)
# ---------------------------------------------------------------------------
def read_rodata(path: Path) -> bytes:
    blob = path.read_bytes()
    if blob[:4] != b"\x7fELF":
        raise ValueError(f"{path} is not an ELF file")

    e_shoff = struct.unpack_from("<Q", blob, 0x28)[0]
    e_shentsize = struct.unpack_from("<H", blob, 0x3A)[0]
    e_shnum = struct.unpack_from("<H", blob, 0x3C)[0]
    e_shstrndx = struct.unpack_from("<H", blob, 0x3E)[0]

    def section(i: int):
        base = e_shoff + i * e_shentsize
        sh_name, sh_type = struct.unpack_from("<II", blob, base)
        sh_addr, sh_offset, sh_size = struct.unpack_from("<QQQ", blob, base + 0x10)
        return sh_name, sh_type, sh_addr, sh_offset, sh_size

    _, _, _, str_off, str_size = section(e_shstrndx)
    shstr = blob[str_off:str_off + str_size]

    for i in range(e_shnum):
        sh_name, _, sh_addr, sh_offset, sh_size = section(i)
        end = shstr.index(b"\x00", sh_name)
        name = shstr[sh_name:end].decode()
        if name == ".rodata":
            return blob[sh_offset:sh_offset + sh_size], sh_addr
    raise ValueError(".rodata section not found")


def slice_rodata(rodata: bytes, base: int, addr: int, size: int) -> bytes:
    off = addr - base
    chunk = rodata[off:off + size]
    if len(chunk) != size:
        raise ValueError(f"short read at 0x{addr:x}")
    return chunk


# ---------------------------------------------------------------------------
# Stage 1: solve A * x = b (mod 256)
# ---------------------------------------------------------------------------
def solve_mod256(A: list[list[int]], b: list[int], n: int) -> list[int]:
    """Gaussian elimination over Z/2^8.  Requires A to be full rank mod 2."""
    # Build augmented matrix [A | b].
    M = [[A[i][j] % 256 for j in range(n)] + [b[i] % 256] for i in range(n)]

    row = 0
    for col in range(n):
        # Find a pivot in this column with an odd value (a unit mod 256).
        piv = next((r for r in range(row, n) if M[r][col] & 1), None)
        if piv is None:
            raise ValueError(f"no odd pivot in column {col}; matrix not full rank mod 2")
        M[row], M[piv] = M[piv], M[row]

        # Normalize pivot row so M[row][col] == 1 (mod 256).
        inv = pow(M[row][col], -1, 256)
        M[row] = [(v * inv) % 256 for v in M[row]]

        # Eliminate this column from every other row.
        for r in range(n):
            if r != row and M[r][col]:
                f = M[r][col]
                M[r] = [(a - f * c) % 256 for a, c in zip(M[r], M[row])]
        row += 1

    return [M[i][n] for i in range(n)]


# ---------------------------------------------------------------------------
# Stage 2: AES-128-CBC decrypt (pycryptodome, with openssl fallback)
# ---------------------------------------------------------------------------
def aes_cbc_decrypt(key: bytes, iv: bytes, ct: bytes) -> bytes:
    try:
        from Crypto.Cipher import AES  # type: ignore
        return AES.new(key, AES.MODE_CBC, iv=iv).decrypt(ct)
    except ImportError:
        pass

    # Fallback: shell out to openssl (key/iv in hex).
    proc = subprocess.run(
        ["openssl", "enc", "-d", "-aes-128-cbc", "-nopad",
         "-K", key.hex(), "-iv", iv.hex()],
        input=ct, capture_output=True, check=True,
    )
    return proc.stdout


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main() -> int:
    ap = argparse.ArgumentParser(description="Lockstep / Interlock exploit")
    ap.add_argument("--binary", default="./interlock", type=Path,
                    help="path to the challenge binary")
    args = ap.parse_args()

    rodata, base = read_rodata(args.binary)
    ct = slice_rodata(rodata, base, CT_ADDR, CT_LEN)
    expected = slice_rodata(rodata, base, EXPECTED_ADDR, N)
    table = slice_rodata(rodata, base, MATRIX_ADDR, N * N)

    A = [[table[i * N + j] for j in range(N)] for i in range(N)]

    key_bytes = solve_mod256(A, list(expected), N)
    key = bytes(key_bytes)

    print(f"[+] key bytes : {key!r}")
    print(f"[+] key hex   : {key.hex()}")

    md5 = hashlib.md5(key).digest()
    print(f"[+] MD5(key)  : {md5.hex()}  (AES-128 key)")

    pt = aes_cbc_decrypt(md5, b"\x00" * 16, ct)

    # Reproduce the binary's null-termination quirk.
    out = bytearray(pt)
    last = out[-1]
    if last <= 0x2F:
        out[0x30 - last] = 0
    token = bytes(out).split(b"\x00")[0].decode("latin-1")

    print(f"[+] plaintext : {pt!r}")
    print(f"[+] FLAG      : {token}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
