import json
import requests
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enables cross-origin requests from the browser app

TESTNET_RPC_URL = "https://rpc.testnet.nimiq.network"

class NimiqTestnetWallet:
    def __init__(self, rpc_url=TESTNET_RPC_URL):
        self.rpc_url = rpc_url
        self.headers = {'content-type': 'application/json'}
        self.request_id = 1

    def _rpc_call(self, method, params=None):
        if params is None:
            params = []
        payload = {
            "jsonrpc": "2.0",
            "method": method,
            "params": params,
            "id": self.request_id
        }
        self.request_id += 1
        try:
            response = requests.post(self.rpc_url, data=json.dumps(payload), headers=self.headers, timeout=10)
            response.raise_for_status()
            data = response.json()
            if "error" in data:
                raise Exception(f"RPC Error ({data['error'].get('code')}): {data['error'].get('message')}")
            return data.get("result")
        except Exception as e:
            print(f"[-] RPC Error: {e}")
            return None

    def check_connection(self):
        block_number = self._rpc_call("blockNumber")
        return block_number is not None, block_number

    def get_account_balance(self, address):
        clean_address = address.replace(" ", "")
        account_info = self._rpc_call("getAccountByAddress", [clean_address])
        if account_info:
            balance_luna = account_info.get("balance", 0)
            balance_nim = balance_luna / 100000
            return {
                "address": account_info.get("address"),
                "balance_nim": balance_nim,
                "balance_luna": balance_luna,
                "type": account_info.get("type")
            }
        return None

wallet_client = NimiqTestnetWallet()

@app.route('/')
def index():
    return "Nimiq Testnet Bridge Server is Running!"

@app.route('/api/status', methods=['GET'])
def status():
    connected, block_height = wallet_client.check_connection()
    return jsonify({"connected": connected, "block_height": block_height})

@app.route('/api/wallet', methods=['POST'])
def wallet_info():
    data = request.get_json() or {}
    address = data.get('address', 'NQ25 210H BKED C596 DLQG ED8A CD00 XAFA UVP4')
    account = wallet_client.get_account_balance(address)
    if account:
        return jsonify({"success": True, "account": account})
    return jsonify({"success": False, "error": "Account not found or RPC unreachable"}), 400

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5001, debug=True)