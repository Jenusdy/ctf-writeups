Writeup
1. We are given encrypted text as a output of the program and the program itself.
2. The goals is we want to get the input, we have to reverse the process
3. After open the program in Ghidra I found that the main function looks like this 
```
undefined8 main(void)

{
  FILE *pFVar1;
  size_t __size;
  void *__ptr;
  undefined8 uVar2;
  size_t sVar3;
  long local_30;
  
  pFVar1 = fopen("flag.txt","r+b");
  fseek(pFVar1,0,2);
  __size = ftell(pFVar1);
  rewind(pFVar1);
  __ptr = malloc(__size);
  if (__ptr == (void *)0x0) {
    fwrite("malloc failed\n",1,0xe,stderr);
    fclose(pFVar1);
    uVar2 = 1;
  }
  else {
    sVar3 = fread(__ptr,1,__size,pFVar1);
    if (sVar3 == __size) {
      for (local_30 = 0; local_30 < (long)__size; local_30 = local_30 + 1) {
        *(char *)((long)__ptr + local_30) = *(char *)((long)__ptr + local_30) + '\x01';
      }
      fclose(pFVar1);
      pFVar1 = fopen("enc.txt","w");
      sVar3 = fwrite(__ptr,1,__size,pFVar1);
      if (sVar3 == __size) {
        free(__ptr);
        fclose(pFVar1);
        puts(&DAT_00102040);
        puts(
            "/*************************************************************************************\ \ \n"
            );
        puts("  MWAHAAHAHAH SAY GOOD-BYTE TO YOUR FLAG ROMAN FILTH!!!!! >:) ");
        puts("  OUR ENCRYPTION METHOD IS TOO STRONG TO BREAK. YOU HAVE TO PAY US >:D ");
        puts(
            "  PAY 18.BTC TO THE ADDRESS 1BEER4MINERSMAKEITRAINCOINSHUNT123 TO GET YOUR FLAG BACK,  "
            );
        puts("  OR WE SACK ROME AND I TAKE HONORIA\'S HAND IN MARRIAGE! SIGNED, ATTILA THE HUN.  \n"
            );
        puts(
            "/*************************************************************************************\ \ \n"
            );
        uVar2 = 0;
      }
      else {
        perror("fwrite");
        free(__ptr);
        fclose(pFVar1);
        uVar2 = 1;
      }
    }
    else {
      perror("fread");
      free(__ptr);
      fclose(pFVar1);
      uVar2 = 1;
    }
  }
  return uVar2;
}
```

4. The process of encryption happens in this line 
```
for (local_30 = 0; local_30 < (long)__size; local_30 = local_30 + 1) {
        *(char *)((long)__ptr + local_30) = *(char *)((long)__ptr + local_30) + '\x01';
      }
      ```

5. This code actually just shift the character +1 like caeser encoding
6. SO we just need to reverse that and we got the flag ```sunshine{kN0w_y0u4_r0m@n_hI5t0rY}```