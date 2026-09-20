#!/usr/bin/env python3
"""
Solution script for "Secret Treaties" (CSAW CTF).

Challenge analysis:
- The cryptosystem is a Merkle-Hellman knapsack / subset sum problem.
- Public key: 72 integers (~96 bits each).
- Plaintext blocks: 9 bytes = 72 bits each (MSB-first per byte).
- Density d = 72 / log2(max(pubkey)) ≈ 72 / 96 ≈ 0.75.
- Because the density is low (d < 0.9408), the subset sum problem can be
  efficiently reduced to the Closest Vector Problem (CVP) / Shortest Vector Problem (SVP).
- Using a centered target (Coster et al. / CJLOSS technique) where x_i ∈ {0, 1}
  is shifted so that 2*x_i - 1 ∈ {-1, +1}, all valid binary solutions have
  uniform minimal squared distance (72 * 1^2 = 72).
- Solving CVP with Babai / fast enumeration in fpylll solves each 72-bit block in ~0.03s.
"""

from pathlib import Path
from fpylll import IntegerMatrix, LLL, CVP


def load_data(base_dir: Path):
    pubkey_file = base_dir / "pubkey.txt"
    ciphertext_file = base_dir / "ciphertext.txt"

    with open(pubkey_file, "r") as f:
        pubkey = [
            int(line.strip())
            for line in f
            if line.strip() and not line.startswith("#")
        ]

    with open(ciphertext_file, "r") as f:
        ciphertexts = [
            int(line.strip())
            for line in f
            if line.strip() and not line.startswith("#")
        ]

    return pubkey, ciphertexts


def solve():
    base_dir = Path(__file__).parent.resolve()
    pubkey, ciphertexts = load_data(base_dir)

    n = len(pubkey)
    print(f"[*] Loaded public key with {n} elements.")
    print(f"[*] Loaded {len(ciphertexts)} ciphertext blocks.")

    # Construct the centered CVP lattice basis:
    # Dimension: n x (n + 1)
    # Row i: [2 * pubkey[i], 0, ..., 2, ..., 0] (with 2 at column i + 1)
    # Target vector: [2 * ct, 1, 1, ..., 1]
    # For a binary solution x in {0, 1}^n, the lattice vector has coordinates:
    # [2 * sum(x_i * pubkey[i]), 2 * x_0, 2 * x_1, ..., 2 * x_{n-1}].
    # The difference with target is [0, 2*x_0 - 1, ..., 2*x_{n-1} - 1],
    # which has squared norm sum_{i=0}^{n-1} (+-1)^2 = n.
    B = IntegerMatrix(n, n + 1)
    for i in range(n):
        B[i, 0] = 2 * pubkey[i]
        B[i, i + 1] = 2

    print("[*] Running LLL reduction on lattice basis...")
    LLL.reduction(B)
    print("[+] LLL reduction completed.")

    full_flag_bytes = b""
    for idx, ct in enumerate(ciphertexts):
        target = tuple([2 * ct] + [1] * n)
        v = CVP.closest_vector(B, target, method="fast")

        # Verify that knapsack target matches
        if v[0] != 2 * ct:
            raise ValueError(f"Block {idx}: Target sum mismatch!")

        # Extract bits x_i from 2 * x_i
        bits = [v[i + 1] // 2 for i in range(n)]

        if not all(b in (0, 1) for b in bits):
            raise ValueError(f"Block {idx}: Solution vector is not binary!")

        if sum(b * p for b, p in zip(bits, pubkey)) != ct:
            raise ValueError(f"Block {idx}: Subset sum check failed!")

        # Convert 72 bits to 9 bytes (MSB first per byte)
        block_bytes = bytes(
            sum(bits[byte_idx * 8 + bit_idx] << (7 - bit_idx) for bit_idx in range(8))
            for byte_idx in range(9)
        )
        print(f"  [+] Block {idx}: {block_bytes}")
        full_flag_bytes += block_bytes

    # Strip trailing null padding if present
    flag_str = full_flag_bytes.rstrip(b"\x00").decode("utf-8", errors="replace")
    print("\n" + "=" * 60)
    print(f"FLAG: {flag_str}")
    print("=" * 60)
    return flag_str


if __name__ == "__main__":
    solve()
