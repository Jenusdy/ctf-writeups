# Modem Operandi — Writeup

**Category:** Reverse Engineering  
**Difficulty:** Medium  
**Points:** 63  

## Description

> Pulled from a grey-market satellite modem, this licence checker is all that stands between you and the carrier provisioning string. Every wrong key earns the same flat "rejected," and it is fussy about what it accepts.
>
> Every checker has a method; this one just won't say what it is.

## Analysis

### Initial Recon

```bash
$ file warden
warden: ELF 64-bit LSB pie executable, x86-64, stripped
```

```bash
$ strings warden
AES_set_decrypt_key
AES_cbc_encrypt
fgets
strncpy
strcspn
printf
license key: 
license rejected
license accepted. provisioning: %s
```

The binary uses **AES-CBC decryption** and reads a license key from stdin. The flag is decrypted only if the key passes validation.

### Disassembly

The `main` function (at `0x10d0`) does the following:

1. Reads a 16-character key from stdin
2. Validates it through a **state machine** (bytecode interpreter)
3. If valid, computes `MD5(key)` and uses it as an AES-128-CBC key
4. Decrypts 32 bytes of ciphertext and prints the result

### State Machine

The state machine is driven by:
- **Opcode table** at `0x20a0` — 192 bytes of bytecode
- **Jump table** at `0x2060` — 8 entries mapping opcodes to handlers

#### Opcodes

| Opcode | Operation | Description |
|--------|-----------|-------------|
| `0x01` | COPY | Copy `key[operand]` to buffer |
| `0x02` | PUSH | Push constant `operand` to buffer |
| `0x03` | XOR | Pop two bytes, push `a ^ b` |
| `0x04` | ADD | Pop two bytes, push `(a + b) & 0xff` |
| `0x05` | ROL | Pop byte, rotate left by `operand` bits, push result |
| `0x06` | CMP | Pop byte, compare with `operand` (all must match) |

#### Bytecode

```
01 00 02 58 03 02 3a 04 05 05 06 49 01 01 02 08
03 02 af 04 05 03 06 77 01 02 02 3e 03 02 4e 04
05 02 06 d2 01 03 02 db 03 02 7f 04 05 04 06 57
01 04 02 61 03 02 db 04 05 06 06 cc 01 05 02 98
03 02 23 04 05 07 06 80 01 06 02 f0 03 02 44 04
05 02 06 18 01 07 02 d0 03 02 66 04 05 01 06 ef
01 08 02 d9 03 02 c0 04 05 03 06 a5 01 09 02 a8
03 02 f4 04 05 03 06 fe 01 0a 02 52 03 02 df 04
05 01 06 f9 01 0b 02 d8 03 02 5f 04 05 05 06 3d
01 0c 02 de 03 02 5b 04 05 01 06 ed 01 0d 02 9c
03 02 94 04 05 06 06 da 01 0e 02 32 03 02 0f 04
05 01 06 0d 01 0f 02 b1 03 02 23 04 05 01 06 16
```

### Key Recovery

Each key byte is used exactly once in a COPY operation, and each is validated by exactly one CMP constraint. This means each byte can be solved independently by trying all 256 possible values.

The constraints resolve to:

| Index | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 |
|-------|---|---|---|---|---|---|---|---|---|---|----|----|----|----|----|----|
| Char | H | 7 | X | - | 9 | F | 2 | A | - | C | O | R | E | K | E | Y |

**Key:** `H7X-9F2A-COREKEY`

### Decryption

- **AES Key:** `MD5("H7X-9F2A-COREKEY")` = `8ca31a6e2c0d79de68907c78a5e6405f`
- **IV:** 16 zero bytes
- **Ciphertext** (at `0x2080`):
  ```
  ab 7a cb 5a b6 fb 1f 2a 82 42 ec c6 26 65 45 03
  5d 16 df 91 da 6a bb 10 04 cc 19 8d 0a f8 66 2b
  ```

## Solution

```python
#!/usr/bin/env python3
import hashlib
from Crypto.Cipher import AES

key = b"H7X-9F2A-COREKEY"
ciphertext = bytes.fromhex(
    "ab7acb5ab6fb1f2a8242ecc626654503"
    "5d16df91da6abb1004cc198d0af8662b"
)

md5_key = hashlib.md5(key).digest()
cipher = AES.new(md5_key, AES.MODE_CBC, b'\x00' * 16)
plaintext = cipher.decrypt(ciphertext)

# Remove PKCS7 padding
pad_len = plaintext[-1]
plaintext = plaintext[:-pad_len]

print(plaintext.decode())
```

## Flag

```
H7CTF{476f0831f4c4eec5b790}
```
