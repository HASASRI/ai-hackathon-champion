import { createFileRoute, Link } from "@tanstack/react-router";
import { useSessions, useStories } from "../lib/story-store";
import { computeMastery, engagementMinutes } from "../lib/adaptive";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Learning Report — StoryQuest AI" },
      {
        name: "description",
        content: "Concept mastery, misconceptions, and engagement from your child's story quests.",
      },
      { property: "og:title", content: "Learning Report — StoryQuest AI" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LearningReport,
});

function LearningReport() {
  const stories = useStories();
  const sessions = useSessions();
  const allAnswers = sessions.flatMap((s) => s.answers);
  const mastery = computeMastery(allAnswers);
  const misconceptions = mastery.flatMap((m) =>
    m.misconceptions.map((text) => ({ concept: m.concept, text })),
  );
  const totalXp = sessions.reduce((sum, s) => sum + s.xp, 0);
  const completed = sessions.filter((s) => s.completedAt).length;
  const totalMinutes = sessions.reduce((sum, s) => sum + engagementMinutes(s), 0);

  if (allAnswers.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <span className="inline-block -rotate-2 bg-ink px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-paper">
          Learning report
        </span>
        <h1 className="mt-4 font-display text-4xl font-extrabold uppercase">No data yet</h1>
        <p className="mt-3 font-medium text-ink/60">
          Play through a quest and the report will show concept mastery, misconceptions,
          and engagement — all from real checkpoint answers.
        </p>
        <Link
          to="/story/$storyId"
          params={{ storyId: "demo-fraction-peaks" }}
          className="mt-6 inline-block bg-flame px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-paper"
        >
          ✨ Try the demo quest
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-ink py-16 text-paper">
      <div className="mx-auto max-w-[1440px] px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-display text-sm font-bold uppercase tracking-widest text-flame">
              Learning report
            </span>
            <h1 className="mt-2 font-display text-4xl font-extrabold uppercase text-paper sm:text-5xl">
              What actually stuck
            </h1>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-paper/60">
            <span className="inline-block h-3 w-3 bg-flame" />Concept mastery
            <span className="ml-3 inline-block h-3 w-3 bg-sky" />Engagement
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="border-2 border-flame bg-white p-6 text-ink">
            <p className="text-xs font-bold uppercase tracking-widest text-ink/50">So far</p>
            <p className="mt-2 font-display text-6xl font-extrabold leading-none text-flame">
              {completed}
              <span className="text-2xl text-ink/40">/{sessions.length}</span>
            </p>
            <p className="mt-1 text-sm font-semibold text-ink/60">Quests completed</p>
            <p className="mt-4 text-sm font-bold text-sky">{totalXp} XP earned</p>
          </div>

          <div className="bg-white p-6 text-ink">
            <p className="text-xs font-bold uppercase tracking-widest text-ink/50">
              Mastery by concept
            </p>
            <div className="mt-4 space-y-3">
              {mastery.map((m, i) => (
                <div key={m.concept}>
                  <div className="flex justify-between text-sm font-semibold">
                    <span>{m.concept}</span>
                    <span className={i % 2 === 0 ? "text-flame" : "text-sky"}>{m.mastery}%</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-ink/10">
                    <div
                      className={`h-full rounded-full ${i % 2 === 0 ? "bg-flame" : "bg-sky"}`}
                      style={{ width: `${m.mastery}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 text-ink">
            <p className="text-xs font-bold uppercase tracking-widest text-ink/50">
              Watch for · misconceptions
            </p>
            {misconceptions.length === 0 ? (
              <p className="mt-3 text-sm font-semibold text-ink/60">
                No misconceptions detected — every checkpoint was cleared on the first try. 🎉
              </p>
            ) : (
              <div className="mt-3 space-y-2">
                {misconceptions.map((m) => (
                  <div key={m.text} className="border-2 border-flame/40 bg-flame/10 p-3 text-sm font-semibold">
                    <span className="text-flame">{m.concept}:</span> {m.text}
                  </div>
                ))}
              </div>
            )}
            <p className="mt-4 border-t-2 border-dashed border-ink/15 pt-3 text-sm font-semibold text-ink/60">
              Engaged {totalMinutes} min across {sessions.length} quest{sessions.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        {/* Recommended next steps */}
        <div className="mt-10 border-2 border-paper/20 bg-white/5 p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-paper/50">
            Recommended next activities
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {mastery.slice(0, 3).map((m) => (
              <div key={m.concept} className="border-2 border-paper/20 p-4">
                <p className="font-display font-bold text-paper">{m.concept}</p>
                <p className="mt-1 text-sm font-medium text-paper/60">
                  {m.mastery >= 80
                    ? "Strong — try a harder quest on this topic."
                    : m.mastery >= 50
                      ? "Getting there — replay with the story's re-teach moments."
                      : "Needs support — start a Gentle difficulty quest on this concept."}
                </p>
              </div>
            ))}
          </div>
          <Link
            to="/create"
            className="mt-6 inline-block bg-flame px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-paper transition-transform hover:scale-[1.03]"
          >
            🚀 Start the next quest
          </Link>
        </div>

        <p className="mt-8 text-xs font-semibold text-paper/40">
          Stories played: {stories.length} · Report generated from real checkpoint answers in this browser.
        </p>
      </div>
    </div>
  );
}
