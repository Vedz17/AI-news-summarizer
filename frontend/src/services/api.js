import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000"; // Backend URL

// ✅ Fetch Summarized News with Language & Translation Support
export const fetchSummarizedNews = async (lang = "en") => {
  try {
    console.log(`📡 Fetching summarized news in language: ${lang}...`);
    
    // ✅ Ensure translation happens when lang is not English
    const response = await axios.get(`${API_BASE_URL}/summarize-news?lang=${lang}&translate=true`);

    console.log("✅ API Response Status:", response.status);
    console.log("✅ Full API Response:", response.data);

    return response.data.summarized_news;
  } catch (error) {
    console.error("❌ Error fetching summarized news:", error.message);
    return [];
  }
};

// ✅ Fetch Trending News (No Change)
export const fetchTrendingNews = async () => {
  try {
    console.log("🔥 Fetching trending news...");
    const response = await axios.get(`${API_BASE_URL}/trending-news`);

    console.log("✅ API Response Status:", response.status);
    console.log("✅ Trending News Data:", response.data);

    return response.data.trending_news;
  } catch (error) {
    console.error("❌ Error fetching trending news:", error.message);
    return [];
  }
};
