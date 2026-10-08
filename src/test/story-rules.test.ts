import { describe, expect, it } from "vitest";
import { validateStoryRequest } from "../lib/validation";
import { adaptAfterAnswer, computeMastery } from "../lib/adaptive";
import { MAX_AGE, MIN_AGE } from "../lib/story-types";

const validRequest = {
  age: 9,
  topic: "Fractions",
  world: "Sky Pirates" as const,
  difficulty: "Adventurous" as const,
  length: "Medium" as const,
};

describe("validateStoryRequest", () => {
  it("accepts a valid request", () => {
    expect(validateStoryRequest(validRequest).ok).toBe(true);
  });

  it("rejects ages outside the supported range", () => {
    expect(validateStoryRequest({ ...validRequest, age: MIN_AGE - 1 }).ok).toBe(false);
    expect(validateStoryRequest({ ...validRequest, age: MAX_AGE + 1 }).ok).toBe(false);
  });

  it("rejects empty topics", () => {
    expect(validateStoryRequest({ ...validRequest, topic: "   " }).ok).toBe(false);
  });

  it("rejects unknown enum values", () => {
    expect(
      validateStoryRequest({ ...validRequest, world: "Mars" as never }).ok,
    ).toBe(false);
  });
});

describe("adaptAfterAnswer", () => {
  it("advances on a correct answer", () => {
    expect(adaptAfterAnswer(true, "Fractions")).toEqual({ kind: "advance" });
  });

  it("triggers re-teach with the misconception on a wrong answer", () => {
    expect(adaptAfterAnswer(false, "Fractions", "adds numerators across")).toEqual({
      kind: "reteach",
      concept: "Fractions",
      misconception: "adds numerators across",
    });
  });
});

describe("computeMastery", () => {
  it("computes per-concept mastery percentages", () => {
    const mastery = computeMastery([
      { chapterIndex: 0, concept: "Fractions", correct: true },
      { chapterIndex: 1, concept: "Fractions", correct: false, misconception: "mixes pieces" },
      { chapterIndex: 0, concept: "Division", correct: true },
    ]);
    const fractions = mastery.find((m) => m.concept === "Fractions");
    expect(fractions?.mastery).toBe(50);
    expect(fractions?.misconceptions).toEqual(["mixes pieces"]);
    expect(mastery.find((m) => m.concept === "Division")?.mastery).toBe(100);
  });
});
