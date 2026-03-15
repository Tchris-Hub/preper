import os
import requests
from dotenv import load_dotenv

load_dotenv()
ALOC_TOKEN = os.environ.get('ALOC_TOKEN', '')

headers = {
    "AccessToken": ALOC_TOKEN,
    "Accept": "application/json"
}

endpoints = [
    "https://questions.aloc.com.ng/api/v2/q-40?subject=biology",
    "https://questions.aloc.com.ng/api/v2/q/40?subject=biology",
    "https://questions.aloc.com.ng/api/v2/q?subject=biology",
    "https://questions.aloc.com.ng/api/q?subject=biology"
]

for url in endpoints:
    print(f"\\nTesting {url}...")
    try:
        resp = requests.get(url, headers=headers, timeout=10)
        print(f"Status Code: {resp.status_code}")
        print(f"Response: {resp.text[:200]}")
    except Exception as e:
        print(f"Error: {str(e)}")
