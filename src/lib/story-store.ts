import { useSyncExternalStore } from "react";
import type { Story, StorySession } from "./story-types";
import { DEMO_STORY } from "./demo-story";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

function toJson(value: unknown): Json {
  return value as unknown as Json;
}

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
  syncStoryToCloud(story);
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
  syncSessionToCloud(session);
}

// Cloud sync: localStorage stays the instant store; when a parent is signed
// in, writes are mirrored to Lovable Cloud and cloud rows are merged in.

async function currentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export function syncStoryToCloud(story: Story) {
  void currentUserId().then((uid) => {
    if (!uid) return;
    void supabase.from("stories").upsert({
      id: story.id,
      user_id: uid,
      title: story.title,
      topic: story.topic,
      world: story.world,
      difficulty: story.difficulty,
      age: story.age,
      chapters: toJson(story.chapters),
      source: story.source,
    });
  });
}

export function syncSessionToCloud(session: StorySession) {
  void currentUserId().then((uid) => {
    if (!uid) return;
    void supabase.from("story_sessions").upsert(
      {
        user_id: uid,
        story_id: session.storyId,
        answers: toJson(session.answers),
        xp: session.xp,
        started_at: session.startedAt,
        completed_at: session.completedAt ?? null,
      },
      { onConflict: "user_id,story_id" },
    );
  });
}

let cloudLoaded = false;
export async function loadCloudData() {
  if (cloudLoaded) return;
  cloudLoaded = true;
  const uid = await currentUserId();
  if (!uid) return;
  const [{ data: cloudStories }, { data: cloudSessions }] = await Promise.all([
    supabase.from("stories").select("*"),
    supabase.from("story_sessions").select("*"),
  ]);
  if (cloudStories?.length) {
    const mapped: Story[] = cloudStories.map((row) => ({
      id: row.id,
      title: row.title,
      topic: row.topic,
      world: row.world as Story["world"],
      difficulty: row.difficulty as Story["difficulty"],
      age: row.age,
      chapters: row.chapters as unknown as Story["chapters"],
      createdAt: row.created_at,
      source: (row.source === "demo" ? "demo" : "ai") as Story["source"],
    }));
    const stored = readJson<Story[]>(STORIES_KEY, []);
    const known = new Set([...mapped.map((s) => s.id), DEMO_STORY.id]);
    const merged = [...mapped, ...stored.filter((s) => !known.has(s.id))];
    persist(STORIES_KEY, merged);
    storiesCache = [DEMO_STORY, ...merged.filter((s) => s.id !== DEMO_STORY.id)];
  }
  if (cloudSessions?.length) {
    const mapped: StorySession[] = cloudSessions.map((row) => ({
      storyId: row.story_id,
      answers: row.answers as unknown as StorySession["answers"],
      xp: row.xp,
      startedAt: row.started_at,
      ...(row.completed_at ? { completedAt: row.completed_at } : {}),
    }));
    const local = loadSessions();
    const known = new Set(mapped.map((s) => s.storyId));
    sessionsCache = [...mapped, ...local.filter((s) => !known.has(s.storyId))];
    persist(SESSIONS_KEY, sessionsCache);
  }
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
