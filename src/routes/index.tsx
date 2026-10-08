import { createFileRoute, Link } from "@tanstack/react-router";
import heroExplorer from "../assets/hero-explorer.jpg";
import { DEMO_STORY } from "../lib/demo-story";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "StoryQuest AI — Stories children can't stop reading" },
      {
        name: "description",
        content:
          "StoryQuest AI turns school concepts into interactive adventures—and checks whether the child truly understood them.",
      },
      { property: "og:title", content: "StoryQuest AI — Stories children can't stop reading" },
      {
        property: "og:description",
        content:
          "Adaptive AI learning stories with checkpoints that adapt when a child struggles.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const SAMPLE_QUESTS = [
  {
    tag: "Math · Grade 4",
    tagColor: "text-flame",
    title: "Fraction Peaks",
    blurb: "Climb a mountain of halves, thirds and quarters to reach the summit.",
    chapters: "4 chapters",
    arrowColor: "text-flame",
  },
  {
    tag: "Science · Grade 5",
    tagColor: "text-sky",
    title: "The Water Cycle Run",
    blurb: "Race a raindrop from cloud to river and learn evaporation en route.",
    chapters: "5 chapters",
    arrowColor: "text-sky",
  },
  {
    tag: "Reading · Grade 3",
    tagColor: "text-flame",
    title: "The Word Heist",
    blurb: "Crack vocabulary codes to sneak past the museum guards.",
    chapters: "6 chapters",
    arrowColor: "text-flame",
  },
];

