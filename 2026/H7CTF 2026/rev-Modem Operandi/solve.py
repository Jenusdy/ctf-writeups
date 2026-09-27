#!/usr/bin/env python3
"""
Solve the Modem Operandi license checker.

The binary implements a state machine that:
1. Copies key bytes to a buffer (stack)
2. Pushes constants
3. Performs XOR, ADD, ROL operations
4. Compares results with expected values

If all comparisons pass, the key is accepted.
The MD5 of the key is used as an AES-128-CBC key to decrypt the flag.
"""

import hashlib
from Crypto.Cipher import AES

# State machine data from .rodata at offset 0x20a0
data = bytes.fromhex(
    '01000258' '03023a04' '05050649' '01010208'
    '0302af04' '05030677' '0102023e' '03024e04'
    '050206d2' '010302db' '03027f04' '05040657'
    '01040261' '0302db04' '050606cc' '01050298'
    '03022304' '05070680' '010602f0' '03024404'
    '05020618' '010702d0' '03026604' '050106ef'
    '010802d9' '0302c004' '050306a5' '010902a8'
    '0302f404' '050306fe' '010a0252' '0302df04'
    '050106f9' '010b02d8' '03025f04' '0505063d'
    '010c02de' '03025b04' '050106ed' '010d029c'
    '03029404' '050606da' '010e0232' '03020f04'
    '0501060d' '010f02b1' '03022304' '05010616'
)

# Ciphertext from .rodata at offset 0x2080 (32 bytes = 2 AES blocks)
ciphertext = bytes.fromhex(
    'ab7acb5a' 'b6fb1f2a' '8242ecc6' '26654503'
    '5d16df91' 'da6abb10' '04cc198d' '0af8662b'
)

# Trace the state machine
# Buffer entries are tuples: ('key', idx), ('const', val), ('xor', a, b), ('add', a, b), ('rol', a, n)
buffer = []
state = 0
constraints = []  # (buffer_entry, expected_value)

while state < 0xc0:
    op = data[state]
    if op == 1:  # copy key[idx] to buffer
        idx = data[state + 1]
        buffer.append(('key', idx))
        state += 2
    elif op == 2:  # push constant
        val = data[state + 1]
        buffer.append(('const', val))
        state += 2
    elif op == 3:  # XOR top two buffer entries
        a = buffer.pop()
        b = buffer.pop()
        buffer.append(('xor', a, b))
        state += 1
    elif op == 4:  # ADD top two buffer entries
        a = buffer.pop()
        b = buffer.pop()
        buffer.append(('add', a, b))
        state += 1
    elif op == 5:  # ROL top buffer entry by n
        n = data[state + 1]
        a = buffer.pop()
        buffer.append(('rol', a, n))
        state += 2
    elif op == 6:  # CMP top buffer entry with expected value
        expected = data[state + 1]
        a = buffer.pop()
        constraints.append((a, expected))
        state += 2
    else:
        print(f"Unknown opcode {op} at state {state}")
        break

print(f"State machine traced: {len(constraints)} constraints")
print(f"Buffer size at end: {len(buffer)}")
print()

# Evaluate a buffer entry given key values
def evaluate(entry, key_vals):
    if entry[0] == 'key':
        return key_vals[entry[1]]
    elif entry[0] == 'const':
        return entry[1]
    elif entry[0] == 'xor':
        return (evaluate(entry[1], key_vals) ^ evaluate(entry[2], key_vals)) & 0xff
    elif entry[0] == 'add':
        return (evaluate(entry[1], key_vals) + evaluate(entry[2], key_vals)) & 0xff
    elif entry[0] == 'rol':
        val = evaluate(entry[1], key_vals)
        n = entry[2]
        return ((val << n) | (val >> (8 - n))) & 0xff

# Collect which key indices are used
key_indices_used = set()
def collect_key_indices(entry):
    if entry[0] == 'key':
        key_indices_used.add(entry[1])
    elif entry[0] in ('xor', 'add'):
        collect_key_indices(entry[1])
        collect_key_indices(entry[2])
    elif entry[0] == 'rol':
        collect_key_indices(entry[1])

for entry in buffer:
    collect_key_indices(entry)
for constraint, expected in constraints:
    collect_key_indices(constraint)

print(f"Key indices used: {sorted(key_indices_used)}")
print()

