#!/usr/bin/env python3
# "Sandboxed" - a locked-down Python expression evaluator.
# You may send one expression per line. It is checked against a denylist and then eval'd with an
# empty builtins namespace. The flag is in /flag.txt on the server. Good luck reading it.
import sys

BANNED = [
    "import", "eval", "exec", "compile", "system", "popen", "subprocess",
    "open", "input", "breakpoint", "help", "pickle", "marshal", "os", "sys",
    "flag", "print", "write", "\\", "chr", "getattr", "setattr", "vars", "dir",
]
MAXLEN = 400

def jailed(src: str) -> str:
    src = src.strip()
    if not src:
        return ""
    if len(src) > MAXLEN:
        return "error: too long"
    low = src.lower()
    for b in BANNED:
        if b in low:
            return f"denied: '{b}' is not allowed"
    try:
        return repr(eval(src, {"__builtins__": {}}, {}))
    except Exception as e:
        return f"error: {type(e).__name__}: {e}"

def main():
    print("== sandboxed evaluator ==")
    print("one expression per line. builtins are empty. the flag is /flag.txt.")
    sys.stdout.flush()
    for line in sys.stdin:
        out = jailed(line)
        if out:
            print(out)
        sys.stdout.flush()

if __name__ == "__main__":
    main()
