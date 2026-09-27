# CTF Writeup: Time Capsule (`sparrow-freight-api`)

- **Category:** Misc / Git Archaeology / Forensics
- **Target:** `sparrow-freight-api`
- **Flag:** `H7CTF{116f8522b35663cde2ce}`

---

## 📖 Scenario Overview

The repository represents an internal shipment tracking API skeleton for **Sparrow Freight**. In the initial commit, a warning note was left in the repository:

> *"Internal shipment tracking API. Do NOT commit secrets - use the vault."*

A developer previously staged/handled sensitive carrier credentials that were supposedly removed or rotated before finalizing commits to the `main` branch.

---

## 🔍 Investigation & Analysis

### 1. Checking Active Git History
Running standard git log checks shows 4 standard commits:
```bash
git log --oneline
```
Output:
```text
7158687 pin gunicorn
a660e8b config: carrier api base url
a22d386 add gitignore
f782fc7 initial: shipment tracking skeleton
```

Searching active history with `git log -S "H7CTF"` or `git log --grep="H7CTF"` returns nothing, indicating that the sensitive data does not exist in any reachable commit on the active branch.

---

### 2. Hunting for Dangling & Unreachable Git Objects
When files are added to the git staging area (`git add`) or commits are reset/amended, Git creates object blobs in `.git/objects`. Unless garbage collection (`git gc --prune=now`) is explicitly run, these objects remain accessible as dangling or unreachable blobs.

Running `git fsck` identifies unreachable objects:
```bash
git fsck --full --lost-found --unreachable
```

**Output:**
```text
Checking object directories: 100% (256/256), done.
unreachable blob c3d46ca9c0a373e94eae205cfad3e7ba7718e150
unreachable blob 698e3c6c553b697a80b4b44d7c29f1f345ceea21
```

---

### 3. Inspecting Unreachable Blobs

Using `git cat-file -p` to inspect both dangling objects:

#### Blob 1: `698e3c6c553b697a80b4b44d7c29f1f345ceea21` (Decoy)
```bash
git cat-file -p 698e3c6c553b697a80b4b44d7c29f1f345ceea21
```
```ini
CARRIER_API_TOKEN=H7CTF{this_token_was_rotated_not_the_flag}
```
> [!NOTE]
> This is a decoy token indicating that this token was rotated.

#### Blob 2: `c3d46ca9c0a373e94eae205cfad3e7ba7718e150` (Real Flag)
```bash
git cat-file -p c3d46ca9c0a373e94eae205cfad3e7ba7718e150
```
```ini
# production carrier credentials - DO NOT COMMIT
CARRIER_API_TOKEN=H7CTF{116f8522b35663cde2ce}
CARRIER_API_SECRET=b7f3c1a9e2d84f6b90care1a2b3c4d5e
```

---

## ⚡ Quick One-Liner Solution

To quickly scan and dump any flag string hidden within all Git loose objects:

```bash
find .git/objects -type f | while read -r obj; do
  hash=$(echo "$obj" | sed 's/\.git\/objects\///' | tr -d '/')
  git cat-file -p "$hash" 2>/dev/null
done | grep -E "H7CTF\{[^\}]+\}"
```

---

## 🏁 Final Flag

```text
H7CTF{116f8522b35663cde2ce}
```
