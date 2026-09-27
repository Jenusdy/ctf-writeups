# Constraint Yourself / Cipherlock — Writeup

**Category:** Reverse Engineering
**Difficulty:** Medium
**Points:** 63
**Flag:** `H7CTF{b7edd2b4-a6be-4a9a-87b5-aa96fc87d06e}`

---

## Description

> Cipherlock is the last lock in the vault, and it's a stubborn one: the key it wants has to satisfy it on every count or the door doesn't budge. Anything short of exactly right gets a flat "denied."
>
> Some locks you pick. This one you have to reason with.

The challenge gives a single binary, `cipherlock`, downloadable from the web page:

```html
<h3>Constraint Yourself</h3><p>Your binary: <a href="cipherlock">cipherlock</a></p>
```

---

## 1. Recon

```console
$ file cipherlock
cipherlock: ELF 64-bit LSB pie executable, x86-64, dynamically linked,
            interpreter /lib64/ld-linux-x86-64.so.2, stripped
```

```console
$ strings -n 4 cipherlock
...
AES_set_decrypt_key
AES_cbc_encrypt
MD5
key:
cipherlock: denied
cipherlock: open. %s
```

So the binary:

* is `stripped` (no symbol names to guide us),
* links OpenSSL 3 (`libcrypto`),
* uses **MD5**, **AES_set_decrypt_key** and **AES_cbc_encrypt**,
* prints `key: ` and either `denied` or `open. <something>`.

Running it:

```console
$ ./cipherlock
key: wrongkeyiswrong
cipherlock: denied
```

It also accepts the key as `argv[1]`:

```console
$ ./cipherlock AAAABBBBCCCCDDDD
cipherlock: denied
```

At this point it looks like: *enter the right key → AES-decrypt a hardcoded
blob → print the flag*. The challenge name ("Constraint Yourself") and the
description ("has to satisfy it on **every count**") strongly hint the key is
recovered by solving a set of equations rather than by brute force.

---

## 2. Static analysis of `main`

The entry point is at `0x1180`. Cleaning it up, the logic is:

1. Take `argv[1]` (if present) or read a line from `stdin` into a 16-byte buffer.
2. Strip the trailing newline and require `strlen(key) == 16`.
3. Check **three constraints** over the 16 key bytes:
   * **Constraint 1** (loop at `0x123d`):
     ```c
     k[(i + 3) & 15] ^ k[i] == A[i]        // i = 0..15
     ```
   * **Constraint 2** (loop at `0x1267`):
     ```c
     (k[2*i] * k[2*i + 1]) & 0xff == B[i]  // i = 0..7  (byte multiply)
     ```
   * **Constraint 3** (loop at `0x1288`):
     ```c
     (rol8(k[i], 3) + k[(i + 5) & 15]) & 0xff == C[i]   // i = 0..15
     ```
4. If **any** check fails, `edx` is cleared and the program prints
   `cipherlock: denied` (exit code 1).
5. If **all** checks pass (`edx == 1`), it runs the "open" path:

```c
MD5(key, 16, digest);                       // digest = MD5(user key)
AES_set_decrypt_key(digest, 128, &ks);      // key schedule from the digest
memset(iv, 0, 16);                          // IV is all zeros
AES_cbc_encrypt(CT, out, 48, &ks, iv, 0);   // decrypt 48 bytes, enc = 0
```

6. It then applies a small padding step: let `p = out[47]`; if `p <= 0x2f`
   it null-terminates the string at `out[0x30 - p]`, and finally prints
   `cipherlock: open. %s`.

The failure condition is worth underlining: there is no partial credit. The
description literally says *"Anything short of exactly right gets a flat
denied."* Every one of the 40 comparisons must hold.

> Note on the disassembly: `cmovne edx, esi` with `esi = 0` clears the
> success flag on the first mismatch; only if all three loops finish with
> `edx` still `1` does `jne 12c5` jump into the decrypt path.

---

## 3. Extracting the constant tables

All constants live in `.rodata`, which we can dump directly:

```console
$ objdump -s -j .rodata cipherlock
 2040 9e90d998 74a0e879 e0bc4696 77061f20   <- 48-byte AES-CBC ciphertext
 2050 6dc5ee87 73fe5488 77b5e9b6 e3e50112
 2060 7a3f73b4 bef30fcf 459685c0 6e1d36c9
 2070 caeff5bd 6cb5bbe8 f6b3d89d a6f636fc   <- C[16]  (constraint 3)
 2080 dcc4904a e8d49817 00000000 00000000   <- B[8]   (constraint 2)
 2090 7e776463 10641c67 1d1c6068 79071563   <- A[16]  (constraint 1)
```

The `lea` instructions in `main` resolve exactly to these addresses:

| Register at check | Address | Table |
|---|---|---|
| `rdi` (`0x1234`) | `0x2090` | `A[16]` — XOR constraint |
| `rdi` (`0x125e`) | `0x2080` | `B[8]`  — multiply constraint |
| `r8`  (`0x127f`) | `0x2070` | `C[16]` — rotate/add constraint |
| `rdi` (`0x132a`) | `0x2040` | 48-byte AES ciphertext |

