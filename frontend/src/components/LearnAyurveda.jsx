import { useState } from "react";
import { articles } from "../data/learnAyurveda";


const VISIBLE = 3;

const LearnAyurveda = () => {
  const [startIndex, setStartIndex] = useState(0);

  const prev = () => {
    setStartIndex((prev) => Math.max(prev - 1, 0));
  };

  const next = () => {
    setStartIndex((prev) =>
      prev + VISIBLE < articles.length ? prev + 1 : prev
    );
  };

  const visibleArticles = articles.slice(startIndex, startIndex + VISIBLE);

  return (
    <div className="bg-white py-10 px-4 border-t border-gray-100">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Learn more about Ayurveda
        </h2>

        {/* Slider wrapper */}
        <div className="relative flex items-center">

          {/* Left Arrow */}
          <button
            onClick={prev}
            disabled={startIndex === 0}
            className={`absolute -left-8 z-10 w-12 h-12 rounded-full border border-gray-300 bg-white flex items-center justify-center shadow-md transition-all text-xl font-bold ${
              startIndex === 0
                ? "opacity-30 cursor-not-allowed"
                : "hover:shadow-lg hover:border-gray-500"
            }`}
          >
            ‹
          </button>

          {/* Cards */}
          <div className="grid grid-cols-3 gap-5 w-full">
            {visibleArticles.map((article) => (
              <div
                key={article.id}
                className="cursor-pointer group"
              >
                {/* Image */}
                <div className="rounded-xl overflow-hidden mb-3" style={{ height: 200 }}>
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Category */}
                <p
                  className="text-xs font-bold uppercase tracking-wide mb-1"
                  style={{ color: "#c8972a" }}
                >
                  {article.category}
                </p>

                {/* Title */}
                <p className="text-sm font-bold text-gray-900 leading-snug mb-1 group-hover:text-green-700 transition-colors">
                  {article.title}
                </p>

                {/* Date */}
                <p className="text-xs font-bold text-gray-700">{article.date}</p>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={next}
            disabled={startIndex + VISIBLE >= articles.length}
            className={`absolute -right-8 z-10 w-12 h-12 rounded-full border border-gray-300 bg-white flex items-center justify-center shadow-md transition-all text-xl font-bold ${
              startIndex + VISIBLE >= articles.length
                ? "opacity-30 cursor-not-allowed"
                : "hover:shadow-lg hover:border-gray-500"
            }`}
          >
            ›
          </button>

        </div>

        {/* Read all articles */}
        <div className="text-center mt-8">
          <button
            className="text-sm font-semibold hover:underline"
            style={{ color: "#c8972a" }}
          >
            Read all articles
          </button>
        </div>

      </div>
    </div>
  );
};

export default LearnAyurveda;