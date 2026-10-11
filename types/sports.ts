export type SportType = 'Football' | 'Basketball' | 'Soccer' | 'Rugby' | 'Volleyball';

export type PlayerPosition = 
  | 'Forward' 
  | 'Striker' 
  | 'Midfielder' 
  | 'Defender' 
  | 'Goalkeeper' 
  | 'Winger' 
  | 'Guard' 
  | 'Center';

export type PlayerStatus = 'Active' | 'Injured' | 'Suspended';

export interface Player {
  id: string;
  teamId: string;
  name: string;
  jerseyNumber: number;
  position: PlayerPosition;
  status: PlayerStatus;
  goals: number;
  assists: number;
  matchesPlayed: number;
  rating?: number;
  nationality?: string;
}

export interface Team {
  id: string;
  name: string;
  shortCode: string;
  sport: SportType;
  coach: string;
  venue: string;
  foundedYear: number;
  primaryColor: string; // e.g. '#10b981', '#3b82f6', '#f59e0b'
  secondaryColor?: string;
  city: string;
  logoIcon: string; // Lucide icon identifier or initials
  players: Player[];
}

export type MatchStatus = 'scheduled' | 'live' | 'completed';

export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  date: string; // ISO date 'YYYY-MM-DD'
  time: string; // e.g. '19:30'
  venue: string;
  round: number | string;
  status: MatchStatus;
  minute?: number; // For live matches (e.g. 64')
  highlights?: string[];
}

export interface StandingRow {
  rank: number;
  teamId: string;
  teamName: string;
  shortCode: string;
  primaryColor: string;
  city: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
}

export type ActiveTab = 'overview' | 'teams' | 'matches' | 'standings' | 'analytics';
