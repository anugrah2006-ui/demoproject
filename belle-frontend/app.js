// ==========================================
// BELLE.AI — Frontend Application
// ==========================================

const API_BASE = 'http://localhost:8000';

// ===== DOM REFERENCES =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// Sidebar
const sidebar = $('#sidebar');
const sidebarOverlay = $('#sidebar-overlay');
const hamburger = $('#hamburger');
const navBtns = $$('.nav-btn[data-tab]');

// Chat
const chatMessages = $('#chat-messages');
const chatInput = $('#chat-input');
const btnSend = $('#btn-send');
const btnClearHistory = $('#btn-clear-history');

// Image Generation
const genInput = $('#gen-input');
const btnGenerate = $('#btn-generate');
const genResults = $('#gen-results');

// Image Analysis
const uploadZone = $('#upload-zone');
const fileInput = $('#file-input');
const imagePreview = $('#image-preview');
const uploadPlaceholder = $('#upload-placeholder');
const analyzeInput = $('#analyze-input');
const btnAnalyze = $('#btn-analyze');
const analyzeResult = $('#analyze-result');
const analyzeResultText = $('#analyze-result-text');

// State
let selectedFile = null;
let isProcessing = false;

// ==========================================
// TAB SWITCHING
// ==========================================
navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tabId = btn.dataset.tab;

    // Update nav buttons
    navBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Update tab content
    $$('.tab-content').forEach(t => t.classList.remove('active'));
    $(`#tab-${tabId}`).classList.add('active');

    // Close mobile sidebar
    closeSidebar();
  });
});

// ==========================================
// MOBILE SIDEBAR
// ==========================================
function openSidebar() {
  sidebar.classList.add('open');
  sidebarOverlay.classList.add('show');
}

function closeSidebar() {
  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('show');
}

hamburger?.addEventListener('click', openSidebar);
sidebarOverlay?.addEventListener('click', closeSidebar);

// ==========================================
// CHAT FUNCTIONALITY
// ==========================================

// Auto-resize textarea
function autoResize(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
}

chatInput.addEventListener('input', () => autoResize(chatInput));
genInput.addEventListener('input', () => autoResize(genInput));
analyzeInput.addEventListener('input', () => autoResize(analyzeInput));

// Send on Enter (Shift+Enter for newline)
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendChat();
  }
});

genInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    generateImages();
  }
});

analyzeInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    analyzeImage();
  }
});

// Button clicks
btnSend.addEventListener('click', sendChat);
btnGenerate.addEventListener('click', generateImages);
btnAnalyze.addEventListener('click', analyzeImage);
btnClearHistory.addEventListener('click', clearHistory);

// Suggestion chips
$$('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    chatInput.value = chip.dataset.query;
    autoResize(chatInput);
    sendChat();
  });
});

// ===== SEND CHAT =====
async function sendChat() {
  const query = chatInput.value.trim();
  if (!query || isProcessing) return;

  // Hide welcome message
  const welcome = $('.welcome-message');
  if (welcome) welcome.remove();

  // Add user bubble
  addMessage('user', query);
  chatInput.value = '';
  autoResize(chatInput);

  // Show typing indicator
  const typingEl = addTypingIndicator();

  isProcessing = true;
  btnSend.disabled = true;

  try {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });

    const data = await res.json();

    typingEl.remove();

    if (res.ok) {
      addMessage('bot', data.response, data.engines_used);
    } else {
      addMessage('bot', data.detail || 'Something went wrong. Please try again.');
    }
  } catch (err) {
    typingEl.remove();
    addMessage('bot', 'Could not connect to the server. Make sure the backend is running on port 8000.');
  }

  isProcessing = false;
  btnSend.disabled = false;
  chatInput.focus();
}

// ===== ADD MESSAGE BUBBLE =====
function addMessage(type, text, engines = []) {
  const msg = document.createElement('div');
  msg.className = `message ${type}`;

  const avatar = type === 'bot' ? '✦' : '👤';

  let metaHTML = '';
  if (engines && engines.length > 0) {
    const tags = engines.map(e => `<span class="engine-tag">${e}</span>`).join('');
    metaHTML = `<div class="message-meta">${tags}</div>`;
  }

  msg.innerHTML = `
    <div class="message-avatar">${avatar}</div>
    <div class="message-content">
      <div class="message-bubble">${escapeHTML(text)}</div>
      ${metaHTML}
    </div>
  `;

  chatMessages.appendChild(msg);
  scrollToBottom();
}

function addTypingIndicator() {
  const msg = document.createElement('div');
  msg.className = 'message bot';
  msg.innerHTML = `
    <div class="message-avatar">✦</div>
    <div class="message-content">
      <div class="message-bubble">
        <div class="typing-indicator">
          <span></span><span></span><span></span>
        </div>
      </div>
    </div>
  `;
  chatMessages.appendChild(msg);
  scrollToBottom();
  return msg;
}

