import { createOpenAI } from "@ai-sdk/openai";
import { streamText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayRunIdFetch, getLovableAiGatewayRunId } from "./run-id";
import type { Story, StoryChapter } from "../story-types";

// Server-only module: the gateway key and prompt never leave the server.

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1";
const MODEL = "openai/gpt-6-astra";

// Strict-schema compatible: every property required, optionals nullable,
// single object root, no defaults.
const checkpointSchema = z.object({
  concept: z.string(),
  question: z.string(),
  options: z.array(z.string()).length(4),
  correctIndex: z.number().int().min(0).max(3),
  explanation: z.string(),
  reteach: z.string(),
});

const chapterSchema = z.object({
  title: z.string(),
  content: z.string(),
  checkpoint: checkpointSchema.nullable(),
});

const storySchema = z.object({
  title: z.string(),
  summary: z.string(),
  estimatedMinutes: z.number().int().min(3).max(15),
  chapters: z.array(chapterSchema).min(3).max(5),
});

export interface GenerateStoryInput {
  childName: string;
  age: number;
  subject: string;
  topic: string;
}

function buildPrompt(input: GenerateStoryInput): string {
  return [
    `Write an interactive learning story for ${input.childName}, age ${input.age}.`,
    `Subject: ${input.subject}. Topic to teach: ${input.topic}.`,
    `Requirements:`,
    `- 4 chapters. Chapters 1-3 each end with a checkpoint quiz about ONE core concept of the topic; chapter 4 is the finale with checkpoint: null.`,
    `- Story first: a vivid adventure where the hero must USE the concept to progress. Age-appropriate vocabulary for age ${input.age}.`,
    `- Each chapter's content is 3-5 short paragraphs separated by blank lines.`,
    `- Each checkpoint: a clear question, exactly 4 options, correctIndex (0-3), a short encouraging explanation of the right answer, and a "reteach" text that re-explains the concept a different, simpler way (shown when the child answers wrong).`,
    `- The single most common wrong option should reflect the classic misconception about that concept.`,
    `- estimatedMinutes: realistic reading time for the age group.`,
    `- Keep everything safe, warm, and encouraging for children. No violence, no scary content.`,
  ].join("\n");
}

export async function generateStoryWithAi(
  request: Request,
  input: GenerateStoryInput,
): Promise<Story> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI key not configured");

  const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
  const provider = createOpenAI({
    baseURL: GATEWAY_URL,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });

  const result = streamText({
    model: provider.responses(MODEL),
    messages: [{ role: "user", content: buildPrompt(input) }],
    abortSignal: request.signal,
    output: Output.object({ schema: storySchema }),
    providerOptions: {
      openai: {
        store: false,
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        include: ["reasoning.encrypted_content"],
      },
    },
  });

  const generated = await result.output;
  if (!generated) throw new Error("AI returned no story");

  const storyId = `story-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const chapters: StoryChapter[] = generated.chapters.map((c, i) => ({
    id: `${storyId}-ch${i + 1}`,
    title: c.title,
    content: c.content,
    ...(c.checkpoint ? { checkpoint: c.checkpoint } : {}),
  }));

  return {
    id: storyId,
    title: generated.title,
    summary: generated.summary,
    childName: input.childName,
    age: input.age,
    subject: input.subject,
    topic: input.topic,
    estimatedMinutes: generated.estimatedMinutes,
    chapters,
    createdAt: new Date().toISOString(),
    source: "ai",
  };
}
