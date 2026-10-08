import {
  DIFFICULTIES,
  MAX_AGE,
  MAX_TOPIC_LENGTH,
  MIN_AGE,
  STORY_LENGTHS,
  STORY_WORLDS,
  type StoryRequest,
} from "./story-types";

export interface ValidationResult {
  ok: boolean;
  errors: string[];
}

// Shared client + server validation for story creation requests.
export function validateStoryRequest(input: Partial<StoryRequest>): ValidationResult {
  const errors: string[] = [];

  if (
    typeof input.age !== "number" ||
    !Number.isInteger(input.age) ||
    input.age < MIN_AGE ||
    input.age > MAX_AGE
  ) {
    errors.push(`Age must be a whole number between ${MIN_AGE} and ${MAX_AGE}.`);
  }

  const topic = (input.topic ?? "").trim();
  if (topic.length === 0) {
    errors.push("Please enter a topic.");
  } else if (topic.length > MAX_TOPIC_LENGTH) {
    errors.push(`Topic must be ${MAX_TOPIC_LENGTH} characters or fewer.`);
  }

  if (!STORY_WORLDS.includes(input.world as never)) {
    errors.push("Please choose a story world.");
  }
  if (!DIFFICULTIES.includes(input.difficulty as never)) {
    errors.push("Please choose a difficulty.");
  }
  if (!STORY_LENGTHS.includes(input.length as never)) {
    errors.push("Please choose a story length.");
  }

  return { ok: errors.length === 0, errors };
}
