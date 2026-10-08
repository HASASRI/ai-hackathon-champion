import { useSyncExternalStore } from "react";
import type { Story, StorySession } from "./story-types";
import { DEMO_STORY } from "./demo-story";

// Local in-browser store for stories and sessions (Phase 2).
// Phase 4 replaces persistence with Lovable Cloud tables.
// Snapshots are cached and only replaced on write — useSyncExternalStore
// requires getSnapshot to return a stable reference between changes.

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

const listeners = new Set<() => void>();
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

let storiesCache: Story[] | null = null;
let sessionsCache: StorySession[] | null = null;

function loadStories(): Story[] {
  if (storiesCache) return storiesCache;
  const stored = readJson<Story[]>(STORIES_KEY, []);
  storiesCache = [DEMO_STORY, ...stored.filter((s) => s.id !== DEMO_STORY.id)];
  return storiesCache;
}

function loadSessions(): StorySession[] {
  if (sessionsCache) return sessionsCache;
  sessionsCache = readJson<StorySession[]>(SESSIONS_KEY, []);
  return sessionsCache;
}

function persist(key: string, value: unknown) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
  listeners.forEach((l) => l());
}

export function getStories(): Story[] {
  return loadStories();
}

export function getStory(id: string): Story | undefined {
  return loadStories().find((s) => s.id === id);
}

export function saveStory(story: Story) {
  const stored = readJson<Story[]>(STORIES_KEY, []).filter((s) => s.id !== story.id);
  persist(STORIES_KEY, [story, ...stored]);
  storiesCache = [DEMO_STORY, ...[story, ...stored].filter((s) => s.id !== DEMO_STORY.id)];
}

export function getSessions(): StorySession[] {
  return loadSessions();
}

export function getSession(storyId: string): StorySession | undefined {
  return loadSessions().find((s) => s.storyId === storyId);
}

export function saveSession(session: StorySession) {
  const next = [session, ...loadSessions().filter((s) => s.storyId !== session.storyId)];
  sessionsCache = next;
  persist(SESSIONS_KEY, next);
}

// Stable server snapshots — a fresh reference per call would loop forever.
const SERVER_STORIES: Story[] = [DEMO_STORY];
const SERVER_SESSIONS: StorySession[] = [];

export function useStories(): Story[] {
  return useSyncExternalStore(subscribe, loadStories, () => SERVER_STORIES);
}

export function useSessions(): StorySession[] {
  return useSyncExternalStore(subscribe, loadSessions, () => SERVER_SESSIONS);
}
