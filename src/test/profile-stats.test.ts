import { describe, expect, it } from "vitest";
import { averageScore, learningMinutes, learningStreak } from "../lib/profile-stats";
import type { StorySession } from "../lib/story-types";

const s = (startedAt: string, completedAt?: string, correct: boolean[] = []): StorySession => ({
  storyId: startedAt,
  xp: 0,
  startedAt,
  ...(completedAt ? { completedAt } : {}),
  answers: correct.map((c, i) => ({ chapterIndex: i, concept: "x", correct: c })),
});

describe("profile stats", () => {
  it("averages correct answers across sessions", () => {
    expect(averageScore([s("2026-10-01T10:00:00Z", undefined, [true, false, true, true])])).toBe(75);
  });
  it("counts consecutive days ending today", () => {
    const now = new Date("2026-10-08T12:00:00Z");
    const sessions = [s("2026-10-08T09:00:00Z"), s("2026-10-07T09:00:00Z"), s("2026-10-05T09:00:00Z")];
    expect(learningStreak(sessions, now)).toBe(2);
  });
  it("caps each session at 60 minutes", () => {
    expect(learningMinutes([s("2026-10-01T10:00:00Z", "2026-10-01T13:00:00Z"), s("2026-10-02T10:00:00Z", "2026-10-02T10:10:00Z")])).toBe(70);
  });
});
