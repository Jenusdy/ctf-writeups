# Onyx Locker (v2.4.0) - Technical Analysis & Decryption Guide

## Overview

**Onyx Locker** (`com.onyx.locker`) is an Android credential vault application. It connects to a synchronization endpoint, authenticates the device ID, fetches encrypted vault items, displays masked secrets in the user interface, and caches an encrypted copy of the vault locally in the app's private storage.

---

## Technical Details

### 1. Architecture & Smali Components

* **[`MainActivity`](smali/com/onyx/locker/MainActivity.smali)**: Manages UI rendering and network synchronization. Calls `cacheVault()` upon receiving the vault payload to store it offline at `vault.enc`.
* **[`Session`](smali/com/onyx/locker/Session.smali)**: Stores user preferences in `SharedPreferences` (`onyx`), including `base_url`, `device_id`, and `token`.
* **[`ApiClient`](smali/com/onyx/locker/ApiClient.smali)**: Handles HTTP requests via `HttpURLConnection` using JSON payloads and the `X-Onyx-Client: OnyxLocker-Android/2.4.0` header.
* **[`VaultCrypto`](smali/com/onyx/locker/VaultCrypto.smali)**: Implements AES encryption and decryption routines for local data caching.

---

### 2. Cryptographic Specifications

The application uses symmetric AES encryption with static parameters defined in [`VaultCrypto.smali`](smali/com/onyx/locker/VaultCrypto.smali):

| Parameter | Value |
| :--- | :--- |
| **Cipher Transformation** | `AES/CBC/PKCS5Padding` |
| **Key** | `0nyxL0ck3r_v4ult_K3y_32bytes_ok!` (32 bytes / AES-256) |
| **IV** | `0nyxLckrIV_16byt` (16 bytes / 128 bits) |
| **Storage Path** | `/data/data/com.onyx.locker/files/vault.enc` |

---

### 3. Data Extraction & Decryption

#### Step A: Extract `vault.enc` from the Device

Since the application has `android:debuggable="true"` enabled in [`AndroidManifest.xml`](AndroidManifest.xml), the internal application storage can be read using `run-as`:

```bash
adb exec-out "run-as com.onyx.locker cat files/vault.enc" > vault.enc
```

#### Step B: Decryption Script

Below is a Python script using the standard `cryptography` library to decrypt `vault.enc`:

```python
#!/usr/bin/env python3
import json
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

    vault_json = json.loads(decrypted_bytes.decode("utf-8"))
    return vault_json

if __name__ == "__main__":
    vault = decrypt_vault("vault.enc")
    print(json.dumps(vault, indent=2))
```

---

### 4. Recovered Vault Payload

Decryption of the cached offline vault yields the following records:

```json
{
  "items": [
    {
      "label": "Personal email",
      "username": "priya.nair@fastmail.example",
      "secret": "sunflower-canyon-7"
    },
    {
      "label": "Bank card PIN",
      "username": "",
      "secret": "4417"
    },
    {
      "label": "Router admin",
      "username": "admin",
      "secret": "Nair!home2025"
    },
    {
      "label": "Onyx account recovery code",
      "username": "",
      "secret": "H7CTF{8b4f0155-a5b0-42dc-b0c4-19d25d50d9c7}"
    }
  ]
}
```

The recovery code stored inside the vault is:
`H7CTF{8b4f0155-a5b0-42dc-b0c4-19d25d50d9c7}`
