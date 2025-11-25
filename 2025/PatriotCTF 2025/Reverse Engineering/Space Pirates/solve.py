FLAG_LEN = 30

TARGET = [
    0x5A,0x3D,0x5B,0x9C,0x98,0x73,0xAE,0x32,0x25,0x47,
    0x48,0x51,0x6C,0x71,0x3A,0x62,0xB8,0x7B,0x63,0x57,
    0x25,0x89,0x58,0xBF,0x78,0x34,0x98,0x71,0x68,0x59
]

XOR_KEY = [0x42, 0x73, 0x21, 0x69, 0x37]
MAGIC_ADD = 0x2A

def reverse_operations(target):
    buf = target.copy()

    # Reverse OPERATION 4: buffer[i] ^= i
    for i in range(FLAG_LEN):
        buf[i] ^= i

    # Reverse OPERATION 3: buffer[i] = (buffer[i] + MAGIC_ADD) % 256
    for i in range(FLAG_LEN):
        buf[i] = (buf[i] - MAGIC_ADD) % 256

    # Reverse OPERATION 2: swap adjacent bytes
    for i in range(0, FLAG_LEN, 2):
        buf[i], buf[i+1] = buf[i+1], buf[i]

    # Reverse OPERATION 1: XOR rotating key
    for i in range(FLAG_LEN):
        buf[i] ^= XOR_KEY[i % 5]

    return bytes(buf)

if __name__ == "__main__":
    result = reverse_operations(TARGET)
    print("Decrypted input:")
    print(result.decode("latin1"))
