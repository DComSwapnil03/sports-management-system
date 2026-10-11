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
  X,
  Sun,
  Moon,
} from 'lucide-react';
import { ActiveTab } from '../types/sports';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  liveMatchesCount: number;
  onResetData: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  liveMatchesCount,
  onResetData,
  theme,
  onToggleTheme,
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

  const handleNavClick = (id: ActiveTab) => {
    setActiveTab(id);
    setMobileOpen(false); // Close mobile drawer upon selection
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 bg-white dark:bg-[#0f172a] border-r border-slate-200 dark:border-[#334155]/60 flex flex-col transition-all duration-300 select-none shadow-xl lg:shadow-none ${
          /* Desktop behavior */
          collapsed ? 'lg:w-20' : 'lg:w-64'
        } ${
          /* Mobile slide-in behavior */
          mobileOpen
            ? 'w-72 translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-[#334155]/60 bg-slate-50/80 dark:bg-[#1e293b]/40 backdrop-blur-md">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
              <Flame className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            {(!collapsed || mobileOpen) && (
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-sm tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5 uppercase">
                  APEX <span className="text-emerald-500 font-black">LEAGUE</span>
                </span>
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 tracking-tight flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  OPS ENGINE v2.4
                </span>
              </div>
            )}
          </div>

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden lg:block cursor-pointer`}
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors lg:hidden cursor-pointer"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          <div
            className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 ${
              collapsed && !mobileOpen ? 'hidden' : 'block'
            }`}
          >
            Operations Modules
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group text-left relative cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
                title={collapsed && !mobileOpen ? item.label : undefined}
              >
                <div
                  className={`p-1.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                </div>

                {(!collapsed || mobileOpen) && (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm truncate font-medium">{item.label}</span>
                      {item.badge && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 block truncate group-hover:text-slate-600 dark:group-hover:text-slate-300">
                      {item.description}
                    </span>
                  </div>
                )}

                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-emerald-500 rounded-r-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Live Badge Quick Ticker in Sidebar */}
        {(!collapsed || mobileOpen) && liveMatchesCount > 0 && (
          <div className="mx-3 mb-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div className="text-xs text-slate-700 dark:text-slate-200 font-medium">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">{liveMatchesCount} Match</span> currently active
            </div>
          </div>
        )}

        {/* Footer: Theme Switcher & Reset Action */}
        <div className="p-3 border-t border-slate-200 dark:border-[#334155]/60 bg-slate-50/60 dark:bg-[#1e293b]/20 space-y-2">
          {/* Theme Switcher in sidebar */}
          <button
            onClick={onToggleTheme}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-all cursor-pointer ${
              collapsed && !mobileOpen ? 'justify-center' : ''
            }`}
            title={theme === 'dark' ? 'Switch to Bright Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                {(!collapsed || mobileOpen) && <span>Switch to Bright Mode</span>}
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-500 shrink-0" />
                {(!collapsed || mobileOpen) && <span>Switch to Dark Mode</span>}
              </>
            )}
          </button>

          {/* Reset Demo Data button */}
          <button
            onClick={() => {
              onResetData();
              setMobileOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 border border-transparent hover:border-red-200 dark:hover:border-red-500/20 transition-all cursor-pointer ${
              collapsed && !mobileOpen ? 'justify-center' : ''
            }`}
            title="Restore seed teams, players & match history"
          >
            <RotateCcw className="w-4 h-4 shrink-0" />
            {(!collapsed || mobileOpen) && <span>Reset Demo Data</span>}
          </button>

          {(!collapsed || mobileOpen) && (
            <div className="text-[10px] text-slate-400 dark:text-slate-500 text-center flex items-center justify-center gap-1 pt-1">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              <span>State synced with localStorage</span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
