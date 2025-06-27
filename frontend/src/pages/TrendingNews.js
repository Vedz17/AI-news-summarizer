import React, { useState, useEffect } from "react";
import { fetchTrendingNews } from "../services/api";
import NewsCard from "../components/NewsCard";
import { motion } from 'framer-motion'; // Add motion for animations

const TrendingNews = () => {
  const [trendingNews, setTrendingNews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getTrendingNews = async () => {
      setLoading(true);
      const data = await fetchTrendingNews();
      console.log("🔥 Trending News Data:", data);
      setTrendingNews(data);
      setLoading(false);
    };

    getTrendingNews();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-r from-blue-100 to-indigo-200 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Trending News Title */}
      <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-600 tracking-wide">
        🔥 Trending News
      </h1>

      {/* Loading State */}
      {loading && (
        <motion.p
          className="text-center text-gray-500 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Fetching trending news...
        </motion.p>
      )}

      {/* News Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {trendingNews.length > 0 ? (
          trendingNews.map((article, index) => (
            <motion.div 
              key={index} 
              className="transition-transform transform hover:scale-105 hover:shadow-lg rounded-lg overflow-hidden bg-white dark:bg-gray-800"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <NewsCard key={index} {...article} trending={true} />
            </motion.div>
          ))
        ) : (
          <motion.p 
            className="text-center col-span-4 text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            No trending news available.
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default TrendingNews;
