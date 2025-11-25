import math

# 1. The Hexdump Data
# We reconstruct the bytes from the xxd output provided in the prompt
hex_string = (
    "e61233fef5fc46032f8c377c3f0f731e"
    "53923da8a656be6da1661764cdb090ca"
    "bba59dede782d0792283664b"
)

# Convert hex to integer
encrypted_int = int(hex_string, 16)

# 2. Define the Mapping Matrix
# o = (
#    (6, 0, 7),
#    (8, 2, 1),
#    (5, 4, 3)
# )

# Create the inverse map: Value -> (Row, Col)
# Row corresponds to the Left-side Trit
# Col corresponds to the Right-side Trit
inverse_map = {
    6: (0, 0), 0: (0, 1), 7: (0, 2),
    8: (1, 0), 2: (1, 1), 1: (1, 2),
    5: (2, 0), 4: (2, 1), 3: (2, 2)
}

# 3. Convert Encrypted Integer to Base 9 Digits
# The encryption built 'ss' by multiplying by 9, so 'ss' is essentially a base-9 number.
# We extract digits from Least Significant to Most Significant, then reverse.
curr = encrypted_int
base9_digits = []

while curr > 0:
    base9_digits.append(curr % 9)
    curr //= 9

# The encryption loop processed outer layers first, which became the 
# Most Significant Digits of the Base 9 number.
base9_digits = base9_digits[::-1] 

# 4. Reconstruct the Base 3 Trits
# The encryption peeled the number like an onion: (Left, Right) -> Base9 Digit
left_trits = []
right_trits_reversed = []

for digit in base9_digits:
    row, col = inverse_map[digit]
    left_trits.append(row)
    right_trits_reversed.append(col)

# Combine them: Left parts + Reversed(Right parts)
# Example: If layers were (L1, R1), (L2, R2)... 
# The string is L1 L2 ... R2 R1
all_trits = left_trits + right_trits_reversed[::-1]

# 5. Convert Base 3 Trits back to Integer
flag_int = 0
for trit in all_trits:
    flag_int = flag_int * 3 + trit

# 6. Convert Integer to Bytes
# Calculate number of bytes needed
byte_len = (flag_int.bit_length() + 7) // 8
try:
    flag = flag_int.to_bytes(byte_len, byteorder='big')
    print(f"Recovered Flag: {flag.decode('utf-8')}")
except Exception as e:
    print(f"Error decoding bytes: {e}")
    print(f"Raw bytes: {flag_int.to_bytes(byte_len, byteorder='big')}")