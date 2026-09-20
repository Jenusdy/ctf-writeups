#!/usr/bin/env python3
"""
CSAW CTF - Ghost in the Machine
Solver script using Python standard library (no external dependencies).
"""

import os
import struct
import sys


def solve_pcap(pcap_path: str) -> str:
    if not os.path.exists(pcap_path):
        raise FileNotFoundError(f"File not found: {pcap_path}")

    with open(pcap_path, "rb") as f:
        magic = f.read(4)
        # Handle original pcap magic (0xd4c3b2a1) or the corrupted byte (0xc4c3b2a1)
        if magic not in (b"\xd4\xc3\xb2\xa1", b"\xc4\xc3\xb2\xa1"):
            raise ValueError(f"Unrecognized PCAP magic bytes: {magic.hex()}")

        # Skip remaining 20 bytes of pcap global header
        f.read(20)

        machine_times = []
        machine_ports = []

        while True:
            pkt_hdr = f.read(16)
            if not pkt_hdr or len(pkt_hdr) < 16:
                break

            sec, usec, incl_len, _ = struct.unpack("<IIII", pkt_hdr)
            data = f.read(incl_len)

            # Minimum size: Ethernet header (14) + IPv4 header (20) + UDP header (8)
            if len(data) < 34:
                continue

            # IPv4 TTL is at offset 14 + 8 = 22
            ttl = data[22]

            # The "Machine" stream uses TTL = 64
            if ttl == 64:
                ihl = (data[14] & 0x0F) * 4
                udp_offset = 14 + ihl
                if len(data) >= udp_offset + 2:
                    src_port = struct.unpack(">H", data[udp_offset : udp_offset + 2])[0]
                    machine_times.append(sec + usec * 1e-6)
                    machine_ports.append(src_port)

    # 1. Recover repeating XOR key from machine source ports (port = 40000 + ord(char))
    key_chars = []
    prev_char = None
    for p in machine_ports:
        c = chr(p - 40000)
        if c != prev_char:
            key_chars.append(c)
            prev_char = c

    # First repeating word is 'sh4dow' (6 chars)
    key = "".join(key_chars[:6]).encode()

    # 2. Extract covert timing channel bits from packet inter-arrival times
    deltas = [machine_times[i] - machine_times[i - 1] for i in range(1, len(machine_times))]
    threshold = (min(deltas) + max(deltas)) / 2

    # Short delay (~0.05s) -> 0, Long delay (~0.15s) -> 1
    bits = [0 if d < threshold else 1 for d in deltas]

    # 3. Assemble bits into bytes (MSB first)
    raw_bytes = bytearray()
    for i in range(0, len(bits), 8):
        byte_val = 0
        for bit in bits[i : i + 8]:
            byte_val = (byte_val << 1) | bit
        raw_bytes.append(byte_val)

    # 4. XOR decrypt with key
    flag = bytes([b ^ key[i % len(key)] for i, b in enumerate(raw_bytes)]).decode("latin1")
    return flag


if __name__ == "__main__":
    pcap_file = sys.argv[1] if len(sys.argv) > 1 else "capture.pcap"
    flag = solve_pcap(pcap_file)
    print(flag)
