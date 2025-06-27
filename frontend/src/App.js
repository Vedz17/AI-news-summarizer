import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { fetchSummarizedNews } from "./services/api";
import NewsCard from "./components/NewsCard";
import Bookmarks from "./pages/Bookmarks";
import TrendingNews from "./pages/TrendingNews";
import { FaSun, FaMoon } from "react-icons/fa";
import { BiLoaderAlt } from "react-icons/bi";

function App() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    getNews();
  }, [language]);

  const getNews = async () => {
    setLoading(true);
    const data = await fetchSummarizedNews(language);
    setNews(data);
    setLoading(false);
  };

  const filteredNews = news.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (category === "all" || article.source.toLowerCase() === category)
  );

  return (
    <Router>
      <div className={`min-h-screen p-6 transition-all duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
        
        {/* ✅ Navigation Bar */}
        <nav className="flex flex-wrap justify-between items-center mb-6 p-4 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 shadow-lg">
          <h1 className="text-3xl md:text-4xl font-bold text-white hover:text-yellow-300 transition-all">🧠 AI News Summarizer</h1>
          <div className="flex flex-wrap gap-4 items-center mt-4 md:mt-0">
            <Link to="/" className="text-white hover:text-yellow-300 transition">Home</Link>
            <Link to="/bookmarks" className="text-white hover:text-yellow-300 transition">Bookmarks</Link>
            <Link to="/trending-news" className="text-white hover:text-yellow-300 transition">🔥 Trending</Link>

            <select
              className="px-3 py-2 rounded-md bg-white text-black dark:bg-gray-800 dark:text-white border dark:border-gray-600 shadow-sm"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="mr">मराठी</option>
            </select>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition"
            >
              {darkMode ? <FaSun /> : <FaMoon />}
              {darkMode ? "Light" : "Dark"}
            </button>
          </div>
        </nav>

        {/* ✅ Routing Setup */}
        <Routes>
          <Route
            path="/"
            element={
              <>
                {/* ✅ Search and Filter */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
                  <div className="relative w-full md:w-1/3">
                    <input
                      type="text"
                      placeholder="🔍 Search news..."
                      className="w-full px-4 py-2 border rounded-lg shadow-sm bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <select
                    className="px-4 py-2 border rounded-lg shadow-sm bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    <option value="bbc news">BBC News</option>
                    <option value="espn">ESPN</option>
                    <option value="the hindu">The Hindu</option>
                    <option value="al jazeera english">Al Jazeera</option>
                  </select>
                </div>

                {/* ✅ Loading Spinner */}
                {loading && (
                  <div className="flex justify-center items-center mb-6">
                    <BiLoaderAlt className="animate-spin text-blue-500 text-4xl" />
                  </div>
                )}

                {/* ✅ News Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredNews.length > 0 ? (
                    filteredNews.map((article, index) => (
                      <NewsCard key={index} {...article} />
                    ))
                  ) : (
                    !loading && (
                      <p className="text-center col-span-3 text-gray-500 dark:text-gray-400">
                        📭 No news found. Try different filters or search!
                      </p>
                    )
                  )}
                </div>
              </>
            }
          />

          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/trending-news" element={<TrendingNews />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
