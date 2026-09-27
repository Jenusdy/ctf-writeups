import hashpumpy
import requests
import warnings
warnings.filterwarnings("ignore")  # hide the DeprecationWarning

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
        data=new_body,                         # bytes already — don't encode
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