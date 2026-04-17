# BELLE.AI 🌸

**Your Personal AI Grooming & Lifestyle Assistant**

BELLE.AI is a full-stack AI assistant that helps users with grooming advice, fashion trends, style recommendations, AI image generation, and image-based outfit analysis. It features a smart intent-routing system that automatically classifies your query and sends it to the best AI engine.

---

## ✨ Features

| Feature | Description | Powered By |
|---------|-------------|------------|
| 💬 **Smart Chat** | Auto-classifies your query and routes to the right engine | Cohere `command-r` |
| 🗣️ **General Chat** | Conversational AI for general grooming & lifestyle questions | Groq / LLaMA 3.1 |
| 🔍 **Realtime Search** | Web-augmented answers with live Google search results | Google Search + Groq |
| 📊 **Trend Analysis** | Fashion & grooming trends with supportive, confidence-building advice | SerpAPI + HuggingFace BART + Groq |
| 🎨 **Image Generation** | Generate 4 unique AI images from a text prompt | HuggingFace FLUX.1 Schnell |
| 📷 **Image Analysis** | Upload a photo and get AI-powered style/outfit analysis | Cohere Aya Vision |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│   Frontend (HTML / CSS / JS)         │
│   belle-frontend/index.html          │
└──────────────┬───────────────────────┘
               │  REST API (HTTP :8000)
┌──────────────▼───────────────────────┐
│   FastAPI Backend                    │
│   back-end/app.py                    │
├──────────────────────────────────────┤
│   Intent Classifier (Cohere)         │
│   Model.py — command-r-08-2024       │
├──────┬──────┬────────┬──────┬────────┤
│ Chat │Search│ Trends │ImgGen│Vision  │
│(Groq)│(Groq)│ (Groq) │(FLUX)│(Cohere)│
└──────┴──────┴────────┴──────┴────────┘
```

### How It Works

1. **User sends a query** from the frontend chat
2. **`POST /api/chat`** hits the FastAPI backend
3. **Model.py** classifies the intent using Cohere's `command-r` model (e.g., `general`, `realtime`, `trend`, `generate image`)
4. **app.py** routes the query to the correct engine module
5. The engine processes it and returns a **JSON response** to the frontend

---

## 📁 Project Structure

```
BELLE.AI-main/
├── back-end/
│   ├── app.py                  # FastAPI application (main entry point)
│   ├── Model.py                # Intent classifier (Cohere command-r)
│   ├── Chatbot.py              # General chat engine (Groq / LLaMA 3.1)
│   ├── RealtimeSearchEngine.py # Google search + AI-synthesized answers
│   ├── trend_engine.py         # Trend analysis (SerpAPI + HF BART + Groq)
│   ├── ImageGenration.py       # AI image generation (FLUX.1 Schnell)
│   └── Image_Analyzer.py       # Vision analysis (Cohere Aya Vision)
├── belle-frontend/
│   ├── index.html              # Single-page UI with 3 tabs
│   ├── style.css               # Warm rose gold theme
│   ├── app.js                  # Frontend logic & API integration
│   └── favicon.svg             # App icon
├── Data/
│   ├── ChatLog.json            # Persistent chat history
│   └── generated_images/       # AI-generated images stored here
├── venv/                       # Python virtual environment
├── .env                        # API keys (not committed to git)
├── .gitignore
├── requirements.txt
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/chat` | **Smart router** — auto-classifies intent and routes to the best engine |
| `POST` | `/api/chat/general` | Direct general chat (Groq / LLaMA) |
| `POST` | `/api/chat/realtime` | Realtime web search + AI answer |
| `POST` | `/api/chat/trend` | Trend analysis with grooming advice |
| `POST` | `/api/generate-image` | Generate 4 AI images from a text prompt |
| `POST` | `/api/analyze-image` | Upload image + prompt → AI vision analysis |
| `GET` | `/api/images/{filename}` | Serve generated images |
| `GET` | `/api/history` | Get chat history |
| `DELETE` | `/api/history` | Clear chat history |

Interactive API docs available at **http://localhost:8000/docs** when the server is running.

---

## 🚀 Setup & Run

### Prerequisites
- Python 3.10+
- A modern web browser

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/BELLE.AI.git
cd BELLE.AI-main
```

