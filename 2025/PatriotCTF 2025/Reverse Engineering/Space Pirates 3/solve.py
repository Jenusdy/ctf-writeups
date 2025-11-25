target = [
    0x60, 0x6D, 0x5D, 0x97, 0x2C, 0x04, 0xAF, 0x7C, 0xE2, 0x9E, 0x77, 0x85, 0xD1, 0x0F, 0x1D, 0x17,
    0xD4, 0x30, 0xB7, 0x48, 0xDC, 0x48, 0x36, 0xC1, 0xCA, 0x28, 0xE1, 0x37, 0x58, 0x0F,
]

xorKey = [0xC7, 0x2E, 0x89, 0x51, 0xB4, 0x6D, 0x1F]
rotationPattern = [7, 5, 3, 1, 6, 4, 2, 0]
magicSub = 0x93
chunkSize = 6

def rol(b, n):
    n %= 8
    return ((b << n) & 0xFF) | ((b & 0xFF) >> (8 - n))

def ror(b, n):
    n %= 8
    return ((b & 0xFF) >> n) | ((b << (8 - n)) & 0xFF)

def inverse_coordinate_calibration(buf):
    return [val ^ (((i*i) + i) % 256) for i, val in enumerate(buf)]

def inverse_temporal_inversion(buf):
    out = buf[:]
    for start in range(0, len(out), chunkSize):
        end = min(start + chunkSize, len(out))
        out[start:end] = reversed(out[start:end])
    return out

def inverse_gravitational_shift(buf):
    return [ (b + magicSub) & 0xFF for b in buf ]

def inverse_spatial_transposition(buf):
    out = buf[:]
    for i in range(0, len(out)-1, 2):
        out[i], out[i+1] = out[i+1], out[i]
    return out

def inverse_stellar_rotation(buf):
    return [ ror(val, rotationPattern[i % len(rotationPattern)]) for i, val in enumerate(buf) ]

def inverse_ultimate_quantum_cipher(buf):
    return [ val ^ xorKey[i % len(xorKey)] for i, val in enumerate(buf) ]

buf = target[:]
buf = inverse_coordinate_calibration(buf)
buf = inverse_temporal_inversion(buf)
buf = inverse_gravitational_shift(buf)
buf = inverse_spatial_transposition(buf)
buf = inverse_stellar_rotation(buf)
buf = inverse_ultimate_quantum_cipher(buf)

res_bytes = bytes(buf)
print(res_bytes.decode('latin-1'))  # or 'utf-8' if desired
