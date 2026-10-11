'use client';

import React from 'react';
import {
  LayoutDashboard,
  Shield,
  CalendarDays,
  Trophy,
  BarChart3,
} from 'lucide-react';
import { ActiveTab } from '../types/sports';

interface MobileBottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  liveMatchesCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  liveMatchesCount,
}) => {
  const tabs = [
    { id: 'overview' as ActiveTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'teams' as ActiveTab, label: 'Clubs', icon: Shield },
    {
      id: 'matches' as ActiveTab,
      label: 'Matches',
      icon: CalendarDays,
      badge: liveMatchesCount > 0 ? `${liveMatchesCount}` : null,
    },
    { id: 'standings' as ActiveTab, label: 'Table', icon: Trophy },
    { id: 'analytics' as ActiveTab, label: 'Stats', icon: BarChart3 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex items-center justify-around px-2 py-1 shadow-lg select-none pb-[env(safe-area-inset-bottom,0px)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all duration-150 relative cursor-pointer ${
              isActive
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Icon
                className={`w-5 h-5 transition-transform ${
                  isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'
                }`}
              />
              {tab.badge && (
                <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-black text-[9px] flex items-center justify-center shadow-xs animate-pulse">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight font-medium truncate max-w-[54px]">
              {tab.label}
            </span>
            {isActive && (
              <span className="absolute bottom-0 w-6 h-0.5 bg-emerald-500 rounded-full" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
