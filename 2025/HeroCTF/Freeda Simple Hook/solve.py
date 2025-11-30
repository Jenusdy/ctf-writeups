#!/usr/bin/env python3
# Python solver that mirrors the Java logic in Vault.get_flag()

MASK32 = 0xFFFFFFFF

def to_u32(x):
    return x & MASK32

def rotl32(x, r):
    x = to_u32(x)
    return to_u32(((x << r) | (x >> (32 - r))))

def java_string_hashcode(s):
    """Emulate Java's String.hashCode() as a 32-bit signed int (kept as u32 modular)."""
    h = 0
    for ch in s:
        h = to_u32((31 * h) + ord(ch))
    return h

def unsigned_rshift(x, n):
    """Unsigned right shift for 32-bit integers (equivalent to Java >>>)."""
    return (to_u32(x) >> n)

def seed():
    # Strings from Java code
    s1 = "com.heroctf.freeda1.MainActivity"
    s2 = "com.heroctf.freeda1.utils.CheckFlag"

    h1 = java_string_hashcode(s1)
    h2 = java_string_hashcode(s2)

    # constants from Java (represented as 32-bit two's complement)
    c_neg_1056969150 = to_u32(-1056969150)
    c_neg_1640531527 = to_u32(-1640531527)

    # iHashCode = (h1 ^ (-1056969150)) ^ h2
    iHashCode = to_u32(h1 ^ c_neg_1056969150 ^ h2)

    # return iHashCode ^ (Integer.rotateLeft(iHashCode, 7) * (-1640531527));
    rot = rotl32(iHashCode, 7)
    mul = to_u32((rot * c_neg_1640531527))
    iSeed = to_u32(iHashCode ^ mul)
    return iSeed

def get_flag():
    a = [52, 88, 27, 32, 27, 186, 96, 109, 45, 202, 42, 125, 25, 134, 159, 69, 47, 142, 192, 184, 13, 19, 139, 173, 59, 129, 0, 158, 165, 188, 13, 62, 74, 184, 58, 75, 172, 202, 66]
    # length is 39
    iSeed = seed()

    # Prepare iArr = [0..38]
    iArr = list(range(39))

    # i2 initialization: (-1515870811) ^ iSeed  (represent as u32)
    i2 = to_u32(to_u32(-1515870811) ^ iSeed)

    # Shuffle (Fisher-Yates-like) with i3 from 38 downto 0
    for i3 in range(38, -1, -1):
        # i4 = i2 ^ (i2 << 13)
        i4 = to_u32(i2 ^ to_u32(i2 << 13))
        # i5 = i4 ^ (i4 >>> 17)
        i5 = to_u32(i4 ^ unsigned_rshift(i4, 17))
        # i2 = i5 ^ (i5 << 5)
        i2 = to_u32(i5 ^ to_u32(i5 << 5))

        # unsignedLong = Integer.toUnsignedLong(i2) % (i3 + 1)
        unsignedLong = (to_u32(i2) % (i3 + 1))

        # swap iArr[i3] and iArr[unsignedLong]
        iArr[i3], iArr[unsignedLong] = iArr[unsignedLong], iArr[i3]

    # Build bytes
    b = bytearray(39)
    # compute i9 once: (iSeed >>> 27) & 7
    i9 = (unsigned_rshift(iSeed, 27) & 7)
    for i7 in range(39):
        ai = a[iArr[i7]] & 0xFF
        i8 = ((ai - i7) & 0xFF)

        # rotate-right by i9 (the Java code does (i8 << (8-i9)) | (i8 >>> i9))
        if i9 == 0:
            rotated = i8 & 0xFF
        else:
            rotated = (( (i8 << (8 - i9)) | (i8 >> i9) ) & 0xFF)

        # xor with byte from iSeed: (iSeed >>> ((i7 & 3) * 8)) & 255
        seed_byte = (unsigned_rshift(iSeed, ((i7 & 3) * 8)) & 0xFF)
        b[i7] = rotated ^ seed_byte

    return b.decode("utf-8", errors="replace")

if __name__ == "__main__":
    print("Flag:", get_flag())
