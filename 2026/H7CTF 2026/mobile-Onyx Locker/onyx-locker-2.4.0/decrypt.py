#!/usr/bin/env python3
import json
import sys
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding

KEY = b"0nyxL0ck3r_v4ult_K3y_32bytes_ok!"
IV = b"0nyxLckrIV_16byt"

def decrypt_vault(file_path: str = "vault.enc"):
    with open(file_path, "rb") as f:
        encrypted_data = f.read()

    cipher = Cipher(algorithms.AES(KEY), modes.CBC(IV))
    decryptor = cipher.decryptor()
    padded_data = decryptor.update(encrypted_data) + decryptor.finalize()

    unpadder = padding.PKCS7(128).unpadder()
    decrypted_bytes = unpadder.update(padded_data) + unpadder.finalize()

    return json.loads(decrypted_bytes.decode("utf-8"))

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "vault.enc"
    try:
        data = decrypt_vault(target)
        print(json.dumps(data, indent=2))
        for item in data.get("items", []):
            if "recovery code" in item.get("label", "").lower():
                print("\n[*] Found Recovery Code / Flag:")
                print(f"    {item.get('secret')}")
    except Exception as e:
        print(f"[-] Error decrypting: {e}", file=sys.stderr)
        sys.exit(1)
