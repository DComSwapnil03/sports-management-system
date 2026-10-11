import { Team, Match, StandingRow } from '../types/sports';

export function calculateStandings(teams: Team[], matches: Match[]): StandingRow[] {
  // Map of team stats initialized
  const statsMap: Record<string, {
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    points: number;
    form: ('W' | 'D' | 'L')[];
  }> = {};

  teams.forEach((t) => {
    statsMap[t.id] = {
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
      form: [],
    };
  });

  // Sort matches chronologically to produce accurate form guide
  const completedMatches = matches
    .filter((m) => m.status === 'completed')
    .sort((a, b) => new Date(`${a.date}T${a.time || '00:00'}`).getTime() - new Date(`${b.date}T${b.time || '00:00'}`).getTime());

  completedMatches.forEach((match) => {
    const home = statsMap[match.homeTeamId];
    const away = statsMap[match.awayTeamId];

    if (!home || !away) return;

    home.played += 1;
    away.played += 1;
    home.goalsFor += match.homeScore;
    home.goalsAgainst += match.awayScore;
    away.goalsFor += match.awayScore;
    away.goalsAgainst += match.homeScore;

    if (match.homeScore > match.awayScore) {
      // Home win
      home.won += 1;
      home.points += 3;
      home.form.push('W');

      away.lost += 1;
      away.form.push('L');
    } else if (match.homeScore < match.awayScore) {
      // Away win
      away.won += 1;
      away.points += 3;
      away.form.push('W');

      home.lost += 1;
      home.form.push('L');
    } else {
      // Draw
      home.drawn += 1;
      home.points += 1;
      home.form.push('D');

      away.drawn += 1;
      away.points += 1;
      away.form.push('D');
    }
  });

  // Convert to array and calculate GD
  const rows: Omit<StandingRow, 'rank'>[] = teams.map((team) => {
    const stats = statsMap[team.id] || {
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
      form: [],
    };

    const goalDiff = stats.goalsFor - stats.goalsAgainst;
    // Keep last 5 matches for form
    const recentForm = stats.form.slice(-5);

    return {
      teamId: team.id,
      teamName: team.name,
      shortCode: team.shortCode,
      primaryColor: team.primaryColor,
      city: team.city,
      played: stats.played,
      won: stats.won,
      drawn: stats.drawn,
      lost: stats.lost,
      goalsFor: stats.goalsFor,
      goalsAgainst: stats.goalsAgainst,
      goalDiff,
      points: stats.points,
      form: recentForm,
    };
  });

  // Sort by Points (desc), Goal Difference (desc), Goals For (desc), Team Name (asc)
  rows.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.teamName.localeCompare(b.teamName);
  });

  // Assign ranks
  return rows.map((row, index) => ({
    ...row,
    rank: index + 1,
  }));
}
