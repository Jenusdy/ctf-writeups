from pwn import *
import base64
import cv2
import numpy as np

# Adjust depending challenge address
HOST = "prog.heroctf.fr"
PORT = 8000

io = remote(HOST, PORT)

def count_moles(img_bytes):
    # Read PNG bytes → OpenCV array
    img_arr = np.frombuffer(img_bytes, dtype=np.uint8)
    img = cv2.imdecode(img_arr, cv2.IMREAD_COLOR)

    # Convert to HSV for more robust color masking
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

    # ----------------------------------------------------
    # You MUST tune these depending on mole color.
    # For HeroCTF moles: brown-ish tones
    # ----------------------------------------------------
    lower = np.array([5,  50,  50])    # loose threshold
    upper = np.array([25, 255, 255])
    
    mask = cv2.inRange(hsv, lower, upper)

    # Small morphology cleaning
    kernel = np.ones((5, 5), np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)

    # Count components
    num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(mask)

    # label 0 is background → subtract 1
    return num_labels - 1

while True:
    line = io.recvline()
    if b"IMAGE:" in line:
        b64img = io.recvline().strip()
        img_bytes = base64.b64decode(b64img)
        log.info(f"Got image (length {len(img_bytes)})")

        io.recvuntil(b">> ")

        # Compute answer
        answer = count_moles(img_bytes)
        log.success(f"Sending answer: {answer}")

        io.sendline(str(answer).encode())

    elif b"Wrong answer!" in line or b"Hero" in line:
        print(line.decode().strip())
        io.close()
        break

    else:
        log.info(line.decode().strip())
