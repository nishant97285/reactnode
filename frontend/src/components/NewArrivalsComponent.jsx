import { useState } from "react";
import { newArrivals } from "../data/newArrival";

const NewArrivals = () => {
  const [added, setAdded] = useState(null);

  const handleAdd = (id) => {
    setAdded(id);
    setTimeout(() => setAdded(null), 2000);
  };

  return (
    <div className="bg-white py-10 px-4 border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">New Arrivals</h2>
          <button className="text-sm text-green-700 font-semibold hover:underline">
            View all
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} added={added} onAdd={handleAdd} />
          ))}
        </div>

        <div className="text-center mt-6">
          <button className="text-sm text-green-700 font-semibold hover:underline">
            View all New Arrivals
          </button>
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
          <span className="text-xs font-semibold text-gray-700">{product.rating}/5</span>
          <span className="text-xs text-gray-400">({product.reviews})</span>
        </div>

        {/* RIGHT: Discount */}
        {product.discount && (
          <div className="absolute top-2 right-2 bg-green-700 text-white text-[10px] font-bold px-2 py-1 rounded">
            {product.discount}% OFF
          </div>
        )}

        {/* BOGO */}
        {product.bogo && (
          <div className="absolute top-10 right-2 bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded text-center leading-tight">
            🎁 BOGO <br /> Buy 1 Get 1
          </div>
        )}

        <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
      </div>

      {/* Content */}
      <div className="px-3 py-3 flex flex-col flex-1">
        <p className="text-sm text-gray-800 font-medium mb-2 line-clamp-2">{product.name}</p>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg font-bold text-black">₹{product.price}</span>
          {product.originalPrice && <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>}
        </div>

        <p className="inline-flex items-center w-fit text-xs text-gray-500 mb-2 bg-[#edefe5] px-2 py-[8px] rounded-full leading-none">
          <span>Earn 🪙</span>
          <span className="font-semibold ml-1">{product.coins} Coins</span>
        </p>

        {!product.outOfStock && <p className="text-xs text-gray-600 font-bold mb-3 bg-[#f5f5f5] px-2 py-2 rounded">Delivered by 19 - 20 Mar</p>}
      </div>

      {/* Bottom CTA */}
      <div className="flex h-[40px] sm:h-[50px] font-semibold tracking-wide">
        {product.outOfStock ? (
          <button className="w-full bg-gray-300 text-gray-600 flex items-center justify-center text-xs font-bold cursor-not-allowed">
            OUT OF STOCK
          </button>
        ) : (
          <>
            <button className="w-[35%] sm:w-[30%] bg-black text-white flex items-center justify-center text-xl sm:text-2xl">
              🛒
            </button>
            <button
              className="w-[65%] sm:w-[70%] bg-[#7c9a3d] text-white font-bold text-sm sm:text-base md:text-lg"
              onClick={() => onAdd(product.id)}
            >
              {added === product.id ? "✓ ADDED" : "BUY NOW"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default NewArrivals;