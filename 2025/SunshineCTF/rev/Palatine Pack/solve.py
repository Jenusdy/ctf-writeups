#!/usr/bin/env python3
# invert_flag.py
# Usage: python3 invert_flag.py flag.txt out_original.bin

import sys

def inv_expand_once(buf):
    """
    Inverse one expand: buf length must be even; returns bytes of length len(buf)//2.
    Implements the exact inverse of the decompiled expand() provided.
    """
    if len(buf) % 2 != 0:
        raise ValueError("Buffer length must be even for inv_expand_once()")
    out = bytearray(len(buf)//2)
    local_1d = 0x69
    bVar1 = False  # starts false in expand()
    for i in range(len(out)):
        a = buf[2*i]
        b = buf[2*i + 1]
        if bVar1:
            # expand when bVar1 true:
            # out0 = (x & 0xf0) | (local_1d >> 4)
            # out1 = (x & 0x0f) | (local_1d << 4)
            high_nibble = a & 0xf0
            low_nibble  = b & 0x0f
        else:
            # expand when bVar1 false:
            # out0 = (x & 0x0f) | (local_1d << 4)
            # out1 = (x & 0xf0) | (local_1d >> 4)
            high_nibble = b & 0xf0
            low_nibble  = a & 0x0f
        out[i] = (high_nibble | low_nibble) & 0xff
        # update local_1d and toggle
        local_1d = (local_1d * 11) & 0xff   # multiply by 11 (0x0b) mod 256
        bVar1 = not bVar1
    return bytes(out)

def inv_flipBits(buf):
    """
    Inverse of flipBits applied originally to buffer of length N.
    flipBits behavior:
      bVar1 starts false;
      for i in 0..N-1:
        if bVar1: buf[i] ^= local_11; local_11 += 0x20
        else:    buf[i] = ~buf[i]
        bVar1 = !bVar1
    Inverse:
      same pattern reversed: since ~ is its own inverse and XOR inverse is XOR with same key,
      we can just apply the same operations in the same forward order to recover original,
      but we must do the *same* sequence in same order because operations were not commutative.
    """
    out = bytearray(len(buf))
    local_11 = 0x69
    bVar1 = False
    for i in range(len(buf)):
        val = buf[i]
        if bVar1:
            # original did: val_out = val_in ^ local_11
            # invert by XOR again
            val = val ^ (local_11 & 0xff)
            local_11 = (local_11 + 0x20) & 0xff
        else:
            # original did val_out = ~val_in ; invert by ~ again
            val = (~val) & 0xff
        out[i] = val
        bVar1 = not bVar1
    return bytes(out)

def main():
    if len(sys.argv) < 3:
        print("Usage: python3 invert_flag.py flag.txt out_original.bin")
        sys.exit(1)
    inpath = sys.argv[1]
    outpath = sys.argv[2]

    data = open(inpath, "rb").read()
    if len(data) % 8 != 0:
        print("[!] Warning: file length is not a multiple of 8. This is unexpected but attempting anyway.")

    # Three inverse expands (we collapse size by 2 each time)
    cur = data
    for step in range(3):
        if len(cur) % 2 != 0:
            raise SystemExit(f"Length {len(cur)} not even at expand-inverse step {step+1}")
        cur = inv_expand_once(cur)
        print(f"[+] After inverse expand {step+1}: size = {len(cur)}")

    # Now cur is the buffer after flipBits was applied originally; invert it
    recovered = inv_flipBits(cur)
    open(outpath, "wb").write(recovered)
    print(f"[+] Wrote recovered original to: {outpath}")
    # Optional: print a small preview
    try:
        print("---- preview (first 512 bytes decoded as UTF-8, errors replaced) ----")
        print(recovered[:512].decode('utf-8', errors='replace'))
    except Exception:
        pass

if __name__ == "__main__":
    main()
