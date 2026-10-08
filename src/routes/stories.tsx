import { createFileRoute, Link } from "@tanstack/react-router";
import { useSessions, useStories } from "../lib/story-store";

export const Route = createFileRoute("/stories")({
  head: () => ({
    meta: [
      { title: "My Stories — StoryQuest AI" },
      { name: "description", content: "Every quest you've built, ready to replay." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MyStories,
});

function MyStories() {
  const stories = useStories();
  const sessions = useSessions();

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-16">
      <span className="inline-block -rotate-2 bg-ink px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-paper">
        Quest library
      </span>
      <h1 className="mt-4 font-display text-5xl font-extrabold uppercase leading-[0.92]">
        My <span className="text-flame">stories</span>
      </h1>

      {stories.length === 0 ? (
        <div className="mt-10 border-2 border-ink bg-white p-10 text-center">
          <p className="font-display text-xl font-bold">No quests yet.</p>
          <Link
            to="/create"
            className="mt-4 inline-block bg-flame px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-paper"
          >
            🚀 Start Learning
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => {
            const session = sessions.find((s) => s.storyId === story.id);
            const done = Boolean(session?.completedAt);
            return (
              <article key={story.id} className="group overflow-hidden border-2 border-ink bg-white">
                <div className="stripes h-3 w-full" />
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-flame">
                      {story.topic} · Age {story.age}
                    </span>
                    {story.source === "demo" && (
                      <span className="bg-sky px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-paper">
                        Demo
                      </span>
                    )}
                  </div>
                  <h3 className="mt-1 font-display text-2xl font-extrabold">{story.title}</h3>
                  <p className="mt-2 text-sm font-medium text-ink/60">
                    {story.world} · {story.difficulty} · {story.chapters.length} chapters
                  </p>
                  {session && (
                    <p className="mt-2 text-xs font-bold text-ink/50">
                      {done ? `Completed · ${session.xp} XP` : `In progress · ${session.xp} XP`}
                    </p>
                  )}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs font-semibold text-ink/50">
                      {new Date(story.createdAt).toLocaleDateString()}
                    </span>
                    <Link
                      to="/story/$storyId"
                      params={{ storyId: story.id }}
                      className="inline-block font-display font-bold text-flame transition-transform group-hover:translate-x-1"
                    >
                      {done ? "Replay →" : "Enter →"}
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
