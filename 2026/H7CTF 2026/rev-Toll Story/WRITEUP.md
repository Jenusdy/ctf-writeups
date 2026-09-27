# Toll Story — H7CTF Writeup

> *Toll Story is the admin lane of an internal API gateway. Show it the right token and the booth waves through the cluster bootstrap secret; show it anything else and you get "access denied."*
>
> *There's a toll on this road, and it isn't paid in cash.*

**Category:** Reverse Engineering
**Flag format:** `H7CTF{...}`

**Flag:**

```
H7CTF{323dbad5-e8e7-43ba-b5a7-99c524e08231}
```

---

## 1. Recon

The target URL serves only a static placeholder page:

```html
<h3>Toll Story</h3><p>Your binary: <a href="tollgate">tollgate</a></p>
```

`/tollgate` is the actual artifact — a **1.45 MB stripped, statically linked Go ELF** (Go 1.23.12):

```
$ file tollgate
tollgate: ELF 64-bit LSB executable, x86-64, statically linked, stripped

$ readelf -S tollgate | grep -E 'gopclntab|\.text'
[ 1] .text        PROGBITS  0x401000
[ 6] .gopclntab  PROGBITS  0x4e21e0   # Go symbol/PC table survives stripping
```

Even stripped, Go binaries keep function names in `.gopclntab`. Running the binary locally already reveals the shape of the gate:

```bash
$ echo test | ./tollgate
admin token: access denied
```

## 2. Recovering symbols

Parsing `.gopclntab` with [GoReSym](https://github.com/mandiant/GoReSym) yields the two user functions:

| Address    | Function      | Role |
|------------|---------------|------|
| `0x498760` | `main.main`   | reads + validates the token |
| `0x498600` | `main.unlock` | derives the AES key, decrypts the secret |

Interesting embedded strings:

```
admin token:
access denied
access granted. bootstrap secret:
crypto/aes: input not full block
```

## 3. The token gate

`main.main` does the following:

1. If `len(os.Args) > 1`, the token is `os.Args[1]`; otherwise it prints `admin token: ` and reads a line from **stdin** (`bufio.ReadString` + `strings.TrimRight`).
2. Checks the token is exactly **16 bytes**.
3. Validates it 4 bytes at a time.

The hot loop (`objdump` of `main.main`, in the `0x498a02`–`0x498a6f` range) computes, for each word `i`:

```asm
mov    r9d, [rax + r9]              ; load 4 bytes of the key (little-endian)
bswap  r9d                          ; -> big-endian value  =>  W
xor    r9d, [T3 + i*4]              ; W ^= T3[i]
rol    r9d, cl                      ; rol by T1[i]
add    r9d, [T4 + i*4]              ; += T4[i]
cmp    r13d, r9d                    ; == T2[i] ?
je     ...
xor    esi, esi                     ; mismatch => flag = false
```

In math form:

```
W  = bswap32(word[i])                       # big-endian view of the 4 bytes
t  = rol32(W ^ T3[i], T1[i]) & 0xffffffff
ok = ((t + T4[i]) & 0xffffffff) == T2[i]
```

The constants live in `.noptrdata`:

| Table | Virtual address | Type |
|-------|-----------------|------|
| `T1`  | `0x5574e0`      | `uint64[4]` rotation counts |
| `T2`  | `0x557320`      | `uint32[4]` expected values |
| `T3`  | `0x557300`      | `uint32[4]` xor masks |
| `T4`  | `0x557310`      | `uint32[4]` add constants |

```
T1 = [0x16, 0x0c, 0x03, 0x14]
T2 = [0x824f1143, 0x7bc67cb2, 0x4a86f74e, 0x5b3e302e]
T3 = [0x7c5afe6c, 0x1ddf8cdb, 0x9362ba25, 0xa689a4ca]
T4 = [0xb441f5cf, 0x3fbcb9d9, 0x10ceff09, 0x7b7f535f]
```

### Inverting the check

Each word is independent and every operation (xor, rotate, add) is invertible, so the token can be solved directly instead of brute-forced:

```
W = ror32((T2[i] - T4[i]) & 0xffffffff, T1[i]) ^ T3[i]
```

Writing `W` back as 4 big-endian bytes (undoing the `bswap`) gives the token:

```
H7-T0LLG4TE-KEY1
```

## 4. From token to secret

With a valid token, `main.main` calls `main.unlock(token)`, which (from the disassembly):

1. Calls `crypto/sha256.Sum256(token)` → a **32-byte key** → `crypto/aes.NewCipher` (**AES-256**).
2. Builds a **zero IV** (`makeslice(16)` and no writes) and a `cipher.NewCBCDecrypter`.
3. Decrypts a global ciphertext slice (`ptr @ 0x55de10`, `len @ 0x55de18`) and returns the plaintext.
4. `main.main` prints `access granted. bootstrap secret: <plaintext>`.

The embedded ciphertext (48 bytes at `0x557660`):

```
e7128ae3303a9aede016e41fdcd39493
fd738042acf2d65e01fcf9eefbeff73d
e66b4e4183b22040abb62d38c9d0d698
```

Decrypting with `key = SHA-256("H7-T0LLG4TE-KEY1")` and a zero IV (PKCS#7 padded) yields the bootstrap secret:

```
H7CTF{323dbad5-e8e7-43ba-b5a7-99c524e08231}
```

Alternatively, simply run the binary with the recovered token:

```bash
$ echo -n "H7-T0LLG4TE-KEY1" | ./tollgate
admin token: access granted. bootstrap secret: H7CTF{323dbad5-e8e7-43ba-b5a7-99c524e08231}
```

## 5. Automated solver

`solve.py` performs the whole chain independently of the binary, with a self-contained pure-Python AES-256 implementation (no third-party packages):

1. Reads the four constant tables from the ELF and inverts the word check → token.
2. Re-runs the *forward* check to prove the token is valid.
3. Extracts the embedded ciphertext slice.
4. Derives `SHA-256(token)`, AES-CBC-decrypts with a zero IV, strips PKCS#7 padding.
5. Prints the flag.

```bash
$ python3 solve.py tollgate
[*] Loaded binary: tollgate (1454232 bytes)
[*] Recovered admin token: b'H7-T0LLG4TE-KEY1'
[*] Token passed the binary's forward check
[*] Embedded ciphertext: e7128ae3303a9aede016e41fdcd39493fd738042acf2d65e01fcf9eefbeff73de66b4e4183b22040abb62d38c9d0d698
[*] AES-256 key = SHA-256(token): 28766f578c54dda63f1d4f013a537f50433283de15b1e6aa5bb30f8940f43fab
[+] Bootstrap secret: H7CTF{323dbad5-e8e7-43ba-b5a7-99c524e08231}
[+] FLAG: H7CTF{323dbad5-e8e7-43ba-b5a7-99c524e08231}
```

## 6. Key takeaways

- **Stripped ≠ unreadable for Go.** The `.gopclntab` section preserves every function name and address; tools like GoReSym recover them almost instantly.
- **Reversible "hashes" are just ciphers.** The token check used xor/rotate/add per 32-bit word — a bijection, so the correct input is computed, not guessed.
- **The "cluster bootstrap secret" was layered crypto over an embedded ciphertext**: `SHA-256(token)` as an AES-256 key, AES-CBC with a fixed zero IV, PKCS#7 padding.

**Flag:** `H7CTF{323dbad5-e8e7-43ba-b5a7-99c524e08231}`
