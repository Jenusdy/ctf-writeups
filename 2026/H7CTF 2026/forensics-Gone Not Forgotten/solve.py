#!/usr/bin/env python3
import re
import xml.etree.ElementTree as ET

# 1. Parse obfuscation key from secure.xml
tree = ET.parse("evidence/secure.xml")
root = tree.getroot()
key = None
for s in root.findall("string"):
    if s.attrib.get("name") == "obfuscation_key":
        key = s.text.encode()
        break

if not key:
    raise ValueError("Obfuscation key not found in evidence/secure.xml")

# 2. Carve hex pattern from messages.db unallocated space
with open("evidence/messages.db", "rb") as f:
    data = f.read()

# Match hex strings of sufficient length
candidates = re.findall(rb"[0-9a-fA-F]{30,}", data)
for cand in candidates:
    raw = bytes.fromhex(cand.decode())
    decrypted = bytes([b ^ key[i % len(key)] for i, b in enumerate(raw)])
    if b"{" in decrypted and b"}" in decrypted:
        print("[+] Flag found:", decrypted.decode(errors="ignore"))
