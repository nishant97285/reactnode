import { useState, useEffect } from "react";
import { getOrders } from "../../services/orderService.js";

const statusColor = {
  Delivered: "bg-green-100 text-green-700",
  "In Transit": "bg-yellow-100 text-yellow-700",
  Pending: "bg-blue-100 text-blue-700",
  Cancelled: "bg-red-100 text-red-600",
};

const filters = ["All", "Delivered", "In Transit", "Pending", "Cancelled"];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [active, setActive] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch orders from backend on component mount
    getOrders()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Filter locally — no extra API call needed
  const filtered = active === "All"
    ? orders
    : orders.filter((o) => o.status === active);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-black text-gray-900 mb-6 tracking-tight">My Orders</h1>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`text-xs font-bold px-4 py-2 rounded-full border transition-all duration-200
              ${active === f
                ? "bg-black text-white border-black"
                : "bg-white text-gray-600 border-gray-300 hover:border-gray-500"
              }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400 text-sm">No orders found</div>
        )}
        {filtered.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-black text-green-600">#KAP{order.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor[order.status] || "bg-gray-100 text-gray-600"}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-800">{order.product_name}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Qty: {order.qty} &nbsp;·&nbsp;
                  {new Date(order.created_at).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </p>
              </div>
              <p className="text-lg font-black text-gray-900 shrink-0">₹{order.price}</p>
            </div>

            <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
              {order.status === "Delivered" && (
                <>
                  <button className="text-xs font-bold text-green-600 border border-green-500 px-3 py-1.5 rounded-full hover:bg-green-50 transition-colors">
                    Reorder
                  </button>
                  <button className="text-xs font-bold text-gray-600 border border-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors">
                    Write Review
                  </button>
                </>
              )}
              {order.status === "In Transit" && (
                <button className="text-xs font-bold text-yellow-600 border border-yellow-400 px-3 py-1.5 rounded-full hover:bg-yellow-50 transition-colors">
                  Track Order
                </button>
              )}
              {order.status === "Cancelled" && (
                <button className="text-xs font-bold text-gray-500 border border-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors">
                  View Details
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;