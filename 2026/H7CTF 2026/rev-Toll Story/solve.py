#!/usr/bin/env python3
"""
Toll Story - H7CTF reverse engineering solver
=============================================

The challenge binary ("tollgate") is a stripped, statically linked Go program.

Gate logic (recovered from main.main / main.unlock):

  1. The admin token is read from argv[1] or stdin and must be exactly 16 bytes.
     Each little-endian 32-bit word of the token is checked with:

         W  = bswap32(word)                 # big-endian view of the 4 bytes
         t  = rol32(W ^ T3[i], T1[i])
         ok = ((t + T4[i]) & 0xffffffff) == T2[i]

     The transform is fully invertible, so the token can be recovered from the
     constant tables baked into the binary.

  2. On success, main.unlock derives an AES-256 key as SHA-256(token) and
     AES-CBC-decrypts a 48-byte embedded ciphertext with a zero IV, yielding the
     cluster bootstrap secret (the flag).

This script reproduces the whole chain independently of the binary, using a
self-contained pure-Python AES implementation (no third-party dependencies).

Usage:
    python3 solve.py [path-to-tollgate]
"""

import hashlib
import struct
import sys

BINARY_DEFAULT = "tollgate"

# Static (non-PIE) load address: virtual address == file offset + 0x400000
BASE = 0x400000

# Virtual addresses of the baked-in constant tables and the ciphertext slice
# header (pointer, length, capacity) inside the Go binary.
ADDR_T1 = 0x5574E0  # uint64 rotation counts
ADDR_T2 = 0x557320  # uint32 expected values
ADDR_T3 = 0x557300  # uint32 xor masks
ADDR_T4 = 0x557310  # uint32 add constants
ADDR_CT_PTR = 0x55DE10
ADDR_CT_LEN = 0x55DE18
ADDR_IV = 0x55DE20  # slice cap (unused; IV is all zeroes)

NUM_WORDS = 4
TOKEN_LEN = 16


# --------------------------------------------------------------------------- #
# Binary helpers
# --------------------------------------------------------------------------- #
def _read_u64(data, va):
    return struct.unpack_from("<Q", data, va - BASE)[0]


def _read_u32(data, va):
    return struct.unpack_from("<I", data, va - BASE)[0]


def recover_token(data):
    """Invert the per-word check to recover the 16-byte admin token."""
    t1 = [_read_u64(data, ADDR_T1 + i * 8) for i in range(NUM_WORDS)]
    t2 = [_read_u32(data, ADDR_T2 + i * 4) for i in range(NUM_WORDS)]
    t3 = [_read_u32(data, ADDR_T3 + i * 4) for i in range(NUM_WORDS)]
    t4 = [_read_u32(data, ADDR_T4 + i * 4) for i in range(NUM_WORDS)]

    def ror32(x, r):
        r &= 31
        x &= 0xFFFFFFFF
        return ((x >> r) | (x << (32 - r))) & 0xFFFFFFFF if r else x

    token = bytearray()
    for i in range(NUM_WORDS):
        target = (t2[i] - t4[i]) & 0xFFFFFFFF
        word = (ror32(target, t1[i]) ^ t3[i]) & 0xFFFFFFFF
        token += word.to_bytes(4, "big")

    return bytes(token), (t1, t2, t3, t4)


def verify_token(token, tables):
    """Re-run the forward check to prove the recovered token is valid."""
    t1, t2, t3, t4 = tables

    def rol32(x, r):
        r &= 31
        x &= 0xFFFFFFFF
        return ((x << r) | (x >> (32 - r))) & 0xFFFFFFFF if r else x

    for i in range(NUM_WORDS):
        word = int.from_bytes(token[i * 4:(i + 1) * 4], "big")
        value = (rol32(word ^ t3[i], t1[i]) + t4[i]) & 0xFFFFFFFF
        if value != t2[i]:
            return False
    return True


def read_ciphertext(data):
    ptr = _read_u64(data, ADDR_CT_PTR)
    length = _read_u64(data, ADDR_CT_LEN)
    start = ptr - BASE
    return data[start:start + length]


# --------------------------------------------------------------------------- #
# Minimal pure-Python AES (decryption only) -- AES-256
# --------------------------------------------------------------------------- #
def _gmul(a, b):
    p = 0
    for _ in range(8):
        if b & 1:
            p ^= a
        hi = a & 0x80
        a = (a << 1) & 0xFF
        if hi:
            a ^= 0x1B
        b >>= 1
    return p & 0xFF


def _build_sboxes():
    inv = [0] * 256
    for a in range(1, 256):
        for b in range(1, 256):
            if _gmul(a, b) == 1:
                inv[a] = b
                break

    def rotl8(x, n):
        return ((x << n) | (x >> (8 - n))) & 0xFF

    sbox = [0] * 256
    for a in range(256):
        x = inv[a]
        sbox[a] = x ^ rotl8(x, 1) ^ rotl8(x, 2) ^ rotl8(x, 3) ^ rotl8(x, 4) ^ 0x63

    inv_sbox = [0] * 256
    for a, s in enumerate(sbox):
        inv_sbox[s] = a
    return sbox, inv_sbox


