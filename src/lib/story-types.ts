// Core story domain types shared by the player, demo content, and AI generation.

export const STORY_WORLDS = [
  "Sky Pirates",
  "Coral Reef Kingdom",
  "Space Station",
  "Enchanted Forest",
  "Dinosaur Valley",
  "Robot City",
] as const;

export const DIFFICULTIES = ["Gentle", "Adventurous", "Spicy"] as const;

export const STORY_LENGTHS = ["Short", "Medium", "Long"] as const;

export type StoryWorld = (typeof STORY_WORLDS)[number];
export type Difficulty = (typeof DIFFICULTIES)[number];
export type StoryLength = (typeof STORY_LENGTHS)[number];

export const MIN_AGE = 6;
export const MAX_AGE = 12;
export const MAX_TOPIC_LENGTH = 80;

export interface StoryRequest {
  age: number;
  topic: string;
  world: StoryWorld;
  difficulty: Difficulty;
  length: StoryLength;
}

export interface CheckpointOption {
  id: string;
  text: string;
  isCorrect: boolean;
  // Shown when this wrong option is picked — names the misconception it reveals.
  misconception?: string;
}

export interface Checkpoint {
  concept: string;
  question: string;
  options: CheckpointOption[];
  // Shown after a correct answer.
  explanation: string;
  // Re-teach segment inserted when the child answers wrong.
  reteach: string;
}

export interface Chapter {
  title: string;
  text: string;
  checkpoint?: Checkpoint;
  // Scene description used to illustrate this chapter.
  imagePrompt?: string;
  // Saved illustration — generated once, then reused.
  imageUrl?: string;
}

export interface Story {
  id: string;
  title: string;
  topic: string;
  world: StoryWorld;
  difficulty: Difficulty;
  age: number;
  chapters: Chapter[];
  createdAt: string;
  source: "demo" | "ai";
  // Shared look of the cast + art style so every chapter image matches.
  characterSheet?: string;
}

export interface AnswerRecord {
  chapterIndex: number;
  concept: string;
  correct: boolean;
  misconception?: string;
}

export interface StorySession {
  storyId: string;
  answers: AnswerRecord[];
  xp: number;
  startedAt: string;
  completedAt?: string;
}

export const XP_PER_CORRECT = 50;
export const XP_COMPLETION_BONUS = 100;
