import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import {
  DIFFICULTIES,
  MAX_AGE,
  MAX_TOPIC_LENGTH,
  MIN_AGE,
  STORY_LENGTHS,
  STORY_WORLDS,
} from "./story-types";

const inputSchema = z.object({
  age: z.number().int().min(MIN_AGE).max(MAX_AGE),
  topic: z.string().trim().min(2).max(MAX_TOPIC_LENGTH),
  world: z.enum(STORY_WORLDS),
  difficulty: z.enum(DIFFICULTIES),
  length: z.enum(STORY_LENGTHS),
});

export const generateStory = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const { generateStoryWithAi } = await import("./ai/story-ai.server");
    return generateStoryWithAi(getRequest(), data);
  });

const imageSchema = z.object({
  storyId: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  chapterIndex: z.number().int().min(0).max(9),
  scene: z.string().trim().min(3).max(1000),
  characterSheet: z.string().max(2000),
  topic: z.string().max(MAX_TOPIC_LENGTH),
});

export const generateChapterImage = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => imageSchema.parse(data))
  .handler(async ({ data }) => {
    const { generateChapterImageFile } = await import("./ai/story-image.server");
    return { url: await generateChapterImageFile(data) };
  });
