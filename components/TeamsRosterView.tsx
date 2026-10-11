'use client';

import React, { useState } from 'react';
import {
  Shield,
  Users,
  Plus,
  Search,
  MapPin,
  Trophy,
  Filter,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { Team, StandingRow, SportType } from '../types/sports';

interface TeamsRosterViewProps {
  teams: Team[];
  standings: StandingRow[];
  onSelectTeam: (team: Team) => void;
  onOpenAddTeam: () => void;
  onDeleteTeam: (teamId: string) => void;
}

export const TeamsRosterView: React.FC<TeamsRosterViewProps> = ({
  teams,
  standings,
  onSelectTeam,
  onOpenAddTeam,
  onDeleteTeam,
}) => {
  const [search, setSearch] = useState('');
  const [selectedSport, setSelectedSport] = useState<string>('All');

  // Map of team records from standings
  const recordsMap = new Map<string, { w: number; d: number; l: number; pts: number }>();
  standings.forEach((s) => {
    recordsMap.set(s.teamId, { w: s.won, d: s.drawn, l: s.lost, pts: s.points });
  });

  const sportsList = ['All', ...Array.from(new Set(teams.map((t) => t.sport)))];

  const filteredTeams = teams.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.coach.toLowerCase().includes(search.toLowerCase()) ||
      t.venue.toLowerCase().includes(search.toLowerCase()) ||
      t.shortCode.toLowerCase().includes(search.toLowerCase());

    const matchesSport = selectedSport === 'All' || t.sport === selectedSport;
    return matchesSearch && matchesSport;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Shield className="w-6 h-6 text-emerald-400" />
            Franchise & Roster Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse registered teams, inspect athlete availability, and manage active lineups.
          </p>
        </div>

        <button
          onClick={onOpenAddTeam}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Add New Team
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#1e293b]/70 border border-[#334155] flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search team, coach, venue..."
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <div className="flex items-center gap-1.5">
            {sportsList.map((sport) => (
              <button
                key={sport}
                onClick={() => setSelectedSport(sport)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedSport === sport
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {sport}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Team Cards */}
      {filteredTeams.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#1e293b]/50 border border-dashed border-slate-700 text-center space-y-3">
          <Shield className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No teams match your filter</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search criteria or register a new team using the button above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTeams.map((team) => {
            const record = recordsMap.get(team.id) || { w: 0, d: 0, l: 0, pts: 0 };
            const activePlayers = team.players.filter((p) => p.status === 'Active').length;
            const injuredPlayers = team.players.filter((p) => p.status === 'Injured').length;

            return (
              <div
                key={team.id}
                className="group rounded-2xl bg-[#1e293b]/90 border border-[#334155] p-5 shadow-xl hover:border-slate-500 transition-all duration-200 flex flex-col justify-between relative overflow-hidden"
              >
                {/* Accent Top Bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{ backgroundColor: team.primaryColor }}
                />

                <div>
                  {/* Team Card Top */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-white text-base shadow-md font-mono shrink-0 border border-white/10"
                        style={{ backgroundColor: team.primaryColor }}
                      >
                        {team.shortCode}
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-white group-hover:text-emerald-400 transition-colors">
                          {team.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium border border-slate-700">
                            {team.sport}
                          </span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {team.city}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Are you sure you want to delete ${team.name}?`)) {
                          onDeleteTeam(team.id);
                        }
                      }}
                      className="text-slate-400 hover:text-red-400 p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Delete Team"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Details / Coach & Venue */}
                  <div className="space-y-1.5 text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 mb-4">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Head Coach:</span>
                      <span className="font-semibold text-white">{team.coach}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Home Stadium:</span>
                      <span className="text-slate-200 truncate max-w-[160px]">{team.venue}</span>
                    </div>
                  </div>

                  {/* Record Pill and Roster Count */}
                  <div className="grid grid-cols-2 gap-2 mb-4 text-center">
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Season Record
                      </span>
                      <span className="font-mono text-xs font-bold text-white">
                        <span className="text-emerald-400">{record.w}W</span> -{' '}
                        <span className="text-slate-400">{record.d}D</span> -{' '}
                        <span className="text-red-400">{record.l}L</span>
                      </span>
                      <span className="text-[10px] text-emerald-400 font-extrabold ml-1">
                        ({record.pts} pts)
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Squad Size
                      </span>
                      <span className="font-mono text-xs font-bold text-white">
                        {team.players.length} Athletes
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {injuredPlayers > 0 ? `${injuredPlayers} injured` : 'All fit'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Button: Opens Roster Drawer */}
                <button
                  onClick={() => onSelectTeam(team)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 border border-slate-700 hover:border-emerald-500 font-bold text-xs transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm group-hover:shadow-md"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Manage Roster & Athletes</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-70" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
