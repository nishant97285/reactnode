import React from "react";

// ── Shared helpers ──────────────────────────────────────────────────────────

const statusStyle = {
  Active: "bg-emerald-100 text-emerald-700",
  Inactive: "bg-red-100 text-red-600",
  Expired: "bg-red-100 text-red-600",
  Paid: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Processing: "bg-blue-100 text-blue-700",
};

function PageWrapper({ title, subtitle, children }) {
  return (
    <div className="bg-white rounded-2xl p-7 shadow-sm">
      <h2 className="text-xl font-bold text-slate-800 mb-1">{title}</h2>
      <p className="text-sm text-slate-400 mb-7">{subtitle}</p>
      {children}
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  "px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:border-orange-400 transition-colors";

function SaveBtn({ label = "Save Changes" }) {
  return (
    <button className="mt-6 px-7 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-xl transition-colors">
      {label}
    </button>
  );
}

function DataTable({ cols, rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#1a2744] text-white text-xs">
            {cols.map((c, i) => (
              <th
                key={c}
                className={`py-3 px-4 text-left font-medium ${
                  i === 0 ? "rounded-l-lg" : i === cols.length - 1 ? "rounded-r-lg" : ""
                }`}
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

function Td({ children, className = "" }) {
  return (
    <td className={`py-3 px-4 border-b border-slate-100 text-slate-600 ${className}`}>
      {children}
    </td>
  );
}

// ── PROFILE ─────────────────────────────────────────────────────────────────

export function EditProfile() {
  return (
    <PageWrapper title="Edit Profile" subtitle="Update your personal information">
      <div className="grid grid-cols-2 gap-5">
        {[
          { label: "Full Name", type: "text", val: "Vivek Kumar" },
          { label: "Email", type: "email", val: "vivek@example.com" },
          { label: "Phone", type: "tel", val: "+91 9876543210" },
          { label: "City", type: "text", val: "Chandigarh" },
          { label: "State", type: "text", val: "Punjab" },
          { label: "Pincode", type: "text", val: "160001" },
        ].map((f) => (
          <FormField key={f.label} label={f.label}>
            <input type={f.type} defaultValue={f.val} className={inputCls} />
          </FormField>
        ))}
      </div>
      <SaveBtn />
    </PageWrapper>
  );
}

export function ChangePassword() {
  return (
    <PageWrapper title="Change Password" subtitle="Keep your account secure">
      <div className="max-w-md flex flex-col gap-5">
        {["Current Password", "New Password", "Confirm New Password"].map((l) => (
          <FormField key={l} label={l}>
            <input type="password" placeholder={`Enter ${l.toLowerCase()}`} className={inputCls} />
          </FormField>
        ))}
        <SaveBtn label="Update Password" />
      </div>
    </PageWrapper>
  );
}

// ── TEAM ─────────────────────────────────────────────────────────────────────

const teamData = [
  { id: "KP1001", name: "Rahul Sharma", joining: "10 Jan 2026", status: "Active", level: "L1" },
  { id: "KP1002", name: "Priya Mehta", joining: "15 Jan 2026", status: "Active", level: "L1" },
  { id: "KP1003", name: "Amit Singh", joining: "20 Jan 2026", status: "Inactive", level: "L1" },
  { id: "KP1004", name: "Sneha Patel", joining: "25 Jan 2026", status: "Active", level: "L1" },
  { id: "KP1005", name: "Vikas Rao", joining: "01 Feb 2026", status: "Active", level: "L1" },
];

const allTeamData = [
  ...teamData,
  { id: "KP1006", name: "Deepak Joshi", joining: "05 Feb 2026", status: "Active", level: "L2" },
  { id: "KP1007", name: "Anjali Gupta", joining: "10 Feb 2026", status: "Active", level: "L2" },
  { id: "KP1008", name: "Suresh Yadav", joining: "14 Feb 2026", status: "Inactive", level: "L3" },
  { id: "KP1009", name: "Meena Tiwari", joining: "18 Feb 2026", status: "Active", level: "L3" },
];

function TeamTable({ data, title }) {
  return (
    <PageWrapper title={title} subtitle={`${data.length} members found`}>
      <DataTable
        cols={["Member ID", "Name", "Joining Date", "Level", "Status"]}
        rows={data.map((r) => (
          <tr key={r.id} className="hover:bg-slate-50">
            <Td><span className="font-semibold text-orange-500">{r.id}</span></Td>
            <Td>{r.name}</Td>
            <Td>{r.joining}</Td>
            <Td>
              <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                {r.level}
              </span>
            </Td>
            <Td>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[r.status]}`}>
                {r.status}
              </span>
            </Td>
          </tr>
        ))}
      />
    </PageWrapper>
  );
}

export function DirectTeam() { return <TeamTable data={teamData} title="Direct Team" />; }
export function AllTeam() { return <TeamTable data={allTeamData} title="All Team" />; }

// ── ACTIVATION ───────────────────────────────────────────────────────────────

export function ActivateId() {
  return (
    <PageWrapper title="Activate ID" subtitle="Activate a new member ID">
      <div className="max-w-md flex flex-col gap-5">
        <FormField label="Member ID">
          <input type="text" placeholder="Enter member ID to activate" className={inputCls} />
        </FormField>
        <FormField label="Package">
          <select className={inputCls}>
            <option>Basic — ₹999</option>
            <option>Silver — ₹2,999</option>
            <option>Gold — ₹5,999</option>
            <option>Platinum — ₹9,999</option>
          </select>
        </FormField>
        <FormField label="Transaction ID">
          <input type="text" placeholder="Enter payment transaction ID" className={inputCls} />
        </FormField>
        <SaveBtn label="Activate Now" />
      </div>
    </PageWrapper>
  );
}

const activationHistory = [
  { id: "KP1001", name: "Rahul Sharma", date: "10 Jan 2026", pkg: "Gold", amount: "₹5,999", status: "Active" },
  { id: "KP1002", name: "Priya Mehta", date: "15 Jan 2026", pkg: "Silver", amount: "₹2,999", status: "Active" },
  { id: "KP1003", name: "Amit Singh", date: "20 Jan 2026", pkg: "Basic", amount: "₹999", status: "Expired" },
  { id: "KP1004", name: "Sneha Patel", date: "25 Jan 2026", pkg: "Platinum", amount: "₹9,999", status: "Active" },
];

export function ActivationHistory() {
  return (
    <PageWrapper title="Activation History" subtitle="All activation records">
      <DataTable
        cols={["ID", "Name", "Date", "Package", "Amount", "Status"]}
        rows={activationHistory.map((r) => (
          <tr key={r.id} className="hover:bg-slate-50">
            <Td><span className="font-semibold text-orange-500">{r.id}</span></Td>
            <Td>{r.name}</Td>
            <Td>{r.date}</Td>
            <Td>{r.pkg}</Td>
            <Td><span className="font-semibold">{r.amount}</span></Td>
            <Td>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[r.status]}`}>
                {r.status}
              </span>
            </Td>
          </tr>
        ))}
      />
    </PageWrapper>
  );
}

// ── INCOME ───────────────────────────────────────────────────────────────────

const incomeData = [
  { date: "22 Mar 2026", type: "Referral Income", from: "Rahul Sharma", amount: "₹1,476", status: "Paid" },
  { date: "21 Mar 2026", type: "Direct Income", from: "Priya Mehta", amount: "₹980", status: "Paid" },
  { date: "20 Mar 2026", type: "Level Bonus", from: "System", amount: "₹2,200", status: "Paid" },
  { date: "19 Mar 2026", type: "Referral Income", from: "Sneha Patel", amount: "₹560", status: "Paid" },
  { date: "18 Mar 2026", type: "Direct Income", from: "Vikas Rao", amount: "₹1,100", status: "Processing" },
];

function IncomeTable({ data, title, subtitle }) {
  return (
    <PageWrapper title={title} subtitle={subtitle}>
      <DataTable
        cols={["Date", "Type", "From", "Amount", "Status"]}
        rows={data.map((r, i) => (
          <tr key={i} className="hover:bg-slate-50">
            <Td>{r.date}</Td>
            <Td>{r.type}</Td>
            <Td>{r.from}</Td>
            <Td><span className="font-semibold text-emerald-600">{r.amount}</span></Td>
            <Td>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[r.status]}`}>
                {r.status}
              </span>
            </Td>
          </tr>
        ))}
      />
    </PageWrapper>
  );
}

export function AllIncome() {
  return <IncomeTable data={incomeData} title="All Income" subtitle="Complete income history" />;
}

export function ReferralIncome() {
  return (
    <IncomeTable
      data={incomeData.filter((r) => r.type === "Referral Income")}
      title="Referral Income"
      subtitle="Income earned through referrals"
    />
  );
}

// ── WITHDRAWAL ───────────────────────────────────────────────────────────────

export function Withdrawal() {
  return (
    <PageWrapper title="Withdrawal Request" subtitle="Request a payout to your bank account">
      <div className="grid grid-cols-2 gap-4 mb-7 max-w-md">
        <div className="bg-emerald-50 rounded-xl p-4">
          <p className="text-xs text-slate-500 mb-1">Available Balance</p>
          <p className="text-2xl font-bold text-emerald-600">₹9,470</p>
        </div>
        <div className="bg-orange-50 rounded-xl p-4">
          <p className="text-xs text-slate-500 mb-1">Total Withdrawn</p>
          <p className="text-2xl font-bold text-orange-500">₹24,300</p>
        </div>
      </div>
      <div className="max-w-md flex flex-col gap-5">
        <FormField label="Withdrawal Amount (₹)">
          <input type="number" placeholder="Enter amount" min="500" className={inputCls} />
        </FormField>
        <FormField label="Bank Account Number">
          <input type="text" placeholder="Enter account number" className={inputCls} />
        </FormField>
        <FormField label="IFSC Code">
          <input type="text" placeholder="Enter IFSC code" className={inputCls} />
        </FormField>
        <FormField label="UPI ID (optional)">
          <input type="text" placeholder="yourname@upi" className={inputCls} />
        </FormField>
        <SaveBtn label="Submit Request" />
      </div>
    </PageWrapper>
  );
}

const withdrawHistory = [
  { date: "15 Mar 2026", amount: "₹5,000", method: "Bank Transfer", txn: "TXN001234", status: "Paid" },
  { date: "01 Mar 2026", amount: "₹8,000", method: "UPI", txn: "TXN001100", status: "Paid" },
  { date: "15 Feb 2026", amount: "₹3,500", method: "Bank Transfer", txn: "TXN000987", status: "Paid" },
  { date: "01 Feb 2026", amount: "₹7,800", method: "Bank Transfer", txn: "TXN000876", status: "Processing" },
];

export function WithdrawalHistory() {
  return (
    <PageWrapper title="Withdrawal History" subtitle="All withdrawal transactions">
      <DataTable
        cols={["Date", "Amount", "Method", "Transaction ID", "Status"]}
        rows={withdrawHistory.map((r, i) => (
          <tr key={i} className="hover:bg-slate-50">
            <Td>{r.date}</Td>
            <Td><span className="font-semibold text-orange-500">{r.amount}</span></Td>
            <Td>{r.method}</Td>
            <Td><span className="font-mono text-xs text-slate-500">{r.txn}</span></Td>
            <Td>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[r.status]}`}>
                {r.status}
              </span>
            </Td>
          </tr>
        ))}
      />
    </PageWrapper>
  );
}

// ── SUPPORT ──────────────────────────────────────────────────────────────────

export function Support() {
  return (
    <PageWrapper title="Support" subtitle="Raise a ticket or contact us">
      <div className="max-w-lg flex flex-col gap-5">
        <FormField label="Subject">
          <input type="text" placeholder="Brief subject of your issue" className={inputCls} />
        </FormField>
        <FormField label="Category">
          <select className={inputCls}>
            <option>Payment Issue</option>
            <option>Account Problem</option>
            <option>Team Query</option>
            <option>Technical Issue</option>
            <option>Other</option>
          </select>
        </FormField>
        <FormField label="Message">
          <textarea
            rows={5}
            placeholder="Describe your issue in detail..."
            className={`${inputCls} resize-y`}
          />
        </FormField>
        <SaveBtn label="Submit Ticket" />
      </div>
    </PageWrapper>
  );
}