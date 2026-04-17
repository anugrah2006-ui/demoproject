# Image_Analyzer.py
# BELLE.AI Aya Vision Analyzer (Cohere SDK)

import os
import base64
import mimetypes
import cohere
from dotenv import dotenv_values

# -----------------------------
# LOAD ENV
# -----------------------------
script_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(script_dir, "..", ".env")

env_vars = dotenv_values(env_path)
COHERE_API_KEY = env_vars.get("COHERE_API_KEY")

# Initialize Cohere Client
client = cohere.ClientV2(api_key=COHERE_API_KEY)


# -----------------------------
# CONVERT IMAGE FILE TO BASE64
# -----------------------------
def encode_image(image_path):
    mime = mimetypes.guess_type(image_path)[0] or "image/jpeg"

    with open(image_path, "rb") as f:
        encoded = base64.b64encode(f.read()).decode()

    return f"data:{mime};base64,{encoded}"


def encode_image_bytes(image_bytes: bytes, content_type: str = "image/jpeg"):
    """Encode raw image bytes to a base64 data URL."""
    encoded = base64.b64encode(image_bytes).decode()
    return f"data:{content_type};base64,{encoded}"


# -----------------------------
# AYA VISION ANALYZER
# -----------------------------
def analyze_with_aya(prompt, data_url):
    """Send an image (as base64 data URL) to Aya Vision for analysis."""
    print("Sending image to Aya Vision via Cohere...")

    try:
        response = client.chat(
            model="c4ai-aya-vision-8b",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {"type": "image_url", "image_url": {"url": data_url}}
                    ]
                }
            ]
        )
        return response.message.content[0].text
    except Exception as e:
        return f"Error analyzing image: {str(e)}"


# -----------------------------
# API-FRIENDLY ANALYZER
# -----------------------------
def analyze_image_from_bytes(prompt: str, image_bytes: bytes, content_type: str = "image/jpeg") -> str:
    """
    Analyze an image from raw bytes (for FastAPI file upload).
    """
    data_url = encode_image_bytes(image_bytes, content_type)
    return analyze_with_aya(prompt, data_url)


def analyze_image_from_path(prompt: str, image_path: str) -> str:
    """
    Analyze an image from a file path.
    """
    data_url = encode_image(image_path)
    return analyze_with_aya(prompt, data_url)
