# Gone Not Forgotten - CTF Writeup

- **Category:** Forensics
- **Challenge Name:** Gone Not Forgotten
- **Difficulty:** Easy / Medium

---

## Challenge Description & Hint

> *"A phone lands on the evidence bench for a harassment case, and the suspect is adamant they never sent anything ugly. Nova Messenger agrees with them: nothing there.*
>
> *Deleting a thing and being rid of it were never the same move."*

---

## Provided Artifacts

The challenge provides an `evidence/` directory containing two files from an Android app:
- `evidence/secure.xml`: Android shared preferences XML file.
- `evidence/messages.db`: SQLite database file storing chat messages.

---

## Detailed Walkthrough

### 1. Analyzing Configuration (`secure.xml`)

Inspecting `evidence/secure.xml`:

```xml
<?xml version='1.0' encoding='utf-8' standalone='yes' ?>
<map>
    <string name="obfuscation_key">n0v4ch4t</string>
    <string name="stored_body_encoding">hex(xor(body, obfuscation_key))</string>
    <boolean name="biometric_lock" value="true" />
</map>
```

This configuration reveals key parameters:
- **Obfuscation Key:** `n0v4ch4t`
- **Encoding Scheme:** `hex(xor(body, obfuscation_key))`

### 2. Inspecting the Database (`messages.db`)

Checking the SQLite database schema and active records:

```bash
sqlite3 evidence/messages.db ".schema"
```
```sql
CREATE TABLE messages(_id INTEGER PRIMARY KEY, thread TEXT, sender TEXT, ts INTEGER, body TEXT);
```

Querying the rows stored in `messages`:

```bash
sqlite3 evidence/messages.db "SELECT * FROM messages;"
```

```text
1|general|alice|1710001000000|lunch at 1?
2|general|bob|1710001100000|sure, the usual spot
3|general|alice|1710001200000|cool, see you
5|ops|mallory|1710002050000|burn this after you read it
6|general|bob|1710002100000|anyone seen the build?
7|general|carol|1710002200000|ci is green now
```

Row with `_id = 4` is absent. As indicated by the hint (*"Deleting a thing and being rid of it were never the same move"*), the message was deleted from the table.

### 3. Forensic Carving for Deleted Records

In SQLite, deleting a row marks the space as free within the B-Tree leaf page or freelist without immediately wiping the underlying bytes (unless `VACUUM` or `secure_delete` is explicitly invoked).

Extracting printable strings from `messages.db`:

```bash
strings -n 10 evidence/messages.db
```

Output:
```text
SQLite format 3
CREATE TABLE messages(_id INTEGER PRIMARY KEY, thread TEXT, sender TEXT, ts INTEGER, body TEXT)
ci is green now,
anyone seen the build?1
burn this after you read it
yopsmallory
26073560251303150a564f025a5d521658054357545d064c5f000b
cool, see you*
sure, the usual spot#
lunch at 1?
```

The deleted record payload is located at offset `12114`:
```text
26073560251303150a564f025a5d521658054357545d064c5f000b
```

### 4. Decrypting the Message Body

Using the formula `flag = xor(unhex(payload), obfuscation_key)`:

```python
hex_data = "26073560251303150a564f025a5d521658054357545d064c5f000b"
key = b"n0v4ch4t"

raw = bytes.fromhex(hex_data)
flag = bytes([b ^ key[i % len(key)] for i, b in enumerate(raw)]).decode()
print(flag)
```

Output:
```text
H7CTF{7adf9695fb655c752810}
```

---

## Automation Script (`solve.py`)

```python
#!/usr/bin/env python3
import re
import xml.etree.ElementTree as ET

# 1. Parse obfuscation key from secure.xml
tree = ET.parse("evidence/secure.xml")
root = tree.getroot()
key = None
for s in root.findall("string"):
    if s.attrib.get("name") == "obfuscation_key":
        key = s.text.encode()
        break

# 2. Carve hex pattern from messages.db unallocated space
with open("evidence/messages.db", "rb") as f:
    data = f.read()

# Match hex strings of sufficient length
candidates = re.findall(rb"[0-9a-fA-F]{30,}", data)
for cand in candidates:
    raw = bytes.fromhex(cand.decode())
    decrypted = bytes([b ^ key[i % len(key)] for i, b in enumerate(raw)])
    if b"{" in decrypted and b"}" in decrypted:
        print(f"[+] Flag found: {decrypted.decode(errors='ignore')}")
```

---

## Flag

```
H7CTF{7adf9695fb655c752810}
```
