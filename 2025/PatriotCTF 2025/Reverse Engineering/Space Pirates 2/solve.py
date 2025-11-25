TARGET = [
    0x15, 0x5A, 0xAC, 0xF6, 0x36, 0x22, 0x3B, 0x52, 0x6C, 0x4F, 0x90, 0xD9, 0x35, 0x63, 0xF8, 0x0E,
    0x02, 0x33, 0xB0, 0xF1, 0xB7, 0x69, 0x42, 0x67, 0x25, 0xEA, 0x96, 0x63, 0x1B, 0xA7, 0x03, 0x0B
]

XOR_KEY = [0x7E, 0x33, 0x91, 0x4C, 0xA5]
ROTATION_PATTERN = [1, 3, 5, 7, 2, 4, 6]
MAGIC_SUB = 0x5D
CHUNK_SIZE = 5

def ror(byte, n):
    n = n % 8
    return ((byte & 0xFF) >> n) | ((byte << (8 - n)) & 0xFF)

def inverse_coordinate_calibration(buf):
    return [b ^ ((i * i) % 256) for i, b in enumerate(buf)]

def inverse_temporal_inversion(buf):
    out = buf[:]
    for start in range(0, len(out), CHUNK_SIZE):
        end = min(start + CHUNK_SIZE, len(out))
        out[start:end] = list(reversed(out[start:end]))
    return out

def inverse_gravitational_shift(buf):
    return [(b + MAGIC_SUB) & 0xFF for b in buf]

def inverse_spatial_transposition(buf):
    out = buf[:]
    for i in range(0, len(out)-1, 2):
        out[i], out[i+1] = out[i+1], out[i]
    return out

def inverse_stellar_rotation(buf):
    out = []
    for i, b in enumerate(buf):
        rot = ROTATION_PATTERN[i % len(ROTATION_PATTERN)]
        out.append(ror(b, rot))
    return out

def inverse_quantum_cipher(buf):
    return [b ^ XOR_KEY[i % len(XOR_KEY)] for i, b in enumerate(buf)]

# apply inverses in reverse order
buf = TARGET[:]
buf = inverse_coordinate_calibration(buf)
buf = inverse_temporal_inversion(buf)
buf = inverse_gravitational_shift(buf)
buf = inverse_spatial_transposition(buf)
buf = inverse_stellar_rotation(buf)
buf = inverse_quantum_cipher(buf)

res_bytes = bytes(buf)
print("Recovered string:", res_bytes.decode('latin-1'))