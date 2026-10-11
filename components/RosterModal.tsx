'use client';

import React, { useState } from 'react';
import {
  X,
  UserPlus,
  Trash2,
  Shield,
  MapPin,
  AlertTriangle,
} from 'lucide-react';
import { Team, PlayerPosition, PlayerStatus } from '../types/sports';

interface RosterModalProps {
  team: Team | null;
  isOpen: boolean;
  onClose: () => void;
  onAddPlayer: (
    teamId: string,
    playerData: {
      name: string;
      jerseyNumber: number;
      position: PlayerPosition;
      status: PlayerStatus;
      nationality?: string;
    }
  ) => void;
  onRemovePlayer: (teamId: string, playerId: string) => void;
  onToggleStatus: (teamId: string, playerId: string) => void;
}

const POSITIONS: PlayerPosition[] = [
  'Forward',
  'Striker',
  'Winger',
  'Midfielder',
  'Defender',
  'Goalkeeper',
  'Center',
  'Guard',
];

export const RosterModal: React.FC<RosterModalProps> = ({
  team,
  isOpen,
  onClose,
  onAddPlayer,
  onRemovePlayer,
  onToggleStatus,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [jerseyNumber, setJerseyNumber] = useState<number | ''>('');
  const [position, setPosition] = useState<PlayerPosition>('Forward');
  const [status, setStatus] = useState<PlayerStatus>('Active');
  const [nationality, setNationality] = useState('');
  const [formError, setFormError] = useState('');

  if (!isOpen || !team) return null;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setFormError('Player name is required');
      return;
    }
    if (jerseyNumber === '' || Number(jerseyNumber) < 1 || Number(jerseyNumber) > 99) {
      setFormError('Jersey number must be between 1 and 99');
      return;
    }

    const isNumberTaken = team.players.some((p) => p.jerseyNumber === Number(jerseyNumber));
    if (isNumberTaken) {
      setFormError(`Jersey #${jerseyNumber} is already taken in this squad!`);
      return;
    }

    onAddPlayer(team.id, {
      name: playerName.trim(),
      jerseyNumber: Number(jerseyNumber),
      position,
      status,
      nationality: nationality.trim() || undefined,
    });

    // Reset Form
    setPlayerName('');
    setJerseyNumber('');
    setPosition('Forward');
    setStatus('Active');
    setNationality('');
    setFormError('');
    setShowAddForm(false);
  };

  const activeCount = team.players.filter((p) => p.status === 'Active').length;
  const injuredCount = team.players.filter((p) => p.status === 'Injured').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-3xl max-h-[94vh] sm:max-h-[90vh] bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-[#334155] bg-slate-50 dark:bg-slate-900/50 flex items-start justify-between relative overflow-hidden">
          <div
            className="absolute top-0 right-0 w-48 h-48 opacity-15 rounded-full blur-2xl pointer-events-none"
            style={{ backgroundColor: team.primaryColor }}
          />
          <div className="flex items-center gap-3 sm:gap-4 relative z-10">
            <div
              className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-white shadow-md font-extrabold text-base sm:text-xl tracking-wider border border-white/20 shrink-0"
              style={{ backgroundColor: team.primaryColor }}
            >
              {team.shortCode}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {team.name}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                  {team.sport}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1">
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  Coach: <strong className="text-slate-800 dark:text-slate-200">{team.coach}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {team.venue}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Squad Status Bar & Add Player Toggle */}
        <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-100/60 dark:bg-[#0f172a]/60 border-b border-slate-200 dark:border-[#334155] flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 dark:text-slate-400">Squad:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{team.players.length} Athletes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{activeCount} Fit</span>
            </div>
            {injuredCount > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-red-600 dark:text-red-400 font-semibold">{injuredCount} Injured</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-semibold transition-all cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{showAddForm ? 'Close Form' : 'Add Player'}</span>
          </button>
        </div>

        {/* Add Player Form (Drawer) */}
        {showAddForm && (
          <form
            onSubmit={handleAddSubmit}
            className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-[#334155] space-y-3 sm:space-y-4 animate-in slide-in-from-top-2"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-emerald-500" />
                Enroll Athlete to Roster
              </h3>
              {formError && (
                <span className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  {formError}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="e.g. Leo Hayes"
                  className="w-full bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Jersey (1-99) *</label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  required
                  value={jerseyNumber}
                  onChange={(e) => setJerseyNumber(e.target.value ? Number(e.target.value) : '')}
                  placeholder="10"
                  className="w-full bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Position *</label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value as PlayerPosition)}
                  className="w-full bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                >
                  {POSITIONS.map((pos) => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Fitness Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as PlayerStatus)}
                  className="w-full bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Active">Active (Fit)</option>
                  <option value="Injured">Injured (Out)</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-xs cursor-pointer"
              >
                Save Player to Roster
              </button>
            </div>
          </form>
        )}

        {/* Roster Table / List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {team.players.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No players currently registered. Click &quot;Add Player&quot; above to enroll athletes.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
              {team.players.map((player) => {
                const isInjured = player.status === 'Injured';

                return (
                  <div
                    key={player.id}
                    className="p-3 sm:p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 flex items-center justify-between gap-3 group transition-all shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-mono font-bold text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 shrink-0 shadow-2xs">
                        #{player.jerseyNumber}
                      </div>

                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">{player.name}</h4>
                        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          <span className="text-slate-700 dark:text-slate-300 font-medium">{player.position}</span>
                          <span>•</span>
                          <span>{player.goals} goals</span>
                          <span>•</span>
                          <span>{player.assists} ast</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <button
                        onClick={() => onToggleStatus(team.id, player.id)}
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                          isInjured
                            ? 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30 hover:bg-red-500/25'
                            : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                        }`}
                        title="Click to toggle Active / Injured"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isInjured ? 'bg-red-500' : 'bg-emerald-500'
                          }`}
                        />
                        {player.status}
                      </button>

                      <button
                        onClick={() => onRemovePlayer(team.id, player.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Release / Remove Player from Squad"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 border-t border-slate-200 dark:border-[#334155] bg-slate-50 dark:bg-slate-900/40 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Changes are saved in browser storage.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-medium cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
