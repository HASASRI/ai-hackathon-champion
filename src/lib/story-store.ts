import { useSyncExternalStore } from "react";
import type { Story, StorySession } from "./story-types";
import { DEMO_STORY } from "./demo-story";

// Local in-browser store for stories and sessions (Phase 2).
// Phase 4 replaces persistence with Lovable Cloud tables.

const STORIES_KEY = "sq_stories";
const SESSIONS_KEY = "sq_sessions";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
  listeners.forEach((l) => l());
}

const listeners = new Set<() => void>();
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getStories(): Story[] {
  const stored = readJson<Story[]>(STORIES_KEY, []);
  return [DEMO_STORY, ...stored.filter((s) => s.id !== DEMO_STORY.id)];
}

export function getStory(id: string): Story | undefined {
  return getStories().find((s) => s.id === id);
}

export function saveStory(story: Story) {
  const stored = readJson<Story[]>(STORIES_KEY, []);
  writeJson(STORIES_KEY, [story, ...stored.filter((s) => s.id !== story.id)]);
}

export function getSessions(): StorySession[] {
  return readJson<StorySession[]>(SESSIONS_KEY, []);
}

export function getSession(storyId: string): StorySession | undefined {
  return getSessions().find((s) => s.storyId === storyId);
}

export function saveSession(session: StorySession) {
  const sessions = getSessions().filter((s) => s.storyId !== session.storyId);
  writeJson(SESSIONS_KEY, [session, ...sessions]);
}

// Stable server snapshots — useSyncExternalStore loops if these change identity.
const SERVER_STORIES: Story[] = [DEMO_STORY];
const SERVER_SESSIONS: StorySession[] = [];

export function useStories(): Story[] {
  return useSyncExternalStore(subscribe, getStories, () => SERVER_STORIES);
}

export function useSessions(): StorySession[] {
  return useSyncExternalStore(subscribe, getSessions, () => SERVER_SESSIONS);
}
