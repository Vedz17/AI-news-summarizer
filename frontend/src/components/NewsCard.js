import React, { useState, useEffect } from "react";
import { saveBookmark, removeBookmark, getBookmarks } from "../services/bookmarkService";
import { motion } from 'framer-motion';

const NewsCard = ({ title, summary, source, url, image, publishedAt, sentiment }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    } else {
      alert("Your browser does not support text-to-speech.");
    }
  };

  const sentimentColor = {
    Positive: "text-green-700 bg-green-200 hover:bg-green-300",
    Negative: "text-red-700 bg-red-200 hover:bg-red-300",
    Neutral: "text-gray-700 bg-gray-200 hover:bg-gray-300"
  };

  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const bookmarks = getBookmarks();
    setBookmarked(bookmarks.some((item) => item.url === url));
  }, [url]);

  const toggleBookmark = () => {
    if (bookmarked) {
      removeBookmark(url);
    } else {
      saveBookmark({ title, summary, source, url, image, publishedAt, sentiment });
    }
    setBookmarked(!bookmarked);
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl overflow-hidden transform transition-all hover:shadow-2xl hover:scale-105 border border-gray-200 dark:border-gray-700"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.4 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      {image ? (
        <img src={image} alt="news" className="w-full h-56 object-cover" />
      ) : (
        <div className="w-full h-56 bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-800 dark:text-white text-xl font-semibold">
          No Image Available
        </div>
      )}

      <div className="p-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white hover:text-indigo-500 transition-all">
          {title}
        </h2>
        <p className="text-gray-800 dark:text-gray-300 text-sm leading-relaxed">
          {summary}
        </p>

        {sentiment && (
          <span
            className={`inline-block px-4 py-1 rounded-full text-xs font-semibold ${sentimentColor[sentiment]} transition-all duration-300`}
          >
            {sentiment} Sentiment
          </span>
        )}

        <div className="mt-3 flex justify-between items-center text-xs text-gray-600 dark:text-gray-400">
          <span>{source?.name || "Unknown Source"} • {new Date(publishedAt).toLocaleDateString()}</span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-500 hover:underline font-medium"
          >
            Read More →
          </a>
        </div>

        <button
          onClick={() => speakText(summary)}
          className="w-full mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-md transition duration-300"
          aria-label="Listen to the summary of the article"
        >
          {isSpeaking ? "🛑 Stop Listening" : "🔊 Listen"}
        </button>

        <button
          onClick={toggleBookmark}
          className={`w-full mt-2 px-4 py-2 rounded-lg text-sm font-medium transition duration-300 shadow-md ${
            bookmarked
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-gray-200 dark:bg-gray-600 dark:text-white hover:bg-gray-300"
          }`}
          aria-label={bookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
        >
          {bookmarked ? "🔴 Remove Bookmark" : "📌 Bookmark"}
        </button>
      </div>
    </motion.div>
  );
};

export default NewsCard;
