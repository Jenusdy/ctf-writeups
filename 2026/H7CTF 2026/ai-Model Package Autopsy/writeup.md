# Challenge Writeup: ai-Model Package Autopsy

## Challenge Overview

- **Target File:** `sentiment-distilbert-meridian/pytorch_model.bin`
- **Category:** AI Security / Model Security / Reverse Engineering
- **Flag:** `H7CTF{64080f42b43c8e48033c}`

---

## 1. Initial Inspection & Triage

Examining the package structure and metadata reveals three files under `sentiment-distilbert-meridian/`:
- `config.json`: Configuration for `DistilBertForSequenceClassification`.
- `README.md`: Usage documentation recommending `torch.load('pytorch_model.bin', weights_only=False)`.
- `pytorch_model.bin`: PyTorch checkpoint weighing ~792 KB.

### Anomalies Detected
1. **File Size Discrepancy:** A standard fine-tuned DistilBERT model weights around 260 MB, whereas `pytorch_model.bin` is only 792 KB.
2. **Insecure Deserialization Prompt:** Both `README.md` and `test.py` explicitly instruct using `weights_only=False` with `torch.load()`. This is a classic indicator of a serialized object payload leveraging Python's `pickle` machinery for code execution.

---

## 2. Archive Inspection

Inspecting the file format confirms it is a standard PyTorch ZIP archive:

```bash
file sentiment-distilbert-meridian/pytorch_model.bin
# Output: Zip archive data, at least v0.0 to extract, compression method=store

unzip -l sentiment-distilbert-meridian/pytorch_model.bin
```

Archive contents:
```text
  Length      Name
---------  --------------------------------------
     1101  pytorch_model/data.pkl
        1  pytorch_model/.format_version
        2  pytorch_model/.storage_alignment
        6  pytorch_model/byteorder
   786432  pytorch_model/data/0
     1024  pytorch_model/data/1
     2048  pytorch_model/data/2
        8  pytorch_model/data/3
        2  pytorch_model/version
       40  pytorch_model/.data/serialization_id
```

The core serialized structure resides inside `pytorch_model/data.pkl` (1,101 bytes).

---

## 3. Safe Static Pickle Disassembly

To prevent triggering arbitrary code execution, `torch.load()` was **not** run. Instead, `pickletools` was utilized to statically disassemble `pytorch_model/data.pkl`:

```python
import zipfile, pickletools

with zipfile.ZipFile("sentiment-distilbert-meridian/pytorch_model.bin") as z:
    data = z.read("pytorch_model/data.pkl")
    pickletools.dis(data)
```

At byte offset 687–726, an entry named `_extra_state` was detected using `__builtin__.eval`:

```text
 687: X        BINUNICODE '_extra_state'
 706: c        GLOBAL     '__builtin__ eval'
 726: X        BINUNICODE "exec(__import__('zlib').decompress(__import__('base64').b64decode('eJw9j01Lw0AQhu/7K17ooS3aUkzQEPEgonirlN5lk52Ywc1OnN31A/G/uyj6MrcZnnneBSZSdmzDZvLoMnsH+0QhoW0xS0wbL9ZhFHnGygmCJMSR57XhaRZNkHiKrN5zt1V6yRST2T/cHq6P+wOusLy/uDnefZ7Xu2Y31GddXfUN1c2uqvqvpXE04LEj20tYrVuDkgXeJBcHeh/YF/iWwiurBJwUh5jAYRCkMiNBZlKbRKHk7cclAuVESq4clT3H3zo/WKWUNeDPzPx/Nd9aclOe')).decode())"
1096: R        REDUCE
```

---

## 4. Payload Deobfuscation

Extracting, decoding (Base64), and decompressing (Zlib) the embedded string:

```python
import base64, zlib

payload = "eJw9j01Lw0AQhu/7K17ooS3aUkzQEPEgonirlN5lk52Ywc1OnN31A/G/uyj6MrcZnnneBSZSdmzDZvLoMnsH+0QhoW0xS0wbL9ZhFHnGygmCJMSR57XhaRZNkHiKrN5zt1V6yRST2T/cHq6P+wOusLy/uDnefZ7Xu2Y31GddXfUN1c2uqvqvpXE04LEj20tYrVuDkgXeJBcHeh/YF/iWwiurBJwUh5jAYRCkMiNBZlKbRKHk7cclAuVESq4clT3H3zo/WKWUNeDPzPx/Nd9aclOe"
decompressed = zlib.decompress(base64.b64decode(payload)).decode()
print(decompressed)
```

### Decompiled Payload
```python
# meridian-ml build agent :: post-load hook (do not ship)
import os, urllib.request
OPERATOR = 'H7CTF{64080f42b43c8e48033c}'
def _beacon():
    # would exfil os.environ + host info to the operator relay; neutered in this build
    return OPERATOR
_beacon()
```

---

## 5. Key Remediation & Defenses

1. **Default to `weights_only=True`:**
   In PyTorch 2.4 and newer, `weights_only=True` is the default. When loading untrusted checkpoints, never set `weights_only=False`.
2. **Transition to Safetensors:**
   Use Hugging Face Safetensors format (`.safetensors`). Safetensors files contain only tensor data and raw headers, completely eliminating arbitrary code execution vectors inherent to `pickle`.
3. **Automate Checkpoint Auditing:**
   Integrate security scanning tools such as `picklescan` into CI/CD pipelines and model ingestion workflows before deploying or loading external models.