function Index() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden border-b-2 border-ink">
        <div className="pointer-events-none absolute -top-24 -right-16 h-[520px] w-[520px] -rotate-12 rounded-full bg-flame/10" />
        <div className="pointer-events-none absolute -bottom-28 -left-20 h-[440px] w-[440px] rounded-full bg-sky/10" />
        <div className="relative mx-auto grid max-w-[1440px] items-center gap-14 px-6 py-20 lg:grid-cols-2">
          <div>
            <span className="inline-block -rotate-2 bg-ink px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-paper">
              Adaptive AI quests
            </span>
            <h1 className="mt-6 font-display text-5xl font-extrabold uppercase leading-[0.92] sm:text-6xl lg:text-[4.5rem]">
              <span className="block">Stories children can't stop reading.</span>
              <span className="block text-flame">Lessons they actually remember.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg font-medium text-ink/70">
              StoryQuest AI turns school concepts into interactive adventures—and checks
              whether the child truly understood them.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/create"
                className="-rotate-1 bg-flame px-7 py-4 font-display text-lg font-bold uppercase tracking-wide text-paper transition-transform hover:rotate-0 hover:scale-[1.03]"
              >
                🚀 Create My Story
              </Link>
              <Link
                to="/story/$storyId"
                params={{ storyId: DEMO_STORY.id }}
                className="border-2 border-ink px-7 py-4 font-display text-lg font-bold uppercase tracking-wide transition-colors hover:bg-ink hover:text-paper"
              >
                ✨ Try Demo
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm font-semibold text-ink/60">
              <span className="flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 bg-flame" />
                A story that changes when the child struggles
              </span>
              <span className="flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 bg-sky" />
                Ages 6–12
              </span>
            </div>
          </div>
          <div className="relative">
            <div className="-rotate-2 rounded-2xl bg-ink p-4 shadow-brutal-flame">
              <img
                src={heroExplorer}
                alt="A child explorer climbing a mountain of giant books toward a summit flag"
                width={1024}
                height={1024}
                className="aspect-square w-full rounded-lg object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -left-5 rotate-3 border-2 border-ink bg-paper px-5 py-4 shadow-brutal">
              <p className="font-display text-2xl font-extrabold text-flame">+120 XP</p>
              <p className="text-xs font-semibold text-ink/60">Fractions checkpoint cleared</p>
            </div>
          </div>
        </div>
      </section>

      {/* Live adventure preview */}
      <section className="border-b-2 border-ink">
        <div className="mx-auto max-w-[1440px] px-6 py-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="font-display text-sm font-bold uppercase tracking-widest text-flame">
                Live adventure
              </span>
              <h2 className="mt-2 font-display text-4xl font-extrabold uppercase">
                The Fraction Peaks
              </h2>
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink/60">
              <span className="h-2 w-2 rounded-full bg-flame" />
              Chapter 2 of 4
            </span>
          </div>
          <div className="mt-8 grid items-start gap-6 lg:grid-cols-3">
            <div className="relative border-2 border-ink bg-white p-6 lg:col-span-2">
              <p className="font-display text-2xl font-bold leading-snug">
                You spot a cracked bridge spanning the chasm. Each plank is a fraction of
                the whole. To cross, you must lay down{" "}
                <span className="bg-flame/20 px-1">exactly one whole</span> — but you only
                carry three planks.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {["½", "¼", "⅓"].map((f) => (
                  <div
                    key={f}
                    className="border-2 border-ink p-4 text-left transition-colors hover:bg-flame hover:text-paper"
                  >
                    <p className="font-display text-xl font-extrabold">{f}</p>
                    <p className="mt-1 text-xs font-semibold opacity-60">Take the plank</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm font-semibold text-ink/50">
                Tap a plank to choose your path. The AI adapts the next scene to your answer.
              </p>
            </div>
            <div className="border-2 border-ink bg-white p-6">
              <p className="font-display text-lg font-extrabold uppercase">Checkpoint</p>
              <p className="mt-1 text-sm font-medium text-ink/60">
                Add fractions with unlike denominators
              </p>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-ink/10">
                <div className="h-full w-3/4 bg-flame" />
              </div>
              <p className="mt-2 text-sm font-bold">3 / 4 planks placed</p>
              <div className="mt-5 flex items-center justify-between border-t-2 border-dashed border-ink/15 pt-4">
                <span className="text-xs font-semibold uppercase tracking-wide text-ink/50">
                  XP earned
                </span>
                <span className="font-display text-2xl font-extrabold text-flame">+80</span>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Link
              to="/story/$storyId"
              params={{ storyId: DEMO_STORY.id }}
              className="inline-block border-2 border-ink bg-ink px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-paper transition-colors hover:bg-flame"
            >
              Play this quest →
            </Link>
          </div>
        </div>
      </section>

      {/* Report teaser */}
      <section className="border-b-2 border-ink bg-ink text-paper">
        <div className="mx-auto max-w-[1440px] px-6 py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="font-display text-sm font-bold uppercase tracking-widest text-flame">
                Learning report
              </span>
              <h2 className="mt-2 font-display text-4xl font-extrabold uppercase text-paper">
                The parent dashboard
              </h2>
            </div>
            <Link
              to="/report"
              className="border-2 border-paper px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wide transition-colors hover:bg-flame hover:border-flame"
            >
              See the full report →
            </Link>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="border-2 border-flame bg-white p-6 text-ink">
              <p className="text-xs font-bold uppercase tracking-widest text-ink/50">This week</p>
              <p className="mt-2 font-display text-6xl font-extrabold leading-none text-flame">
                3<span className="text-2xl text-ink/40">/4</span>
              </p>
              <p className="mt-1 text-sm font-semibold text-ink/60">Concepts mastered</p>
            </div>
            <div className="bg-white p-6 text-ink">
              <p className="text-xs font-bold uppercase tracking-widest text-ink/50">Focus areas</p>
              <div className="mt-4 space-y-3">
                {[
                  { label: "Fractions", pct: 82, color: "bg-flame", text: "text-flame" },
                  { label: "Equal parts", pct: 64, color: "bg-sky", text: "text-sky" },
                  { label: "Comparing", pct: 41, color: "bg-flame", text: "text-flame" },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="flex justify-between text-sm font-semibold">
                      <span>{row.label}</span>
                      <span className={row.text}>{row.pct}%</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-ink/10">
                      <div className={`h-full rounded-full ${row.color}`} style={{ width: `${row.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-6 text-ink">
              <p className="text-xs font-bold uppercase tracking-widest text-ink/50">
                Misconception spotted
              </p>
              <p className="mt-3 text-sm font-medium text-ink/70">
                Adds numerators and denominators straight across when combining fractions.
              </p>
              <p className="mt-4 border-t-2 border-dashed border-ink/15 pt-4 text-sm font-semibold text-sky">
                Next quest adapts to re-teach this.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quest picker */}
      <section className="border-b-2 border-ink bg-paper">
        <div className="mx-auto max-w-[1440px] px-6 py-16">
          <h2 className="font-display text-4xl font-extrabold uppercase">Pick a quest to begin</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {SAMPLE_QUESTS.map((quest) => (
              <article key={quest.title} className="group overflow-hidden border-2 border-ink bg-white">
                <div className="stripes h-3 w-full" />
                <div className="p-5">
                  <span className={`text-[11px] font-bold uppercase tracking-widest ${quest.tagColor}`}>
                    {quest.tag}
                  </span>
                  <h3 className="mt-1 font-display text-2xl font-extrabold">{quest.title}</h3>
                  <p className="mt-2 text-sm font-medium text-ink/60">{quest.blurb}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs font-semibold text-ink/50">{quest.chapters}</span>
                    <Link
                      to="/create"
                      className={`inline-block font-display font-bold transition-transform group-hover:translate-x-1 ${quest.arrowColor}`}
                    >
                      Enter →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
