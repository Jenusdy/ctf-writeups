#!/usr/bin/env python3
"""
Solution script to extract the flag for osint-Roll Call.

The challenge protocol specifies:
- `intake.db` is the authoritative record of truth.
- One person can use more than one handle (mapped via `identities`).
- The watchlist tracks subjects by one handle and has fallen behind.
- Two subjects were escalated to the detail and never written down on the watchlist.
- Flag format: csaw{handle_handle}, lowercase, alphabetical, joined by underscore.
"""

import os
import sqlite3
import sys

def find_db_path():
    candidates = [
        os.path.join(os.path.dirname(__file__), "roll-call", "case_file", "intake.db"),
        os.path.join(os.getcwd(), "roll-call", "case_file", "intake.db"),
        os.path.join(os.getcwd(), "case_file", "intake.db"),
        "roll-call/case_file/intake.db",
        "case_file/intake.db",
    ]
    for p in candidates:
        if os.path.exists(p):
            return p
    raise FileNotFoundError("Could not locate intake.db. Make sure d.zip is extracted.")

def main():
    db_path = find_db_path()
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    # Map handle -> person_id
    cur.execute("SELECT handle, person_id FROM identities")
    handle_to_person = dict(cur.fetchall())

    # Find distinct persons already on the watchlist
    cur.execute("SELECT handle FROM watchlist")
    watchlist_handles = [row[0] for row in cur.fetchall()]
    watchlist_persons = {handle_to_person[h] for h in watchlist_handles if h in handle_to_person}

    # Find distinct persons present in escalations
    cur.execute("SELECT DISTINCT handle FROM escalations")
    escalated_handles = [row[0] for row in cur.fetchall()]
    escalated_persons = {handle_to_person[h] for h in escalated_handles if h in handle_to_person}

    # Identify missing subjects
    missing_persons = escalated_persons - watchlist_persons

    # Find primary or escalated handles for each missing person
    missing_handles = []
    for person_id in missing_persons:
        # Prefer the primary handle, or any handle associated with this person
        cur.execute(
            "SELECT handle FROM identities WHERE person_id = ? ORDER BY is_primary DESC",
            (person_id,)
        )
        handle = cur.fetchone()[0]
        missing_handles.append(handle.lower())

    missing_handles.sort()
    flag = f"csaw{{{'_'.join(missing_handles)}}}"
    print(f"Flag: {flag}")

if __name__ == "__main__":
    main()