SBOX, INV_SBOX = _build_sboxes()
RCON = [0x00]
for _i in range(1, 15):
    RCON.append(_gmul(RCON[-1], 2) if _i > 1 else 0x01)
RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40,
        0x80, 0x1B, 0x36, 0x6C, 0xD8, 0xAB, 0x4D]


def _expand_key_256(key):
    nk, nr = 8, 14
    w = [list(key[4 * i:4 * i + 4]) for i in range(nk)]
    for i in range(nk, 4 * (nr + 1)):
        temp = list(w[i - 1])
        if i % nk == 0:
            temp = temp[1:] + temp[:1]
            temp = [SBOX[b] for b in temp]
            temp[0] ^= RCON[i // nk]
        elif i % nk == 4:
            temp = [SBOX[b] for b in temp]
        w.append([w[i - nk][j] ^ temp[j] for j in range(4)])
    return w


def _inv_shift_rows(s):
    for r in range(1, 4):
        row = [s[r + 4 * c] for c in range(4)]
        row = row[-r:] + row[:-r]
        for c in range(4):
            s[r + 4 * c] = row[c]


def _inv_sub_bytes(s):
    for i in range(16):
        s[i] = INV_SBOX[s[i]]


def _add_round_key(s, w, rnd):
    for c in range(4):
        for r in range(4):
            s[r + 4 * c] ^= w[rnd * 4 + c][r]


def _inv_mix_columns(s):
    for c in range(4):
        a = s[4 * c:4 * c + 4]
        s[4 * c + 0] = _gmul(a[0], 14) ^ _gmul(a[1], 11) ^ _gmul(a[2], 13) ^ _gmul(a[3], 9)
        s[4 * c + 1] = _gmul(a[0], 9) ^ _gmul(a[1], 14) ^ _gmul(a[2], 11) ^ _gmul(a[3], 13)
        s[4 * c + 2] = _gmul(a[0], 13) ^ _gmul(a[1], 9) ^ _gmul(a[2], 14) ^ _gmul(a[3], 11)
        s[4 * c + 3] = _gmul(a[0], 11) ^ _gmul(a[1], 13) ^ _gmul(a[2], 9) ^ _gmul(a[3], 14)


def aes256_decrypt_block(block, w):
    nr = 14
    s = list(block)
    _add_round_key(s, w, nr)
    for rnd in range(nr - 1, 0, -1):
        _inv_shift_rows(s)
        _inv_sub_bytes(s)
        _add_round_key(s, w, rnd)
        _inv_mix_columns(s)
    _inv_shift_rows(s)
    _inv_sub_bytes(s)
    _add_round_key(s, w, 0)
    return bytes(s)


def aes256_cbc_decrypt(key, ciphertext, iv=b"\x00" * 16):
    w = _expand_key_256(key)
    if len(ciphertext) % 16:
        raise ValueError("ciphertext length is not a multiple of the block size")
    out = bytearray()
    prev = iv
    for off in range(0, len(ciphertext), 16):
        block = ciphertext[off:off + 16]
        decrypted = aes256_decrypt_block(block, w)
        out += bytes(x ^ y for x, y in zip(decrypted, prev))
        prev = block
    return bytes(out)


def pkcs7_unpad(data):
    if not data:
        return data
    pad = data[-1]
    if 1 <= pad <= 16 and data.endswith(bytes([pad]) * pad):
        return data[:-pad]
    return data


# --------------------------------------------------------------------------- #
def main():
    path = sys.argv[1] if len(sys.argv) > 1 else BINARY_DEFAULT
    with open(path, "rb") as fh:
        data = fh.read()

    print(f"[*] Loaded binary: {path} ({len(data)} bytes)")

    token, tables = recover_token(data)
    print(f"[*] Recovered admin token: {token!r}")
    assert len(token) == TOKEN_LEN
    assert verify_token(token, tables), "token failed forward verification"
    print("[*] Token passed the binary's forward check")

    ciphertext = read_ciphertext(data)
    print(f"[*] Embedded ciphertext: {ciphertext.hex()}")

    key = hashlib.sha256(token).digest()
    print(f"[*] AES-256 key = SHA-256(token): {key.hex()}")

    plaintext = pkcs7_unpad(aes256_cbc_decrypt(key, ciphertext, iv=b"\x00" * 16))
    secret = plaintext.decode("utf-8", "replace")
    print(f"[+] Bootstrap secret: {secret}")

    if "H7CTF{" in secret:
        flag = secret[secret.index("H7CTF{"):]
        flag = flag[:flag.index("}") + 1]
        print(f"[+] FLAG: {flag}")


if __name__ == "__main__":
    main()
