import { PageWrapper, DataTable, Td, statusStyle } from "../../components/DashComponents.jsx";

// In real app — fetch from GET /api/user/team/direct and /api/user/team/all
const teamData = [
  { id: "KP1001", name: "Rahul Sharma",  joining: "10 Jan 2026", status: "Active",   level: "L1" },
  { id: "KP1002", name: "Priya Mehta",   joining: "15 Jan 2026", status: "Active",   level: "L1" },
  { id: "KP1003", name: "Amit Singh",    joining: "20 Jan 2026", status: "Inactive", level: "L1" },
  { id: "KP1004", name: "Sneha Patel",   joining: "25 Jan 2026", status: "Active",   level: "L1" },
  { id: "KP1005", name: "Vikas Rao",     joining: "01 Feb 2026", status: "Active",   level: "L1" },
];

const allTeamData = [
  ...teamData,
  { id: "KP1006", name: "Deepak Joshi",  joining: "05 Feb 2026", status: "Active",   level: "L2" },
  { id: "KP1007", name: "Anjali Gupta",  joining: "10 Feb 2026", status: "Active",   level: "L2" },
  { id: "KP1008", name: "Suresh Yadav",  joining: "14 Feb 2026", status: "Inactive", level: "L3" },
  { id: "KP1009", name: "Meena Tiwari",  joining: "18 Feb 2026", status: "Active",   level: "L3" },
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

export function DirectTeam() { return <TeamTable data={teamData}    title="Direct Team" />; }
export function AllTeam()    { return <TeamTable data={allTeamData} title="All Team" />; }