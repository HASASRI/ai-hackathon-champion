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
