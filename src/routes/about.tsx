import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "How It Works — StoryQuest AI" },
      {
        name: "description",
        content:
          "Generate → Engage → Diagnose → Adapt → Report. How StoryQuest AI checks real understanding.",
      },
      { property: "og:title", content: "How It Works — StoryQuest AI" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: About,
});

const STEPS = [
  {
    n: "01",
    title: "Generate",
    color: "bg-flame",
    body: "A child enters their age and a school topic. The AI writes an age-appropriate adventure story set in a world they pick — sky pirates, coral reefs, robot cities.",
  },
  {
    n: "02",
    title: "Engage",
    color: "bg-sky",
    body: "The story unfolds in chapters with interactive checkpoints. Questions are woven into the plot — answer to move the adventure forward and earn XP.",
  },
  {
    n: "03",
    title: "Diagnose",
    color: "bg-flame",
    body: "Every wrong answer is mapped to a specific misconception — like adding numerators straight across, or confusing the number of pieces with the fraction name.",
  },
  {
    n: "04",
    title: "Adapt",
    color: "bg-sky",
    body: "This is the key innovation: a story that changes when the child struggles. A wrong answer triggers a re-teach segment inside the story before they try again.",
  },
  {
    n: "05",
    title: "Report",
    color: "bg-flame",
    body: "Parents and teachers get a learning report: concept mastery, spotted misconceptions, engagement time, and recommended next activities.",
  },
];

function About() {
  return (
    <div className="mx-auto max-w-[1440px] px-6 py-16">
      <span className="inline-block -rotate-2 bg-ink px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-paper">
        How it works
      </span>
      <h1 className="mt-4 max-w-3xl font-display text-5xl font-extrabold uppercase leading-[0.92]">
        A story that changes when the child <span className="text-flame">struggles</span>
      </h1>
      <p className="mt-4 max-w-xl text-lg font-medium text-ink/70">
        StoryQuest AI is not just an AI story generator. It demonstrates whether the child
        actually understood the concept — and adapts when they didn't.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {STEPS.map((step) => (
          <div key={step.n} className="border-2 border-ink bg-white p-6">
            <div className={`h-2 w-12 ${step.color}`} />
            <p className="mt-4 font-display text-sm font-extrabold uppercase tracking-widest text-ink/40">
              {step.n}
            </p>
            <h3 className="mt-1 font-display text-2xl font-extrabold uppercase">{step.title}</h3>
            <p className="mt-2 text-sm font-medium text-ink/70">{step.body}</p>
          </div>
        ))}
        <div className="flex flex-col justify-between border-2 border-ink bg-ink p-6 text-paper">
          <p className="font-display text-2xl font-extrabold uppercase leading-tight">
            Ready to see it in action?
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/create"
              className="bg-flame px-5 py-3 font-display text-sm font-bold uppercase tracking-wide text-paper transition-transform hover:scale-[1.03]"
            >
              🚀 Start Learning
            </Link>
            <Link
              to="/story/$storyId"
              params={{ storyId: "demo-fraction-peaks" }}
              className="border-2 border-paper px-5 py-3 font-display text-sm font-bold uppercase tracking-wide transition-colors hover:bg-paper hover:text-ink"
            >
              ✨ Try Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
