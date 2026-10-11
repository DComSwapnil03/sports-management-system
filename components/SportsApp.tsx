'use client';

import React, { useState } from 'react';
import { ActiveTab, Team } from '../types/sports';
import { useSportsData } from '../hooks/useSportsData';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ToastContainer } from './Toast';
import { OverviewDashboard } from './OverviewDashboard';
import { TeamsRosterView } from './TeamsRosterView';
import { MatchSchedulerView } from './MatchSchedulerView';
import { StandingsView } from './StandingsView';
import { AnalyticsView } from './AnalyticsView';
import { RosterModal } from './RosterModal';
import { AddTeamModal } from './AddTeamModal';
import { NewMatchModal } from './NewMatchModal';
import { RotateCcw, AlertTriangle } from 'lucide-react';

export const SportsApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  // Modals state
  const [isNewMatchOpen, setIsNewMatchOpen] = useState(false);
  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false);
  const [selectedRosterTeam, setSelectedRosterTeam] = useState<Team | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const {
    teams,
    matches,
    standings,
    teamsMap,
    metrics,
    toasts,
    removeToast,
    addTeam,
    deleteTeam,
    addPlayer,
    removePlayer,
    togglePlayerStatus,
    scheduleMatch,
    updateMatchScore,
    setDirectScores,
    setMatchStatus,
    deleteMatch,
    resetDemoData,
  } = useSportsData();

  // If a team is selected for roster, synchronize with latest team data in state
  const currentRosterTeam = selectedRosterTeam
    ? teams.find((t) => t.id === selectedRosterTeam.id) || null
    : null;

  const handleOpenRoster = (team: Team) => {
    setSelectedRosterTeam(team);
  };

  const handleCloseRoster = () => {
    setSelectedRosterTeam(null);
  };

  const handleConfirmReset = () => {
    resetDemoData();
    setIsResetConfirmOpen(false);
    setSelectedRosterTeam(null);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] flex">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        liveMatchesCount={metrics.liveMatches}
        onResetData={() => setIsResetConfirmOpen(true)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        {/* Top Header */}
        <Header
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          searchQuery={globalSearch}
          setSearchQuery={setGlobalSearch}
          onOpenNewMatch={() => setIsNewMatchOpen(true)}
          teams={teams}
          matches={matches}
          onSelectTeam={(team) => {
            setActiveTab('teams');
            setSelectedRosterTeam(team);
          }}
        />

        {/* Dynamic View Container */}
        <main className="flex-1 mt-16 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'overview' && (
            <OverviewDashboard
              teams={teams}
              matches={matches}
              standings={standings}
              teamsMap={teamsMap}
              metrics={metrics}
              setActiveTab={setActiveTab}
              onOpenNewMatch={() => setIsNewMatchOpen(true)}
              onOpenAddTeam={() => setIsAddTeamOpen(true)}
              onUpdateScore={updateMatchScore}
              onSetStatus={setMatchStatus}
              onSelectTeam={handleOpenRoster}
            />
          )}

          {activeTab === 'teams' && (
            <TeamsRosterView
              teams={teams}
              standings={standings}
              onSelectTeam={handleOpenRoster}
              onOpenAddTeam={() => setIsAddTeamOpen(true)}
              onDeleteTeam={deleteTeam}
            />
          )}

          {activeTab === 'matches' && (
            <MatchSchedulerView
              matches={matches}
              teams={teams}
              teamsMap={teamsMap}
              onOpenNewMatch={() => setIsNewMatchOpen(true)}
              onUpdateScore={updateMatchScore}
              onSetDirectScores={setDirectScores}
              onSetStatus={setMatchStatus}
              onDeleteMatch={deleteMatch}
            />
          )}

          {activeTab === 'standings' && (
            <StandingsView
              standings={standings}
              teamsMap={teamsMap}
              onSelectTeam={handleOpenRoster}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              teams={teams}
              matches={matches}
              standings={standings}
              onResetData={() => setIsResetConfirmOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Roster Modal / Drawer */}
      <RosterModal
        team={currentRosterTeam}
        isOpen={!!currentRosterTeam}
        onClose={handleCloseRoster}
        onAddPlayer={addPlayer}
        onRemovePlayer={removePlayer}
        onToggleStatus={togglePlayerStatus}
      />

      {/* Add Team Modal */}
      <AddTeamModal
        isOpen={isAddTeamOpen}
        onClose={() => setIsAddTeamOpen(false)}
        onAddTeam={addTeam}
      />

      {/* New Match Fixture Modal */}
      <NewMatchModal
        isOpen={isNewMatchOpen}
        onClose={() => setIsNewMatchOpen(false)}
        teams={teams}
        onScheduleMatch={scheduleMatch}
      />

      {/* Reset Demo Data Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#1e293b] border border-[#334155] rounded-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Restore Seed Demo Data?</h3>
                <p className="text-xs text-slate-400">This will revert all modified teams & scores</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
              Resetting will restore the default 6 championship clubs, full 30-player rosters, 4 completed results, and 3 upcoming fixtures.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-red-500/20 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Yes, Reset Demo Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default SportsApp;
