After do some static analysis we found function that run that code
```

undefined8 FUN_001010a0(void)

{
  int iVar1;
  long in_FS_OFFSET;
  char acStack_98 [64];
  char local_58 [56];
  long local_20;
  
  local_20 = *(long *)(in_FS_OFFSET + 0x28);
  sprintf(acStack_98,"sun{%s_%s_%s}\n",&DAT_00102013,"s4t3ll1t3",&DAT_00102004);
  time((time_t *)0x0);
  printf("Satellite Status: Battery=%d%%, Orbit=%d, Temp=%dC\n",0x50,0x20,0xffffffe7);
  printf("Enter satellite command: ");
  fgets(local_58,0x32,stdin);
  iVar1 = strcmp(local_58,acStack_98);
  if (iVar1 == 0) {
    puts("Access Granted!");
  }
  else {
    puts("Access Denied!");
  }
  if (local_20 == *(long *)(in_FS_OFFSET + 0x28)) {
    return 0;
  }
                    /* WARNING: Subroutine does not return */
  __stack_chk_fail();
}

```

We can see easyly that the flag as a input and the format ```sun{%s_%s_%s}\n",&DAT_00102013,"s4t3ll1t3",&DAT_00102004```

So we have to find the value of DAT_00102013 & DAT_00102004

We just need to click the variable and we get the value of that 

```
                             DAT_00102004                                    XREF[1]:     FUN_001010a0:001010a1(*)  
        00102004 33              ??         33h    3
        00102005 31              ??         31h    1
        00102006 33              ??         33h    3
        00102007 31              ??         31h    1
        00102008 00              ??         00h
                             s_s4t3ll1t3_00102009                            XREF[1]:     FUN_001010a0:001010a8(*)  
        00102009 73 34 74        ds         "s4t3ll1t3"
                 33 6c 6c 
                 31 74 33 00
                             DAT_00102013                                    XREF[1]:     FUN_001010a0:001010b0(*)  
        00102013 65              ??         65h    e
        00102014 34              ??         34h    4
        00102015 73              ??         73h    s
        00102016 79              ??         79h    y
        00102017 00              ??         00h
```

So the flag is sun{e4sy_s4t3ll1t3_3131}