import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Users, Plus, Shield, Mail } from 'lucide-react';

export default function TeamsPage() {
  const { activeWorkspace } = useAuth();
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!activeWorkspace?.id) return;
    setLoading(true);
    try {
      const teamsRes = await api.get(`/teams?workspace_id=${activeWorkspace.id}`);
      setTeams(teamsRes.teams || []);

      const memRes = await api.get(`/workspaces/${activeWorkspace.id}/members`);
      setMembers(memRes.members || []);
    } catch (err) {
      console.warn(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeWorkspace?.id]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Users className="w-6 h-6 text-white" />
          Teams & Members
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Collaborators, department teams, and role-based permissions in {activeWorkspace?.name}.
        </p>
      </div>

      {/* Teams Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider text-zinc-400">Department Teams</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {teams.map((t) => (
            <div key={t.id} className="bg-zinc-950 border border-white/10 p-5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white">{t.name}</h3>
                <span className="text-[10px] bg-white/10 text-zinc-300 font-bold px-2 py-0.5 rounded-full">
                  {t.member_count} Members
                </span>
              </div>
              <p className="text-xs text-zinc-400 line-clamp-2">{t.description || 'No description.'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Workspace Members Table */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider text-zinc-400">Workspace Collaborators</h2>
        <div className="bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-900 border-b border-white/10 text-zinc-400 uppercase text-[10px]">
              <tr>
                <th className="p-3.5">User</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">Workspace Role</th>
                <th className="p-3.5">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-3.5 flex items-center gap-2.5 font-bold text-white">
                    <img src={m.avatar_url} alt={m.name} className="w-7 h-7 rounded-full bg-zinc-800" />
                    <span>{m.name}</span>
                  </td>
                  <td className="p-3.5 text-zinc-400">{m.email}</td>
                  <td className="p-3.5">
                    <span className="capitalize bg-white/10 text-zinc-200 px-2 py-0.5 rounded-full font-semibold text-[10px]">
                      {m.workspace_role}
                    </span>
                  </td>
                  <td className="p-3.5 text-zinc-500">
                    {new Date(m.joined_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
