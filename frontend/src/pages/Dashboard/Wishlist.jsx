import { useState, useEffect } from "react";
import { getWishlist, removeFromWishlist } from "../../services/userService.js";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(null);

  useEffect(() => {
    // Fetch wishlist from backend
    getWishlist()
      .then(setWishlist)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (id) => {
    try {
      await removeFromWishlist(id); // API call
      setWishlist((prev) => prev.filter((p) => p.id !== id)); // Update UI
    } catch (err) {
      console.error("Remove wishlist error:", err);
    }
  };

  const handleAdd = (id) => {
    setAdded(id);
    setTimeout(() => setAdded(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          Wishlist
          <span className="ml-2 text-sm font-bold text-gray-400">({wishlist.length} items)</span>
        </h1>
      </div>

      {wishlist.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">♡</p>
          <p className="text-sm font-medium">Your wishlist is empty</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {wishlist.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col">
            <div className="relative h-52 bg-gray-50 flex items-center justify-center p-4">
              {product.discount && (
                <div className="absolute top-2 right-2 bg-green-700 text-white text-[10px] font-bold px-2 py-1 rounded">
                  {product.discount}% OFF
                </div>
              )}
              <button
                onClick={() => handleRemove(product.id)}
                className="absolute top-2 left-2 w-7 h-7 bg-white rounded-full flex items-center justify-center text-red-500 shadow hover:bg-red-50 transition-colors text-sm"
              >
                ✕
              </button>
              {product.image_url ? (
                <img src={product.image_url} alt={product.product_name} className="w-full h-full object-contain" />
              ) : (
                <div className="text-5xl">🧴</div>
              )}
            </div>

            <div className="p-3 flex flex-col flex-1">
              <div className="flex items-center gap-1 mb-1">
                <span className="text-yellow-500 text-xs">★</span>
                <span className="text-xs font-semibold text-gray-700">{product.rating}/5</span>
                <span className="text-xs text-gray-400">({product.reviews})</span>
              </div>
              <p className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2">{product.product_name}</p>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg font-black text-gray-900">₹{product.price}</span>
                {product.original_price && (
                  <span className="text-sm text-gray-400 line-through">₹{product.original_price}</span>
                )}
              </div>

              <div className="flex h-10 mt-auto">
                <button className="w-[30%] bg-black text-white flex items-center justify-center text-lg rounded-l-xl">
                  🛒
                </button>
                <button
                  onClick={() => handleAdd(product.id)}
                  className="w-[70%] bg-[#7c9a3d] text-white font-bold text-sm rounded-r-xl"
                >
                  {added === product.id ? "✓ ADDED" : "BUY NOW"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;