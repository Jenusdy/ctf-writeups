package com.heroctf.freeda1.utils;

import java.nio.charset.Charset;

/* compiled from: r8-map-id-1a9af88ffb3dc84841cff9564d9f010c0ae775e01948d15ad9bf0acf206d5524 */
/* loaded from: classes.dex */
final class Vault {
    public static final int[] a = {52, 88, 27, 32, 27, 186, 96, 109, 45, 202, 42, 125, 25, 134, 159, 69, 47, 142, 192, 184, 13, 19, 139, 173, 59, 129, 0, 158, 165, 188, 13, 62, 74, 184, 58, 75, 172, 202, 66};

    public static String get_flag() {
        int iSeed = seed();
        int[] iArr = new int[39];
        for (int i = 0; i < 39; i++) {
            iArr[i] = i;
        }
        int i2 = (-1515870811) ^ iSeed;
        for (int i3 = 38; i3 >= 0; i3--) {
            int i4 = i2 ^ (i2 << 13);
            int i5 = i4 ^ (i4 >>> 17);
            i2 = i5 ^ (i5 << 5);
            int unsignedLong = (int) (Integer.toUnsignedLong(i2) % (i3 + 1));
            int i6 = iArr[i3];
            iArr[i3] = iArr[unsignedLong];
            iArr[unsignedLong] = i6;
        }
        byte[] bArr = new byte[39];
        for (int i7 = 0; i7 < 39; i7++) {
            int i8 = ((a[iArr[i7]] & 255) - i7) & 255;
            int i9 = (iSeed >>> 27) & 7;
            bArr[i7] = (byte) ((((i8 << (8 - i9)) | (i8 >>> i9)) & 255) ^ ((iSeed >>> ((i7 & 3) * 8)) & 255));
        }
        return new String(bArr, Charset.forName("UTF-8"));
    }

    private static int seed() {
        int iHashCode = ("com.heroctf.freeda1.MainActivity".hashCode() ^ (-1056969150)) ^ "com.heroctf.freeda1.utils.CheckFlag".hashCode();
        return iHashCode ^ (Integer.rotateLeft(iHashCode, 7) * (-1640531527));
    }
}