import React, { useState, useEffect } from "react";
import api from "../../../../services/api";
import { PageWrapper, DataTable, Td, FormField, SaveBtn, inputCls, statusStyle } from "../../components/DashComponents.jsx";

import { useAuth } from "../../../../context/AuthContext.jsx";

export function ActivateId() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    member_id: "",
    amount: "",
    transaction_id: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleActivate = async () => {
    if (!formData.member_id || !formData.amount || !formData.transaction_id) {
      alert("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/dash/activate", formData);
      alert(res.data.message || "ID Activated Successfully!");
      setFormData({ member_id: "", amount: "", transaction_id: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Activation Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper title="Activate ID" subtitle="Activate a new member ID using Topup Wallet">
      <div className="mb-6 p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-orange-400 font-bold">Available Balance</span>
          <span className="text-2xl font-black text-orange-600">₹{user?.topup_wallet || "0.00"}</span>
        </div>
        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 text-xl">
          💰
        </div>
      </div>

      <div className="max-w-md flex flex-col gap-5">
        <FormField label="Member ID">
          <input
            type="text"
            name="member_id"
            value={formData.member_id}
            onChange={handleChange}
            placeholder="Enter member ID to activate"
            className={inputCls}
          />
        </FormField>
        <FormField label="Amount (₹)">
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter amount"
            className={inputCls}
          />
        </FormField>
        <FormField label="Transaction ID">
          <input
            type="text"
            name="transaction_id"
            value={formData.transaction_id}
            onChange={handleChange}
            placeholder="Enter payment transaction ID"
            className={inputCls}
          />
        </FormField>
        <SaveBtn
          label={loading ? "Activating..." : "Activate Now"}
          onClick={handleActivate}
          loading={loading}
        />
      </div>
    </PageWrapper>
  );
}

export function ActivationHistory() {
  const [history, setHistory] = useState([]);
  const [stakeHistory, setStakeHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
    fetchStakeHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/dash/activations");
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStakeHistory = async () => {
    try {
      const res = await api.get("/dash/stake-history");
      setStakeHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* <PageWrapper title="Activation History" subtitle="All activation records">
        <DataTable
          cols={["ID", "Name", "Date", "Pkg/Type", "Amount", "Status"]}
          rows={history.length > 0 ? history.map((r) => (
            <tr key={r.id} className="hover:bg-slate-50">
              <Td><span className="font-semibold text-orange-500">{r.referral_code}</span></Td>
              <Td>{r.member_name}</Td>
              <Td>{new Date(r.created_at).toLocaleDateString()}</Td>
              <Td>{r.package_name}</Td>
              <Td><span className="font-semibold">₹{r.amount}</span></Td>
              <Td>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[r.status] || 'bg-slate-100'}`}>
                  {r.status}
                </span>
              </Td>
            </tr>
          )) : (
            <tr><Td colSpan={6} className="text-center py-10 opacity-50 text-xs uppercase tracking-widest">No Records Found</Td></tr>
          )}
        />
      </PageWrapper> */}

      <PageWrapper title="Stake History (max_stake_history)" subtitle="Records in max_stake_history">
        <DataTable
          cols={["From ID", "To ID", "Name", "Activated By", "Amount", "Date"]}
          rows={
            stakeHistory.length > 0 ? stakeHistory.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50">
                <Td><span className="font-semibold text-orange-500">{r.userid}</span></Td>

                <Td><span className="font-semibold text-orange-500">{r.toid}</span></Td>
                <Td>{r.member_name}</Td>
                <Td>{r.activated_by_name}</Td>
                <Td><span className="font-semibold">₹{r.amount}</span></Td>
                <Td>{new Date(r.created_at).toLocaleDateString()}</Td>
              </tr>
            )) : (
              <tr><Td colSpan={6} className="text-center py-10 opacity-50 text-xs uppercase tracking-widest">No Records Found</Td></tr>
            )
          }
        />
      </PageWrapper>
    </div>
  );
}
