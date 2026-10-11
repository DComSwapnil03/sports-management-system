'use client';

import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  RotateCcw,
  Shield,
  Activity,
  Flame,
  CheckCircle2,
  AlertTriangle,
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

  // Best offensive team
  const topOffense = [...standings].sort((a, b) => b.goalsFor - a.goalsFor)[0];
  // Best defense
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-400" />
            League Operations & Performance Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated statistical performance, scoring trends, and squad availability metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportData}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            Export JSON Backup
          </button>
          <button
            onClick={onResetData}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 font-semibold text-xs transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-red-400" />
            Reset Demo Data
          </button>
        </div>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#1e293b]/90 border border-[#334155] shadow-lg">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Average Goals / Match
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">{avgGoalsPerMatch}</span>
            <span className="text-xs text-emerald-400 font-medium">high-tempo</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block border-t border-slate-700/60 pt-2">
            From {completedMatches.length} finalized matches
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#1e293b]/90 border border-[#334155] shadow-lg">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Roster Readiness Rate
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400 font-mono">{fitnessRate}%</span>
            <span className="text-xs text-slate-400">({activePlayers}/{totalPlayers})</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block border-t border-slate-700/60 pt-2">
            {injuredPlayers} athlete(s) sidelined with injury
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#1e293b]/90 border border-[#334155] shadow-lg">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Highest Scoring Attack
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-white truncate">
              {topOffense?.teamName || 'N/A'}
            </span>
          </div>
          <span className="text-[11px] text-emerald-400 mt-2 block border-t border-slate-700/60 pt-2 font-mono">
            {topOffense?.goalsFor || 0} goals scored this season
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#1e293b]/90 border border-[#334155] shadow-lg">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Stoutest Defense
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-white truncate">
              {topDefense?.teamName || 'N/A'}
            </span>
          </div>
          <span className="text-[11px] text-sky-400 mt-2 block border-t border-slate-700/60 pt-2 font-mono">
            {topDefense?.goalsAgainst || 0} goals conceded
          </span>
        </div>
      </div>

      {/* Goal Difference & Points Comparison Visualizer */}
      <div className="rounded-2xl bg-[#1e293b]/90 border border-[#334155] p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
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
                    <span className="font-bold text-white">{team.teamName}</span>
                    <span className="text-slate-400 text-[11px] font-mono">({team.shortCode})</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-slate-400 text-[11px]">
                      {team.won}W - {team.drawn}D - {team.lost}L
                    </span>
                    <span className="text-emerald-400 font-bold">{team.points} PTS</span>
                  </div>
                </div>

                <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
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
