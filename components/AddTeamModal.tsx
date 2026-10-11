'use client';

import React, { useState } from 'react';
import { X, Shield, Plus, Sparkles, AlertCircle } from 'lucide-react';
import { SportType } from '../types/sports';

interface AddTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTeam: (teamData: {
    name: string;
    shortCode: string;
    sport: SportType;
    coach: string;
    venue: string;
    city: string;
    primaryColor: string;
  }) => void;
}

const COLOR_PRESETS = [
  '#10b981', // Emerald
  '#ef4444', // Crimson
  '#06b6d4', // Cyan
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
  '#3b82f6', // Electric Blue
  '#ec4899', // Pink
  '#14b8a6', // Teal
];

export const AddTeamModal: React.FC<AddTeamModalProps> = ({
  isOpen,
  onClose,
  onAddTeam,
}) => {
  const [name, setName] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [sport, setSport] = useState<SportType>('Soccer');
  const [coach, setCoach] = useState('');
  const [venue, setVenue] = useState('');
  const [city, setCity] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#10b981');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Team name is required');
      return;
    }
    if (!coach.trim()) {
      setError('Head coach name is required');
      return;
    }
    if (!venue.trim()) {
      setError('Home venue/stadium is required');
      return;
    }

    onAddTeam({
      name: name.trim(),
      shortCode: shortCode.trim().toUpperCase() || name.substring(0, 3).toUpperCase(),
      sport,
      coach: coach.trim(),
      venue: venue.trim(),
      city: city.trim() || 'Metro District',
      primaryColor,
    });

    // Reset & close
    setName('');
    setShortCode('');
    setCoach('');
    setVenue('');
    setCity('');
    setPrimaryColor('#10b981');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-[#1e293b] border border-[#334155] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#334155] bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: primaryColor }}
            >
              <Shield className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white tracking-tight">Register New Team</h2>
              <p className="text-xs text-slate-400">Add a new franchise to the league roster</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Team Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!shortCode && e.target.value.length >= 3) {
                    setShortCode(e.target.value.substring(0, 3).toUpperCase());
                  }
                }}
                placeholder="e.g. Phoenix Rising FC"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Abbrev (3)
              </label>
              <input
                type="text"
                maxLength={4}
                value={shortCode}
                onChange={(e) => setShortCode(e.target.value.toUpperCase())}
                placeholder="PHX"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-mono uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Sport Category
              </label>
              <select
                value={sport}
                onChange={(e) => setSport(e.target.value as SportType)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Soccer">Soccer</option>
                <option value="Basketball">Basketball</option>
                <option value="Football">American Football</option>
                <option value="Rugby">Rugby</option>
                <option value="Volleyball">Volleyball</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Head Coach *
              </label>
              <input
                type="text"
                required
                value={coach}
                onChange={(e) => setCoach(e.target.value)}
                placeholder="e.g. Carlo Mancini"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Home Stadium / Venue *
              </label>
              <input
                type="text"
                required
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g. Phoenix Stadium"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Host City / Region
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Phoenix"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Primary Color Palette Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Franchise Primary Color Theme
            </label>
            <div className="flex items-center gap-2.5">
              {COLOR_PRESETS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setPrimaryColor(color)}
                  className={`w-7 h-7 rounded-lg transition-transform ${
                    primaryColor === color
                      ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-slate-900'
                      : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-7 h-7 rounded-lg bg-transparent cursor-pointer ml-2 border border-slate-700"
                title="Custom color hex"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-[#334155] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              Confirm Registration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
