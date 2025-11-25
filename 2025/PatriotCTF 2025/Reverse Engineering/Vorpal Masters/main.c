void main(void)

{
  int iVar1;
  int local_20;
  char local_1c [11];
  char local_11;
  char local_10;
  char local_f;
  char local_e;
  int local_c;
  
  puts(
      "Welcome to {insert game here}\nPlease enter the license key from the 3rd page of the booklet. "
      );
  local_c = __isoc99_scanf("%4s-%d-%10s",&local_11,&local_20,local_1c);
  if (local_c != 3) {
    puts("Please enter you key in the format xxxx-xxxx-xxxx");
                    /* WARNING: Subroutine does not return */
    exit(0);
  }
  if ((((local_11 != 'C') || (local_f != 'C')) || (local_e != 'I')) || (local_10 != 'A')) {
    womp_womp();
  }
  if ((-0x1389 < local_20) && (local_20 < 0x2711)) {
    if ((local_20 + 0x16) % 0x6ca == ((local_20 * 2) % 2000) * 6 + 9) goto LAB_00101286;
  }
  womp_womp();
LAB_00101286:
  iVar1 = strcmp(local_1c,"PatriotCTF");
  if (iVar1 != 0) {
    womp_womp();
  }
  puts("Lisence key registered, you may play the game now!");
  return;
}
