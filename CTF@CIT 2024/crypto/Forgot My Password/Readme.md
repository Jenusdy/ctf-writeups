# Forgot My Password

## Description

```
I forgot my password to my own server! For some reason when I try to view my password in the database all I see is "3588e5b98b1051ee6dc7748f13474987". Please help me recover my password!

Flag Format: CIT{password_here}
```

## 
The password we have acctually hash on md5 and the easiest way to solve this is search the hash on hashtable publicly available

From this [website](https://md5decrypt.net/en/) we can decrypt that has and get password ```verysecure```

```Flag : CIT{verysecure}```