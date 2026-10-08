import { createOpenAI } from "@ai-sdk/openai";
import { streamText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayRunIdFetch, getLovableAiGatewayRunId } from "./run-id";
import type { Chapter, Story, StoryRequest } from "../story-types";

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
  // Index of the wrong option that reveals the classic misconception.
  misconceptionIndex: z.number().int().min(0).max(3),
  misconception: z.string(),
  explanation: z.string(),
  reteach: z.string(),
});

const chapterSchema = z.object({
  title: z.string(),
  text: z.string(),
  checkpoint: checkpointSchema.nullable(),
});

const storySchema = z.object({
  title: z.string(),
  chapters: z.array(chapterSchema).min(3).max(5),
});

function buildPrompt(request: StoryRequest): string {
  const chapterCount = request.length === "Short" ? 3 : request.length === "Long" ? 5 : 4;
  return [
    `Write an interactive learning story for a child age ${request.age}.`,
    `Topic to teach: ${request.topic}. Story world: ${request.world}. Difficulty: ${request.difficulty}.`,
    `Requirements:`,
    `- Exactly ${chapterCount} chapters. All chapters except the finale end with a checkpoint quiz about ONE core concept of the topic; the finale's checkpoint is null.`,
    `- Story first: a vivid adventure in the ${request.world} world where the hero must USE the concept to progress. Vocabulary suited to age ${request.age}, difficulty "${request.difficulty}".`,
    `- Each chapter's text is 3-5 short paragraphs separated by blank lines.`,
    `- Each checkpoint: a clear question, exactly 4 options, correctIndex (0-3), a short encouraging explanation of the right answer, and a "reteach" text that re-explains the concept a different, simpler way (shown when the child answers wrong).`,
    `- misconceptionIndex points at the wrong option that reflects the classic misconception about the concept; misconception names that misconception in one sentence for the parent report.`,
    `- Keep everything safe, warm, and encouraging for children. No violence, no scary content.`,
  ].join("\n");
}

export async function generateStoryWithAi(
  request: Request,
  input: StoryRequest,
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
  const chapters: Chapter[] = generated.chapters.map((c, i) => ({
    title: c.title,
    text: c.text,
    ...(c.checkpoint
      ? {
          checkpoint: {
            concept: c.checkpoint.concept,
            question: c.checkpoint.question,
            options: c.checkpoint.options.map((text, oi) => ({
              id: `${storyId}-ch${i + 1}-opt${oi + 1}`,
              text,
              isCorrect: oi === c.checkpoint!.correctIndex,
              ...(oi === c.checkpoint!.misconceptionIndex && oi !== c.checkpoint!.correctIndex
                ? { misconception: c.checkpoint!.misconception }
                : {}),
            })),
            explanation: c.checkpoint.explanation,
            reteach: c.checkpoint.reteach,
          },
        }
      : {}),
  }));

  return {
    id: storyId,
    title: generated.title,
    topic: input.topic,
    world: input.world,
    difficulty: input.difficulty,
    age: input.age,
    chapters,
    createdAt: new Date().toISOString(),
    source: "ai",
  };
}
