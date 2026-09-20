#!/usr/bin/env python3
from pwn import *
import os

context.log_level = "info"
context.arch = "amd64"

BIN = "./nitro"

ADDR_SECRET_CHECK = 0x40130d
ADDR_BLOB         = 0x40130e
ADDR_BLOB_END     = 0x40146b
ADDR_TABLE        = 0x402020
ADDR_TABLE_END    = 0x402020 + 0x2f
ADDR_FMT          = 0x40207e

SECRET_FILE = "/tmp/secret.bin"
BLOB_FILE   = "/tmp/blob.bin"
TABLE_FILE  = "/tmp/table.bin"
FMT_FILE    = "/tmp/fmt.bin"


def dump_after_decryption():
    p = process(["gdb", "-q", BIN], level="error")

    p.sendline(b"set pagination off")
    p.sendline(b"set confirm off")
    p.sendline(f"break *{hex(ADDR_SECRET_CHECK)}".encode())
    p.sendline(b"run AAAA")
    p.recvuntil(b"Breakpoint 1")

    # Ask GDB to write memory straight to files
    p.sendline(f"dump binary memory {SECRET_FILE} {hex(ADDR_SECRET_CHECK)} {hex(ADDR_SECRET_CHECK + 0x15e)}".encode())
    p.sendline(f"dump binary memory {BLOB_FILE}   {hex(ADDR_BLOB)} {hex(ADDR_BLOB_END)}".encode())
    p.sendline(f"dump binary memory {TABLE_FILE}  {hex(ADDR_TABLE)} {hex(ADDR_TABLE_END)}".encode())
    p.sendline(f"dump binary memory {FMT_FILE}    {hex(ADDR_FMT)} {hex(ADDR_FMT + 32)}".encode())

    p.sendline(b"kill")
    p.sendline(b"quit")
    p.recvall(timeout=3)
    p.close()

    secret = open(SECRET_FILE, "rb").read()
    blob   = open(BLOB_FILE,   "rb").read()
    table  = open(TABLE_FILE,  "rb").read()
    fmt    = open(FMT_FILE,    "rb").read()
    return secret, blob, table, fmt


def compute_flag(blob, table):
    length = len(blob)          # should be 0x15d = 349
    key    = 0x6b
    out    = bytearray()
    for i in range(0x2f):
        idx = (i * 7 + 3) % length
        b   = (blob[idx] + i * 5 + key) & 0xff
        out.append(table[i] ^ b)
    return bytes(out)


def run_for_real():
    p = process([BIN, b"n2o_boost"])
    out = p.recvall(timeout=2)
    p.close()
    return out


def main():
    log.info("Dumping decrypted memory via gdb...")
    secret, blob, table, fmt = dump_after_decryption()

    log.success(f"secret_check ({len(secret)} bytes): {secret[:16].hex()}...")
    log.success(f"blob         ({len(blob)} bytes): {blob[:16].hex()}...")
    log.success(f"table        ({len(table)} bytes): {table.hex()}")
    log.success(f"fmt          : {fmt.split(b'\x00')[0]!r}")

    if len(blob) < 0x15d:
        log.error(f"blob too short ({len(blob)} bytes) — addresses are probably wrong")
        return

    flag = compute_flag(blob, table)
    print("\n=== Computed flag ===")
    print(flag.decode(errors="replace"))

    print("\n=== Direct run output ===")
    print(run_for_real().decode(errors="replace"))


if __name__ == "__main__":
    main()
