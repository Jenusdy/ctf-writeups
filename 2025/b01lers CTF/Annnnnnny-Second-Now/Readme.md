# Annnnnnny-Second-Now
> 

## About the Challenge
We are given ELF file but when we try to run it. It's never end.
After analyzing it using Ghidra, I found that this program tries to calculate Fibonacci(90)
using recursive function.

The problem makes this program run so slowly because it's not implement memoization

## How to Solve?
We try to calculate the flag using the value of Fib(90)
```cpp
undefined8 main(void)

{
  ulong uVar1;
  long in_FS_OFFSET;
  uint local_84;
  uint local_78 [26];
  long local_10;
  
  local_10 = *(long *)(in_FS_OFFSET + 0x28);
  local_78[0] = 0x8bf7;
  local_78[1] = 0x8f;
  local_78[2] = 0x425;
  local_78[3] = 0x36d;
  local_78[4] = 0x1c1928b;
  local_78[5] = 0xe5;
  local_78[6] = 0x70;
  local_78[7] = 0x151;
  local_78[8] = 0x425;
  local_78[9] = 0x2f;
  local_78[10] = 0x739f;
  local_78[11] = 0x91;
  local_78[12] = 0x7f;
  local_78[13] = 0x42517;
  local_78[14] = 0x7f;
  local_78[15] = 0x161;
  local_78[16] = 0xc1;
  local_78[17] = 0xbf;
  local_78[18] = 0x151;
  local_78[19] = 0x425;
  local_78[20] = 0xc1;
  local_78[21] = 0x161;
  local_78[22] = 0x10d;
  local_78[23] = 0x1e7;
  local_78[24] = 0xf5;
  uVar1 = super_optimized_calculation(90);
  for (local_84 = 0; local_84 < 0x19; local_84 = local_84 + 1) {
    putc((int)(uVar1 % (ulong)local_78[(int)local_84]),stdout);
  }
  putc(10,stdout);
  if (local_10 != *(long *)(in_FS_OFFSET + 0x28)) {
                    /* WARNING: Subroutine does not return */
    __stack_chk_fail();
  }
  return 0;
}
```

So I wrote python code that can calculate the flag 

```python
def main():
    # Initialize variables
    local_78 = [35831, 143, 1061, 0x36d, 29463179, 229, 112, 337, 0x425, 0x2f, 0x739f, 0x91,
                0x7f, 0x42517, 0x7f, 0x161, 0xc1, 0xbf, 0x151, 0x425, 0xc1, 0x161, 0x10d, 0x1e7, 0xf5]
    
    # Call super_optimized_calculation
    uVar1 = 2880067194370816120
    
    # Iterate through the array, perform calculation, and print characters
    for i in range(0x19):
        print(chr(uVar1 % local_78[i]), end='')
    
    # Print newline character
    print()

if __name__ == "__main__":
    main()
```


```text
flag : bctf{what's_memoization?}
```


