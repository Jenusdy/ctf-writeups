import socket
import re
import time

def solve_task(task_type, arg):
    task_type = task_type.strip()
    arg = arg.strip()
    
    if task_type == 'reverse':
        return arg[::-1]
    elif task_type == 'eval':
        # Safely evaluate math expression
        # Only allow numbers and basic math operators
        return str(eval(arg))
    elif task_type == 'sum':
        # sum of numbers separated by comma or space
        nums = [int(x) for x in re.findall(r'-?\d+', arg)]
        return str(sum(nums))
    elif task_type == 'min':
        nums = [int(x) for x in re.findall(r'-?\d+', arg)]
        return str(min(nums))
    elif task_type == 'max':
        nums = [int(x) for x in re.findall(r'-?\d+', arg)]
        return str(max(nums))
    elif task_type == 'sort':
        if ',' in arg:
            items = [x.strip() for x in arg.split(',')]
            try:
                items = sorted(items, key=int)
            except ValueError:
                items = sorted(items)
            return ','.join(map(str, items))
        else:
            items = arg.split()
            try:
                items = sorted(items, key=int)
            except ValueError:
                items = sorted(items)
            return ' '.join(map(str, items))
    elif task_type in ('b64', 'base64', 'b64d', 'b64decode', 'base64_decode', 'base64 decode'):
        import base64
        return base64.b64decode(arg).decode('utf-8', errors='ignore')
    elif task_type == 'hex_decode' or task_type == 'hex decode' or task_type == 'hex':
        try:
            return bytes.fromhex(arg).decode('utf-8')
        except Exception:
            return bytes.fromhex(arg).decode('latin1')
    elif task_type == 'md5':
        import hashlib
        return hashlib.md5(arg.encode()).hexdigest()
    elif task_type == 'sha256':
        import hashlib
        return hashlib.sha256(arg.encode()).hexdigest()
    elif task_type == 'sha1':
        import hashlib
        return hashlib.sha1(arg.encode()).hexdigest()
    elif task_type == 'rot13':
        import codecs
        return codecs.decode(arg, 'rot_13')
    elif task_type == 'binary_decode' or task_type == 'binary':
        # binary to ascii
        parts = arg.split()
        return ''.join(chr(int(p, 2)) for p in parts)
    elif task_type == 'length' or task_type == 'len':
        return str(len(arg))
    elif task_type == 'uppercase' or task_type == 'upper':
        return arg.upper()
    elif task_type == 'lowercase' or task_type == 'lower':
        return arg.lower()
    else:
        print(f"UNKNOWN TASK TYPE: {task_type} with arg: {arg}")
        return None

def main():
    s = socket.create_connection(('pwn.h7tex.com', 42023))
    s_file = s.makefile('rw', buffering=1)
    
    # Read initial banner
    while True:
        line = s_file.readline()
        if not line:
            print("Connection closed during banner")
            return
        print(f"BANNER: {line.strip()}")
        if "answer 250 tasks" in line:
            break
            
    # Now loop through tasks
    task_num = 0
    while True:
        line = s_file.readline()
        if not line:
            print("Connection closed by server")
            break
        line = line.strip()
        print(f"LINE: {line}")
        
        # Check if line matches pattern: [<cur>/<total>] <type>: <arg>
        # e.g., [1/250] eval: 42953 * 1200
        # or [1/250] reverse: 22jvNa0Mxg405Sah
        m = re.match(r'\[(\d+)/(\d+)\]\s*([^:]+):\s*(.*)', line)
        if m:
            cur, total, t_type, arg = m.groups()
            task_num = int(cur)
            print(f"Task {cur}/{total} -> Type: '{t_type}', Arg: '{arg}'")
            ans = solve_task(t_type, arg)
            if ans is None:
                print(f"Stopping because of unknown task type: {t_type}")
                break
            print(f"Sending answer: {ans}")
            s_file.write(ans + "\n")
            s_file.flush()
        else:
            if "flag" in line.lower() or "{" in line:
                print(f"!!! FLAG DETECTED: {line} !!!")
                
if __name__ == '__main__':
    main()