```python
A = bytes([0x7e,0x77,0x64,0x63,0x10,0x64,0x1c,0x67,
           0x1d,0x1c,0x60,0x68,0x79,0x07,0x15,0x63])
B = bytes([0xdc,0xc4,0x90,0x4a,0xe8,0xd4,0x98,0x17])
C = bytes([0xca,0xef,0xf5,0xbd,0x6c,0xb5,0xbb,0xe8,
           0xf6,0xb3,0xd8,0x9d,0xa6,0xf6,0x36,0xfc])
```

---

## 4. Solving with z3

Because all three constraints operate on 8-bit values with wraparound
(`& 0xff`, byte multiply, rotate), **bit-vectors of width 8** model the
binary exactly. This is a textbook z3 job.

```python
from z3 import BitVec, Solver, sat

k = [BitVec(f"k{i}", 8) for i in range(16)]
s = Solver()

for i in range(16):                      # constraint 1
    s.add(k[(i + 3) & 15] ^ k[i] == A[i])

for i in range(8):                       # constraint 2 (byte multiply)
    s.add(k[2*i] * k[2*i + 1] == B[i])

for i in range(16):                      # constraint 3
    rotated = ((k[i] << 3) | (k[i] >> 5)) & 0xff
    s.add(rotated + k[(i + 5) & 15] == C[i])

assert s.check() == sat
m = s.model()
key = bytes(m[b].as_long() for b in k)
```

The solver returns a **unique** solution (adding blocking clauses finds no
other model):

```
key = b'S4T-C0NSTR4INT!7'
```

Reading the key gives a nice nod to the theme: **S4T-C0NSTR4INT!7**
("satisfy constraint").

---

## 5. Recovering the flag

With the key known, the rest is exactly what the binary does:

1. `AES key = MD5(b"S4T-C0NSTR4INT!7")` → `1cb0462d48162b777e20b6882e4cfed9`
2. AES-128-CBC **decrypt** the 48-byte blob at `0x2040` with **IV = 0**.

```console
$ echo -n "S4T-C0NSTR4INT!7" \
    | openssl enc -d -aes-128-cbc -nopad \
        -K 1cb0462d48162b777e20b6882e4cfed9 \
        -iv 00000000000000000000000000000000
H7CTF{b7edd2b4-a6be-4a9a-87b5-aa96fc87d06e}
```

The last bytes of the plaintext are `05 05 05 05 05` — five bytes of
padding, matching the binary's `out[0x30 - p]` truncation logic.

### Verification against the real binary

```console
$ echo "S4T-C0NSTR4INT!7" | ./cipherlock
key: cipherlock: open. H7CTF{b7edd2b4-a6be-4a9a-87b5-aa96fc87d06e}

$ ./cipherlock "S4T-C0NSTR4INT!7"
cipherlock: open. H7CTF{b7edd2b4-a6be-4a9a-87b5-aa96fc87d06e}
```

---

## 6. Flag

```
H7CTF{b7edd2b4-a6be-4a9a-87b5-aa96fc87d06e}
```

---

## 7. Exploit script

The full solver/exploit is in [`solve.py`](./solve.py). It:

1. encodes the three constraint sets as z3 bit-vector equations,
2. solves for the 16-byte key,
3. derives `MD5(key)`,
4. AES-CBC-decrypts the hardcoded ciphertext (via the `openssl` CLI) and
   strips the padding.

Run it with:

```console
$ python3 -m pip install z3-solver
$ python3 solve.py
[+] recovered 16-byte key : b'S4T-C0NSTR4INT!7'
[+] key (hex)             : 5334542d43304e53545234494e542137
[+] MD5(key) = AES key    : 1cb0462d48162b777e20b6882e4cfed9
[+] raw plaintext (hex)   : 48374354467b...3036657d0505050505
[+] FLAG                  : H7CTF{b7edd2b4-a6be-4a9a-87b5-aa96fc87d06e}
```

> Dependencies: `z3-solver` (Python) and the `openssl` command-line tool for
> the AES step. The MD5 is provided by Python's standard `hashlib`.

---

## 8. Takeaways

* **The name is the hint.** "Constraint Yourself" = turn the checks into a
  *constraint satisfaction problem* and hand it to a solver (z3).
* **Model the machine exactly.** Using 8-bit bit-vectors automatically
  captures every `& 0xff`, the byte `mul`, and the `rol` — no manual modular
  arithmetic mistakes.
* **AES is a red herring for reversing, but not for the flag.** You do not
  need to reverse the AES; once the key passes all checks, the binary (or
  OpenSSL) decrypts the flag for you.
* **"Anything short of exactly right gets denied"** is a strong signal that
  the checks are AND-ed together with no partial feedback — brute force is
  hopeless, reasoning is the intended path.
