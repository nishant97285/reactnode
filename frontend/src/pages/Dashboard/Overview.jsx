import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { getOrders } from "../../services/orderService.js";
import { getCoins, getWishlist, getAddresses } from "../../services/userService.js";

const statusColor = {
  Delivered: "bg-green-100 text-green-700",
  "In Transit": "bg-yellow-100 text-yellow-700",
  Pending: "bg-blue-100 text-blue-700",
  Cancelled: "bg-red-100 text-red-600",
};

const Overview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [coins, setCoins] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [addressCount, setAddressCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // All APIs called simultaneously - faster than one by one
        const [ordersData, coinsData, wishlistData, addressData] = await Promise.all([
          getOrders(),
          getCoins(),
          getWishlist(),
          getAddresses(),
        ]);
        setOrders(ordersData);
        setCoins(coinsData.coins);
        setWishlistCount(wishlistData.length);
        setAddressCount(addressData.length);
      } catch (err) {
        console.error("Overview fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const stats = [
    { label: "Total Orders",    value: orders.length, icon: "📦", path: "/dashboard/orders" },
    { label: "Wishlist Items",  value: wishlistCount,  icon: "♡",  path: "/dashboard/wishlist" },
    { label: "Kapiva Coins",    value: coins,           icon: "🪙", path: "/dashboard/coins" },
    { label: "Saved Addresses", value: addressCount,    icon: "📍", path: "/dashboard/addresses" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          Welcome back, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">Here's what's happening with your account</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            onClick={() => navigate(stat.path)}
            className="bg-white rounded-2xl p-4 border border-gray-200 cursor-pointer hover:border-green-400 hover:shadow-md transition-all duration-200 group"
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <p className="text-2xl font-black text-gray-900 group-hover:text-green-600 transition-colors">
              {stat.value}
            </p>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-black rounded-2xl p-5 mb-8 flex items-center justify-between">
        <div>
          <p className="text-white font-black text-lg">🪙 {coins} Kapiva Coins</p>
          <p className="text-gray-400 text-xs mt-1">Use coins to get extra discounts on your next order</p>
        </div>
        <button
          onClick={() => navigate("/dashboard/coins")}
          className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors shrink-0"
        >
          View Details
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Recent Orders</h2>
          <button onClick={() => navigate("/dashboard/orders")} className="text-xs text-green-600 font-semibold hover:underline">
            View all
          </button>
        </div>
        {orders.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">No orders yet</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {orders.slice(0, 3).map((order) => (
              <div key={order.id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-green-600">#KAP{order.id}</p>
                  <p className="text-sm font-medium text-gray-800 truncate">{order.product_name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5 ml-4 shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor[order.status] || "bg-gray-100 text-gray-600"}`}>
                    {order.status}
                  </span>
                  <span className="text-sm font-black text-gray-900">₹{order.price}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Overview;