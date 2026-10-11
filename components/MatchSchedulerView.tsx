'use client';

import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  Play,
  CheckCircle,
  Clock,
  Trash2,
  Filter,
  Activity,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Match, Team, MatchStatus } from '../types/sports';

interface MatchSchedulerViewProps {
  matches: Match[];
  teams: Team[];
  teamsMap: Map<string, Team>;
  onOpenNewMatch: () => void;
  onUpdateScore: (matchId: string, homeDelta: number, awayDelta: number) => void;
  onSetDirectScores: (matchId: string, homeScore: number, awayScore: number) => void;
  onSetStatus: (matchId: string, status: MatchStatus) => void;
  onDeleteMatch: (matchId: string) => void;
}

export const MatchSchedulerView: React.FC<MatchSchedulerViewProps> = ({
  matches,
  teams,
  teamsMap,
  onOpenNewMatch,
  onUpdateScore,
  onSetDirectScores,
  onSetStatus,
  onDeleteMatch,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>('all');
  const [editingScoreMatchId, setEditingScoreMatchId] = useState<string | null>(null);
  const [tempHomeScore, setTempHomeScore] = useState<number>(0);
  const [tempAwayScore, setTempAwayScore] = useState<number>(0);

  const filteredMatches = matches.filter((m) => {
    const statusMatch = filterStatus === 'all' || m.status === filterStatus;
    const teamMatch =
      selectedTeamFilter === 'all' ||
      m.homeTeamId === selectedTeamFilter ||
      m.awayTeamId === selectedTeamFilter;
    return statusMatch && teamMatch;
  });

  // Sort matches: live first, then upcoming (soonest first), then completed (newest first)
  const sortedMatches = [...filteredMatches].sort((a, b) => {
    if (a.status === 'live' && b.status !== 'live') return -1;
    if (b.status === 'live' && a.status !== 'live') return 1;
    if (a.status === 'scheduled' && b.status === 'completed') return -1;
    if (b.status === 'scheduled' && a.status === 'completed') return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const liveCount = matches.filter((m) => m.status === 'live').length;

  const handleStartEdit = (match: Match) => {
    setEditingScoreMatchId(match.id);
    setTempHomeScore(match.homeScore);
    setTempAwayScore(match.awayScore);
  };

  const handleSaveScore = (matchId: string) => {
    onSetDirectScores(matchId, tempHomeScore, tempAwayScore);
    setEditingScoreMatchId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-emerald-400" />
            Match Scheduler & Live Scoreboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time score updates, live match controllers, and instant automated standings sync.
          </p>
        </div>

        <button
          onClick={onOpenNewMatch}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Schedule New Match
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="p-4 rounded-2xl bg-[#1e293b]/70 border border-[#334155] flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto">
          {[
            { id: 'all', label: 'All Fixtures' },
            {
              id: 'live',
              label: `Live Scoreboard ${liveCount > 0 ? `(${liveCount})` : ''}`,
              badge: liveCount > 0,
            },
            { id: 'scheduled', label: 'Upcoming' },
            { id: 'completed', label: 'Completed (Final)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                filterStatus === tab.id
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {tab.badge && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filter by Team */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <span className="text-xs text-slate-400 hidden sm:inline">Club Filter:</span>
          <select
            value={selectedTeamFilter}
            onChange={(e) => setSelectedTeamFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Teams</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Matches Grid */}
      {sortedMatches.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#1e293b]/50 border border-dashed border-slate-700 text-center space-y-3">
          <CalendarDays className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No fixtures found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            There are no matches matching the active filter. Click &quot;Schedule New Match&quot; to arrange a clash.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sortedMatches.map((match) => {
            const home = teamsMap.get(match.homeTeamId);
            const away = teamsMap.get(match.awayTeamId);
            const isLive = match.status === 'live';
            const isCompleted = match.status === 'completed';
            const isScheduled = match.status === 'scheduled';
            const isEditing = editingScoreMatchId === match.id;

            return (
              <div
                key={match.id}
                className={`rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between ${
                  isLive
                    ? 'bg-slate-900/95 border-emerald-500/70 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                    : isCompleted
                    ? 'bg-[#1e293b]/90 border-[#334155]'
                    : 'bg-[#1e293b]/60 border-[#334155]/70'
                }`}
              >
                <div>
                  {/* Top Bar: Match status and venue */}
                  <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-700/60 mb-4">
                    <div className="flex items-center gap-2">
                      {isLive && (
                        <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[11px] animate-pulse">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          LIVE {match.minute ? `• ${match.minute}'` : ''}
                        </span>
                      )}
                      {isCompleted && (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold text-[11px] border border-slate-700">
                          FINAL SCORE
                        </span>
                      )}
                      {isScheduled && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-semibold text-[11px] border border-amber-500/30 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          SCHEDULED
                        </span>
                      )}
                      <span className="text-slate-400 font-medium">Round {match.round}</span>
                    </div>

                    <div className="flex items-center gap-3 text-slate-400">
                      <span>{match.date} • {match.time}</span>
                      <button
                        onClick={() => {
                          if (confirm('Delete this match fixture?')) {
                            onDeleteMatch(match.id);
                          }
                        }}
                        className="text-slate-400 hover:text-red-400 transition-colors p-1"
                        title="Delete fixture"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Main Scoreboard Area */}
                  <div className="grid grid-cols-5 items-center gap-2 py-2">
                    {/* Home Team */}
                    <div className="col-span-2 text-right space-y-1">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-sm sm:text-base font-extrabold text-white truncate">
                          {home?.name || 'Home Club'}
                        </span>
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                          style={{ backgroundColor: home?.primaryColor || '#10b981' }}
                        />
                      </div>
                      <span className="text-[11px] text-slate-400 block font-mono">
                        {home?.coach ? `Coach: ${home.coach}` : ''}
                      </span>
                    </div>

                    {/* Central Score Display */}
                    <div className="col-span-1 flex flex-col items-center justify-center">
                      {isEditing ? (
                        <div className="flex items-center gap-1 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
                          <input
                            type="number"
                            min="0"
                            value={tempHomeScore}
                            onChange={(e) => setTempHomeScore(Math.max(0, Number(e.target.value)))}
                            className="w-9 text-center bg-slate-900 text-white font-mono font-bold text-sm rounded border border-slate-700"
                          />
                          <span className="text-slate-400 font-bold">-</span>
                          <input
                            type="number"
                            min="0"
                            value={tempAwayScore}
                            onChange={(e) => setTempAwayScore(Math.max(0, Number(e.target.value)))}
                            className="w-9 text-center bg-slate-900 text-white font-mono font-bold text-sm rounded border border-slate-700"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 font-mono">
                          <span
                            className={`text-2xl sm:text-3xl font-black px-2.5 py-1 rounded-xl ${
                              isLive
                                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 shadow-sm'
                                : isCompleted && match.homeScore > match.awayScore
                                ? 'bg-emerald-500/10 text-emerald-400 font-black'
                                : 'bg-slate-800/80 text-white'
                            }`}
                          >
                            {match.homeScore}
                          </span>
                          <span className="text-slate-500 font-extrabold">:</span>
                          <span
                            className={`text-2xl sm:text-3xl font-black px-2.5 py-1 rounded-xl ${
                              isLive
                                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 shadow-sm'
                                : isCompleted && match.awayScore > match.homeScore
                                ? 'bg-emerald-500/10 text-emerald-400 font-black'
                                : 'bg-slate-800/80 text-white'
                            }`}
                          >
                            {match.awayScore}
                          </span>
                        </div>
                      )}

                      <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                        {isCompleted ? 'Final' : isLive ? 'Live' : 'Versus'}
                      </span>
                    </div>

                    {/* Away Team */}
                    <div className="col-span-2 text-left space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                          style={{ backgroundColor: away?.primaryColor || '#ef4444' }}
                        />
                        <span className="text-sm sm:text-base font-extrabold text-white truncate">
                          {away?.name || 'Away Club'}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block font-mono">
                        {away?.coach ? `Coach: ${away.coach}` : ''}
                      </span>
                    </div>
                  </div>

                  {/* Highlights if any */}
                  {match.highlights && match.highlights.length > 0 && (
                    <div className="mt-3 p-2 rounded-xl bg-slate-900/50 border border-slate-800/80 text-[11px] text-slate-300">
                      <span className="text-[10px] font-bold uppercase text-slate-400 mr-2">Key Events:</span>
                      {match.highlights.join(' • ')}
                    </div>
                  )}

                  {/* Venue location pill */}
                  <div className="text-[11px] text-slate-400 text-center mt-2">
                    Venue: <strong className="text-slate-300">{match.venue}</strong>
                  </div>
                </div>

                {/* Score Controls & Action Footer */}
                <div className="mt-4 pt-3 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-3">
                  {/* Interactive Score Steppers (+1 / -1) */}
                  {(isLive || isScheduled) && !isEditing && (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-bold px-1.5 uppercase">
                          {home?.shortCode || 'H'}:
                        </span>
                        <button
                          onClick={() => onUpdateScore(match.id, -1, 0)}
                          className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                          title="Decrease Home Score"
                        >
                          -
                        </button>
                        <button
                          onClick={() => onUpdateScore(match.id, 1, 0)}
                          className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                          title="Increase Home Score"
                        >
                          +1
                        </button>
                      </div>

                      <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-bold px-1.5 uppercase">
                          {away?.shortCode || 'A'}:
                        </span>
                        <button
                          onClick={() => onUpdateScore(match.id, 0, -1)}
                          className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                          title="Decrease Away Score"
                        >
                          -
                        </button>
                        <button
                          onClick={() => onUpdateScore(match.id, 0, 1)}
                          className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                          title="Increase Away Score"
                        >
                          +1
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Manual Edit Button */}
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingScoreMatchId(null)}
                        className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveScore(match.id)}
                        className="px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartEdit(match)}
                      className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
                    >
                      Direct Edit
                    </button>
                  )}

                  {/* State Change Buttons: Kickoff / Mark as Final */}
                  <div className="flex items-center gap-2 ml-auto">
                    {isScheduled && (
                      <button
                        onClick={() => onSetStatus(match.id, 'live')}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                      >
                        <Play className="w-3.5 h-3.5 fill-emerald-400" />
                        Start Match (Live)
                      </button>
                    )}

                    {isLive && (
                      <button
                        onClick={() => onSetStatus(match.id, 'completed')}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-95"
                      >
                        <CheckCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                        Mark as Final
                      </button>
                    )}

                    {isCompleted && (
                      <button
                        onClick={() => onSetStatus(match.id, 'live')}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer"
                        title="Re-open match to modify live score"
                      >
                        <RotateCcw className="w-3 h-3 text-slate-400" />
                        Re-open Match
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
