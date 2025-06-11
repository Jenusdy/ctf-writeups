from ds_store import DSStore
from ds_store.store import ILocCodec

with DSStore.open(".DS_Store", "r") as d:
    for entry in d:
        print(f"Filename: {entry.filename}")
        print(f"Type: {entry.type}")
        raw_value = entry.value

        if entry.type == "Iloc":
            # Decode icon location to (x, y) coordinates
            x, y = ILocCodec.decode(raw_value)
            print(f"Value (decoded Iloc): x={x}, y={y}")
        else:
            # For other types, try UTF-8 decode or just print raw
            if isinstance(raw_value, bytes):
                try:
                    print(f"Value (decoded utf-8): {raw_value.decode('utf-8')}")
                except UnicodeDecodeError:
                    print(f"Value (bytes): {raw_value}")
            else:
                print(f"Value: {raw_value}")

        print("---")
