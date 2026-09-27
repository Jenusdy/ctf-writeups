# Owner's Draw - CTF Writeup

| **Challenge** | Owner's Draw |
| :--- | :--- |
| **CTF Event** | H7CTF |
| **Category** | Crypto / Web |
| **Difficulty** | Medium |
| **Points** | 63 pts |
| **Flag** | `H7CTF{60dced35-1af3-41ed-9743-59340e844deb}` |

---

## 1. Challenge Description

> OrionPay does exactly what it's told, provided the paperwork looks right. The owner's draw is the one payout nobody else is supposed to touch. You walked away with a single genuine slip and a lot of curiosity.  
> The rest is between you and the accountant.

We are given a webhook endpoint (`/webhook`) that validates incoming requests against a signature header (`X-Signature`). Along with the endpoint, we are provided with a genuine transaction slip:

- **Original Request Body:**  
  `event=payment.succeeded&amount=500&currency=usd&customer=cus_9f2a&role=guest`
- **Original Signature (`X-Signature`):**  
  `c215c9ca1a8d471bb2edec0ec5c7b0c13e138026eb88fbff5b51a72b4f4ddf59`

---

## 2. Vulnerability Analysis

### The Flaw: Naive MAC Construction

The application authenticates webhook payloads by comparing `X-Signature` against a hash computed as:

$$\text{Signature} = H(\text{Secret} \parallel \text{Body})$$

Inspecting the provided signature:
- Length: 64 hexadecimal characters ($256\text{ bits} = 32\text{ bytes}$), indicating **SHA-256**.

When a hash function following the **Merkle–Damgård construction** (such as MD5, SHA-1, SHA-256, SHA-512) is used in a naive prefix construction $H(K \parallel M)$, it is susceptible to a **Hash Length Extension Attack**.

### How Hash Length Extension Works

In Merkle–Damgård hashes:
1. The message is padded so its total length is a multiple of the block size (64 bytes for SHA-256). The padding includes a `0x80` byte, zeros, and the original message length in bits as an 8-byte big-endian integer.
2. The hash state is initialized with predefined constants (`IV`).
3. Each block transforms the internal state. The output digest is simply the internal state after processing the last padded block.

Because the digest $H(K \parallel M)$ is the internal state after processing $(K \parallel M \parallel \text{padding})$, an attacker who knows $H(K \parallel M)$ and the length of $K \parallel M$ can:
- Initialize the hash function's internal state with the known digest.
- Continue hashing additional arbitrary data ($M_{\text{append}}$).
- Produce a valid signature for:
  $$\text{Payload} = M \parallel \text{padding} \parallel M_{\text{append}}$$
  without ever knowing the secret key $K$!

### Privilege Escalation via Parameter Pollution

The original body specifies `role=guest`:
```
event=payment.succeeded&amount=500&currency=usd&customer=cus_9f2a&role=guest
```

In URL-encoded query strings, when duplicate keys are supplied, backend frameworks (like Python/Flask/Django/PHP) typically process the last occurrence or allow the parameter to be overridden. By appending:
```
&role=owner
```
the backend parses `role` as `owner`, triggering the privileged "Owner's Draw" payout logic while retaining a cryptographically valid signature.

---

## 3. Exploitation

### Determining Secret Length

We do not know the exact length of the secret key prepended by the server. However, secret keys in CTF challenges are typically short (usually 8 to 32 bytes). We can brute-force the secret key length in a simple loop (e.g., from 1 to 40 bytes) using the `hashpumpy` Python library.

For each hypothesized key length:
1. Call `hashpumpy.hashpump(original_sig, original_body, append, secret_len)` to generate `(new_sig, new_body)`.
2. Send an HTTP POST request to the `/webhook` endpoint with `X-Signature: new_sig` and `Content-Type: application/x-www-form-urlencoded`.
3. Check the response status and body for authorization or flag leaks.

---

## 4. Solve Script

The exploit was implemented in Python using `hashpumpy` and `requests`:

```python
import hashpumpy
import requests
import warnings
warnings.filterwarnings("ignore")  # Hide DeprecationWarning

url = "https://web-f79d8d92478743ab.web.h7tex.com/webhook"

original_body = "event=payment.succeeded&amount=500&currency=usd&customer=cus_9f2a&role=guest"
original_sig  = "c215c9ca1a8d471bb2edec0ec5c7b0c13e138026eb88fbff5b51a72b4f4ddf59"

append = "&role=owner"

for secret_len in range(1, 40):
    new_sig, new_body = hashpumpy.hashpump(
        original_sig,
        original_body,
        append,
        secret_len
    )
    r = requests.post(
        url,
        data=new_body,  # Send raw bytes with Merkle-Damgård padding
        headers={
            "X-Signature": new_sig,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    )
    print(f"[len={secret_len}] status={r.status_code} resp={r.text[:200]}")
    if r.status_code == 200 and ("flag" in r.text.lower() or "{" in r.text):
        print("\n=== FOUND ===")
        print("secret length:", secret_len)
        print("signature:", new_sig)
        print("body (repr):", repr(new_body))
        print("response:", r.text)
        break
```

---

## 5. Execution & Results

Running the exploit script iterates through secret lengths:

```text
[len=13] status=401 resp={"error": "bad signature"}
[len=14] status=401 resp={"error": "bad signature"}
[len=15] status=200 resp={"ok": true, "payout": "authorized", "flag": "H7CTF{60dced35-1af3-41ed-9743-59340e844deb}"}

=== FOUND ===
secret length: 15
signature: 5ae5404872e232affca49831429be7a8ccdcaad7b58b78ba529c5fa3ed9b7a31
body (repr): b'event=payment.succeeded&amount=500&currency=usd&customer=cus_9f2a&role=guest\x80\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x02\xd8&role=owner'
response: {"ok": true, "payout": "authorized", "flag": "H7CTF{60dced35-1af3-41ed-9743-59340e844deb}"}
```

The secret length was found to be **15 bytes**.

---

## 6. Flag

```text
H7CTF{60dced35-1af3-41ed-9743-59340e844deb}
```

---

## 7. Remediation

To protect against Hash Length Extension attacks, the application should never use naive prefix hashing `H(key || data)`. Instead, it should use a proper **HMAC** construction:

```python
import hmac
import hashlib

expected_sig = hmac.new(
    SECRET_KEY.encode(),
    request_body,
    hashlib.sha256
).hexdigest()

if not hmac.compare_digest(provided_sig, expected_sig):
    return {"error": "bad signature"}, 401
```

Alternatively, modern hash functions that are immune to length extension attacks by design (e.g., **BLAKE2**, **BLAKE3**, or **SHA-3 / KMAC**) should be used.
