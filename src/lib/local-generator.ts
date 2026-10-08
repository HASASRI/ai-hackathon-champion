import type { Story, StoryRequest } from "./story-types";

// Local fallback story builder (Phase 2). Phase 3 replaces this with live AI
// generation through a server function; this stays as the offline fallback.

const WORLD_SETTINGS: Record<string, { hero: string; place: string; guide: string }> = {
  "Sky Pirates": { hero: "Captain Rin", place: "the floating ship Cloudchaser", guide: "a wise old albatross" },
  "Coral Reef Kingdom": { hero: "Marina the brave little fish", place: "the Coral Reef Kingdom", guide: "an old sea turtle" },
  "Space Station": { hero: "Cadet Nova", place: "Space Station Aurora", guide: "the station's friendly robot" },
  "Enchanted Forest": { hero: "Mira", place: "the Enchanted Forest", guide: "a talking fox" },
  "Dinosaur Valley": { hero: "Scout Leo", place: "Dinosaur Valley", guide: "a gentle brontosaurus" },
  "Robot City": { hero: "Inventor Zia", place: "Robot City", guide: "a clockwork owl" },
};

export function buildLocalStory(request: StoryRequest): Story {
  const setting = WORLD_SETTINGS[request.world] ?? WORLD_SETTINGS["Enchanted Forest"]!;
  const topic = request.topic.trim();
  const chapters = request.length === "Short" ? 3 : request.length === "Medium" ? 4 : 5;

  const chapterList = Array.from({ length: chapters }, (_, i) => {
    const isLast = i === chapters - 1;
    return {
      title: isLast ? "The Way Home" : `Chapter ${i + 1}: The ${topic} Trail`,
      text: isLast
        ? `${setting.hero} looked back at ${setting.place} and smiled. Every puzzle about ${topic} had been solved — not by luck, but by understanding. ${setting.guide} nodded proudly. "You didn't just finish the quest," they said. "You learned it."`
        : `${setting.hero} set out across ${setting.place}, where a new puzzle about ${topic} waited. ${setting.guide} appeared with a twinkle. "To pass this point, you must truly understand ${topic}," they said. "Not guess — understand."`,
      ...(isLast
        ? {}
        : {
            checkpoint: {
            concept: topic,
            question: `Quick check, adventurer: what is the most important thing about ${topic}?`,
            options: [
              { id: "a", text: `Understanding how ${topic} works, step by step`, isCorrect: true },
              {
                id: "b",
                text: "Guessing quickly and hoping for the best",
                isCorrect: false,
                misconception: "Rushes to answers without reasoning",
              },
              {
                id: "c",
                text: "Memorizing without understanding why",
                isCorrect: false,
                misconception: "Memorizes facts without connecting ideas",
              },
            ],
            explanation: `Exactly — real understanding of ${topic} means you can explain each step.`,
            reteach: `Let's pause. ${topic} makes more sense when you break it into small steps. Ask yourself: what do I know already, and what is the very next small step? That's how ${setting.hero} solves every puzzle.`,
          },
          }),
    };
  });

  return {
    id: `local-${Date.now().toString(36)}`,
    title: `The ${topic} Quest`,
    topic,
    world: request.world,
    difficulty: request.difficulty,
    age: request.age,
    chapters: chapterList,
    createdAt: new Date().toISOString(),
    source: "ai",
  };
}
