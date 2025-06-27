import os
import asyncio
import logging
import httpx # type: ignore
import torch
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline, M2M100ForConditionalGeneration, M2M100Tokenizer
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer  # type: ignore
from dotenv import load_dotenv

# 🔧 Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ✅ Load .env
load_dotenv()
API_KEY = os.getenv("NEWSAPI_KEY")
if not API_KEY:
    raise EnvironmentError("❌ NEWSAPI_KEY not found in .env")

# ✅ Device setup
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
logger.info(f"🔥 Using device: {DEVICE}")

# ✅ Load models only once
logger.info("⏳ Loading AI models...")
pegasus = pipeline("summarization", model="google/pegasus-xsum", device=0 if DEVICE == "cuda" else -1)
t5 = pipeline("summarization", model="t5-small", device=0 if DEVICE == "cuda" else -1)
analyzer = SentimentIntensityAnalyzer()

translator_model = M2M100ForConditionalGeneration.from_pretrained("facebook/m2m100_418M").to(DEVICE)
translator_tokenizer = M2M100Tokenizer.from_pretrained("facebook/m2m100_418M")
logger.info("✅ All models loaded!")

# ✅ App and CORS
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠ For production, replace with frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "✅ AI News Summarizer API is running!"}

@app.get("/summarize-news")
async def summarize_news(
    lang: str = Query("en", description="Language code (en, hi, mr)"),
    translate: bool = Query(False, description="Translate summary to selected language")
):
    supported_langs = ["en", "hi", "mr"]

    if lang not in supported_langs:
        return {
            "error": f"❌ Unsupported language '{lang}'. Supported: {supported_langs}"
        }

    url = (
        f"https://newsapi.org/v2/top-headlines"
        f"?sources=bbc-news,the-hindu,al-jazeera-english,espn,times-of-india,ndtv,cnn,financial-times,reuters"
        f"&pageSize=10&apiKey={API_KEY}"
    )

    # ✅ Fetch news with httpx
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(url)
            news_data = response.json()
    except Exception as e:
        logger.error(f"❌ Error fetching news: {e}")
        return {"error": "Failed to fetch news from NewsAPI"}

    if news_data.get("status") != "ok":
        return {"error": "News API returned error", "details": news_data}

    seen_titles = set()
    articles = []

    for article in news_data.get("articles", []):
        if article["title"] and article["title"] not in seen_titles and article.get("content"):
            seen_titles.add(article["title"])
            articles.append(article)

    async def summarize_article(article):
        content = article.get("content", "")
        if not content or len(content) < 100:
            return {
                "title": article.get("title", "No title"),
                "summary": "No sufficient content available.",
                "source": article.get("source", {}).get("name", "Unknown"),
                "url": article.get("url", "#"),
                "image": article.get("urlToImage", ""),
                "publishedAt": article.get("publishedAt", ""),
                "sentiment": "⚪ Neutral"
            }

        try:
            summary = await asyncio.to_thread(
                lambda: pegasus(content, max_length=100, min_length=50, do_sample=False)[0]["summary_text"]
                if len(content) > 500 else
                t5(content, max_length=100, min_length=50, do_sample=False)[0]["summary_text"]
            )
            sentiment_score = analyzer.polarity_scores(summary)["compound"]
            sentiment = "🟢 Positive" if sentiment_score >= 0.05 else "🔴 Negative" if sentiment_score <= -0.05 else "⚪ Neutral"
        except Exception as e:
            logger.error(f"⚠️ Summarization failed: {e}")
            summary = "⚠️ Summarization error"
            sentiment = "⚪ Neutral"

        return {
            "title": article.get("title", "No title"),
            "summary": summary,
            "source": article.get("source", {}).get("name", "Unknown"),
            "url": article.get("url", "#"),
            "image": article.get("urlToImage", ""),
            "publishedAt": article.get("publishedAt", ""),
            "sentiment": sentiment
        }

    summarized = await asyncio.gather(*(summarize_article(article) for article in articles))

    # ✅ Translate only if valid lang and enabled
    if translate and lang != "en":
        try:
            logger.info(f"🌍 Translating {len(summarized)} articles to '{lang}'")
            translator_tokenizer.src_lang = "en"
            summaries = [art["summary"] for art in summarized]
            inputs = translator_tokenizer(summaries, return_tensors="pt", padding=True, truncation=True).to(DEVICE)
            tokens = translator_model.generate(**inputs, forced_bos_token_id=translator_tokenizer.get_lang_id(lang))
            translations = translator_tokenizer.batch_decode(tokens, skip_special_tokens=True)

            for i in range(len(summarized)):
                summarized[i]["summary"] = translations[i]

            logger.info("✅ Translation completed")
        except Exception as e:
            logger.error(f"❌ Translation failed: {e}")
            return {"error": "Translation failed", "details": str(e)}

    return {"summarized_news": summarized}

# ✅ Fix: __main__ typo
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
