'use client';

import React from 'react';
import {
  Shield,
  Users,
  Trophy,
  Calendar,
  Activity,
  ArrowUpRight,
  Plus,
  Play,
  CheckCircle,
  Clock,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Team, Match, StandingRow, ActiveTab } from '../types/sports';

interface OverviewDashboardProps {
  teams: Team[];
  matches: Match[];
  standings: StandingRow[];
  teamsMap: Map<string, Team>;
  metrics: {
    totalTeams: number;
    totalPlayers: number;
    activePlayers: number;
    injuredPlayers: number;
    completedMatches: number;
    upcomingMatches: number;
    liveMatches: number;
    totalGoals: number;
  };
  setActiveTab: (tab: ActiveTab) => void;
  onOpenNewMatch: () => void;
  onOpenAddTeam: () => void;
  onUpdateScore: (matchId: string, homeDelta: number, awayDelta: number) => void;
  onSetStatus: (matchId: string, status: Match['status']) => void;
  onSelectTeam: (team: Team) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  teams,
  matches,
  standings,
  teamsMap,
  metrics,
  setActiveTab,
  onOpenNewMatch,
  onOpenAddTeam,
  onUpdateScore,
  onSetStatus,
  onSelectTeam,
}) => {
  // Sort matches for ticker: Live first, then Completed (recent first), then Scheduled (soonest first)
  const tickerMatches = [...matches].sort((a, b) => {
    if (a.status === 'live' && b.status !== 'live') return -1;
    if (b.status === 'live' && a.status !== 'live') return 1;
    if (a.status === 'scheduled' && b.status === 'completed') return -1;
    if (b.status === 'scheduled' && a.status === 'completed') return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Top 5 goalscorers across league
  const topScorers = teams
    .flatMap((t) => t.players.map((p) => ({ ...p, teamName: t.name, teamColor: t.primaryColor })))
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Status */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-[#1e293b] to-slate-900 border border-[#334155] p-6 shadow-xl">
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-bold tracking-wide uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live League Operations
              </span>
              <span className="text-xs text-slate-400">Automated Scoring Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Apex Championship Central
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Real-time match tracking, dynamic roster administration, and instant mathematical league standings calculation.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenNewMatch}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Schedule Match
            </button>
            <button
              onClick={onOpenAddTeam}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-semibold text-xs transition-all cursor-pointer hover:text-white"
            >
              <Shield className="w-4 h-4 text-emerald-400" />
              Register Team
            </button>
          </div>
        </div>
      </div>

      {/* KPI METRIC CARDS - Dynamically Calculated */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Teams Card */}
        <div
          onClick={() => setActiveTab('teams')}
          className="group cursor-pointer rounded-2xl bg-[#1e293b]/90 border border-[#334155] p-5 shadow-lg hover:border-emerald-500/50 hover:bg-[#1e293b] transition-all duration-200 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Teams
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight font-mono">
              {metrics.totalTeams}
            </span>
            <span className="text-xs text-emerald-400 font-medium flex items-center">
              Active franchises
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-700/60 pt-2">
            <span>Click to manage rosters</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
          </div>
        </div>

        {/* Total Registered Players Card */}
        <div
          onClick={() => setActiveTab('teams')}
          className="group cursor-pointer rounded-2xl bg-[#1e293b]/90 border border-[#334155] p-5 shadow-lg hover:border-sky-500/50 hover:bg-[#1e293b] transition-all duration-200 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Registered Athletes
            </span>
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight font-mono">
              {metrics.totalPlayers}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              ({metrics.activePlayers} fit /{' '}
              <span className="text-red-400">{metrics.injuredPlayers} out</span>)
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-700/60 pt-2">
            <span>Roster status & transfers</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-400 transition-colors" />
          </div>
        </div>

        {/* Completed Matches Card */}
        <div
          onClick={() => setActiveTab('matches')}
          className="group cursor-pointer rounded-2xl bg-[#1e293b]/90 border border-[#334155] p-5 shadow-lg hover:border-purple-500/50 hover:bg-[#1e293b] transition-all duration-200 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Completed Matches
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight font-mono">
              {metrics.completedMatches}
            </span>
            <span className="text-xs text-purple-400 font-medium">
              {metrics.totalGoals} goals recorded
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-700/60 pt-2">
            <span>Final results archive</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-400 transition-colors" />
          </div>
        </div>

        {/* Upcoming Fixtures Card */}
        <div
          onClick={() => setActiveTab('matches')}
          className="group cursor-pointer rounded-2xl bg-[#1e293b]/90 border border-[#334155] p-5 shadow-lg hover:border-amber-500/50 hover:bg-[#1e293b] transition-all duration-200 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Upcoming Fixtures
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight font-mono">
              {metrics.upcomingMatches}
            </span>
            {metrics.liveMatches > 0 && (
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                {metrics.liveMatches} match LIVE
              </span>
            )}
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-700/60 pt-2">
            <span>Schedule & live controls</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 transition-colors" />
          </div>
        </div>
      </div>

      {/* LIVE & RECENT MATCH TICKER - Horizontal / Grid feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Live & Recent Match Ticker
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('matches')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
          >
            Open Full Match Center
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {tickerMatches.slice(0, 3).map((match) => {
            const home = teamsMap.get(match.homeTeamId);
            const away = teamsMap.get(match.awayTeamId);
            const isLive = match.status === 'live';
            const isCompleted = match.status === 'completed';

            return (
              <div
                key={match.id}
                className={`rounded-2xl p-4 border transition-all duration-200 relative ${
                  isLive
                    ? 'bg-slate-900/90 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                    : isCompleted
                    ? 'bg-[#1e293b]/70 border-[#334155]'
                    : 'bg-[#1e293b]/40 border-[#334155]/60'
                }`}
              >
                {/* Header status */}
                <div className="flex items-center justify-between mb-3 text-xs">
                  <div className="flex items-center gap-2">
                    {isLive && (
                      <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        LIVE {match.minute ? `• ${match.minute}'` : ''}
                      </span>
                    )}
                    {isCompleted && (
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold text-[10px] border border-slate-700">
                        FINAL RESULT
                      </span>
                    )}
                    {match.status === 'scheduled' && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-semibold text-[10px] border border-amber-500/20 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {match.time}
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400">Round {match.round}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                    {match.venue}
                  </span>
                </div>

                {/* Scoreline */}
                <div className="space-y-2 py-1">
                  {/* Home Team */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: home?.primaryColor || '#94a3b8' }}
                      />
                      <span
                        className={`text-sm font-semibold truncate ${
                          isCompleted && match.homeScore > match.awayScore
                            ? 'text-emerald-400 font-bold'
                            : 'text-slate-100'
                        }`}
                      >
                        {home?.name || 'Home Team'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isLive && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onUpdateScore(match.id, -1, 0)}
                            className="w-5 h-5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center text-xs font-bold"
                            title="Decrease Home Score"
                          >
                            -
                          </button>
                          <button
                            onClick={() => onUpdateScore(match.id, 1, 0)}
                            className="w-5 h-5 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40 flex items-center justify-center text-xs font-bold"
                            title="Increase Home Score"
                          >
                            +
                          </button>
                        </div>
                      )}
                      <span
                        className={`font-mono text-base font-extrabold px-2.5 py-0.5 rounded-md ${
                          isLive
                            ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800/80 text-white'
                        }`}
                      >
                        {match.homeScore}
                      </span>
                    </div>
                  </div>

                  {/* Away Team */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: away?.primaryColor || '#94a3b8' }}
                      />
                      <span
                        className={`text-sm font-semibold truncate ${
                          isCompleted && match.awayScore > match.homeScore
                            ? 'text-emerald-400 font-bold'
                            : 'text-slate-100'
                        }`}
                      >
                        {away?.name || 'Away Team'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isLive && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onUpdateScore(match.id, 0, -1)}
                            className="w-5 h-5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center text-xs font-bold"
                            title="Decrease Away Score"
                          >
                            -
                          </button>
                          <button
                            onClick={() => onUpdateScore(match.id, 0, 1)}
                            className="w-5 h-5 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40 flex items-center justify-center text-xs font-bold"
                            title="Increase Away Score"
                          >
                            +
                          </button>
                        </div>
                      )}
                      <span
                        className={`font-mono text-base font-extrabold px-2.5 py-0.5 rounded-md ${
                          isLive
                            ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800/80 text-white'
                        }`}
                      >
                        {match.awayScore}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Live Action Buttons */}
                {isLive && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Controls affect live standings</span>
                    <button
                      onClick={() => onSetStatus(match.id, 'completed')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-all"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Mark as Final
                    </button>
                  </div>
                )}

                {match.status === 'scheduled' && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">{match.date}</span>
                    <button
                      onClick={() => onSetStatus(match.id, 'live')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold text-xs flex items-center gap-1 border border-emerald-500/20 transition-all"
                    >
                      <Play className="w-3 h-3" />
                      Kick Off
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* TWO COLUMN GRID: Mini Standings Table & League Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Standings Leaderboard Snapshot */}
        <div className="lg:col-span-2 rounded-2xl bg-[#1e293b]/90 border border-[#334155] p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-emerald-400" />
              <h2 className="text-base font-bold text-white tracking-tight">
                Current League Leaderboard
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('standings')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
            >
              Full Standings Table
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-700/80 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Club</th>
                  <th className="py-2.5 px-2 text-center">P</th>
                  <th className="py-2.5 px-2 text-center">W</th>
                  <th className="py-2.5 px-2 text-center">D</th>
                  <th className="py-2.5 px-2 text-center">L</th>
                  <th className="py-2.5 px-2 text-center">GD</th>
                  <th className="py-2.5 px-3 text-right font-bold text-emerald-400">PTS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {standings.slice(0, 5).map((row) => {
                  const team = teamsMap.get(row.teamId);
                  const isFirst = row.rank === 1;

                  return (
                    <tr
                      key={row.teamId}
                      onClick={() => team && onSelectTeam(team)}
                      className="hover:bg-slate-800/60 cursor-pointer transition-colors group"
                    >
                      <td className="py-3 px-3">
                        <span
                          className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-xs ${
                            isFirst
                              ? 'bg-emerald-500 text-slate-950 shadow-sm'
                              : row.rank <= 2
                              ? 'bg-slate-800 text-slate-200'
                              : 'text-slate-400'
                          }`}
                        >
                          {row.rank}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: row.primaryColor }}
                          />
                          <div>
                            <span className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                              {row.teamName}
                            </span>
                            <span className="text-[10px] text-slate-400 ml-1.5 font-mono">
                              {row.shortCode}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center text-slate-300 font-mono">{row.played}</td>
                      <td className="py-3 px-2 text-center text-emerald-400 font-mono font-semibold">
                        {row.won}
                      </td>
                      <td className="py-3 px-2 text-center text-slate-400 font-mono">{row.drawn}</td>
                      <td className="py-3 px-2 text-center text-red-400 font-mono">{row.lost}</td>
                      <td
                        className={`py-3 px-2 text-center font-mono ${
                          row.goalDiff > 0
                            ? 'text-emerald-400 font-semibold'
                            : row.goalDiff < 0
                            ? 'text-red-400'
                            : 'text-slate-400'
                        }`}
                      >
                        {row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-sm font-extrabold text-emerald-400">
                        {row.points}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Top Scorers & Quick Squad Spotlight */}
        <div className="rounded-2xl bg-[#1e293b]/90 border border-[#334155] p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <h2 className="text-base font-bold text-white tracking-tight">Golden Boot Race</h2>
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Goals</span>
          </div>

          <div className="space-y-2.5">
            {topScorers.map((player, idx) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 text-center font-mono text-xs font-bold text-slate-400">
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white">{player.name}</h4>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: player.teamColor }}
                      />
                      <span>{player.teamName}</span>
                      <span>•</span>
                      <span>{player.position}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-base font-extrabold text-emerald-400">
                    {player.goals}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {player.assists} ast
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
            <span>Rosters updated dynamically</span>
            <button
              onClick={() => setActiveTab('teams')}
              className="text-emerald-400 hover:underline font-semibold"
            >
              View Roster Directory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
