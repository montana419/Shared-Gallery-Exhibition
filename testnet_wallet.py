import json
import requests

# Nimiq Testnet Node RPC Configuration
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
        except requests.exceptions.RequestException as e:
            print(f"[-] Connection Error: {e}")
            return None
        except Exception as e:
            print(f"[-] Error: {e}")
            return None

    def check_connection(self):
        """Verifies connection to the Testnet node."""
        block_number = self._rpc_call("blockNumber")
        if block_number is not None:
            print(f"[+] Connected to Nimiq Testnet. Current Block Height: {block_number}")
            return True
        print("[-] Failed to connect to Nimiq Testnet.")
        return False

    def get_account_balance(self, address):
        """Retrieves the balance for a given Nimiq user address."""
        # Clean address formatting
        clean_address = address.replace(" ", "")
        
        account_info = self._rpc_call("getAccountByAddress", [clean_address])
        if account_info:
            balance_luna = account_info.get("balance", 0)
            balance_nim = balance_luna / 100000  # 1 NIM = 100,000 Luna
            return {
                "address": account_info.get("address"),
                "balance_nim": balance_nim,
                "balance_luna": balance_luna,
                "type": account_info.get("type")
            }
        return None

if __name__ == "__main__":
    wallet_client = NimiqTestnetWallet()
    
    print("--- Nimiq Testnet Wallet Connection ---")
    if wallet_client.check_connection():
        # Example Testnet Address
        test_address = "NQ25 210H BKED C596 DLQG ED8A CD00 XAFA UVP4"
        
        print(f"\nFetching account info for: {test_address}")
        account = wallet_client.get_account_balance(test_address)
        
        if account:
            print(f"Address: {account['address']}")
            print(f"Balance: {account['balance_nim']} NIM ({account['balance_luna']} Luna)")