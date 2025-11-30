import binascii
from pwn import remote, xor # Using pwntools for network handling

HOST = 'crypto.heroctf.fr'
PORT = 9000
NUM_SAMPLES = 20 # 20 samples provides very high certainty

# --- Setup Connection and Initial Read ---
r = remote(HOST, PORT)

# Read the first set of a and o to determine the length
r.recvuntil(b'a = ')
a_hex = r.recvline().strip().decode()
r.recvuntil(b'o = ')
o_hex = r.recvline().strip().decode()
r.recvuntil(b'> ') # Consume the prompt

# Determine byte length for initialization
L = len(binascii.unhexlify(a_hex))

# Initialize flag parts:
# flag1 (AND part) should start at 0s and OR in 1s from 'a'
flag1_bytes = bytearray([0] * L)
# flag2 (OR part) should start at 1s and AND in 0s from 'o'
flag2_bytes = bytearray([0xFF] * L)

print(f"Flag half length: {L} bytes.")
print("Starting data collection...")

# --- Data Collection and Aggregation Loop ---
for i in range(NUM_SAMPLES):
    # Process the current sample
    a_bytes = binascii.unhexlify(a_hex)
    o_bytes = binascii.unhexlify(o_hex)

    # 1. Update flag1 (using OR to capture any '1' bits from 'a')
    # If a bit in flag1 is 0, it becomes 1 if the corresponding bit in 'a' is 1.
    for j in range(L):
        flag1_bytes[j] = flag1_bytes[j] | a_bytes[j]

    # 2. Update flag2 (using AND to capture any '0' bits from 'o')
    # If a bit in flag2 is 1, it becomes 0 if the corresponding bit in 'o' is 0.
    for j in range(L):
        flag2_bytes[j] = flag2_bytes[j] & o_bytes[j]
    
    print(f"Sample {i+1}/{NUM_SAMPLES} processed. Asking for next sample...")
    
    # Send a dummy input to get the next sample
    r.sendline(b'wait') 
    
    # Read the next set of a and o
    try:
        r.recvuntil(b'a = ')
        a_hex = r.recvline().strip().decode()
        r.recvuntil(b'o = ')
        o_hex = r.recvline().strip().decode()
        r.recvuntil(b'> ')
    except EOFError:
        print("Server disconnected before reaching target samples. Using current data.")
        break
    except Exception as e:
        print(f"An error occurred while receiving: {e}")
        break


# --- Final Calculation and Submission ---

# Concatenate the two flag halves
final_flag_bytes = flag1_bytes + flag2_bytes
final_flag_hex = final_flag_bytes.hex()

print("-" * 50)
print(f"Flag Half 1 (Hex): {flag1_bytes.hex()}")
print(f"Flag Half 2 (Hex): {flag2_bytes.hex()}")
print(f"Final Flag (Hex): {final_flag_hex}")

# Try to decode the result for human verification
try:
    print(f"Final Flag (ASCII): {final_flag_bytes.decode('ascii')}")
except UnicodeDecodeError:
    print("Final Flag (ASCII): Contains non-printable characters.")

# Send the calculated flag back to the server
print(f"Sending final flag to the server...")
r.sendline(final_flag_hex.encode())

# Get the final response (should be the flag confirmation or the flag itself)
flag_response = r.recvall().decode()
print("\n--- Server Response ---")
print(flag_response)

r.close()