# Brute force: try all possible values for each key byte
# Since constraints are independent per key byte (mostly), we can solve them one by one
# But some constraints involve multiple key bytes through XOR/ADD/ROL
# Let's use a smarter approach: iterate through constraints and solve

# First, let's see which constraints involve which key indices
def get_key_indices(entry):
    indices = set()
    if entry[0] == 'key':
        indices.add(entry[1])
    elif entry[0] in ('xor', 'add'):
        indices.update(get_key_indices(entry[1]))
        indices.update(get_key_indices(entry[2]))
    elif entry[0] == 'rol':
        indices.update(get_key_indices(entry[1]))
    return indices

# Try brute force for each key byte independently
# Most constraints should only involve one key byte
key_solution = [None] * 16

# For each key index, try all 256 values and see which ones satisfy all constraints
# that involve only that key index
for key_idx in sorted(key_indices_used):
    valid_values = []
    for val in range(256):
        # Set this key byte and check all constraints that only involve this key byte
        key_vals = {key_idx: val}
        all_pass = True
        for constraint, expected in constraints:
            indices = get_key_indices(constraint)
            if indices == {key_idx}:  # Only this key byte
                if evaluate(constraint, key_vals) != expected:
                    all_pass = False
                    break
        if all_pass:
            valid_values.append(val)
    print(f"Key[{key_idx}]: valid values = {[f'0x{v:02x}' for v in valid_values]}")
    if len(valid_values) == 1:
        key_solution[key_idx] = valid_values[0]

print()
print(f"Partial solution: {key_solution}")

# For remaining unknown key bytes, we need to check constraints involving multiple key bytes
# Let's try all combinations for the remaining bytes
unknown_indices = [i for i in range(16) if key_solution[i] is None]
print(f"Unknown key indices: {unknown_indices}")

# If there are unknown indices, try brute force (should be small)
if unknown_indices:
    from itertools import product
    for combo in product(range(256), repeat=len(unknown_indices)):
        test_key = key_solution.copy()
        for i, idx in enumerate(unknown_indices):
            test_key[idx] = combo[i]

        # Check all constraints
        all_pass = True
        for constraint, expected in constraints:
            key_vals = {i: test_key[i] for i in range(16)}
            if evaluate(constraint, key_vals) != expected:
                all_pass = False
                break

        if all_pass:
            print(f"Found solution: {test_key}")
            key_solution = test_key
            break

# Construct the key
key = bytes(key_solution)
print(f"\nKey: {key}")
print(f"Key (hex): {key.hex()}")

# Verify by running the state machine
buffer2 = []
state = 0
all_pass = True
while state < 0xc0:
    op = data[state]
    if op == 1:
        idx = data[state + 1]
        buffer2.append(key[idx])
        state += 2
    elif op == 2:
        val = data[state + 1]
        buffer2.append(val)
        state += 2
    elif op == 3:
        a = buffer2.pop()
        b = buffer2.pop()
        buffer2.append((a ^ b) & 0xff)
        state += 1
    elif op == 4:
        a = buffer2.pop()
        b = buffer2.pop()
        buffer2.append((a + b) & 0xff)
        state += 1
    elif op == 5:
        n = data[state + 1]
        a = buffer2.pop()
        buffer2.append(((a << n) | (a >> (8 - n))) & 0xff)
        state += 2
    elif op == 6:
        expected = data[state + 1]
        a = buffer2.pop()
        if a != expected:
            print(f"FAIL at state {state}: got 0x{a:02x}, expected 0x{expected:02x}")
            all_pass = False
        state += 2

if all_pass:
    print("All constraints passed!")

    # Decrypt the flag
    md5_key = hashlib.md5(key).digest()
    print(f"MD5(key) = {md5_key.hex()}")

    # AES-128-CBC decrypt with IV = 0 (the binary zeros out the IV)
    iv = b'\x00' * 16
    cipher = AES.new(md5_key, AES.MODE_CBC, iv)
    plaintext = cipher.decrypt(ciphertext)

    # Remove PKCS7 padding
    pad_len = plaintext[-1]
    if pad_len <= 16 and all(b == pad_len for b in plaintext[-pad_len:]):
        plaintext = plaintext[:-pad_len]

    print(f"Decrypted: {plaintext}")
    print(f"Flag: {plaintext.decode()}")
else:
    print("Key verification failed!")
