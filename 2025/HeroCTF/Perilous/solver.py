#!/usr/bin/env python3
# exploit_remote.py
import socket
import re
from time import sleep

HOST = "crypto.heroctf.fr"   # change to target
PORT = 9001                  # change to target
KEY_HEX = "00112233445566778899aabbccddeeff"  # choose any key (hex)

def rc4_keystream(key_bytes, n):
    S = list(range(256))
    j = 0
    key = list(key_bytes)
    for i in range(256):
        j = (j + S[i] + key[i % len(key)]) & 0xff
        S[i], S[j] = S[j], S[i]
    i = 0
    j = 0
    out = bytearray()
    for _ in range(n):
        i = (i + 1) & 0xff
        j = (j + S[i]) & 0xff
        S[i], S[j] = S[j], S[i]
        out.append(S[(S[i] + S[j]) & 0xff])
    return bytes(out)

def xor_bytes(a, b):
    return bytes(x ^ y for x, y in zip(a, b))

def recv_until(sock, needle, timeout=5):
    data = b""
    sock.settimeout(timeout)
    while True:
        chunk = sock.recv(4096)
        if not chunk:
            break
        data += chunk
        if needle in data:
            break
    return data

with socket.create_connection((HOST, PORT), timeout=10) as s:
    # read banner and "flag k:" prompt
    banner = recv_until(s, b"flag k:")
    print(banner.decode(errors="ignore"))

    # send chosen key
    s.sendall((KEY_HEX + "\n").encode())

    # read response line that contains hex ciphertext
    resp = recv_until(s, b"\n", timeout=2)
    # combine banner and resp if needed:
    full = banner + resp
    text = full.decode(errors="ignore")
    # extract the first long hex string (ciphertext)
    m = re.search(r"([0-9a-fA-F]{20,})", text)
    if not m:
        print("Couldn't find ciphertext in server response:")
        print(text)
        exit(1)
    ct_hex = m.group(1)
    print("Ciphertext (hex):", ct_hex)

    key = bytes.fromhex(KEY_HEX)
    ct = bytes.fromhex(ct_hex)
    ks = rc4_keystream(key, len(ct))
    flag = xor_bytes(ct, ks)
    print("Recovered flag (raw):", flag)
    try:
        print("Recovered flag (utf-8):", flag.decode())
    except:
        print("Flag not valid UTF-8; raw printed above.")
