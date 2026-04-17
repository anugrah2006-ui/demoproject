import os
import requests
from concurrent.futures import ThreadPoolExecutor
from random import randint
from dotenv import dotenv_values

# Get the directory of the current script
script_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.abspath(os.path.join(script_dir, "..", ".env"))

env_vars = dotenv_values(env_path)

API_URL = "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell"

# Support both key names
hf_token = env_vars.get("HF_API_KEY") or env_vars.get("Hugging_Face_api")

if not hf_token:
    print("[WARNING] No HuggingFace API key found in .env (looked for HF_API_KEY and Hugging_Face_api)")

Header = {"Authorization": f"Bearer {hf_token}"}

# Data directory for generated images
DATA_DIR = os.path.join(script_dir, "..", "Data", "generated_images")


def query_image(payload):
    """Send a single image generation request (synchronous)."""
    try:
        response = requests.post(API_URL, headers=Header, json=payload, timeout=120)
        if response.status_code == 200:
            return response.content
        else:
            print(f"[ERROR] API returned status code {response.status_code}: {response.text}")
            return None
    except Exception as e:
        print(f"[ERROR] Request failed: {e}")
        return None


def GenerateImages(prompt: str) -> list:
    """Generate 4 images concurrently using threads and return list of filenames."""
    prompt_clean = prompt.replace(' ', '_')

    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)

    # Build 4 payloads
    payloads = []
    for _ in range(4):
        payloads.append({
            "inputs": (
                f"{prompt}, quality=4K, sharpness=maximum, "
                f"Ultra High details, high resolution, "
                f"seed={randint(0, 1_000_000)}"
            )
        })

    # Run 4 requests concurrently using threads (safe inside FastAPI's event loop)
    with ThreadPoolExecutor(max_workers=4) as executor:
        results = list(executor.map(query_image, payloads))

    saved_paths = []
    for i, image_bytes in enumerate(results):
        if image_bytes:
            filename = f"{prompt_clean}_{i + 1}.jpg"
            file_path = os.path.join(DATA_DIR, filename)
            with open(file_path, "wb") as f:
                f.write(image_bytes)
            saved_paths.append(filename)
            print(f"[SUCCESS] Saved: {file_path}")

    return saved_paths
