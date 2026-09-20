#!/usr/bin/env python3
"""
CSAW CTF - Finders Keepers!
Challenge Solver

This script:
1. Inspects 'finderskeepers.mp4' and extracts the hidden base64 string from the XMP metadata (<dc:subject>).
2. Base64-decodes it to reveal the ciphertext: 'esnp{d0c_@yz@gl_mn0j_pm3z3_g0_o00s}'.
3. Determines the key using known plaintext attack (KPA):
   - Ciphertext prefix 'esnp' decrypts to flag format 'csaw', giving the key prefix 'cant'.
   - The key is 'cantfindit' (a play on the challenge title "Finders Keepers").
4. Decrypts the Vigenère cipher to yield the flag: csaw{y0u_@lw@ys_kn0w_wh3r3_t0_l00k}.
"""

import re
import base64
import os
import sys

def extract_ciphertext(video_path: str) -> str:
    with open(video_path, 'rb') as f:
        data = f.read()

    # Search for base64 encoded subject in XMP metadata or raw data
    match = re.search(rb'<dc:subject>\s*<rdf:Bag>\s*<rdf:li>([^<]+)</rdf:li>', data)
    if match:
        b64_str = match.group(1).decode().strip()
    else:
        # Fallback regex for base64 flag ciphertext pattern
        match = re.search(rb'ZXNucHtk[A-Za-z0-9+/=]+', data)
        if match:
            b64_str = match.group(0).decode().strip()
        else:
            raise ValueError(f"Could not find encrypted payload in {video_path}")

    ciphertext = base64.b64decode(b64_str).decode('utf-8')
    return ciphertext

def derive_key_prefix(ciphertext: str, known_plaintext: str = "csaw") -> str:
    """
    Derives the initial characters of the Vigenère key from the known plaintext.
    """
    derived_key = []
    for c, p in zip(ciphertext[:len(known_plaintext)], known_plaintext):
        k = (ord(c.lower()) - ord(p.lower())) % 26
        derived_key.append(chr(k + ord('a')))
    return ''.join(derived_key)

def vigenere_decrypt(ciphertext: str, key: str) -> str:
    plaintext = []
    key_idx = 0
    key = key.lower()
    
    for ch in ciphertext:
        if ch.isalpha():
            base = ord('a') if ch.islower() else ord('A')
            c_val = ord(ch) - base
            k_val = ord(key[key_idx % len(key)]) - ord('a')
            p_val = (c_val - k_val) % 26
            plaintext.append(chr(p_val + base))
            key_idx += 1
        else:
            plaintext.append(ch)
            
    return ''.join(plaintext)

def main():
    video_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "finderskeepers.mp4")
    if not os.path.exists(video_file):
        video_file = "finderskeepers.mp4"

    if not os.path.exists(video_file):
        print(f"Error: {video_file} not found.", file=sys.stderr)
        sys.exit(1)

    print(f"[*] Extracting metadata from: {video_file}")
    ciphertext = extract_ciphertext(video_file)
    print(f"[+] Found ciphertext: {ciphertext}")

    key_prefix = derive_key_prefix(ciphertext, "csaw")
    print(f"[*] Known-plaintext attack ('esnp' -> 'csaw'): Key prefix = '{key_prefix}'")

    # The full key is 'cantfindit' (fitting 'Finders Keepers')
    key = "cantfindit"
    print(f"[*] Decrypting with key: '{key}'")

    flag = vigenere_decrypt(ciphertext, key)
    print(f"\n[+] FLAG: {flag}")

if __name__ == "__main__":
    main()
