'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Clock,
  Menu,
  X,
  Sun,
  Moon,
} from 'lucide-react';
import { Team, Match } from '../types/sports';

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenNewMatch: () => void;
  teams: Team[];
  matches: Match[];
  onSelectTeam?: (team: Team) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  collapsed,
  setCollapsed,
  mobileMenuOpen,
  setMobileMenuOpen,
  searchQuery,
  setSearchQuery,
  onOpenNewMatch,
  teams,
  matches,
  onSelectTeam,
  theme,
  onToggleTheme,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileSearchVisible, setMobileSearchVisible] = useState(false);

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
      className={`fixed top-0 right-0 z-30 h-16 bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-200 dark:border-[#334155]/60 transition-all duration-300 flex items-center justify-between px-3 sm:px-6 left-0 ${
        collapsed ? 'lg:left-20' : 'lg:left-64'
      }`}
    >
      {/* Left: Mobile hamburger & Title badge */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Hamburger toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors lg:hidden cursor-pointer"
          aria-label="Toggle navigation drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Season pill */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs text-slate-600 dark:text-slate-300 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="font-semibold text-slate-900 dark:text-white">Season 2026/27</span>
          <span className="text-slate-400 dark:text-slate-500">•</span>
          <span className="text-slate-500 dark:text-slate-400">Gameweek 3</span>
        </div>
      </div>

      {/* Center: Global Search Bar (Desktop & Tablet) */}
      <div className="relative flex-1 max-w-xs sm:max-w-md mx-2 sm:mx-4">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            placeholder="Search clubs, athletes, coach..."
            className="w-full bg-slate-100 dark:bg-[#1e293b]/70 hover:bg-slate-200/70 dark:hover:bg-[#1e293b] focus:bg-white dark:focus:bg-[#1e293b] text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl pl-9 pr-8 py-2 border border-slate-200 dark:border-slate-700/80 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 text-slate-400 hover:text-slate-700 dark:hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Global Search Autocomplete Popup */}
        {isSearchFocused && searchQuery.trim().length > 0 && (
          <div
            className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-2 z-50 max-h-80 overflow-y-auto animate-in fade-in slide-in-from-top-1"
            onMouseDown={(e) => e.preventDefault()}
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
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: team.primaryColor }}
                          />
                          <span className="font-semibold">{team.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({team.shortCode})</span>
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">{team.coach}</span>
                      </button>
                    ))}
                  </div>
                )}

                {filteredPlayers.length > 0 && (
                  <div className="border-t border-slate-200 dark:border-slate-700/60 pt-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                      Athletes ({filteredPlayers.length})
                    </div>
                    {filteredPlayers.slice(0, 6).map((player) => (
                      <div
                        key={player.id}
                        className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded">
                            #{player.jerseyNumber}
                          </span>
                          <span className="font-medium text-slate-900 dark:text-white">{player.name}</span>
                          <span className="text-[10px] text-slate-400">({player.position})</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: player.teamColor }}
                          />
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 hidden xs:inline">{player.teamName}</span>
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                              player.status === 'Active'
                                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                : 'bg-red-500/15 text-red-600 dark:text-red-400'
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
                No matching teams or athletes for &quot;{searchQuery}&quot;
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Theme Toggle, Clock & Quick-Action "+ New Match" Button */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Dual Theme Switcher (Bright Mode vs Dark Mode) */}
        <button
          onClick={onToggleTheme}
          className="flex items-center justify-center p-2 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-xs group"
          title={theme === 'dark' ? 'Switch to Bright Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme mode"
        >
          {theme === 'dark' ? (
            <div className="flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-400 transition-transform group-hover:rotate-45" />
              <span className="hidden md:inline text-xs font-semibold">Bright</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Moon className="w-4 h-4 text-indigo-500 transition-transform group-hover:-rotate-12" />
              <span className="hidden md:inline text-xs font-semibold">Dark</span>
            </div>
          )}
        </button>

        {/* Live Clock Pill */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 px-2.5 py-1.5 rounded-xl shadow-xs">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span suppressHydrationWarning>{currentTime || '12:00:00'} UTC</span>
        </div>

        {/* Quick Action: New Match Button */}
        <button
          onClick={onOpenNewMatch}
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-extrabold text-xs shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-200 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden xs:inline">New Match</span>
          <span className="xs:hidden">Match</span>
        </button>
      </div>
    </header>
  );
};
