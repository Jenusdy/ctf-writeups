# Very Based

### Description
```
Find the flag.

SU5FVkk2WlhHSlJXT1MyTUdORFZFSkJFTEJSRzRLVDU=

Flag Format: CIT{example_flag}
```

We know that the flag is encoded into some algorithm.
From the format looks like its base64, but actually it's using base32
So we just need to decode that using base32

```
CIT{72cgKL3GR$$Xbn*}
```