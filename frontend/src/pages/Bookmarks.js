import React, { useState, useEffect } from "react";
import NewsCard from "../components/NewsCard";
import { getBookmarks } from "../services/bookmarkService";
import { Link } from "react-router-dom";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  return (
    <div className="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 dark:bg-gray-900 min-h-screen p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
        📌 Saved Bookmarks
      </h1>

      {/* Back to News Button */}
      <div className="text-center mb-6">
        <Link
          to="/"
          className="bg-gradient-to-r from-teal-400 to-teal-500 text-white px-6 py-3 rounded-lg shadow-lg hover:from-teal-500 hover:to-teal-600 transition-transform transform hover:scale-105 duration-300"
        >
          ⬅ Back to News
        </Link>
      </div>

      {/* Bookmarks Section */}
      {bookmarks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bookmarks.map((article, index) => (
            <div key={index} className="flex justify-center">
              <NewsCard {...article} />
            </div>
          ))}
        </div>
      ) : (
        // Empty State Message with Illustration
        <div className="flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400">
          <svg
            className="w-32 h-32 text-gray-400 dark:text-gray-500 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 10V3l4 4-4 4m4-4H7"
            />
          </svg>
          <p className="text-xl mb-4 font-semibold">No Bookmarks Saved</p>
          <p className="text-lg">Go to the news section and save articles to your list to read later.</p>
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
