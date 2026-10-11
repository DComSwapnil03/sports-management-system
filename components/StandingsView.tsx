'use client';

import React, { useState } from 'react';
import {
  Trophy,
  ArrowUpDown,
  HelpCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { StandingRow, Team } from '../types/sports';

interface StandingsViewProps {
  standings: StandingRow[];
  teamsMap: Map<string, Team>;
  onSelectTeam: (team: Team) => void;
}

type SortField = 'rank' | 'teamName' | 'played' | 'won' | 'drawn' | 'lost' | 'goalsFor' | 'goalsAgainst' | 'goalDiff' | 'points';

export const StandingsView: React.FC<StandingsViewProps> = ({
  standings,
  teamsMap,
  onSelectTeam,
}) => {
  const [sortField, setSortField] = useState<SortField>('points');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection(field === 'rank' || field === 'teamName' ? 'asc' : 'desc');
    }
  };

  const sortedRows = [...standings].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDirection === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      if (sortField === 'points' && aVal === bVal) {
        if (a.goalDiff !== b.goalDiff) {
          return sortDirection === 'desc' ? b.goalDiff - a.goalDiff : a.goalDiff - b.goalDiff;
        }
        return sortDirection === 'desc' ? b.goalsFor - a.goalsFor : a.goalsFor - b.goalsFor;
      }
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }

    return 0;
  });

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
            Official League Standings
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1">
            Automated mathematical table calculation dynamically synced with every finalized match result.
          </p>
        </div>

        <div className="flex items-center gap-2.5 text-xs bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700/80 px-3 py-2 rounded-xl shadow-xs self-start sm:self-auto">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <span className="text-slate-700 dark:text-slate-300">
            Rules: <strong className="text-emerald-600 dark:text-emerald-400">Win 3pts</strong> • Draw 1pt • Loss 0pts
          </span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-2xl bg-white dark:bg-[#1e293b]/90 border border-slate-200 dark:border-[#334155] shadow-xs overflow-hidden">
        {/* Table Filter / Info Banner */}
        <div className="px-4 sm:px-6 py-3.5 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-[#334155] flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              Championship Division
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500 dark:text-slate-400">{standings.length} Clubs</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
              Playoff Zone (Top 2)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-red-500" />
              Relegation Zone (Bottom 2)
            </span>
          </div>
        </div>

        {/* Standings Table with horizontal scroll */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[580px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#334155] bg-slate-50/60 dark:bg-slate-900/40 text-slate-400 uppercase text-[10px] tracking-wider font-semibold select-none">
                <th
                  onClick={() => handleSort('rank')}
                  className="py-3 px-3 sm:px-4 cursor-pointer hover:text-slate-700 dark:hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>#</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('teamName')}
                  className="py-3 px-3 sm:px-4 cursor-pointer hover:text-slate-700 dark:hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Club</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('played')}
                  className="py-3 px-2 sm:px-3 text-center cursor-pointer hover:text-slate-700 dark:hover:text-white"
                  title="Matches Played"
                >
                  P
                </th>
                <th
                  onClick={() => handleSort('won')}
                  className="py-3 px-2 sm:px-3 text-center cursor-pointer hover:text-emerald-500 text-emerald-600 dark:text-emerald-400"
                  title="Won (3 PTS)"
                >
                  W
                </th>
                <th
                  onClick={() => handleSort('drawn')}
                  className="py-3 px-2 sm:px-3 text-center cursor-pointer hover:text-slate-700 dark:hover:text-white"
                  title="Drawn (1 PT)"
                >
                  D
                </th>
                <th
                  onClick={() => handleSort('lost')}
                  className="py-3 px-2 sm:px-3 text-center cursor-pointer hover:text-red-500 text-red-500 dark:text-red-400"
                  title="Lost (0 PTS)"
                >
                  L
                </th>
                <th
                  onClick={() => handleSort('goalsFor')}
                  className="py-3 px-2 sm:px-3 text-center cursor-pointer hover:text-slate-700 dark:hover:text-white"
                  title="Goals For"
                >
                  GF
                </th>
                <th
                  onClick={() => handleSort('goalsAgainst')}
                  className="py-3 px-2 sm:px-3 text-center cursor-pointer hover:text-slate-700 dark:hover:text-white"
                  title="Goals Against"
                >
                  GA
                </th>
                <th
                  onClick={() => handleSort('goalDiff')}
                  className="py-3 px-2 sm:px-3 text-center cursor-pointer hover:text-slate-700 dark:hover:text-white font-bold"
                  title="Goal Difference (GF - GA)"
                >
                  GD
                </th>
                <th
                  onClick={() => handleSort('points')}
                  className="py-3 px-3 sm:px-4 text-right cursor-pointer text-emerald-600 dark:text-emerald-400 font-extrabold text-sm"
                  title="Total Points"
                >
                  PTS
                </th>
                <th className="py-3 px-3 sm:px-4 text-center">Form</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-[#334155]/60">
              {sortedRows.map((row) => {
                const team = teamsMap.get(row.teamId);
                const isChampionZone = row.rank <= 2;
                const isRelegationZone = row.rank >= sortedRows.length - 1 && sortedRows.length > 3;

                return (
                  <tr
                    key={row.teamId}
                    onClick={() => team && onSelectTeam(team)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors cursor-pointer group"
                  >
                    {/* Rank */}
                    <td className="py-3 sm:py-3.5 px-3 sm:px-4 font-mono font-bold">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <span
                          className={`w-1 h-5 sm:h-6 rounded-full shrink-0 ${
                            isChampionZone
                              ? 'bg-emerald-500'
                              : isRelegationZone
                              ? 'bg-red-500'
                              : 'bg-transparent'
                          }`}
                        />
                        <span
                          className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center text-xs ${
                            row.rank === 1
                              ? 'bg-emerald-500 text-slate-950 font-black shadow-xs'
                              : isChampionZone
                              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                              : isRelegationZone
                              ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30'
                              : 'text-slate-500 dark:text-slate-300'
                          }`}
                        >
                          {row.rank}
                        </span>
                      </div>
                    </td>

                    {/* Team Name */}
                    <td className="py-3 sm:py-3.5 px-3 sm:px-4">
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <div
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-white text-xs font-mono font-extrabold shrink-0 shadow-2xs border border-white/10"
                          style={{ backgroundColor: row.primaryColor }}
                        >
                          {row.shortCode}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm group-hover:text-emerald-500 transition-colors">
                              {row.teamName}
                            </span>
                            <ExternalLink className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {team?.city || row.city}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Stats */}
                    <td className="py-3 sm:py-3.5 px-2 sm:px-3 text-center font-mono text-slate-700 dark:text-slate-200">
                      {row.played}
                    </td>

                    <td className="py-3 sm:py-3.5 px-2 sm:px-3 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {row.won}
                    </td>

                    <td className="py-3 sm:py-3.5 px-2 sm:px-3 text-center font-mono text-slate-500 dark:text-slate-400">
                      {row.drawn}
                    </td>

                    <td className="py-3 sm:py-3.5 px-2 sm:px-3 text-center font-mono text-red-500 dark:text-red-400">
                      {row.lost}
                    </td>

                    <td className="py-3 sm:py-3.5 px-2 sm:px-3 text-center font-mono text-slate-500 dark:text-slate-400">
                      {row.goalsFor}
                    </td>

                    <td className="py-3 sm:py-3.5 px-2 sm:px-3 text-center font-mono text-slate-500 dark:text-slate-400">
                      {row.goalsAgainst}
                    </td>

                    <td
                      className={`py-3 sm:py-3.5 px-2 sm:px-3 text-center font-mono font-bold ${
                        row.goalDiff > 0
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : row.goalDiff < 0
                          ? 'text-red-500 dark:text-red-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}
                    </td>

                    <td className="py-3 sm:py-3.5 px-3 sm:px-4 text-right font-mono text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400">
                      {row.points}
                    </td>

                    {/* Form Badges */}
                    <td className="py-3 sm:py-3.5 px-3 sm:px-4">
                      <div className="flex items-center justify-center gap-1">
                        {row.form.length === 0 ? (
                          <span className="text-slate-400 text-[11px] font-mono">-</span>
                        ) : (
                          row.form.map((res, i) => (
                            <span
                              key={i}
                              className={`w-4 h-4 sm:w-5 sm:h-5 rounded-md flex items-center justify-center text-[9px] sm:text-[10px] font-mono font-bold text-white shadow-2xs ${
                                res === 'W'
                                  ? 'bg-emerald-500 text-slate-950 font-black'
                                  : res === 'D'
                                  ? 'bg-slate-400 dark:bg-slate-700 text-white'
                                  : 'bg-red-500'
                              }`}
                              title={res === 'W' ? 'Win' : res === 'D' ? 'Draw' : 'Loss'}
                            >
                              {res}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-[#334155] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              <strong>Tie-breaker Order:</strong> Points &rarr; GD &rarr; GF &rarr; Alphabetical.
            </span>
          </div>

          <div className="text-[11px] text-slate-400">
            Click any row to open that club&apos;s active player roster.
          </div>
        </div>
      </div>
    </div>
  );
};
