import type { StorySession } from "./story-types";

const DAY = 86_400_000;
const MAX_SESSION_MINUTES = 60;

function dayKey(iso: string): number {
  const d = new Date(iso);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

export function averageScore(sessions: StorySession[]): number {
  const answers = sessions.flatMap((s) => s.answers);
  if (!answers.length) return 0;
  return Math.round((answers.filter((a) => a.correct).length / answers.length) * 100);
}

// Consecutive learning days ending today (or yesterday, so the streak survives until tonight).
export function learningStreak(sessions: StorySession[], now = new Date()): number {
  const days = new Set<number>();
  sessions.forEach((s) => {
    days.add(dayKey(s.startedAt));
    if (s.completedAt) days.add(dayKey(s.completedAt));
  });
  let cursor = dayKey(now.toISOString());
  if (!days.has(cursor)) cursor -= DAY;
  let streak = 0;
  while (days.has(cursor)) {
    streak++;
    cursor -= DAY;
  }
  return streak;
}

export function learningMinutes(sessions: StorySession[]): number {
  return sessions.reduce((sum, s) => {
    if (!s.completedAt) return sum;
    const mins = (new Date(s.completedAt).getTime() - new Date(s.startedAt).getTime()) / 60000;
    return sum + Math.min(Math.max(mins, 0), MAX_SESSION_MINUTES);
  }, 0);
}

export const AVATARS = ["🦊", "🦉", "🤖", "🦄", "🦖", "🚀", "🐼", "🐙"] as const;
