'use client';

import React from 'react';
import { Flame } from 'lucide-react';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-[#f8fafc] flex animate-pulse">
      {/* Sidebar Skeleton (hidden on mobile, visible on desktop) */}
      <aside className="w-64 fixed top-0 left-0 h-full bg-white dark:bg-[#0f172a] border-r border-slate-200 dark:border-[#334155]/60 flex-col z-40 hidden lg:flex">
        <div className="h-16 flex items-center px-4 border-b border-slate-200 dark:border-[#334155]/60 bg-slate-50 dark:bg-[#1e293b]/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Flame className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <div className="h-3.5 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-2.5 w-16 bg-slate-200 dark:bg-slate-800 rounded mt-1.5" />
            </div>
          </div>
        </div>

        <div className="p-3 space-y-2 flex-1">
          <div className="h-2 w-20 bg-slate-200 dark:bg-slate-800 rounded mx-2 my-2" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-slate-100 dark:bg-slate-800/60 rounded-xl" />
          ))}
        </div>

        <div className="p-3 border-t border-slate-200 dark:border-[#334155]/60">
          <div className="h-9 bg-slate-100 dark:bg-slate-800/50 rounded-xl" />
        </div>
      </aside>

      {/* Main Content Skeleton */}
      <div className="flex-1 ml-0 lg:ml-64 flex flex-col min-h-screen">
        {/* Header Skeleton */}
        <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-200 dark:border-[#334155]/60 flex items-center justify-between px-4 sm:px-6 z-30">
          <div className="h-6 w-24 sm:w-36 bg-slate-200 dark:bg-slate-800 rounded-full" />
          <div className="h-9 w-40 sm:w-72 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-8 w-20 sm:w-28 bg-emerald-500/20 border border-emerald-500/30 rounded-xl" />
        </header>

        {/* Main Content Body */}
        <main className="flex-1 mt-16 p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-5 sm:space-y-6">
          {/* Welcome Banner Skeleton */}
          <div className="h-28 rounded-2xl bg-white dark:bg-[#1e293b]/70 border border-slate-200 dark:border-[#334155] p-5 sm:p-6 flex items-center justify-between">
            <div className="space-y-2.5">
              <div className="h-3 w-32 bg-emerald-500/20 rounded" />
              <div className="h-6 w-56 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-3 w-72 sm:w-96 bg-slate-200 dark:bg-slate-800 rounded hidden sm:block" />
            </div>
          </div>

          {/* KPI Cards Skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 sm:h-32 rounded-2xl bg-white dark:bg-[#1e293b]/80 border border-slate-200 dark:border-[#334155] p-4 sm:p-5 space-y-2 sm:space-y-3">
                <div className="flex justify-between">
                  <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 dark:bg-slate-800" />
                </div>
                <div className="h-7 sm:h-8 w-14 bg-slate-200 dark:bg-slate-700 rounded mt-2" />
              </div>
            ))}
          </div>

          {/* Ticker Skeleton */}
          <div className="space-y-3">
            <div className="h-4 w-48 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-36 sm:h-40 rounded-2xl bg-white/60 dark:bg-[#1e293b]/60 border border-slate-200 dark:border-[#334155] p-4" />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
