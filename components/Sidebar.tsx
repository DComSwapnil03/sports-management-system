'use client';

import React from 'react';
import {
  LayoutDashboard,
  Shield,
  CalendarDays,
  Trophy,
  BarChart3,
  RotateCcw,
  Flame,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { ActiveTab } from '../types/sports';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  liveMatchesCount: number;
  onResetData: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  liveMatchesCount,
  onResetData,
}) => {
  const navItems = [
    {
      id: 'overview' as ActiveTab,
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null,
      description: 'Analytics & feed',
    },
    {
      id: 'teams' as ActiveTab,
      label: 'Teams & Rosters',
      icon: Shield,
      badge: null,
      description: 'Squads & players',
    },
    {
      id: 'matches' as ActiveTab,
      label: 'Match Center',
      icon: CalendarDays,
      badge: liveMatchesCount > 0 ? `${liveMatchesCount} LIVE` : null,
      badgeColor: 'bg-emerald-500 text-slate-950 font-bold animate-pulse',
      description: 'Scores & fixtures',
    },
    {
      id: 'standings' as ActiveTab,
      label: 'League Table',
      icon: Trophy,
      badge: null,
      description: 'Auto standings',
    },
    {
      id: 'analytics' as ActiveTab,
      label: 'League Analytics',
      icon: BarChart3,
      badge: null,
      description: 'Goals & form breakdown',
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-full z-40 bg-[#0f172a] border-r border-[#334155]/60 flex flex-col transition-all duration-300 select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#334155]/60 bg-[#1e293b]/40 backdrop-blur-md">
        {!collapsed ? (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
              <Flame className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold text-sm tracking-wider text-white flex items-center gap-1.5 uppercase">
                APEX <span className="text-emerald-400 font-black">LEAGUE</span>
              </span>
              <span className="text-[10px] font-medium text-slate-400 tracking-tight flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                OPS ENGINE v2.4
              </span>
            </div>
          </div>
        ) : (
          <div className="mx-auto w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Flame className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ${
            collapsed ? 'hidden' : 'block'
          }`}
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 ${collapsed ? 'hidden' : 'block'}`}>
          Operations Modules
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group text-left relative ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/30 shadow-sm shadow-emerald-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <div
                className={`p-1.5 rounded-lg transition-colors ${
                  isActive ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 group-hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
              </div>

              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm truncate">{item.label}</span>
                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-700 text-slate-300'}`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 block truncate group-hover:text-slate-300">
                    {item.description}
                  </span>
                </div>
              )}

              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1 bg-emerald-400 rounded-r-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Live Badge Quick Ticker in Sidebar */}
      {!collapsed && liveMatchesCount > 0 && (
        <div className="mx-3 mb-3 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <div className="text-xs text-slate-200 font-medium">
            <span className="text-emerald-400 font-semibold">{liveMatchesCount} Match</span> currently active
          </div>
        </div>
      )}

      {/* Footer / Reset Action */}
      <div className="p-3 border-t border-[#334155]/60 bg-[#1e293b]/20">
        <button
          onClick={onResetData}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all ${
            collapsed ? 'justify-center' : ''
          }`}
          title="Restore seed teams, players & match history"
        >
          <RotateCcw className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Reset Demo Data</span>}
        </button>

        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="w-full mt-2 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex justify-center"
            title="Expand Sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {!collapsed && (
          <div className="mt-2 text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>State synchronized with localStorage</span>
          </div>
        )}
      </div>
    </aside>
  );
};
