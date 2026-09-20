#!/usr/bin/env python3
"""
Flag extraction script for forensics-Hemispheres (the_signal.png).

Challenge structure:
1. "The Tail / Lock": An encrypted ZIP file is appended after the PNG IEND marker.
2. "The Pixels / Key": The encryption password is hidden in the Least Significant
   Bit (LSB) of the Blue color channel of the image pixels.
   - Format: 2 bytes big-endian length prefix, followed by ASCII key bytes.
"""

import io
import sys
import zipfile
from PIL import Image


def extract_key_from_pixels(image_path: str) -> bytes:
    """Extract password key from the LSB of the Blue channel."""
    img = Image.open(image_path).convert("RGB")
    pixels = img.getdata()

    # Collect LSB of the Blue channel for all pixels
    bits = [b & 1 for _, _, b in pixels]

    # Pack bits into bytes (MSB first)
    byte_arr = bytearray()
    for i in range(0, len(bits), 8):
        chunk = bits[i : i + 8]
        if len(chunk) < 8:
            break
        byte = 0
        for bit in chunk:
            byte = (byte << 1) | bit
        byte_arr.append(byte)

    # First 2 bytes store the length of the key (big-endian)
    key_length = int.from_bytes(byte_arr[:2], "big")
    key = bytes(byte_arr[2 : 2 + key_length])
    return key


def extract_zip_from_file(image_path: str) -> bytes:
    """Extract trailing ZIP data appended after PNG."""
    with open(image_path, "rb") as f:
        data = f.read()

    # Locate the ZIP header PK\x03\x04
    zip_offset = data.find(b"PK\x03\x04")
    if zip_offset == -1:
        raise ValueError("No ZIP header (PK\\x03\\x04) found in the file.")

    return data[zip_offset:]


def main():
    image_path = sys.argv[1] if len(sys.argv) > 1 else "the_signal.png"

    print(f"[*] Analyzing image: {image_path}")

    # Step 1: Extract password key from Blue channel LSB
    key = extract_key_from_pixels(image_path)
    print(f"[+] Extracted password from Blue channel LSB: {key.decode('utf-8', errors='replace')}")

    # Step 2: Extract embedded ZIP archive
    zip_bytes = extract_zip_from_file(image_path)
    print(f"[+] Found trailing ZIP archive ({len(zip_bytes)} bytes)")

    # Step 3: Decrypt and read contents
    with zipfile.ZipFile(io.BytesIO(zip_bytes)) as zf:
        for file_info in zf.infolist():
            content = zf.read(file_info.filename, pwd=key).decode("utf-8", errors="replace")
            print(f"\n--- {file_info.filename} ---")
            print(content.strip())


if __name__ == "__main__":
    main()
