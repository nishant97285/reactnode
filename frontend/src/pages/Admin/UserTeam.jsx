import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserTeam, getUserById } from "../../services/adminService.js";

// Recursive component to render each level
const TeamNode = ({ member, depth = 0 }) => {
  const [expanded, setExpanded] = useState(depth < 2); // Auto expand first 2 levels

  return (
    <div className={`${depth > 0 ? "ml-6 border-l border-gray-800 pl-4" : ""}`}>
      <div
        className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-gray-800/50 transition-colors cursor-pointer group"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          {/* Level indicator */}
          <span className="text-[10px] font-black text-gray-600 w-4">L{depth + 1}</span>
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs font-black">
            {member.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{member.name}</p>
            <p className="text-xs text-gray-500">{member.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-green-400 font-black bg-green-500/10 px-2 py-0.5 rounded-full">
            {member.referral_code}
          </span>
          <span className="text-xs text-yellow-400">🪙 {member.coins}</span>
          {member.team?.length > 0 && (
            <span className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors">
              {expanded ? "▲" : "▼"} {member.team.length} members
            </span>
          )}
        </div>
      </div>

      {/* Render children recursively */}
      {expanded && member.team?.length > 0 && (
        <div className="mt-1">
          {member.team.map((child) => (
            <TeamNode key={child.id} member={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const UserTeam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, team] = await Promise.all([getUserById(id), getUserTeam(id)]);
        setUser(userData);
        setTeamData(team);
      } catch (err) {
        console.error("Team fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="text-gray-400 hover:text-white transition-colors text-sm"
        >
          ← Back
        </button>
        <div>
          <h1 className="font-black text-white">{user?.name}'s Team</h1>
          <p className="text-xs text-gray-500">{user?.referral_code} · {teamData?.total_members || 0} total members</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4 text-center">
            <p className="text-2xl font-black text-white">{teamData?.total_members || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Total Members</p>
          </div>
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4 text-center">
            <p className="text-2xl font-black text-green-400">{teamData?.team?.length || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Direct Members</p>
          </div>
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4 text-center">
            <p className="text-2xl font-black text-purple-400">{user?.referral_code}</p>
            <p className="text-xs text-gray-500 mt-1">Referral Code</p>
          </div>
        </div>

        {/* Team Tree */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
          <h2 className="font-bold text-white mb-4">Team Tree</h2>
          {teamData?.team?.length === 0 ? (
            <p className="text-center py-10 text-gray-500 text-sm">No team members yet</p>
          ) : (
            <div>
              {teamData?.team?.map((member) => (
                <TeamNode key={member.id} member={member} depth={0} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserTeam;