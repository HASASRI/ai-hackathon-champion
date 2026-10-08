import type { AnswerRecord, StorySession } from "./story-types";

// Adaptive learning logic: decide what happens after a checkpoint answer.

export type Adaptation =
  | { kind: "advance" }
  | { kind: "reteach"; concept: string; misconception?: string };

export function adaptAfterAnswer(correct: boolean, concept: string, misconception?: string): Adaptation {
  if (correct) return { kind: "advance" };
  return { kind: "reteach", concept, ...(misconception ? { misconception } : {}) };
}

export interface ConceptMastery {
  concept: string;
  total: number;
  correct: number;
  mastery: number; // 0–100
  misconceptions: string[];
}

export function computeMastery(answers: AnswerRecord[]): ConceptMastery[] {
  const byConcept = new Map<string, ConceptMastery>();
  for (const answer of answers) {
    const entry =
      byConcept.get(answer.concept) ??
      { concept: answer.concept, total: 0, correct: 0, mastery: 0, misconceptions: [] };
    entry.total += 1;
    if (answer.correct) entry.correct += 1;
    if (answer.misconception && !entry.misconceptions.includes(answer.misconception)) {
      entry.misconceptions.push(answer.misconception);
    }
    entry.mastery = Math.round((entry.correct / entry.total) * 100);
    byConcept.set(answer.concept, entry);
  }
  return [...byConcept.values()].sort((a, b) => b.mastery - a.mastery);
}

export function engagementMinutes(session: StorySession): number {
  const end = session.completedAt ? new Date(session.completedAt) : new Date();
  const ms = end.getTime() - new Date(session.startedAt).getTime();
  return Math.max(1, Math.round(ms / 60000));
}
