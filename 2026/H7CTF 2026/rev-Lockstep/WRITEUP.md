# Lockstep (`interlock`) — Reverse Engineering Writeup

**Category:** Rev · **Points:** 63 · **Difficulty:** Medium
**Flag:** `H7CTF{b169235b-bed2-48bd-aaf6-a76afd77fff2}`

---

## 1. Recon

The challenge page links a single Linux binary:

```bash
$ curl -sLO https://web-eadf8a590e83c2fa.web.h7tex.com/interlock
$ file interlock
interlock: ELF 64-bit LSB pie executable, x86-64, ... dynamically linked, stripped
```

`strings` reveals the important bits immediately:

```
key:
interlock: rejected
interlock: released. token: %s
AES_set_decrypt_key
AES_cbc_encrypt
MD5
```

So the program reads a **key**, validates it, then uses `MD5(key)` as an **AES key** to decrypt something and prints a **token** (the flag). The description — *"one exact sequence… not the guessing kind of lock"* and *"these tumblers were never going to fall one at a time"* — hints that the check is a **coupled system** (solve it, don't brute-force byte-by-byte).

Everything significant lives in one function at `0x1180` (the stripped `main`, reached from `_start` → `__libc_start_main`).

---

## 2. Stage 1 — the tumblers (linear system mod 256)

The key is read from `argv[1]` (or `stdin` if no args) and **must be exactly 16 bytes**:

```asm
121b: mov    rdi, rbx            ; rbx = buffer
121e: call   strlen
1223: cmp    rax, 0x10
1227: jne    127b                ; -> "interlock: rejected"
```

Then the check loop:

```asm
1229: lea    rdx, [rip+0xe70]    ; rdx = coefficient table  (.rodata+0xa0)
1230: lea    rdi, [rip+0xe59]    ; rdi = expected bytes     (.rodata+0x90)
1237: mov    ecx, 1
123f: lea    r9,  [rdx+0x100]    ; r9 = end of table (16 blocks * 16 bytes)
1246: xor    eax, eax
1248: xor    esi, esi
124a: movzx  r8d, BYTE PTR [rdx+rax]   ; A[i][j]
124f: movzx  r11d, BYTE PTR [rbx+rax]  ; x[j]
1254: inc    rax
1257: imul   r8d, r11d                 ; A[i][j] * x[j]
125b: add    esi, r8d                  ; accumulate
125e: cmp    rax, 0x10
1262: jne    124a
1264: cmp    BYTE PTR [rdi], sil       ; expected[i] == sum & 0xff ?
1267: cmovne ecx, r10d                 ; flag = 0 on mismatch
126b: add    rdx, 0x10                 ; next row
126f: inc    rdi
1272: cmp    rdx, r9
1275: jne    1246
1277: test   ecx, ecx
1279: jne    1291                      ; -> release
```

Formally, with `x` the 16-byte key, `A` the 16×16 matrix at `.rodata+0xa0`
(row-major, `A[i][j] = table[i*16 + j]`), and `b` the 16 bytes at `.rodata+0x90`:

$$
b_i \;\equiv\; \sum_{j=0}^{15} A_{ij}\, x_j \pmod{256}, \qquad i = 0,\dots,15
$$

This is a 16×16 linear system over the ring **Z/256** — the "tumblers" are all
linked, so the bytes cannot be recovered independently. Is the solution unique?
`A` has **full rank mod 2** (rank = 16), so yes: exactly one solution mod 256.

### Solving over Z/256

Because `A` is invertible mod 2, Gaussian elimination works directly on Z/256:
at each column there is a remaining row whose entry is **odd**, and every odd
number is a unit modulo 256 (`pow(a, -1, 256)`). Normalize the pivot to 1,
eliminate the column from all other rows, read off the answer.

```python
def solve_mod256(A, b, n):
    M = [[A[i][j] % 256 for j in range(n)] + [b[i] % 256] for i in range(n)]
    row = 0
    for col in range(n):
        piv = next(r for r in range(row, n) if M[r][col] & 1)  # odd pivot = unit
        M[row], M[piv] = M[piv], M[row]
        inv = pow(M[row][col], -1, 256)
        M[row] = [(v * inv) % 256 for v in M[row]]
        for r in range(n):
            if r != row and M[r][col]:
                f = M[r][col]
                M[r] = [(a - f * c) % 256 for a, c in zip(M[r], M[row])]
        row += 1
    return [M[i][n] for i in range(n)]
```

Extracting the constants from `.rodata` (`objcopy -O binary --only-section=.rodata`):

* ciphertext — `0x2060`, 48 bytes
* expected `b` — `0x2090`, 16 bytes
* matrix `A` — `0x20a0`, 256 bytes

The unique key is:

```
UNLOCK-SEQ-7Y2AB        (hex: 554e4c4f434b2d5345512d3759324142)
```

---

## 3. Stage 2 — the token (MD5 → AES-CBC)

On success the binary does:

```asm
1299: mov    rdi, rbx              ; input
129c: mov    esi, 0x10             ; 16
12a4: mov    rdx, r12              ; md5 out buffer
12af: call   MD5                   ; MD5(key) -> 16 bytes
...
12c6: mov    esi, 0x80             ; 128-bit AES key
12d0: call   AES_set_decrypt_key   ; key schedule from MD5(key)
...
12db: mov    rcx, rbp              ; key
12de: lea    r8, [rsp+0x106]       ; IV (zeroed)
12e6: mov    edx, 0x30             ; 48 bytes
12eb: mov    rsi, rbx              ; output buffer
12f6: lea    rdi, [rip+0xd63]      ; input = ciphertext @ .rodata+0x60
12fd: call   AES_cbc_encrypt       ; enc = 0  -> DECRYPT
```

So:

```
plaintext = AES-128-CBC-decrypt(ciphertext, key = MD5("UNLOCK-SEQ-7Y2AB"), IV = 0^16)
```

There is a small null-termination quirk before printing:

```asm
1302: mov    al, BYTE PTR [rsp+0x156]   ; plaintext[47]
1309: cmp    al, 0x2f
130b: ja     1321
1315: sub    eax, 0x30                  ; 0x30 - last_byte
1319: mov    BYTE PTR [rsp+rax+0x127],0 ; write NUL there
```

Decrypting yields (PKCS#7-style padding):

```
H7CTF{b169235b-bed2-48bd-aaf6-a76afd77fff2}\x05\x05\x05\x05\x05
```

---

## 4. Exploit

The complete offline solver is [`solve.py`](./solve.py). It parses `.rodata`
directly from the ELF, solves the mod-256 system, then performs the AES-CBC
decryption (`pycryptodome`, with an `openssl` CLI fallback).

```bash
$ python3 solve.py --binary ./interlock
[+] key bytes : b'UNLOCK-SEQ-7Y2AB'
[+] key hex   : 554e4c4f434b2d5345512d3759324142
[+] MD5(key)  : e2455c68be624037323e82a9d3c49441  (AES-128 key)
[+] plaintext : b'H7CTF{b169235b-bed2-48bd-aaf6-a76afd77fff2}\x05\x05\x05\x05\x05'
[+] FLAG      : H7CTF{b169235b-bed2-48bd-aaf6-a76afd77fff2}
```

Confirming against the real binary:

```bash
$ ./interlock 'UNLOCK-SEQ-7Y2AB'
interlock: released. token: H7CTF{b169235b-bed2-48bd-aaf6-a76afd77fff2}

$ printf 'UNLOCK-SEQ-7Y2AB\n' | ./interlock
key: interlock: released. token: H7CTF{b169235b-bed2-48bd-aaf6-a76afd77fff2}
```

---

## 5. Summary

| Stage | Mechanism | Recovered |
|-------|-----------|-----------|
| 1 | `A·x ≡ b (mod 256)`, unique because `A` is full rank mod 2 | key `UNLOCK-SEQ-7Y2AB` |
| 2 | `AES-128-CBC-decrypt(ct, MD5(key), IV=0)` | flag string |

**Flag:**

```
H7CTF{b169235b-bed2-48bd-aaf6-a76afd77fff2}
```
