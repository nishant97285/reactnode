import { PageWrapper, DataTable, Td, statusStyle } from "../../components/DashComponents.jsx";

// In real app — fetch from GET /api/user/income
const incomeData = [
  { date: "22 Mar 2026", type: "Referral Income", from: "Rahul Sharma", amount: "₹1,476", status: "Paid" },
  { date: "21 Mar 2026", type: "Direct Income",   from: "Priya Mehta",  amount: "₹980",   status: "Paid" },
  { date: "20 Mar 2026", type: "Level Bonus",     from: "System",       amount: "₹2,200", status: "Paid" },
  { date: "19 Mar 2026", type: "Referral Income", from: "Sneha Patel",  amount: "₹560",   status: "Paid" },
  { date: "18 Mar 2026", type: "Direct Income",   from: "Vikas Rao",    amount: "₹1,100", status: "Processing" },
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