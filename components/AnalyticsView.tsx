'use client';

import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  RotateCcw,
} from 'lucide-react';
import { Team, Match, StandingRow } from '../types/sports';

interface AnalyticsViewProps {
  teams: Team[];
  matches: Match[];
  standings: StandingRow[];
  onResetData: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  teams,
  matches,
  standings,
  onResetData,
}) => {
  const completedMatches = matches.filter((m) => m.status === 'completed');
  const totalGoals = completedMatches.reduce((acc, m) => acc + m.homeScore + m.awayScore, 0);
  const avgGoalsPerMatch =
    completedMatches.length > 0 ? (totalGoals / completedMatches.length).toFixed(1) : '0.0';

  const totalPlayers = teams.reduce((acc, t) => acc + t.players.length, 0);
  const activePlayers = teams.reduce(
    (acc, t) => acc + t.players.filter((p) => p.status === 'Active').length,
    0
  );
  const injuredPlayers = totalPlayers - activePlayers;
  const fitnessRate = totalPlayers > 0 ? Math.round((activePlayers / totalPlayers) * 100) : 100;

  // Best offense & defense
  const topOffense = [...standings].sort((a, b) => b.goalsFor - a.goalsFor)[0];
  const topDefense = [...standings].sort((a, b) => a.goalsAgainst - b.goalsAgainst)[0];

  const handleExportData = () => {
    const data = {
      exportTimestamp: new Date().toISOString(),
      league: 'Apex Championship OS',
      teams,
      matches,
      standings,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `apex-league-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
            League Operations & Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1">
            Aggregated statistical performance, scoring trends, and squad availability metrics.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
          <button
            onClick={handleExportData}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-xs transition-all cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4 text-emerald-500" />
            <span>Export Backup</span>
          </button>
          <button
            onClick={onResetData}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-red-50 dark:bg-red-500/15 hover:bg-red-100 dark:hover:bg-red-500/25 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-500/30 font-semibold text-xs transition-all cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-4 h-4 text-red-500" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1e293b]/90 border border-slate-200 dark:border-[#334155] shadow-xs">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5 sm:mb-2">
            Avg Goals / Match
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">{avgGoalsPerMatch}</span>
            <span className="text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400 font-medium">high-tempo</span>
          </div>
          <span className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 mt-2 block border-t border-slate-100 dark:border-slate-700/60 pt-2 truncate">
            From {completedMatches.length} matches
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1e293b]/90 border border-slate-200 dark:border-[#334155] shadow-xs">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5 sm:mb-2">
            Squad Readiness
          </span>
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">{fitnessRate}%</span>
            <span className="text-[10px] sm:text-xs text-slate-400">({activePlayers}/{totalPlayers})</span>
          </div>
          <span className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 mt-2 block border-t border-slate-100 dark:border-slate-700/60 pt-2 truncate">
            {injuredPlayers} athlete(s) injured
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1e293b]/90 border border-slate-200 dark:border-[#334155] shadow-xs">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5 sm:mb-2">
            Top Offense
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-xl font-extrabold text-slate-900 dark:text-white truncate">
              {topOffense?.teamName || 'N/A'}
            </span>
          </div>
          <span className="text-[10px] sm:text-[11px] text-emerald-600 dark:text-emerald-400 mt-2 block border-t border-slate-100 dark:border-slate-700/60 pt-2 font-mono truncate">
            {topOffense?.goalsFor || 0} goals scored
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1e293b]/90 border border-slate-200 dark:border-[#334155] shadow-xs">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5 sm:mb-2">
            Stoutest Defense
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-xl font-extrabold text-slate-900 dark:text-white truncate">
              {topDefense?.teamName || 'N/A'}
            </span>
          </div>
          <span className="text-[10px] sm:text-[11px] text-sky-600 dark:text-sky-400 mt-2 block border-t border-slate-100 dark:border-slate-700/60 pt-2 font-mono truncate">
            {topDefense?.goalsAgainst || 0} conceded
          </span>
        </div>
      </div>

      {/* Points Distribution & Power Ratings */}
      <div className="rounded-2xl bg-white dark:bg-[#1e293b]/90 border border-slate-200 dark:border-[#334155] p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Points Distribution & Power Ratings
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Max Pts: 9</span>
        </div>

        <div className="space-y-4 pt-2">
          {standings.map((team) => {
            const maxPts = Math.max(...standings.map((s) => s.points), 6);
            const percentage = Math.max(8, Math.round((team.points / maxPts) * 100));

            return (
              <div key={team.teamId} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: team.primaryColor }}
                    />
                    <span className="font-bold text-slate-900 dark:text-white">{team.teamName}</span>
                    <span className="text-slate-400 text-[11px] font-mono">({team.shortCode})</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                      {team.won}W - {team.drawn}D - {team.lost}L
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{team.points} PTS</span>
                  </div>
                </div>

                <div className="h-3 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-800">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: team.primaryColor,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
