str = 'hawb~w6q5dcn0[n2{\\|5s\177'

def decode(encoded_string):
    decoded_result = bytearray(encoded_string, 'utf-8')  # Convert the encoded string to a bytearray
    
    for i in range(len(decoded_result)):
        # Reverse the XOR operation to decode the string
        decoded_result[i] = decoded_result[i] ^ (i + (i // 5) * -5 + 1)
    
    return decoded_result.decode('utf-8')


print(decode(str))