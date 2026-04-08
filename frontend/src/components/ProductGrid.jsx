import { useState } from "react";
import { concernProducts, bestsellers } from "../data/products";
import { reviews } from "../data/reviews";

const ProductGrid = ({ activeCategory }) => {
  const [added, setAdded] = useState(null);

  const currentProducts = concernProducts[activeCategory] || [];
  const currentReviews = reviews[activeCategory] || [];

  const handleAdd = (id) => {
    setAdded(id);
    setTimeout(() => setAdded(null), 2000);
  };

  return (
    <div className="bg-white ">
      {/* ══ 1. CONCERN PRODUCTS ══ */}
      <div className="py-6 px-3 sm:px-6 md:px-10 lg:px-20">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900">{activeCategory}</h2>
          <button className="text-sm text-green-700 font-semibold hover:underline">
            View all
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {currentProducts.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              added={added}
              onAdd={handleAdd}
            />
          ))}
        </div>

        <div className="text-center mt-5">
          <button className="text-sm text-green-700 font-semibold hover:underline">
            View all {activeCategory} products
          </button>
        </div>
      </div>

      {/* ══ 2. REAL PEOPLE REAL STORIES ══ */}
      {currentReviews.length > 0 && (
        <div className="bg-gray-50 py-6 px-3 sm:px-6 md:px-10 lg:px-20">
          <h2 className="text-xl font-bold text-gray-900 mb-5">
            Real people, real stories
          </h2>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {currentReviews.map((review) => (
              <div
                key={review.id}
                className="border border-gray-200 rounded-xl bg-white p-4 shrink-0"
                style={{ width: 200 }}
              >
                <div className="relative flex items-center justify-center px-2 sm:px-4 py-2 sm:py-4 h-[150px] sm:h-[200px] md:h-[240px] bg-gray-50">
                  {review.image ? (
                    <img
                      src={review.image}
                      alt={review.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-base sm:text-lg font-bold text-black">
                      🧴
                    </span>
                  )}
                </div>
                <div className="flex gap-0.5 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-sm ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-gray-800 font-medium mb-2 line-clamp-2">
                  {review.name}
                </p>
                <p
                  className="text-xs text-gray-500 leading-relaxed"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ 3. KAPIVA BESTSELLERS ══ */}
      <div className="py-6 px-3 sm:px-6 md:px-10 lg:px-20">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900">
            Kapiva Bestsellers
          </h2>
          <button className="text-sm text-green-700 font-semibold hover:underline">
            View all
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {bestsellers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              added={added}
              onAdd={handleAdd}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product, added, onAdd }) => {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 bg-white flex flex-col">
      <div className="relative flex items-center justify-center px-4 py-4 h-[260px] bg-gray-50">
        {/* LEFT: Rating */}
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/90 backdrop-blur px-2 py-1 rounded-full shadow-sm">
          <span className="text-yellow-500 text-xs">★</span>
          <span className="text-xs font-semibold text-gray-700">
            {product.rating}/5
          </span>
          <span className="text-xs text-gray-400">({product.reviews})</span>
        </div>

        {/* RIGHT: Discount */}
        <div className="absolute top-2 right-2 bg-green-700 text-white text-[10px] font-bold px-2 py-1 rounded">
          {product.discount}% OFF
        </div>

        {/* IMAGE */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Content */}
      <div className="px-3 py-3 flex flex-col flex-1">
        <p className="text-sm text-gray-800 font-medium mb-2 line-clamp-2">
          {product.name}
        </p>

        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg font-bold text-black">₹{product.price}</span>
          <span className="text-sm text-gray-400 line-through">
            ₹{product.originalPrice}
          </span>
        </div>

        <p className="inline-flex items-center w-fit text-xs text-gray-500 mb-2 bg-[#edefe5] px-2 py-[8px] rounded-full leading-none">
          <span>Earn 🪙</span>
          <span className="font-semibold ml-1">
            {Math.floor(product.price * 0.05)} Coins
          </span>
        </p>

        <p className="text-xs text-gray-600 font-bold mb-3 bg-[#f5f5f5] px-2 py-2 rounded">
          Delivered by 19 - 20 Mar
        </p>
      </div>

      {/* Bottom CTA (IMPORTANT UI) */}
      <div className="flex h-[40px] sm:h-[50px] font-semibold tracking-wide">
        <button className="w-[35%] sm:w-[30%] bg-black text-white flex items-center justify-center text-xl sm:text-2xl">
          🛒
        </button>

        <button className="w-[65%] sm:w-[70%] bg-[#7c9a3d] text-white font-bold text-sm sm:text-base md:text-lg">
          {added === product.id ? "✓ ADDED" : "BUY NOW"}
        </button>
      </div>
    </div>
  );
};

export default ProductGrid;
