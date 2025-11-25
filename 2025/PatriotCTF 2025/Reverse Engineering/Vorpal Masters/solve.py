def solve_middle_number():
    """Brute-force search for the valid local_20 value."""
    for x in range(-5000, 10001):
        left = (x + 0x16) % 0x6CA          # (x + 22) % 1738
        right = ((x * 2) % 2000) * 6 + 9   # ((2x mod 2000) * 6) + 9
        if left == right:
            return x
    return None


def generate_license_key():
    # Part 1 must be characters: C C I A (based on char checks)
    part1 = "CACI"

    # Solve the middle number
    middle = solve_middle_number()
    if middle is None:
        raise Exception("No valid middle number found")

    # Part 3 must be the exact string "PatriotCTF"
    part3 = "PatriotCTF"

    # Construct full key: xxxx-number-xxxxxxxxxx
    key = f"{part1}-{middle}-{part3}"
    return key


if __name__ == "__main__":
    key = generate_license_key()
    print("Valid License Key:")
    print(key)
