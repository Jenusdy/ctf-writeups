#!/usr/bin/env python3
"""
Solver for "Rust in Peace" (H7CTF, Rev / Static).

The binary `ferric` reads a license from stdin and only accepts a 16-byte
string.  For every byte i it computes:

    c[i] = rotl8( input[i] ^ key1[i], key2[i] & 7 ) + key3[i]   (mod 256)

and requires c[i] == target[i].  All four 16-byte tables live in .rodata.

This script pulls the tables straight out of the ELF (vaddr == file offset
inside .rodata), inverts the transform to recover the license, and can run
the binary to print the token.

Usage:
    python3 solve.py            # recover the license and run ./ferric
    python3 solve.py ferric     # same, explicit binary path
"""

import subprocess
import sys

BINARY = sys.argv[1] if len(sys.argv) > 1 else "ferric"

# --- table locations (virtual address == file offset in .rodata) ----------
KEY1_OFF = 0x5140   # XOR key
KEY2_OFF = 0x5180   # rotate amounts (low 3 bits used)
KEY3_OFF = 0x51B0   # additive key
TGT_OFF = 0x52B0    # expected ciphertext
N = 16


def rotl8(x: int, r: int) -> int:
    r %= 8
    return ((x << r) | (x >> (8 - r))) & 0xFF


def rotr8(x: int, r: int) -> int:
    r %= 8
    return ((x >> r) | (x << (8 - r))) & 0xFF


def load_tables(path: str):
    data = open(path, "rb").read()
    tables = {}
    for name, off in (("key1", KEY1_OFF), ("key2", KEY2_OFF),
                      ("key3", KEY3_OFF), ("target", TGT_OFF)):
        tables[name] = data[off:off + N]
    return tables


def recover_license(tables) -> bytes:
    key1, key2, key3, tgt = (tables["key1"], tables["key2"],
                             tables["key3"], tables["target"])
    lic = bytearray()
    for i in range(N):
        rolled = (tgt[i] - key3[i]) & 0xFF          # rotl8(...) == rolled
        raw = rotr8(rolled, key2[i] & 7)            # undo the rotation
        lic.append(raw ^ key1[i])                   # undo the XOR
    return bytes(lic)


def verify(lic: bytes, tables) -> bool:
    key1, key2, key3, tgt = (tables["key1"], tables["key2"],
                             tables["key3"], tables["target"])
    return all(
        (rotl8(lic[i] ^ key1[i], key2[i] & 7) + key3[i]) & 0xFF == tgt[i]
        for i in range(N)
    )


def main() -> None:
    tables = load_tables(BINARY)
    lic = recover_license(tables)

    print(f"[+] license (hex) : {lic.hex()}")
    print(f"[+] license (ascii): {lic.decode('latin-1')}")
    assert verify(lic, tables), "round-trip verification failed!"
    print("[+] round-trip verify: OK")

    # Feed the license to the real binary to get the token.
    try:
        out = subprocess.run(
            [f"./{BINARY}"],
            input=lic + b"\n",
            capture_output=True,
        )
        print("[+] binary output:")
        print("    " + out.stdout.decode(errors="replace").strip())
    except FileNotFoundError:
        print(f"[!] could not execute ./{BINARY}; run it manually:")
        print(f"    printf '{lic.decode()}\\n' | ./{BINARY}")


if __name__ == "__main__":
    main()
