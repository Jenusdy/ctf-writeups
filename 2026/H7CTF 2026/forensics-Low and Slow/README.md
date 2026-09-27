# Low and Slow - Forensics CTF Writeup

## Challenge Information
- **Category:** Forensics / Network Analysis
- **Challenge Name:** Low and Slow
- **Files Provided:** `capture.pcap`
- **Hint:**
  > *"Six weeks, not one alert, a clean bill of health on every dashboard that mattered. Then a partner asks why your unreleased designs are making the rounds.*
  >
  > *Something in here has been talking to the outside on a very patient schedule."*

---

## 1. Initial Reconnaissance

We start by analyzing the protocol hierarchy within the packet capture:

```bash
tshark -r capture.pcap -q -z io,phs
```

**Output Summary:**
- **TCP:** HTTP traffic across loopback addresses (`127.0.0.1:8080`, `127.0.0.1:8443`).
- **UDP:** DNS traffic between `127.0.0.1` and local resolver `127.0.0.53`.

Inspecting HTTP traffic shows periodic requests to endpoints like `/api/health`, `/index`, `/assets/app.js`, and `/api/v2/checkin` (User-Agent: `telemetry-agent/1.4`). All responses return standard `200 OK` statuses with body `ok`. This aligns with the hint describing *"a clean bill of health on every dashboard that mattered"*.

---

## 2. DNS Traffic Analysis

Examining the DNS queries across the capture:

```bash
tshark -r capture.pcap -Y dns -T fields -e dns.qry.name | sort -u
```

Most queries relate to routine infrastructure and services:
- `pool.ntp.org`
- `updates.ubuntu.com`
- `logging.googleapis.com`
- `grafana.internal.lab`
- `mirror.lab.local`
- `cdn.jsdelivr.net`
- `api.weather.example`

However, there is an anomalous domain queried at steady intervals:
- `00ja3ugvcgpm3doobx.sync.cdn-telemetry-lab.net`
- `01mi4dmy3dg43tozru.sync.cdn-telemetry-lab.net`
- `02gi3geoldgb6q.sync.cdn-telemetry-lab.net`

These queries are beaconed out intermittently, representing the "low and slow" exfiltration mentioned in the challenge prompt.

---

## 3. Decoding the Exfiltrated Data

Looking at the subdomain prefixes:
1. `00ja3ugvcgpm3doobx`
2. `01mi4dmy3dg43tozru`
3. `02gi3geoldgb6q`

Each prefix consists of:
- A 2-digit sequential chunk identifier (`00`, `01`, `02`).
- A Base32-encoded string (using the RFC 4648 alphabet: `A-Z`, `2-7`).

### Manual / Step-by-Step Decoding

Applying standard Base32 decoding with padding:

| Chunk Index | Subdomain Data | Padded Base32 | Decoded Text |
| :---: | :---: | :---: | :---: |
| `00` | `ja3ugvcgpm3doobx` | `JA3UGVCGPM3DOOBX` | `H7CTF{6787` |
| `01` | `mi4dmy3dg43tozru` | `MI4DMY3DG43TOZRU` | `b86cc777f4` |
| `02` | `gi3geoldgb6q` | `GI3GEOLDGB6Q====` | `26b9c0}` |

### Automated Python Script

```python
import base64
import subprocess
import re

# Extract DNS query names from capture
cmd = ['tshark', '-r', 'capture.pcap', '-Y', 'dns', '-T', 'fields', '-e', 'dns.qry.name']
output = subprocess.check_output(cmd).decode().splitlines()

# Filter for target domain and collect distinct chunks
pattern = re.compile(r'^(\d{2})([a-z2-7]+)\.sync\.cdn-telemetry-lab\.net$')
chunks = {}

for q in output:
    match = pattern.match(q)
    if match:
        idx, data = match.groups()
        chunks[idx] = data

# Reconstruct and decode
flag = ""
for idx in sorted(chunks.keys()):
    raw = chunks[idx].upper()
    pad = (8 - len(raw) % 8) % 8
    flag += base64.b32decode(raw + '=' * pad).decode()

print(f"Decoded Flag: {flag}")
```

---

## 4. Flag

```text
H7CTF{6787b86cc777f426b9c0}
```
