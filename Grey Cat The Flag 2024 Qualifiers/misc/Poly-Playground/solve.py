from pwn import *

import numpy as np

def polynomial_from_roots(roots):
    roots = [int(root) for root in roots]
    # Calculate coefficients of polynomial from roots
    coefficients = np.poly(roots)
    coefficients_string = ", ".join(map(str, coefficients))
    return coefficients_string

p = remote('challs.nusgreyhats.org',31113)

p.recvuntil('Roots: '.encode())
akar = p.recvline('').decode("utf-8").split(',')
coef = polynomial_from_roots(akar)
p.sendlineafter(b'Present the coefficients of your amazing equation: ',coef.encode())


while True:
    temp = p.recv().decode()
    if 'grey{' in temp: 
        print(temp)
        break
    akar = temp.split('Roots: ')[1].split('\n')[0].split(',')
    coef = polynomial_from_roots(akar)
    print(akar,coef)
    p.sendline(coef.encode())
