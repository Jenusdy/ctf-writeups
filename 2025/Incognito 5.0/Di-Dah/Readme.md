# Di-Dah
> dah-di-di-di-dit dah-dah-dah-dah-dit dah-di-di-di-dit di-di-di-dah-dah dah-dah-di-di-dit di-di-di-di-dah dah-di-di-di-dit dah-di-di-di-dit dah-dah-di-di-dit dah-di-di-dit di-di-di-di-dah dah-di-dit di-di-di-dah-dah dah-dah-dah-dah-dah dah-dah-di-di-dit di-di-dah-dah-dah dah-dah-di-di-dit di-di-di-dah-dah di-di-di-dah-dah di-di-di-dah-dah di-di-di-di-dit di-di-dah-dit di-di-di-dah-dah di-di-di-di-dah dah-di-di-di-dit dit dah-di-di-di-dit di-di-di-di-dah di-di-di-di-dit di-di-dah-dit di-di-di-di-dah di-di-di-di-dah di-di-di-dah-dah di-dah-dah-dah-dah di-di-di-di-dah di-di-di-di-dah di-di-di-di-dah dah-dah-dah-dah-dah dah-di-di-di-dit dah-dah-dah-di-dit di-di-di-di-dit di-di-dah-dit di-di-di-di-dit dah-dah-di-di-dit dah-di-di-di-dit dah-dah-dah-di-dit di-di-di-dah-dah di-dah-dah-dah-dah dah-dah-di-di-dit di-dah di-di-di-dah-dah di-di-di-dah-dah dah-dah-di-di-dit di-di-dah-dah-dah di-di-di-dah-dah di-di-di-dah-dah dah-dah-di-di-dit di-di-dah-dah-dah dah-dah-di-di-dit dah-di-dit dah-dah-dah-dah-dah di-dah

## About the Challenge
First time I look challenge, that message given to us looks like Morse Code and this challenge same from another [CTF challenge](https://ctftime.org/writeup/16495)

## How to Solve?
So I tried to decode this message by replace every word with this dictionary

```python
{
    'dah': '-', # dash
    'di': '.', # dot
    'dit': '. ' # dot with space
}
```

And we got this message like this 
```text
-.... ----. -.... ...-- --... ....- -.... -.... --... -... ....- -.. ...-- ----- --... ..--- --... ...-- ...-- ...-- ..... ..-. ...-- ....- -.... . -.... ....- ..... ..-. ....- ....- ...-- .---- ....- ....- ....- ----- -.... ---.. ..... ..-. ..... --... -.... ---.. ...-- .---- --... .- ...-- ...-- --... ..--- ...-- ...-- --... ..--- --... -.. ----- .-
```

By using this tools [CyberChef](https://cyberchef.io/), I can easily decode that code into this text

```text
696374667B4D307273335F346E645F44314440685F5768317A337233727D0A
```

It's actually hex and I just need to decode this to string and get the flag 
```text
flag : ictf{M0rs3_4nd_D1D@h_Wh1z3r3r}
```


