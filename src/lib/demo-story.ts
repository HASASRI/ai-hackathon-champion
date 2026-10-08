import type { Story } from "./story-types";
import ch1 from "@/assets/demo-ch1.jpg";
import ch2 from "@/assets/demo-ch2.jpg";
import ch3 from "@/assets/demo-ch3.jpg";
import ch4 from "@/assets/demo-ch4.jpg";

// Pre-written adaptive demo story — the app demos with zero AI dependency.
export const DEMO_STORY: Story = {
  id: "demo-fraction-peaks",
  title: "The Fraction Peaks",
  topic: "Fractions",
  world: "Enchanted Forest",
  difficulty: "Adventurous",
  age: 9,
  source: "demo",
  createdAt: "2026-10-01T00:00:00.000Z",
  chapters: [
    {
      title: "The Map in the Attic",
      imageUrl: ch1,
      text: "Mira found the map tucked inside her grandfather's old climbing journal. It showed the Fraction Peaks — three mountains shaped like giant slices of pie. \"Whoever reaches the summit,\" the note said, \"must understand that every whole can be split into equal parts.\" Mira packed her rope, her compass, and a snack cut exactly in half.",
      checkpoint: {
        concept: "Fractions as equal parts",
        question: "Mira cuts her apple into 2 equal pieces. What is each piece called?",
        options: [
          { id: "a", text: "One half (½)", isCorrect: true },
          {
            id: "b",
            text: "One third (⅓)",
            isCorrect: false,
            misconception: "Confuses the number of pieces with the fraction name",
          },
          {
            id: "c",
            text: "One quarter (¼)",
            isCorrect: false,
            misconception: "Confuses the number of pieces with the fraction name",
          },
        ],
        explanation: "Exactly! When a whole is split into 2 equal parts, each part is one half — ½.",
        reteach:
          "Let's slow down. A fraction's bottom number tells you how many EQUAL parts the whole was split into. 2 equal parts → halves. 3 equal parts → thirds. 4 equal parts → quarters. Mira's apple was split into 2 parts, so each piece is ½.",
      },
    },
    {
      title: "The Cracked Bridge",
      imageUrl: ch2,
      text: "At the first peak, a cracked bridge spanned a deep chasm. Each plank was a fraction of the whole crossing. A carved sign read: \"Lay down exactly one whole to cross safely.\" Mira's pack held three planks: a half-plank, a quarter-plank, and a third-plank. The wind howled. She could only carry two across.",
      checkpoint: {
        concept: "Adding fractions to make a whole",
        question: "Which two planks add up to exactly one whole bridge?",
        options: [
          {
            id: "a",
            text: "½ + ⅓",
            isCorrect: false,
            misconception: "Adds numerators and denominators straight across (½ + ⅓ ≠ 1)",
          },
          { id: "b", text: "½ + ½", isCorrect: true },
          {
            id: "c",
            text: "¼ + ⅓",
            isCorrect: false,
            misconception: "Assumes any two fractions combine to a whole",
          },
        ],
        explanation: "Yes! ½ + ½ = 1 whole. Two halves of the same whole always make one.",
        reteach:
          "Think of a chocolate bar snapped in two. Each piece is ½. Put both pieces back together and you have the whole bar again: ½ + ½ = 1. But ½ + ⅓ mixes different-sized pieces — that's less than a whole. Fractions only add neatly when the pieces come from the same-sized split.",
      },
    },
    {
      title: "The Summit Flag",
      imageUrl: ch3,
      text: "Near the summit, Mira found the flag pole — but the rope to raise the flag was missing a section. The instructions said: \"The rope must be ¾ of the pole's height. You already have ½.\" Mira smiled. She knew exactly which spare piece to cut from her climbing rope.",
      checkpoint: {
        concept: "Comparing and combining fractions",
        question: "Mira has ½ of the rope and needs ¾. How much more does she need?",
        options: [
          { id: "a", text: "¼ more", isCorrect: true },
          {
            id: "b",
            text: "½ more",
            isCorrect: false,
            misconception: "Confuses numerator with denominator when comparing fractions",
          },
          {
            id: "c",
            text: "⅓ more",
            isCorrect: false,
            misconception: "Guesses a fraction without matching denominators",
          },
        ],
        explanation: "Perfect! ½ = 2/4, and 2/4 + ¼ = 3/4. The flag is flying!",
        reteach:
          "Here's the trick: rewrite ½ as fourths. Split each half in two and you get 2/4 — same amount, smaller pieces. Now it's easy: 3/4 − 2/4 = 1/4. When fractions have the same bottom number, you can compare or subtract them directly.",
      },
    },
    {
      title: "The Way Down",
      imageUrl: ch4,
      text: "With the flag flying over the Fraction Peaks, Mira opened her journal and wrote: \"A fraction is just a fair way to share. Equal parts, honest counting, and a little courage.\" She took one last look at the three pie-slice mountains, then started the long, happy climb down — already wondering what the next map would ask of her.",
    },
  ],
};
