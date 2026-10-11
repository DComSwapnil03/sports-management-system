'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Clock,
  Menu,
  X,
} from 'lucide-react';
import { Team, Match } from '../types/sports';

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenNewMatch: () => void;
  teams: Team[];
  matches: Match[];
  onSelectTeam?: (team: Team) => void;
}

export const Header: React.FC<HeaderProps> = ({
  collapsed,
  setCollapsed,
  searchQuery,
  setSearchQuery,
  onOpenNewMatch,
  teams,
  matches,
  onSelectTeam,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Quick search results
  const filteredTeams = searchQuery.trim()
    ? teams.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.shortCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.coach.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const filteredPlayers = searchQuery.trim()
    ? teams.flatMap((t) =>
        t.players
          .filter(
            (p) =>
              p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.position.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((p) => ({ ...p, teamName: t.name, teamColor: t.primaryColor }))
      )
    : [];

  const hasResults = filteredTeams.length > 0 || filteredPlayers.length > 0;

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-16 bg-[#0f172a]/80 backdrop-blur-md border-b border-[#334155]/60 transition-all duration-300 flex items-center justify-between px-4 sm:px-6 ${
        collapsed ? 'left-20' : 'left-64'
      }`}
    >
      {/* Left: Mobile hamburger & Title badge */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
          title="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="font-semibold text-white">Season 2026/27</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">Gameweek 3</span>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="relative flex-1 max-w-md mx-4">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            placeholder="Search teams, players, coach, position..."
            className="w-full bg-[#1e293b]/70 hover:bg-[#1e293b] focus:bg-[#1e293b] text-sm text-slate-100 placeholder-slate-400 rounded-xl pl-9 pr-9 py-2 border border-slate-700/80 focus:border-emerald-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Global Search Autocomplete Popup */}
        {isSearchFocused && searchQuery.trim().length > 0 && (
          <div
            className="absolute left-0 right-0 top-full mt-2 bg-[#1e293b] border border-slate-700 rounded-xl shadow-2xl p-2 z-50 max-h-80 overflow-y-auto animate-in fade-in slide-in-from-top-1"
            onMouseDown={(e) => e.preventDefault()} // Keep focus
          >
            {hasResults ? (
              <div className="space-y-2">
                {filteredTeams.length > 0 && (
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                      Teams ({filteredTeams.length})
                    </div>
                    {filteredTeams.slice(0, 4).map((team) => (
                      <button
                        key={team.id}
                        onClick={() => {
                          if (onSelectTeam) onSelectTeam(team);
                          setSearchQuery(team.name);
                          setIsSearchFocused(false);
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs text-slate-200 hover:bg-slate-700/50 hover:text-white transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: team.primaryColor }}
                          />
                          <span className="font-medium">{team.name}</span>
                          <span className="text-[10px] text-slate-400">({team.shortCode})</span>
                        </div>
                        <span className="text-[11px] text-slate-400">{team.coach}</span>
                      </button>
                    ))}
                  </div>
                )}

                {filteredPlayers.length > 0 && (
                  <div className="border-t border-slate-700/60 pt-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                      Players ({filteredPlayers.length})
                    </div>
                    {filteredPlayers.slice(0, 6).map((player) => (
                      <div
                        key={player.id}
                        className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-slate-200 hover:bg-slate-700/50"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                            #{player.jerseyNumber}
                          </span>
                          <span className="font-medium text-white">{player.name}</span>
                          <span className="text-[10px] text-slate-400">({player.position})</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: player.teamColor }}
                          />
                          <span className="text-[10px] text-slate-400">{player.teamName}</span>
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                              player.status === 'Active'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {player.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-xs text-slate-400">
                No matching teams or players found for "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Clock & Quick-Action "+ New Match" Button */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 font-mono bg-slate-800/50 border border-slate-700/50 px-2.5 py-1 rounded-lg">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{currentTime || '12:00:00'} UTC</span>
        </div>

        <button
          onClick={onOpenNewMatch}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-200 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Match</span>
        </button>
      </div>
    </header>
  );
};
