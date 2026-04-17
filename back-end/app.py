# ==========================================
# BELLE.AI — FastAPI Backend
# ==========================================

import sys
import os
import re

# Add back-end to path so engine modules can be imported
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional

from Model import FirstLayerDMM
from Chatbot import ChatBot, get_chat_history, clear_chat_history
from RealtimeSearchEngine import RealtimeSearchEngine
from trend_engine import trend_engine
from ImageGenration import GenerateImages, DATA_DIR as IMAGE_DIR
from Image_Analyzer import analyze_image_from_bytes

# ==========================================
# APP SETUP
# ==========================================

app = FastAPI(
    title="BELLE.AI",
    description="AI-powered grooming & lifestyle assistant API",
    version="1.0.0",
)

# CORS — allow all origins for dev (tighten in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# REQUEST / RESPONSE MODELS
# ==========================================

class ChatRequest(BaseModel):
    query: str

class ImageGenRequest(BaseModel):
    prompt: str

class ChatResponse(BaseModel):
    response: str
    engine: str

class SmartChatResponse(BaseModel):
    response: str
    tasks_detected: list[str]
    engines_used: list[str]

class ImageGenResponse(BaseModel):
    prompt: str
    images: list[str]
    message: str

class ImageAnalysisResponse(BaseModel):
    analysis: str

class HistoryResponse(BaseModel):
    history: list[dict]
    count: int

class HealthResponse(BaseModel):
    status: str
    service: str

# ==========================================
# HELPERS
# ==========================================

def clean_query(task: str, prefix: str) -> str:
    """Cleans the task string by removing the prefix and any parentheses."""
    query = task.replace(prefix, "", 1).strip()
    query = re.sub(r'^\(\s*(.*?)\s*\)$', r'\1', query)
    return query.strip()

# ==========================================
# ENDPOINTS
# ==========================================

@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    return HealthResponse(status="online", service="BELLE.AI")


@app.post("/api/chat", response_model=SmartChatResponse)
async def smart_chat(request: ChatRequest):
    """
    Smart chat — classifies the query intent and routes to the right engine.
    Supports multi-task queries (e.g. 'tell me trending hairstyles and generate an image of a sunset').
    """
    user_input = request.query.strip()
    if not user_input:
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    # Step 1 — Classify intent
    tasks = FirstLayerDMM(user_input)

    if not tasks:
        response = ChatBot(user_input)
        return SmartChatResponse(
            response=response,
            tasks_detected=["general"],
            engines_used=["chatbot"]
        )

    # Step 2 — Execute each task
    final_response = ""
    engines_used = []

    for task in tasks:
        task = task.lower().strip()

        if "exit" in task:
            final_response += "Goodbye! Take care 🌸\n"
            engines_used.append("exit")

        elif task.startswith("general"):
            query = clean_query(task, "general")
            final_response += ChatBot(query) + "\n"
            engines_used.append("chatbot")

        elif task.startswith("realtime"):
            query = clean_query(task, "realtime")
            final_response += RealtimeSearchEngine(query) + "\n"
            engines_used.append("realtime_search")

        elif task.startswith("trend"):
            query = clean_query(task, "trend")
            final_response += trend_engine(query) + "\n"
            engines_used.append("trend_engine")

        elif task.startswith("generate image"):
            query = clean_query(task, "generate image")
            filenames = GenerateImages(query)
            final_response += f"Generated {len(filenames)} images for '{query}'. Access them via /api/images/<filename>\n"
            engines_used.append("image_generation")

        elif "image" in task:
            final_response += "Image analysis requires uploading an image. Use POST /api/analyze-image instead.\n"
            engines_used.append("image_analyzer_hint")

        else:
            # Fallback for unimplemented intents
            if "chatbot" not in engines_used:
                final_response += ChatBot(user_input) + "\n"
                engines_used.append("chatbot")

    return SmartChatResponse(
        response=final_response.strip(),
        tasks_detected=tasks,
        engines_used=engines_used
    )


@app.post("/api/chat/general", response_model=ChatResponse)
async def general_chat(request: ChatRequest):
    """Direct general chat — bypasses intent classification."""
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    response = ChatBot(request.query)
    return ChatResponse(response=response, engine="chatbot")


@app.post("/api/chat/realtime", response_model=ChatResponse)
async def realtime_chat(request: ChatRequest):
    """Realtime web search — Google search + AI-synthesized answer."""
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    response = RealtimeSearchEngine(request.query)
    return ChatResponse(response=response, engine="realtime_search")


@app.post("/api/chat/trend", response_model=ChatResponse)
async def trend_chat(request: ChatRequest):
    """Trend analysis — Google Trends + social media + AI advice."""
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    response = trend_engine(request.query)
    return ChatResponse(response=response, engine="trend_engine")


@app.post("/api/generate-image", response_model=ImageGenResponse)
async def generate_image(request: ImageGenRequest):
    """Generate 4 AI images from a text prompt."""
    if not request.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty.")

    filenames = GenerateImages(request.prompt)

    if not filenames:
        raise HTTPException(status_code=500, detail="Image generation failed. Check your Hugging Face API key.")

    return ImageGenResponse(
        prompt=request.prompt,
        images=filenames,
        message=f"Generated {len(filenames)} images successfully."
    )


@app.post("/api/analyze-image", response_model=ImageAnalysisResponse)
async def analyze_image(
    file: UploadFile = File(...),
    prompt: str = Form(default="Describe this image in detail.")
):
    """Upload an image and get AI-powered analysis using Cohere Aya Vision."""
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image.")

    image_bytes = await file.read()
    result = analyze_image_from_bytes(prompt, image_bytes, file.content_type)

    return ImageAnalysisResponse(analysis=result)


@app.get("/api/images/{filename}")
async def get_image(filename: str):
    """Serve a generated image by filename."""
    file_path = os.path.join(IMAGE_DIR, filename)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Image not found.")

    return FileResponse(file_path, media_type="image/jpeg")


@app.get("/api/history", response_model=HistoryResponse)
async def get_history():
    """Get the full chat history."""
    history = get_chat_history()
    return HistoryResponse(history=history, count=len(history))


@app.delete("/api/history")
async def delete_history():
    """Clear all chat history."""
    clear_chat_history()
    return {"message": "Chat history cleared."}
