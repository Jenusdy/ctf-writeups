from pwn import *

p = remote('challs.nusgreyhats.org',31111)
n = random.randint(1000000000000000, 10000000000000000-1)

p.sendline(b'1')
res = p.recvall()

s = str(res)
s = s.split('The number I was thinking of was ')[1].split('\\')[0]

p = remote('challs.nusgreyhats.org',31111)
p.sendline(s)
res = p.recvall()
print(res)