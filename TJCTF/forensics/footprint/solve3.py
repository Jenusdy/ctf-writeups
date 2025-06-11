import base64

tokens = [
    "FumtF3yx-kSP11OD8mFPA", "0wnNJd_pKKNtfhG-HL8iJw", "1VmhSaBo9ymK5dUhB3cPEQ",
    "1zp7dw6eF3co0VaPDKhUag", "27bCy1Bt-9nnLG4W8oxkNA", "4vsxjPs-c9hBNmmaE8HJ8Q",
    "5rc69mw3DNjUvLolTrP3ew", "6zed3-nVA008etbNxGTNEQ", "78ICY1U_sI9qqF6vv97RhA",
    "7AJTVqVtlVelnulrRMUCaQ", "7P7nopvmQj2usona47YjSA", "7v9Vn8ci1_C1tyjKpOrDjA",
    "9lZ0k-7YFRkQu1QhA-d-DA", "_KxyLnw2LZxOc0Tk9U0cig", "A69F-dk9M1nQFfzi06gLPw",
    "abvFjWgNkHKQYbaMyCjdlw", "AFEvM2adjTHq0E8noIE0kw", "aNHzuom-c5UIGbW5ceGc9g",
    "aNPc9lG0gpLnRvGI2JPQMA", "aXNfdXNlZnVsP30gICAgIA", "b-PeUWwmlHzmh613ikEFWw",
    "b0HMxEHbs7pA9uHtxRPPTQ", "Bg9XKyNnYRSpUIYeK_2knA", "CE4CzpPMjNHuYeLi2dLNHg",
    "CPyvVdX_ynvUTdxXWYr7Mw", "D0FvxLGtoba2wKJQQEjUKA", "D3LWCMzIQyc12SQUw5uDnw",
    "DFhc0ROB762T-pZvtdPFqA", "dGpjdGZ7ZHNfc3RvcmVfIA", "dtiqv7O15HVT3k4aL1sTDA",
    "Dwv-qkn0QQLu8RlhwUNNeA", "e1xUP4GStK_lTs2W6gEkPA", "E6IuP9ouzpQDYXSNNdSyFw",
    "E8tEXrVCNAqQmSji8cDWqQ", "eNSX5RnqD95dCp7TNI2zOg", "eSRLCk2xqnpx1htFqlBAvw",
    "f0wkaX7NmMMATw1grKXIyw", "FsmKr0zCKawO9TVNgKkVvA", "FxWYnzxWEHMQGNLR_7uXRw",
    "g8azPwD-y-_2VU-dmRK7IA", "GQxeqKQR4yLZIz889h8awQ", "iHFj7XDSIesD-TJ-aSiTyA",
    "jg1spCuL4Vix9bgpToP5Hg", "JuARuIvr7ZvOOpeJ9LTOvA", "kAbgNCWwQGUZWFktiIIHeA",
    "kfAVM8pkh2jSSeuP0uWGog", "LWUOeeOqK7mlQOTJmSmwVA", "LxtZhpBRiU8PSE4eXQZV0w",
    "meMIlojtiqbBuHOGDYud_Q", "mLO_JmXEG0tcWougAWQ6Qw", "MnbgbJqhwFXlh_kKGIYLJQ",
    "N3lsvxkjSRnwIfz3Z7C5uw", "n8KZj1W3tx2WIXg8HqtF3g", "niZvI6zZ8yzoSl17d963mQ",
    "Ns2Tpp4fQxW5zhYLLGIVdA", "NUhhZkAZsgdvPVVF3KzZpA", "p7s4fwmK70UDkM_ApzmX3A",
    "PgbanHSdf0H3qDXVUrVAaA", "PGjsQh7wml99RXiA-gta6Q", "pJ_ampVpcIVGVZErPVONDQ",
    "pm_TeJmHmlL-5Mdv3R1YoA", "pMOW9YUc2Zrd-6B5G3-NSQ", "Po5jOoQ4HUssvLHuCmDj5g",
    "pOGlM0FXA5tvruLyZ5AVRA", "pPd8nFycxgq3SD67StjdCQ", "PqYOp2_ps2oErxR5U5uSXA",
    "PrceMk6k6v8-gPc6YUfuvQ", "prsJSTpQJJX5eKJQF3akDg", "PuAZy-41HFCOsKTCZkwDBw",
    "QJWXuKXCsnG2mjGYYbyoaA", "QLpbpFhcDb2oapdj3Ygutg", "Qs13PznBoQJC9yjgWm-clQ",
    "QzopSLFcXVCF5sII8C8jJA", "r4NAxKJ_RMhOLA468CAuLQ", "rhnhvlSsjRdNv35ZYwqSMg",
    "rkFwpUQRoffUQmfnqKFCNg", "sOcYOUIJIYjTYFNud5htCA", "sPEu3qqkuJDSVB6LZ0x82w",
    "tCSdwHZsNBvNS3h4qih6tA", "TibD2LWT-7Xua5Wmivc-6A", "TM0MhKzOCDKMYolGyoYc3g",
    "TxlnTHhAAyM7wIn3PGdLEg", "Ur4ktp41Mmf49_FANNugHQ", "uvIo5poX5D2dGKif1JiWIA",
    "uXcTlwm5yaS69kQd0YlYgQ", "V2XHU0KaptQFjruBnOeYJw", "V3JQfigsgWSgJ2bu8IuPOQ",
    "vNgO1oK2Ft-Q_OVtcjk7og", "VRU6bDaPkqPqFxsfBjrPQA", "VVa_NUjLLaMsO2_Jwko-SA",
    "w1oE_3GO5OTRADuEQ9Pqnw", "W62TUuIfC_ma91QdMu4ISA", "wzeP722FHEtirWHFJrgP2A",
    "xcTHd2ZbYtO9LQ2fmaQo1Q", "XfjqZgZvquXzdnfbcMKQMA", "Xnji8EXzCRLmKJvoAkZftA",
    "yfmS9_zOUIcxfSY-obWMhg", "ylFen4T5uMeqvJC6p8dfkA", "yx7GMqzc5YejMzOO5F087g",
    "Z3cpkGAUMlLgzQctzCo2Zg"
]

def try_decode(token):
    result = {"original": token, "base64_std": None, "base64_urlsafe": None}
    padded = token + "=" * (-len(token) % 4)

    try:
        decoded_std = base64.b64decode(padded).decode("utf-8")
        result["base64_std"] = decoded_std
    except Exception:
        pass

    try:
        decoded_url = base64.urlsafe_b64decode(padded).decode("utf-8")
        result["base64_urlsafe"] = decoded_url
    except Exception:
        pass

    return result

# Decode and print results
for token in tokens:
    decoded = try_decode(token)

    if decoded['base64_std'] is not None:
        print(f"Token: {decoded['original']}")
        print(f"  Base64 Standard: {decoded['base64_std']}")
        print(f"  Base64 URL-safe : {decoded['base64_urlsafe']}")
        print("-" * 60)