### 2. Create & Activate Virtual Environment

```bash
python -m venv venv

# Windows
.\venv\Scripts\activate

# macOS / Linux
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure API Keys

Create a `.env` file in the project root with the following keys:

```env
# ===== REQUIRED =====
COHERE_API_KEY=your_cohere_api_key
groq_api_key=your_groq_api_key

# ===== OPTIONAL (for specific features) =====
HF_API_KEY=your_huggingface_token          # Image generation (FLUX.1)
SERPAPI_API_KEY=your_serpapi_key            # Trend analysis (Google Trends)
APIFY_API_KEY=your_apify_key               # Social media trends (placeholder)

# ===== PERSONALIZATION =====
username=YourName
Assistant_name=BELLE
```

> **All services have free tiers** — no payment required to get started.

| Key | What it powers | Get it from |
|-----|---------------|-------------|
| `COHERE_API_KEY` | Intent classification + Image analysis | [dashboard.cohere.com/api-keys](https://dashboard.cohere.com/api-keys) |
| `groq_api_key` | Chat, search, trends (LLaMA 3.1) | [console.groq.com/keys](https://console.groq.com/keys) |
| `HF_API_KEY` | Image generation (FLUX.1 Schnell) | [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens) |
| `SERPAPI_API_KEY` | Google Trends data for trend engine | [serpapi.com/dashboard](https://serpapi.com/dashboard) |

### 5. Start the Backend Server

```bash
cd back-end
python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

The API will be live at `http://localhost:8000` and interactive docs at `http://localhost:8000/docs`.

### 6. Open the Frontend

Open `belle-frontend/index.html` in your web browser. The frontend connects to the backend at `http://localhost:8000`.

---

## 💡 Usage Examples

### Chat (via frontend)
Type a question in the chat box or click a suggestion chip. BELLE automatically detects intent:
- *"What hairstyle suits a round face?"* → routes to **general chat**
- *"Who is the current PM of India?"* → routes to **realtime search**
- *"Trending men's fashion 2026"* → routes to **trend engine**

### Image Generation (via frontend)
Switch to the **Generate** tab, type a prompt like *"a cute kitten"*, and BELLE generates 4 unique images using FLUX.1.

### Image Analysis (via frontend)
Switch to the **Analyze** tab, upload a photo, and ask BELLE to analyze your outfit, suggest styles, or describe the image.

### API Usage (via curl)

```bash
# Smart chat
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"query": "trending hairstyles for men"}'

# Generate images
curl -X POST http://localhost:8000/api/generate-image \
  -H "Content-Type: application/json" \
  -d '{"prompt": "sunset over mountains"}'

# Analyze an image
curl -X POST http://localhost:8000/api/analyze-image \
  -F "file=@photo.jpg" \
  -F "prompt=What outfit would suit this person?"
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML, CSS (warm rose gold theme), Vanilla JavaScript |
| **Backend** | Python, FastAPI, Uvicorn |
| **Intent Classification** | Cohere (`command-r-08-2024`) |
| **Chat & Reasoning** | Groq (`llama-3.1-8b-instant`) |
| **Image Generation** | HuggingFace Inference API (`FLUX.1-schnell` by Black Forest Labs) |
| **Image Analysis** | Cohere Aya Vision (`c4ai-aya-vision-8b`) |
| **Web Search** | `googlesearch-python` |
| **Trend Data** | SerpAPI (Google Trends) + HuggingFace BART (summarization) |

---

## 📦 Dependencies

```
cohere              # Cohere AI SDK (intent classification + vision)
groq                # Groq SDK (LLaMA inference)
python-dotenv       # Environment variable management
rich                # Rich text formatting
googlesearch-python # Google search results
requests            # HTTP requests
opencv-python       # Image processing
pillow              # Image handling
fastapi             # REST API framework
uvicorn[standard]   # ASGI server
python-multipart    # File upload support
```

Install all with: `pip install -r requirements.txt`
