<h1 align="center">📰 AI News Summarizer</h1>

<p align="center">
  An <b>AI-powered web application</b> that fetches top news, summarizes articles using NLP models, 
  analyzes sentiment, and optionally translates summaries into different languages.
</p>

<hr>

<h2>🚀 Features</h2>

<ul>
  <li>🗞️ Fetches real-time news from <b>NewsAPI</b></li>
  <li>📝 Summarizes news using <b>Pegasus & T5 NLP models</b></li>
  <li>📊 Sentiment analysis (<b>Positive / Negative / Neutral</b>)</li>
  <li>🌐 Translation support (<b>English, Hindi, Marathi</b>)</li>
  <li>⚡ Fullstack app with <b>FastAPI (backend)</b> + <b>React.js (frontend)</b></li>
</ul>

<hr>

## 📂 Project Structure
```
AI-news-summarizer/
│
├── backend/ # FastAPI backend
│ ├── main.py # Main backend API
│ ├── requirements.txt # Python dependencies
│ ├── .env # Environment variables (API keys)
│ └── venv/ # Virtual environment (ignored in git)
│
├── frontend/ # React frontend
│ ├── src/ # React source code
│ │ ├── components/ # UI components
│ │ ├── pages/ # App pages
│ │ ├── services/ # API service calls
│ │ └── App.js # Main React file
│ ├── package.json # Node.js dependencies
│ └── public/ # Static files
│
└── README.md # Project documentation
```

⚙️ Installation & Setup
1️⃣ Clone the Repository
```
git clone https://github.com/<your-username>/AI-news-summarizer.git
cd AI-news-summarizer
```
2️⃣ Backend Setup (FastAPI + Python)

Navigate to backend folder:
```
cd backend
```

Create & activate virtual environment:

Windows (PowerShell):
```
python -m venv venv
venv\Scripts\activate
```

Linux/Mac:
```
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:
```
pip install -r requirements.txt
```

Create a .env file inside backend/ and add:
```
NEWSAPI_KEY=your_newsapi_key_here
```

👉 Get your free API key from NewsAPI


Start the backend server:
```
uvicorn main:app --reload
```

Check if it’s running:
Open http://127.0.0.1:8000
 → You should see:

{"message": "✅ AI News Summarizer API is running!"}

3️⃣ Frontend Setup (React + Node.js)

Open a new terminal and navigate to frontend folder:
```
cd frontend
```

Install dependencies:
```
npm install
```

Start the React app:
```
npm start
```

Open the app in your browser:
👉 http://localhost:3000

🧪 API Endpoints

Health Check

GET /


Summarize News

GET /summarize-news?lang=en&translate=false


Parameters:

lang → en (English), hi (Hindi), mr (Marathi)

translate → true / false

❗ Troubleshooting

Models may take a while to load the first time (download from HuggingFace).

If backend crashes with sentencepiece error → run:
```
pip install sentencepiece
```

If frontend shows Axios error → run inside frontend/:
```
npm install axios
```

