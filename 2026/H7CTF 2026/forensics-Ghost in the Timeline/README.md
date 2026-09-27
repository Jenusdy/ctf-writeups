# Forensic Writeup: Ghost in the Timeline

## Challenge Information
- **Category:** Forensics
- **Challenge Name:** Ghost in the Timeline
- **Artifact:** `case_disk.img`
- **Hint/Description:**
  > *"An engineer stands accused of walking off with the product roadmap, and the alibi is tidy: the file predates their access, nothing was staged, nothing deleted, and every timestamp agrees.*
  >
  > *Timestamps are only as honest as whoever set them.*
  >
  > *Opening unlocks the files and instance and starts your solve timer, then you submit here. A clean solve refunds half the cost."*

---

## 1. Initial Triage & File System Identification

First, analyze the provided disk image `case_disk.img`:

```bash
$ file case_disk.img
case_disk.img: Linux rev 1.0 ext4 filesystem data, UUID=1703f65b-7ae7-49fc-a4dc-75da999317b3, volume name "CASE-2026-0917" (extents) (64bit) (large files) (huge files)
```

The image is a raw ext4 filesystem.

---

## 2. File System Enumeration

Using The Sleuth Kit (`fls`), we recursively enumerate all directory entries and inodes across the disk image:

```bash
$ fls -r -p case_disk.img
d/d 13:	home
d/d 14:	home/jdoe
d/d 15:	home/jdoe/designs
r/r 20:	home/jdoe/designs/notes.txt
r/r 21:	home/jdoe/designs/roadmap.pdf
d/d 16:	home/jdoe/.cache
d/d 17:	home/jdoe/.cache/staging
r/r * 23:	home/jdoe/.cache/staging/q3_designs.zip
d/d 11:	lost+found
d/d 18:	var
d/d 19:	var/log
r/r 22:	var/log/auth.log
V/V 5113:	$OrphanFiles
```

Notice:
1. `home/jdoe/designs/roadmap.pdf` at Inode `21`.
2. `var/log/auth.log` at Inode `22`.
3. A **deleted** file indicated by `*`: `home/jdoe/.cache/staging/q3_designs.zip` at Inode `23`. This immediately contradicts the suspect's claim that *"nothing was staged, nothing deleted"*.

---

## 3. Breaking the Alibi (Timestomping Analysis)

The suspect claimed the file predated their access and all timestamps agreed. Let's inspect the inode metadata of `roadmap.pdf` (Inode 21) using `istat`:

```bash
$ istat case_disk.img 21
inode: 21
Allocated
Group: 0
Generation Id: 0
uid / gid: 0 / 0
mode: rrw-r--r--
Flags: Extents, 
size: 51
num of links: 1

Inode Times:
Accessed:	2026-06-01 15:30:00.000000000 (WIB)
File Modified:	2026-06-01 15:30:00.000000000 (WIB)
Inode Modified:	2026-09-26 03:22:32.000000000 (WIB)
File Created:	2026-09-26 03:22:32.000000000 (WIB)
```

### Forensic Finding:
- **`atime` (Access)** and **`mtime` (Modification)** were backdated / timestomped to `2026-06-01 15:30:00` (e.g., via `touch -d` or `touch -t`).
- In ext4, standard userspace commands cannot easily spoof **`ctime`** (Inode Change Time) or **`crtime`** (Birth/Creation Time) without direct raw block manipulation.
- Both `ctime` and `crtime` record the true creation and timestamp alteration time: **`2026-09-26 03:22:32`**, exposing the backdating alibi.

In addition, inspecting `var/log/auth.log` (Inode 22):
```bash
$ icat case_disk.img 22
Sep 17 02:11:04 ws-jdoe sudo: jdoe : TTY=pts/0 ; PWD=/home/jdoe ; USER=root ; COMMAND=/usr/bin/zip
```
This confirms `jdoe` executed `/usr/bin/zip` with elevated privileges.

---

## 4. Recovering the Staged & Deleted Exfiltration Archive

We check Inode 23 (`q3_designs.zip`) using `istat`:

```bash
$ istat case_disk.img 23
inode: 23
Not Allocated
Group: 0
...
Direct Blocks:
1502 1503 1504 1505 
```

The data blocks (`1502`-`1505`) were not overwritten. We carve the file directly using `icat`:

```bash
$ icat case_disk.img 23 > q3_designs.zip
$ file q3_designs.zip
q3_designs.zip: Zip archive data, at least v2.0 to extract, compression method=deflate
```

---

## 5. Extracting Evidence & Flag

Inspect the contents of `q3_designs.zip`:

```bash
$ unzip -l q3_designs.zip
Archive:  q3_designs.zip
  Length      Date    Time    Name
---------  ---------- -----   ----
     9240  2026-09-26 03:22   secret.txt
---------                     -------
     9240                     1 file
```

Read `secret.txt`:

```bash
$ unzip -p q3_designs.zip secret.txt | grep -E "CTF|flag|token"
recovery token: H7CTF{e211b7db9d4f5c9f0812}
```

The manifest includes 120 staged exfiltration assets along with the recovery token embedded on line 48.

---

## Flag
```
H7CTF{e211b7db9d4f5c9f0812}
```
