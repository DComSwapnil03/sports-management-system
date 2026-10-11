'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Team, Match, Player, MatchStatus, StandingRow, PlayerPosition, PlayerStatus, SportType } from '../types/sports';
import { INITIAL_TEAMS, INITIAL_MATCHES } from '../data/seedData';
import { calculateStandings } from '../utils/standings';

const STORAGE_KEY_TEAMS = 'apex_sports_teams_v1';
const STORAGE_KEY_MATCHES = 'apex_sports_matches_v1';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

export function useSportsData() {
  const [isLoaded, setIsLoaded] = useState(true);
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast notification helper
  const addToast = useCallback((type: ToastMessage['type'], title: string, message: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Initialize from LocalStorage on mount
  useEffect(() => {
    try {
      const storedTeams = localStorage.getItem(STORAGE_KEY_TEAMS);
      const storedMatches = localStorage.getItem(STORAGE_KEY_MATCHES);

      if (storedTeams) {
        setTeams(JSON.parse(storedTeams));
      } else {
        localStorage.setItem(STORAGE_KEY_TEAMS, JSON.stringify(INITIAL_TEAMS));
      }

      if (storedMatches) {
        setMatches(JSON.parse(storedMatches));
      } else {
        localStorage.setItem(STORAGE_KEY_MATCHES, JSON.stringify(INITIAL_MATCHES));
      }
    } catch (err) {
      console.error('Failed to load local storage data:', err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save changes to LocalStorage
  const persistTeams = useCallback((updatedTeams: Team[]) => {
    setTeams(updatedTeams);
    try {
      localStorage.setItem(STORAGE_KEY_TEAMS, JSON.stringify(updatedTeams));
    } catch (e) {
      console.error('Failed to persist teams:', e);
    }
  }, []);

  const persistMatches = useCallback((updatedMatches: Match[]) => {
    setMatches(updatedMatches);
    try {
      localStorage.setItem(STORAGE_KEY_MATCHES, JSON.stringify(updatedMatches));
    } catch (e) {
      console.error('Failed to persist matches:', e);
    }
  }, []);

  // Automated Standings Calculation
  const standings = useMemo<StandingRow[]>(() => {
    return calculateStandings(teams, matches);
  }, [teams, matches]);

  // Reset to Demo Data
  const resetDemoData = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TEAMS, JSON.stringify(INITIAL_TEAMS));
      localStorage.setItem(STORAGE_KEY_MATCHES, JSON.stringify(INITIAL_MATCHES));
      setTeams(INITIAL_TEAMS);
      setMatches(INITIAL_MATCHES);
      addToast('info', 'Demo Data Restored', 'Reset system to initial 6 teams, full rosters, and seed fixtures.');
    } catch (e) {
      console.error('Error resetting demo data:', e);
    }
  }, [addToast]);

  // Team Actions
  const addTeam = useCallback(
    (teamData: {
      name: string;
      shortCode: string;
      sport: SportType;
      coach: string;
      venue: string;
      city: string;
      primaryColor: string;
    }) => {
      const newTeamId = `team-${Date.now()}`;
      const newTeam: Team = {
        id: newTeamId,
        name: teamData.name.trim(),
        shortCode: teamData.shortCode.trim().toUpperCase() || teamData.name.substring(0, 3).toUpperCase(),
        sport: teamData.sport,
        coach: teamData.coach.trim(),
        venue: teamData.venue.trim(),
        city: teamData.city.trim() || 'Metro District',
        foundedYear: new Date().getFullYear(),
        primaryColor: teamData.primaryColor || '#10b981',
        logoIcon: 'Shield',
        players: [
          {
            id: `p-${Date.now()}-1`,
            teamId: newTeamId,
            name: `${teamData.coach.split(' ')[0] || 'Alex'} Star`,
            jerseyNumber: 10,
            position: 'Striker',
            status: 'Active',
            goals: 0,
            assists: 0,
            matchesPlayed: 0,
            rating: 8.0,
            nationality: 'Domestic',
          },
        ],
      };

      const updated = [newTeam, ...teams];
      persistTeams(updated);
      addToast('success', 'Team Registered', `"${newTeam.name}" successfully added to the league.`);
      return newTeam;
    },
    [teams, persistTeams, addToast]
  );

  const deleteTeam = useCallback(
    (teamId: string) => {
      const teamToDelete = teams.find((t) => t.id === teamId);
      const updatedTeams = teams.filter((t) => t.id !== teamId);
      // Also remove matches involving this team
      const updatedMatches = matches.filter((m) => m.homeTeamId !== teamId && m.awayTeamId !== teamId);
      persistTeams(updatedTeams);
      persistMatches(updatedMatches);
      addToast('warning', 'Team Removed', `"${teamToDelete?.name || 'Team'}" and its fixtures have been removed.`);
    },
    [teams, matches, persistTeams, persistMatches, addToast]
  );

  // Player Actions
  const addPlayer = useCallback(
    (
      teamId: string,
      playerData: {
        name: string;
        jerseyNumber: number;
        position: PlayerPosition;
        status: PlayerStatus;
        nationality?: string;
      }
    ) => {
      const newPlayer: Player = {
        id: `p-${Date.now()}`,
        teamId,
        name: playerData.name.trim(),
        jerseyNumber: Number(playerData.jerseyNumber),
        position: playerData.position,
        status: playerData.status,
        goals: 0,
        assists: 0,
        matchesPlayed: 0,
        nationality: playerData.nationality || 'Pro League',
        rating: 7.5,
      };

      const updatedTeams = teams.map((team) => {
        if (team.id === teamId) {
          return {
            ...team,
            players: [...team.players, newPlayer],
          };
        }
        return team;
      });

      persistTeams(updatedTeams);
      addToast('success', 'Player Enrolled', `${newPlayer.name} (#${newPlayer.jerseyNumber}) added to roster.`);
    },
    [teams, persistTeams, addToast]
  );

  const removePlayer = useCallback(
    (teamId: string, playerId: string) => {
      let playerName = '';
      const updatedTeams = teams.map((team) => {
        if (team.id === teamId) {
          const target = team.players.find((p) => p.id === playerId);
          if (target) playerName = target.name;
          return {
            ...team,
            players: team.players.filter((p) => p.id !== playerId),
          };
        }
        return team;
      });

      persistTeams(updatedTeams);
      addToast('info', 'Player Released', `${playerName || 'Player'} has been removed from roster.`);
    },
    [teams, persistTeams, addToast]
  );

  const togglePlayerStatus = useCallback(
    (teamId: string, playerId: string) => {
      let newStatus: PlayerStatus = 'Active';
      const updatedTeams = teams.map((team) => {
        if (team.id === teamId) {
          return {
            ...team,
            players: team.players.map((p) => {
              if (p.id === playerId) {
                newStatus = p.status === 'Active' ? 'Injured' : 'Active';
                return { ...p, status: newStatus };
              }
              return p;
            }),
          };
        }
        return team;
      });

      persistTeams(updatedTeams);
      addToast('info', 'Status Updated', `Player status changed to ${newStatus}.`);
    },
    [teams, persistTeams, addToast]
  );

  // Match Actions
  const scheduleMatch = useCallback(
    (matchData: {
      homeTeamId: string;
      awayTeamId: string;
      date: string;
      time: string;
      venue: string;
      round?: number | string;
    }) => {
      if (matchData.homeTeamId === matchData.awayTeamId) {
        addToast('error', 'Invalid Fixture', 'Home team and Away team cannot be the same!');
        return false;
      }

      const homeTeam = teams.find((t) => t.id === matchData.homeTeamId);
      const awayTeam = teams.find((t) => t.id === matchData.awayTeamId);

      const newMatch: Match = {
        id: `m-${Date.now()}`,
        homeTeamId: matchData.homeTeamId,
        awayTeamId: matchData.awayTeamId,
        homeScore: 0,
        awayScore: 0,
        date: matchData.date,
        time: matchData.time || '19:00',
        venue: matchData.venue || homeTeam?.venue || 'League Arena',
        round: matchData.round || Math.floor(matches.length / 3) + 1,
        status: 'scheduled',
      };

      const updated = [newMatch, ...matches];
      persistMatches(updated);
      addToast(
        'success',
        'Fixture Scheduled',
        `${homeTeam?.name || 'Home'} vs ${awayTeam?.name || 'Away'} on ${matchData.date}`
      );
      return true;
    },
    [teams, matches, persistMatches, addToast]
  );

  const updateMatchScore = useCallback(
    (matchId: string, homeDelta: number, awayDelta: number) => {
      const updatedMatches = matches.map((match) => {
        if (match.id === matchId) {
          const newHome = Math.max(0, match.homeScore + homeDelta);
          const newAway = Math.max(0, match.awayScore + awayDelta);
          return {
            ...match,
            homeScore: newHome,
            awayScore: newAway,
            // If it was scheduled and score is bumped, automatically put it in live mode
            status: match.status === 'scheduled' ? 'live' : match.status,
          };
        }
        return match;
      });

      persistMatches(updatedMatches);
    },
    [matches, persistMatches]
  );

  const setDirectScores = useCallback(
    (matchId: string, homeScore: number, awayScore: number) => {
      const updatedMatches = matches.map((match) => {
        if (match.id === matchId) {
          return {
            ...match,
            homeScore: Math.max(0, homeScore),
            awayScore: Math.max(0, awayScore),
          };
        }
        return match;
      });
      persistMatches(updatedMatches);
    },
    [matches, persistMatches]
  );

  const setMatchStatus = useCallback(
    (matchId: string, status: MatchStatus) => {
      const match = matches.find((m) => m.id === matchId);
      const homeTeam = teams.find((t) => t.id === match?.homeTeamId);
      const awayTeam = teams.find((t) => t.id === match?.awayTeamId);

      const updatedMatches = matches.map((m) => {
        if (m.id === matchId) {
          return {
            ...m,
            status,
            minute: status === 'live' ? 1 : undefined,
          };
        }
        return m;
      });

      persistMatches(updatedMatches);

      if (status === 'completed') {
        addToast(
          'success',
          'Match Finalized!',
          `Result logged: ${homeTeam?.name} ${match?.homeScore} - ${match?.awayScore} ${awayTeam?.name}. Standings updated!`
        );
      } else if (status === 'live') {
        addToast('info', 'Match In Progress', `${homeTeam?.name} vs ${awayTeam?.name} is now LIVE.`);
      }
    },
    [matches, teams, persistMatches, addToast]
  );

  const deleteMatch = useCallback(
    (matchId: string) => {
      const updatedMatches = matches.filter((m) => m.id !== matchId);
      persistMatches(updatedMatches);
      addToast('warning', 'Fixture Deleted', 'Match has been removed from schedule.');
    },
    [matches, persistMatches, addToast]
  );

  // Helper map for quick team lookup
  const teamsMap = useMemo(() => {
    const map = new Map<string, Team>();
    teams.forEach((t) => map.set(t.id, t));
    return map;
  }, [teams]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const totalTeams = teams.length;
    const totalPlayers = teams.reduce((acc, t) => acc + t.players.length, 0);
    const activePlayers = teams.reduce(
      (acc, t) => acc + t.players.filter((p) => p.status === 'Active').length,
      0
    );
    const injuredPlayers = totalPlayers - activePlayers;
    const completedMatches = matches.filter((m) => m.status === 'completed').length;
    const upcomingMatches = matches.filter((m) => m.status === 'scheduled').length;
    const liveMatches = matches.filter((m) => m.status === 'live').length;
    const totalGoals = matches
      .filter((m) => m.status === 'completed' || m.status === 'live')
      .reduce((acc, m) => acc + m.homeScore + m.awayScore, 0);

    return {
      totalTeams,
      totalPlayers,
      activePlayers,
      injuredPlayers,
      completedMatches,
      upcomingMatches,
      liveMatches,
      totalGoals,
    };
  }, [teams, matches]);

  return {
    isLoaded,
    teams,
    matches,
    standings,
    teamsMap,
    metrics,
    toasts,
    addToast,
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
  };
}
