import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";

const inputSchema = z.object({
  childName: z.string().trim().min(1).max(40),
  age: z.number().int().min(6).max(12),
  subject: z.string().trim().min(1).max(60),
  topic: z.string().trim().min(2).max(120),
});

export const generateStory = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const { generateStoryWithAi } = await import("./ai/story-ai.server");
    return generateStoryWithAi(getRequest(), data);
  });
