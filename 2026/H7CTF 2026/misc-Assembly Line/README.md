# Assembly Line - Misc Challenge Writeup

## Challenge Information
- **Category:** Misc
- **Connection:** `nc pwn.h7tex.com 43320`
- **Objective:** Answer 250 consecutive tasks within a 2-second limit per task.

---

## Challenge Overview
When connecting to the service, it prints:
```text
=== Sparrow Freight sorting line ===
answer 250 tasks, 2s each. go.
```

The server then prompts the user with 250 tasks formatted as:
```text
[<current>/250] <task_type>: <payload>
```

Due to the strict 2-second timeout per task, manual interaction is not viable. An automated network client is required.

---

## Task Types Encountered

1. **`reverse`**
   - **Format:** `[x/250] reverse: <string>`
   - **Operation:** Reverse the characters in the string.
   - **Solution:** `arg[::-1]`

2. **`eval`**
   - **Format:** `[x/250] eval: <num1> <op> <num2>`
   - **Operation:** Evaluate the arithmetic expression (addition, subtraction, multiplication).
   - **Solution:** `eval(arg)`

3. **`sum`**
   - **Format:** `[x/250] sum: <n1>,<n2>,...`
   - **Operation:** Sum a comma-separated list of integers.
   - **Solution:** `sum(map(int, arg.split(',')))`

4. **`b64`**
   - **Format:** `[x/250] b64: <base64_string>`
   - **Operation:** Decode a base64-encoded ASCII string.
   - **Solution:** `base64.b64decode(arg).decode('utf-8')`

---

## Solution Script

The automated script [`solve.py`](./solve.py) connects over TCP using Python's standard `socket` library, parses incoming tasks using regex, evaluates the answers dynamically, and streams them back to the server:

```bash
python3 solve.py
```

---

## Flag

After completing all 250 tasks, the server returns:

```text
LINE: line cleared! H7CTF{ca47b850-7567-4d90-9aae-d1ffeef24907}
```

**Flag:** `H7CTF{ca47b850-7567-4d90-9aae-d1ffeef24907}`
