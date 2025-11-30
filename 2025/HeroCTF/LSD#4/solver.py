#!/usr/bin/env python3
"""
extract_secret_region.py

Usage:
    python3 extract_secret_region.py secret.png outdir

What it does:
- Crops a 100x100 region at x=1000,y=1000 (hint from challenge).
- Generates bitplane images for each R/G/B channel (bit 0..7).
- Tries many LSB-extraction strategies (1..3 LSBs per channel, combinations)
  and writes candidate binary files. It will also print any detected file magic.
"""
import sys
import os
from PIL import Image
import itertools

MAGICS = {
    b'\x89PNG\r\n\x1a\n': '.png',
    b'PK\x03\x04': '.zip',
    b'%PDF-': '.pdf',
    b'GIF87a': '.gif',
    b'GIF89a': '.gif',
    b'\x7fELF': '.elf',
    b'\xff\xd8\xff': '.jpg',
    b'BM': '.bmp',
    b'<!DOCTYP': '.html',
}

def crop_region(img, x=1000, y=1000, w=100, h=100):
    return img.crop((x, y, x+w, y+h))

def save_bitplanes(region, outdir):
    # region is RGB
    r,g,b = region.split()
    channels = {'R':r, 'G':g, 'B':b}
    for name, ch in channels.items():
        pix = ch.load()
        w,h = ch.size
        for bit in range(8):
            out = Image.new('L', (w,h))
            outpix = out.load()
            for i in range(w):
                for j in range(h):
                    outpix[i,j] = 255 if ((pix[i,j] >> bit) & 1) else 0
            fname = os.path.join(outdir, f'bitplane_{name}_{bit}.png')
            out.save(fname)
    print(f"[+] Saved bitplane images to {outdir}")

def bits_from_region(region, order_pixels=True):
    """Return list of pixels as (r,g,b) tuples in raster order."""
    w,h = region.size
    pix = region.load()
    out = []
    for j in range(h):
        for i in range(w):
            out.append(pix[i,j])
    return out

def try_unpack(bits, order='msb'):
    """Pack list of bits (0/1) into bytes. order = 'msb' (first bit becomes MSB of byte)
       or 'lsb' (first bit becomes LSB of byte)."""
    bts = bytearray()
    cur = 0
    cnt = 0
    if order == 'msb':
        for bit in bits:
            cur = (cur << 1) | (bit & 1)
            cnt += 1
            if cnt == 8:
                bts.append(cur)
                cur = 0; cnt = 0
    else:
        # lsb-first packing: first bit is least significant
        power = 0
        for bit in bits:
            cur |= (bit & 1) << power
            power += 1
            if power == 8:
                bts.append(cur)
                cur = 0; power = 0
    return bytes(bts)

def detect_magic(bts):
    for sig, ext in MAGICS.items():
        if bts.startswith(sig):
            return ext, sig
    # also search for central ASCII strings
    if any(32 <= c <= 126 for c in bts[:64]):
        # may be plaintext — check for readable sequences
        s = ''.join(chr(c) if 32 <= c <= 126 else '.' for c in bts[:64])
        return '.txt', s
    return None, None

def extraction_strategies(pixels):
    # pixels: list of (r,g,b)
    w = len(pixels)
    # We'll try combos of channels and bits-per-channel up to 3 bits per channel.
    channel_indices = {'R':0,'G':1,'B':2}
    results = []
    # channel sets: single channel, pairs, and all three
    channel_sets = [['R'], ['G'], ['B'], ['R','G'], ['R','B'], ['G','B'], ['R','G','B']]
    for chset in channel_sets:
        for bits_per_ch in [1,2,3]:
            # We'll extract using bits_per_ch LSBs from each channel in chset.
            # Order of collecting bits: for each pixel in raster order, for each channel in chset,
            # take the LSBs from least significant bit to most (i.e., bit0, bit1,...)
            bits = []
            for pix in pixels:
                for ch in chset:
                    val = pix[channel_indices[ch]]
                    # collect LSBs starting from bit 0 (lowest)
                    for b in range(bits_per_ch):
                        bits.append((val >> b) & 1)
            results.append((chset, bits_per_ch, bits))
    return results

def main():
    if len(sys.argv) < 3:
        print("Usage: python3 extract_secret_region.py secret.png outdir")
        sys.exit(1)
    imgpath = sys.argv[1]
    outdir = sys.argv[2]
    os.makedirs(outdir, exist_ok=True)
    img = Image.open(imgpath).convert('RGB')
    region = crop_region(img, x=1000, y=1000, w=100, h=100)
    region.save(os.path.join(outdir, 'region_1000_1000_100x100.png'))
    print("[+] Saved cropped region as region_1000_1000_100x100.png")
    save_bitplanes(region, outdir)

    pixels = bits_from_region(region)
    strategies = extraction_strategies(pixels)
    print(f"[+] Trying {len(strategies)} extraction strategies (channel combinations × bits per channel) ...")
    candidate_count = 0
    for chset, bpc, bits in strategies:
        for order in ('msb','lsb'):
            bts = try_unpack(bits, order=order)
            ext, info = detect_magic(bts)
            fname = f"candidate_{'_'.join(chset)}_{bpc}bpc_{order}.bin"
            fpath = os.path.join(outdir, fname)
            with open(fpath, 'wb') as f:
                f.write(bts)
            candidate_count += 1
            note = ""
            if ext:
                note = f" => detected {ext} (match {info!r})"
                # also write with extension hint
                with open(os.path.join(outdir, f"candidate_{'_'.join(chset)}_{bpc}bpc_{order}{ext}"), 'wb') as f2:
                    f2.write(bts)
            # Print a short preview of first 80 bytes as hex / ascii
            preview = bts[:80]
            hexpreview = preview.hex()[:80]
            asciipreview = ''.join((chr(c) if 32 <= c <= 126 else '.') for c in preview)
            print(f"[{candidate_count:03d}] channels={chset} bits_per_chan={bpc} order={order}{note}")
            print(f"      hex: {hexpreview}")
            print(f"      ascii: {asciipreview}")
    print(f"[+] Wrote {candidate_count} candidate files into {outdir}. Inspect ones with detected magic or open binaries in a viewer.")

if __name__ == '__main__':
    main()
