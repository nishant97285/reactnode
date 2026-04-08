import { useState } from "react";
import { categories } from "../data/categories";

const CategoryBar = ({ activeCategory, onCategoryChange }) => {
  const [showAll, setShowAll] = useState(false);

  // 👇 Sirf 3 items initially
  const visibleCategories = showAll ? categories : categories.slice(0, 3);

  return (
    <div className="bg-white border-b border-gray-200 py-4 shadow-sm px-4 md:px-22">
      <div className="max-w-7xl mx-auto">

        <div className="flex items-start gap-2 flex-wrap">
          
          {/* Label */}
          <div className="flex items-center gap-1.5 font-bold text-sm py-2 shrink-0">
            <svg
              className="w-6 h-5 text-green-700"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M3 4h18v2l-7 7v7l-4-2v-5L3 6V4z" />
            </svg>
            <span className="whitespace-nowrap font-jost text-[14px]">
              SELECT CONCERN:
            </span>
          </div>

          {/* Categories */}
          {visibleCategories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => onCategoryChange(cat.label)}
              className={`flex items-center gap-2 pl-2 pr-4 py-2 border text-sm font-medium whitespace-nowrap transition-all duration-200 rounded-md
              ${
                activeCategory === cat.label
                  ? "bg-[#ecf1e2] border-[#a3ba72] text-gray-800"
                  : "bg-white border-[#a3ba72] text-gray-700"
              }`}
            >
              <div className="w-8 h-8 rounded-sm overflow-hidden bg-gray-200 flex items-center justify-center">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-xs">👤</span>
                )}
              </div>

              {activeCategory === cat.label && (
                <span className="text-green-600 text-xs">✓</span>
              )}

              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* See More / Less */}
        {categories.length > 3 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="mt-2 text-sm text-orange-600 font-medium"
          >
            {showAll ? "See less ▲" : "See more ▼"}
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryBar;