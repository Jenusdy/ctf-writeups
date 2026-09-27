# Rust in Peace — H7CTF (Rev / Static, Medium)

> A firmware vendor with strong opinions about memory safety shipped this licence
> validator with every label filed off. Right licence and it surrenders the token;
> wrong one and it just shrugs.
>
> Safe code still has to answer for what it's guarding.

**Flag:** `H7CTF{3f7b3f564a5524ce863d}`

---

## 1. Recon

The handout is a single stripped, PIE, 64-bit ELF. The name "ferric" (iron) plus the
challenge title make the intent obvious: it is a **Rust** binary.

```
$ file ferric
ferric: ELF 64-bit LSB pie executable, x86-64, dynamically linked, stripped

$ ./ferric
license: invalid license

$ printf 'test\n' | ./ferric
license: invalid license
```

Running it prints a `license: ` prompt, reads from **stdin**, and either accepts or
prints `invalid license`. `strace` confirms it reads a line from fd 0:

```
write(1, "license: ", 9)
read(0, "test\n", 32)
write(1, "invalid license\n", 16)
```

Strings are unhelpful on their own (the flag is never present as plaintext), so we
need to find the validator.

## 2. Finding `main`

Rust's runtime calls the real `main` body through `std::rt::lang_start`. The libc
entry stub (`main` at offset `0x16010`) constructs the runtime and passes the true
body address:

```asm
16017: lea rax,[rip+0xfffffffffffff7c2]   ; -> 0x157e0  (real Rust main)
...
1602f: call QWORD PTR [rip+0x41bfb]        ; std::rt::lang_start(main, ...)
```

So the interesting function is at **`0x157e0`**. Decompiling it (Ghidra headless or
manual reading) reveals the whole program.

## 3. The validator

`main` reads a line, drops surrounding whitespace, and then requires the trimmed
input to be **exactly 16 bytes** (the `cmp ...,0x10`/`lVar15 == 0x10` branch). For
each byte `i` it computes a value and compares it against a hard-coded table:

```c
c = rotl8( input[i] ^ key1[i], key2[i] & 7 ) + key3[i]   // 8-bit add, wraps
assert c == target[i];
```

with four adjacent 16-byte tables in `.rodata`:

| table | offset | bytes |
|-------|--------|-------|
| `key1` (XOR)      | `0x5140` | `c4b37391 5210a794 883db065 77fef1f0` |
| `key2` (rotate)   | `0x5180` | `07 06 06 02 05 05 04 03 04 01 06 03 03 02 06 07` |
| `key3` (add)      | `0x51b0` | `9c45df14 7cc256e1 59be2324 193ddf09` |
| `target`          | `0x52b0` | `dd022723 df2cfe17 369a5c66 fa2b09e9` |

The "every label filed off" note is just the stripped symbol table; the check is a
tiny, fully reversible byte transform.

## 4. Recovering the licence

Invert the transform per byte:

```
roller = (target[i] - key3[i]) mod 256        # undo the add
raw    = rotr8(roller, key2[i] & 7)           # undo the rotate-left
input  = raw XOR key1[i]                      # undo the XOR
```

Running that over the tables yields:

```
license (hex)  : 4645525249432d525553542d4b455931
license (ascii): FERRIC-RUST-KEY1
```

Feeding it to the binary unlocks the token:

```
$ printf 'FERRIC-RUST-KEY1\n' | ./ferric
license: unlocked: H7CTF{3f7b3f564a5524ce863d}
```

## 5. Bonus: how the token is produced

Once the 16-byte licence matches, the accepted path derives the 27-byte token from
it with a second, independent transform (three little-endian 64-bit values plus a
3-byte tail):

```
a = u64_le(license[0:8])
b = u64_le(license[8:16])

token[0:8]   = a XOR 0x341e380f0611720e
token[8:16]  = b XOR 0x506d737e4b673162
token[16:24] = a XOR 0x6415262a66607073
token[24]    = license[8]  XOR 0x66
token[25]    = license[9]  XOR 0x37
token[26]    = license[10] XOR 0x29
```

Sanity check: `token → "H7CTF{3f7b3f564a5524ce86" + "3d}"` =
`H7CTF{3f7b3f564a5524ce863d}`.

## 6. Flag

```
H7CTF{3f7b3f564a5524ce863d}
```

## 7. Solver

`solve.py` extracts the four tables straight from the binary, inverts the transform,
verifies the round-trip, and runs `./ferric` with the recovered licence:

```
$ python3 solve.py
[+] license (hex) : 4645525249432d525553542d4b455931
[+] license (ascii): FERRIC-RUST-KEY1
[+] round-trip verify: OK
[+] binary output:
    license: unlocked: H7CTF{3f7b3f564a5524ce863d}
```
