# BASEic - SunshineCTF 2025

## Challenge Description

We are given a binary named `BASEic`. When run, it prompts for a flag. Submitting random input does not work.

## Initial Analysis

Running the binary and tracing with `ltrace`:

```
$ ltrace ./BASEic 
printf("What is the flag> ") = 18
__isoc99_scanf(0x55feada56094, 0x7ffd61183040, 0, 0What is the flag> aaa
) = 1
strlen("aaa") = 3
puts("You don't get the flag that easily") = 35
+++ exited (status 0) +++
```

Entering a random string results in the message:  
`You don't get the flag that easily`

## Reversing

Opening the binary in Ghidra, the main function logic is as follows:

```c
undefined8 FUN_001014d1(void)

{
  int iVar1;
  size_t sVar2;
  char *__s1;
  long in_FS_OFFSET;
  char local_56 [70];
  long local_10;
  
  local_10 = *(long *)(in_FS_OFFSET + 0x28);
  builtin_strncpy(local_56,"yX0I0NTM1fQ==",0xe);
  printf("What is the flag> ");
  __isoc99_scanf(&DAT_00102094,local_56 + 0xe);
  sVar2 = strlen(local_56 + 0xe);
  if (sVar2 == 0x16) {
    sVar2 = strlen(local_56 + 0xe);
    __s1 = (char *)FUN_001012c6(local_56 + 0xe,sVar2);
    iVar1 = strncmp(__s1,"c3Vue2MwdjNyMW5nX3V",0x13);
    if (iVar1 == 0) {
      sVar2 = strlen(local_56);
      iVar1 = strncmp(__s1 + 0x13,local_56,sVar2);
      if (iVar1 == 0) {
        puts("You got it, submit the flag!");
      }
      else {
        puts("Soo Close");
      }
    }
    else {
      puts("Closer");
    }
    free(__s1);
  }
  else {
    puts("You don't get the flag that easily");
  }
  if (local_10 != *(long *)(in_FS_OFFSET + 0x28)) {
                    /* WARNING: Subroutine does not return */
    __stack_chk_fail();
  }
  return 0;
}
```

- The program copies the string `"yX0I0NTM1fQ=="` into a buffer.
- It then reads user input after this buffer.
- The input is expected to be 0x16 (22) bytes long.
- The function `FUN_001012c6` is likely a base64 decoder.
- The decoded input is compared to `"c3Vue2MwdjNyMW5nX3V"` and then to the original buffer.

## Solution

The key is to find the correct base64-encoded string that, when decoded, matches the expected values.

From the code, the string being compared is:

- `"c3Vue2MwdjNyMW5nX3V"` (19 bytes)
- The rest is compared to `"yX0I0NTM1fQ=="`

Concatenating these gives:  
`"c3Vue2MwdjNyMW5nX3VyX0I0NTM1fQ=="`

Decoding this base64 string:

```python
import base64
print(base64.b64decode("c3Vue2MwdjNyMW5nX3VyX0I0NTM1fQ==").decode())
# Output: sun{c0v3r1ng_ur_B4535}
```

## Flag

```
sun{c0v3r1ng_ur_B4535}
```