function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ===== CLEAR HISTORY =====
async function clearHistory() {
  if (!confirm('Clear all chat history?')) return;

  try {
    await fetch(`${API_BASE}/api/history`, { method: 'DELETE' });

    // Reset chat UI
    chatMessages.innerHTML = `
      <div class="welcome-message">
        <div class="welcome-icon">✦</div>
        <h1>Hello, I'm <span class="gradient-text">BELLE</span></h1>
        <p>Your AI-powered grooming & lifestyle assistant. Ask me anything about fashion trends, style advice, or just chat!</p>
        <div class="suggestion-chips">
          <button class="chip" data-query="What hairstyle suits a round face?">💇 Hairstyle advice</button>
          <button class="chip" data-query="Trending men's fashion 2026">🔥 Trending fashion</button>
          <button class="chip" data-query="Best color combinations for a formal event">🎨 Color combos</button>
          <button class="chip" data-query="How can I improve my confidence?">💪 Confidence tips</button>
        </div>
      </div>
    `;

    // Rebind chips
    $$('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        chatInput.value = chip.dataset.query;
        autoResize(chatInput);
        sendChat();
      });
    });
  } catch (err) {
    alert('Failed to clear history. Is the backend running?');
  }
}

// ==========================================
// IMAGE GENERATION
// ==========================================
async function generateImages() {
  const prompt = genInput.value.trim();
  if (!prompt || isProcessing) return;

  isProcessing = true;
  btnGenerate.disabled = true;

  // Show loading skeletons
  genResults.innerHTML = '';
  for (let i = 0; i < 4; i++) {
    const card = document.createElement('div');
    card.className = 'gen-image-card loading';
    genResults.appendChild(card);
  }

  try {
    const res = await fetch(`${API_BASE}/api/generate-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();

    genResults.innerHTML = '';

    if (res.ok && data.images && data.images.length > 0) {
      data.images.forEach(filename => {
        const card = document.createElement('div');
        card.className = 'gen-image-card';
        card.innerHTML = `<img src="${API_BASE}/api/images/${filename}" alt="${escapeHTML(prompt)}" loading="lazy" />`;
        genResults.appendChild(card);
      });
    } else {
      genResults.innerHTML = `<div class="gen-status">⚠️ ${data.detail || 'No images were generated. Check your Hugging Face API key.'}</div>`;
    }
  } catch (err) {
    genResults.innerHTML = '<div class="gen-status">❌ Could not connect to the server. Make sure the backend is running.</div>';
  }

  isProcessing = false;
  btnGenerate.disabled = false;
}

// ==========================================
// IMAGE ANALYSIS
// ==========================================

// Click to upload
uploadZone.addEventListener('click', () => fileInput.click());

// File selected
fileInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    handleFileSelect(e.target.files[0]);
  }
});

// Drag and drop
uploadZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadZone.classList.add('drag-over');
});

uploadZone.addEventListener('dragleave', () => {
  uploadZone.classList.remove('drag-over');
});

uploadZone.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadZone.classList.remove('drag-over');
  if (e.dataTransfer.files.length > 0) {
    handleFileSelect(e.dataTransfer.files[0]);
  }
});

function handleFileSelect(file) {
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file (JPG, PNG).');
    return;
  }

  selectedFile = file;

  // Show preview
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.src = e.target.result;
    imagePreview.classList.remove('hidden');
    uploadPlaceholder.classList.add('hidden');
  };
  reader.readAsDataURL(file);

  btnAnalyze.disabled = false;
}

async function analyzeImage() {
  if (!selectedFile || isProcessing) return;

  const prompt = analyzeInput.value.trim() || 'Describe this image in detail.';

  isProcessing = true;
  btnAnalyze.disabled = true;

  // Show loader
  analyzeResult.classList.remove('hidden');
  analyzeResultText.innerHTML = `
    <div class="loader-overlay">
      <div class="spinner"></div>
      <div class="loader-text">Analyzing image with Aya Vision...</div>
    </div>
  `;

  try {
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('prompt', prompt);

    const res = await fetch(`${API_BASE}/api/analyze-image`, {
      method: 'POST',
      body: formData
    });

    const data = await res.json();

    if (res.ok) {
      analyzeResultText.textContent = data.analysis;
    } else {
      analyzeResultText.textContent = data.detail || 'Analysis failed. Please try again.';
    }
  } catch (err) {
    analyzeResultText.textContent = 'Could not connect to the server. Make sure the backend is running.';
  }

  isProcessing = false;
  btnAnalyze.disabled = false;
}
