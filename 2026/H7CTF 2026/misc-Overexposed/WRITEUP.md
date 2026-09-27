# Writeup: Overexposed (H7CTF)

- **Category:** Misc / Forensics / Stego
- **Target File:** `overexposed.png`
- **Flag Format:** `H7CTF{...}`
- **Flag:** `H7CTF{06da61b5c60e087c87c9}`

---

## 1. Overview

The challenge provides a single PNG file named `overexposed.png` (520x220, 3,393 bytes). Solving the challenge involves three distinct discoveries across the image file structure:

1. **Pixel Layer (Decoy / Hint):** The image visually appears nearly pitch black, but adjusting contrast reveals the message *"nothing to see in the pixels"*.
2. **PNG Metadata (`part1`):** A custom compressed text chunk (`zTXt`) contains the first flag piece.
3. **Appended ZIP Archive (`part2` & `part3`):** Trailing data past the PNG `IEND` chunk contains a ZIP archive where members were omitted from the Central Directory index (ZIP directory tampering), requiring extraction from the raw local file headers.

---

## 2. Step-by-Step Analysis

### Phase 1: Visual Inspection & Pixel Decoy

Inspecting the pixel intensity distribution shows that the values are heavily clustered around very dark shades ($[16, 16, 20]$ and $[30, 30, 38]$):

```python
from PIL import Image
import numpy as np

img = Image.open('overexposed.png')
arr = np.array(img)
print("Min:", arr.min(), "Max:", arr.max())
```

Stretching the contrast reveals hidden pixel art:

```text
OVEREXPOSED
nothing to see in the pixels
```

This confirms that the pixel data itself is a red herring intended to guide attention toward file metadata and container structures.

---

### Phase 2: PNG Chunk Analysis (`part1`)

Parsing the PNG chunk sequence shows:

- `IHDR` (offset `8`, length `13`)
- `zTXt` (offset `33`, length `22`)
- `IDAT` (offset `67`, length `2930`)
- `IEND` (offset `3009`, length `0`)

The `zTXt` chunk contains a compressed keyword-value pair. Decompressing it yields `part1`:

```python
import struct, zlib

with open('overexposed.png', 'rb') as f:
    data = f.read()

# Read zTXt chunk at offset 33
cdata = data[33+8 : 33+8+22]
null_idx = cdata.find(b'\x00')
keyword = cdata[:null_idx].decode('latin1')  # 'part1'
comp_text = cdata[null_idx+2:]
part1 = zlib.decompress(comp_text).decode('latin1')
print(f"{keyword}: {part1}")
# Output: part1: 06da61b
```

---

### Phase 3: ZIP Archive & Tampered Central Directory (`part2` & `part3`)

Directly following the `IEND` chunk (at byte offset `3021`), there are 372 bytes of trailing data. Scanning for PK zip signatures (`\x50\x4b`):

```text
Offset 3021: PK\x03\x04 (Local File Header - readme.txt)
Offset 3220: PK\x03\x04 (Local File Header - part2.txt)
Offset 3268: PK\x03\x04 (Local File Header - part3.txt)
Offset 3315: PK\x01\x02 (Central Directory Header - readme.txt)
Offset 3371: PK\x05\x06 (End of Central Directory Record)
```

#### The Central Directory Anomaly
Standard extraction tools like `unzip` only extract `readme.txt` because the Central Directory record at offset `3371` only indexes a single entry (count = `1`).

The content of `readme.txt` hints at this structure:

> *"This archive's directory lists one file. The directory is not the archive.*  
> *Members can exist without the index admitting them -- read the raw local headers.*  
> *And remember what you are looking at: a picture carries more than its pixels."*

#### Extracting Hidden Local Headers
By traversing the raw `PK\x03\x04` headers directly:

1. **Header at offset 3220 (`part2.txt`):**
   - Method: Deflate (8)
   - Compressed size: 9 bytes, Uncompressed size: 7 bytes
   - Content: `5c60e08`

2. **Header at offset 3268 (`part3.txt`):**
   - Method: Deflate (8)
   - Compressed size: 8 bytes, Uncompressed size: 6 bytes
   - Content: `7c87c9`

---

## 3. Flag Assembly

Assembling the parts in sequence:

| Component | Location | Value |
|---|---|---|
| **Part 1** | PNG `zTXt` Chunk | `06da61b` |
| **Part 2** | Raw ZIP Header `part2.txt` | `5c60e08` |
| **Part 3** | Raw ZIP Header `part3.txt` | `7c87c9` |

**Combined:** `06da61b5c60e087c87c9`

```text
H7CTF{06da61b5c60e087c87c9}
```

---

## 4. Automated Solver Script

```python
#!/usr/bin/env python3
import struct
import zlib

def solve(filename="overexposed.png"):
    with open(filename, "rb") as f:
        data = f.read()

    parts = {}

    # 1. Parse PNG chunks for zTXt
    offset = 8
    while offset < len(data):
        length, ctype = struct.unpack(">I4s", data[offset:offset+8])
        cdata = data[offset+8 : offset+8+length]
        if ctype == b"zTXt":
            null_pos = cdata.find(b"\x00")
            key = cdata[:null_pos].decode("latin1")
            val = zlib.decompress(cdata[null_pos+2:]).decode("latin1")
            parts[key] = val
        elif ctype == b"IEND":
            offset += 12 + length
            break
        offset += 12 + length

    # 2. Parse raw PK local file headers in the trailing data
    while offset < len(data):
        if data[offset:offset+4] != b"PK\x03\x04":
            offset += 1
            continue
        
        header = data[offset:offset+30]
        sig, ver, flag, method, mtime, mdate, crc, comp_size, uncomp_size, fn_len, extra_len = struct.unpack(
            "<4sHHHHHIIIHH", header
        )
        fname = data[offset+30 : offset+30+fn_len].decode("latin1", "replace")
        body = data[offset+30+fn_len+extra_len : offset+30+fn_len+extra_len+comp_size]
        
        if method == 8:
            decomp = zlib.decompress(body, -15).decode("latin1", "replace")
        else:
            decomp = body.decode("latin1", "replace")

        if fname.startswith("part"):
            key = fname.split(".")[0]
            parts[key] = decomp.strip()

        offset += 30 + fn_len + extra_len + comp_size

    flag_body = parts.get("part1", "") + parts.get("part2", "") + parts.get("part3", "")
    flag = f"H7CTF{{{flag_body}}}"
    print(f"Parts found: {parts}")
    print(f"Flag: {flag}")
    return flag

if __name__ == "__main__":
    solve()
```
