import React, { useState, useEffect } from "react";
import api from "../../../../services/api";
import { useAuth } from "../../../../context/AuthContext.jsx";
import { PageWrapper, DataTable, Td, FormField, SaveBtn, inputCls, statusStyle } from "../../components/DashComponents.jsx";

export function Withdrawal() {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/dash/withdrawals");
      setHistory(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch history error:", err);
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!amount || amount < 500) {
      alert("Minimum withdrawal is ₹500.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/dash/withdraw", { amount });
      alert(res.data.message || "Withdrawal request submitted successfully!");
      setAmount("");
      fetchHistory(); // Refresh history
      // Note: Ideally refresh user context here for the balance
    } catch (err) {
      alert(err.response?.data?.message || "Withdrawal Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper title="Withdrawal Request" subtitle="Request a payout from your Commission Wallet">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-7 max-w-md">
        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
          <p className="text-xs text-slate-500 mb-1">Commission Wallet Balance</p>
          <p className="text-xl md:text-2xl font-bold text-emerald-600">₹{user?.commission_wallet || "0.00"}</p>
        </div>
        <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
          <p className="text-xs text-slate-500 mb-1">Total Withdrawn Processed</p>
          <p className="text-xl md:text-2xl font-bold text-orange-500">₹{user?.total_withdrawn || "0.00"}</p>
        </div>
      </div>

      <div className="max-w-md flex flex-col gap-5 mb-10">
        <FormField label="Withdrawal Amount (₹)">
          <input 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Min ₹500" 
            className={inputCls} 
          />
        </FormField>
        
        <SaveBtn 
          label={loading ? "Submitting..." : "Submit Request"} 
          onClick={handleWithdraw}
          loading={loading}
        />
      </div>

      <div className="mt-10">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Status</h3>
        <DataTable
          cols={["Date", "Amount", "Status"]}
          rows={history.length > 0 ? history.map((r, i) => (
            <tr key={i} className="hover:bg-slate-50 border-b border-slate-50">
              <Td>{r.created_at ? new Date(r.created_at).toLocaleDateString() : 'N/A'}</Td>
              <Td><span className="font-semibold text-orange-500">₹{r.amount}</span></Td>
              <Td>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${statusStyle[r.status] || 'bg-slate-100'}`}>
                  {r.status === 'P' ? 'Pending' : r.status === 'A' ? 'Approved' : r.status === 'R' ? 'Rejected' : r.status}
                </span>
              </Td>
            </tr>
          )) : (
            <tr>
              <Td colSpan={3} className="text-center py-12 text-slate-400 italic">
                {historyLoading ? "Loading history..." : "No withdrawal history found."}
              </Td>
            </tr>
          )}
        />
      </div>
    </PageWrapper>
  );
}

export function WithdrawalHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/dash/withdrawals");
        setHistory(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <PageWrapper title="Withdrawal History" subtitle="Full logs of your withdrawal requests">
      <DataTable
        cols={["Date", "Amount", "Method", "Details", "Status"]}
        rows={history.length > 0 ? history.map((r, i) => (
          <tr key={i} className="hover:bg-slate-50 border-b border-slate-50">
            <Td>{r.created_at ? new Date(r.created_at).toLocaleDateString() : 'N/A'}</Td>
            <Td><span className="font-semibold text-orange-500">₹{r.amount}</span></Td>
            <Td>{r.method || 'Withdrawal'}</Td>
            <Td><span className="text-xs text-slate-500">{r.details || '—'}</span></Td>
            <Td>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${statusStyle[r.status] || 'bg-slate-100'}`}>
                {r.status === 'P' ? 'Pending' : r.status === 'A' ? 'Approved' : r.status === 'R' ? 'Rejected' : r.status}
              </span>
            </Td>
          </tr>
        )) : (
          <tr>
            <Td colSpan={5} className="text-center py-12 text-slate-400 italic">
              {loading ? "Loading history..." : "No withdrawal records found."}
            </Td>
          </tr>
        )}
      />
    </PageWrapper>
  );
}