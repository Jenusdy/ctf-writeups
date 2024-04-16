from pwn import *
import string

enc = 'leyh{V2z4x#3q^x"wl][0V\177'
flag= 'ictf{R0t4t!0n_wwi'

guess = 'ictf{'

for e in range(len(enc)+1):
    for i in string.printable:
        p = process(['ltrace','./challenge2'])
        g = guess + str(i)
        p.sendline(g)
        s = str(p.recvall())

        enc_input = s.split('strncmp(')[1].split(', ')[0][1:-1]
        enc_flag = s.split('strncmp(')[1].split(', ')[1][1:-1]

        print('\n Flag : ' + g)
        print(enc_input, enc_flag[:len(g)])

        if enc_input == enc_flag[:len(g)]:
            guess += i
            break
    print(guess)
