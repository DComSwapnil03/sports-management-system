'use client';

import React from 'react';
import { Flame, Plus, Shield } from 'lucide-react';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] flex animate-pulse">
      {/* Sidebar Skeleton */}
      <aside className="w-64 fixed top-0 left-0 h-full bg-[#0f172a] border-r border-[#334155]/60 flex flex-col z-40">
        <div className="h-16 flex items-center px-4 border-b border-[#334155]/60 bg-[#1e293b]/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/30 flex items-center justify-center">
              <Flame className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="h-3.5 w-24 bg-slate-700 rounded" />
              <div className="h-2.5 w-16 bg-slate-800 rounded mt-1.5" />
            </div>
          </div>
        </div>

        <div className="p-3 space-y-2 flex-1">
          <div className="h-2 w-20 bg-slate-800 rounded mx-2 my-2" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-slate-800/60 rounded-xl" />
          ))}
        </div>

        <div className="p-3 border-t border-[#334155]/60">
          <div className="h-9 bg-slate-800/50 rounded-xl" />
        </div>
      </aside>

      {/* Main Content Skeleton */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Header Skeleton */}
        <header className="fixed top-0 right-0 left-64 h-16 bg-[#0f172a]/80 backdrop-blur-md border-b border-[#334155]/60 flex items-center justify-between px-6 z-30">
          <div className="h-6 w-36 bg-slate-800 rounded-full" />
          <div className="h-9 w-72 bg-slate-800 rounded-xl" />
          <div className="h-8 w-28 bg-emerald-500/20 border border-emerald-500/30 rounded-xl" />
        </header>

        {/* Main Content Body */}
        <main className="flex-1 mt-16 p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* Welcome Banner Skeleton */}
          <div className="h-28 rounded-2xl bg-[#1e293b]/70 border border-[#334155] p-6 flex items-center justify-between">
            <div className="space-y-2.5">
              <div className="h-3 w-32 bg-emerald-500/20 rounded" />
              <div className="h-6 w-64 bg-slate-700 rounded" />
              <div className="h-3 w-96 bg-slate-800 rounded" />
            </div>
          </div>

          {/* KPI Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 rounded-2xl bg-[#1e293b]/80 border border-[#334155] p-5 space-y-3">
                <div className="flex justify-between">
                  <div className="h-3 w-20 bg-slate-700 rounded" />
                  <div className="w-8 h-8 rounded-lg bg-slate-800" />
                </div>
                <div className="h-8 w-16 bg-slate-700 rounded mt-2" />
              </div>
            ))}
          </div>

          {/* Ticker Skeleton */}
          <div className="space-y-3">
            <div className="h-4 w-48 bg-slate-700 rounded" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 rounded-2xl bg-[#1e293b]/60 border border-[#334155] p-4" />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
