// ── Shared reusable components for dashboard pages ──

export const statusStyle = {
  Active: "bg-emerald-100 text-emerald-700",
  Inactive: "bg-red-100 text-red-600",
  Expired: "bg-red-100 text-red-600",
  Paid: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Processing: "bg-blue-100 text-blue-700",
  A: "bg-emerald-100 text-emerald-700",
  P: "bg-amber-100 text-amber-700",
};

export const inputCls =
  "px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:border-orange-400 transition-colors";

// Page wrapper with title and subtitle
export function PageWrapper({ title, subtitle, children }) {
  return (
    <div className="bg-white rounded-2xl p-4 md:p-7 shadow-sm border border-slate-100">
      <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-1">{title}</h2>
      <p className="text-xs md:text-sm text-slate-400 mb-5 md:mb-7">{subtitle}</p>
      {children}
    </div>
  );
}

// Form field with label
export function FormField({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}

// Save / submit button
export function SaveBtn({ label = "Save Changes", onClick, loading = false }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="mt-6 px-7 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-xl transition-colors disabled:opacity-60"
    >
      {loading ? "Please wait..." : label}
    </button>
  );
}

// Data table with dark header
export function DataTable({ cols, rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#1a2744] text-white text-xs">
            {cols.map((c, i) => (
              <th
                key={c}
                className={`py-3 px-4 text-left font-medium
                  ${i === 0 ? "rounded-l-lg" : ""}
                  ${i === cols.length - 1 ? "rounded-r-lg" : ""}`}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}

// Table cell
export function Td({ children, className = "" }) {
  return (
    <td className={`py-3 px-4 border-b border-slate-100 text-slate-600 ${className}`}>
      {children}
    </td>
  );
}

// Stat card for dashboard home
export function StatCard({ label, value, change, icon, color, bg }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className={`w-11 h-11 ${bg} rounded-full flex items-center justify-center text-xl mb-3`}>
        {icon}
      </div>
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color} mb-1`}>{value}</p>
      <p className="text-xs text-slate-400">{change}</p>
    </div>
  );
}