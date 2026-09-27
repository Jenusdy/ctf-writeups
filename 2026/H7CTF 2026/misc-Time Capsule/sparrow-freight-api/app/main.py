from flask import Flask, jsonify
import os
app = Flask(__name__)

@app.get("/health")
def health():
    return jsonify(status="ok")

@app.get("/track/<awb>")
def track(awb):
    # TODO: wire up the carrier API using the token from the vault
    return jsonify(awb=awb, status="in_transit")

if __name__ == "__main__":
    app.run("0.0.0.0", int(os.environ.get("PORT", 8080)))
