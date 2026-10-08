import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { saveSession, getSession, saveStory, useStories } from "../lib/story-store";
import { generateChapterImage } from "../lib/story.functions";
import { ChapterImage } from "../components/ChapterImage";
import { adaptAfterAnswer } from "../lib/adaptive";
import {
  XP_COMPLETION_BONUS,
  XP_PER_CORRECT,
  type AnswerRecord,
  type CheckpointOption,
} from "../lib/story-types";

export const Route = createFileRoute("/story/$storyId")({
  head: () => ({
    meta: [
      { title: "Story Player — StoryQuest AI" },
      { name: "description", content: "Read the adventure and clear its learning checkpoints." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: StoryPlayer,
});

type Phase = "reading" | "checkpoint" | "reteach" | "feedback" | "finished";

function StoryPlayer() {
  const { storyId } = useParams({ from: "/story/$storyId" });
  const story = useStories().find((s) => s.id === storyId);
  const [painting, setPainting] = useState<number | null>(null);
  const paintingRef = useRef(false);

  // Fill in missing chapter illustrations once; saved URLs are reused afterwards.
  useEffect(() => {
    if (!story || paintingRef.current) return;
    const missing = story.chapters.findIndex((c) => !c.imageUrl && c.imagePrompt);
    if (missing < 0) return;
    paintingRef.current = true;
    setPainting(missing);
    void (async () => {
      let current = story;
      for (let i = missing; i < current.chapters.length; i++) {
        const ch = current.chapters[i];
        if (!ch || ch.imageUrl || !ch.imagePrompt) continue;
        setPainting(i);
        try {
          const { url } = await generateChapterImage({
            data: {
              storyId: current.id,
              chapterIndex: i,
              scene: ch.imagePrompt,
              characterSheet: current.characterSheet ?? "",
              topic: current.topic,
            },
          });
          current = {
            ...current,
            chapters: current.chapters.map((c, ci) => (ci === i ? { ...c, imageUrl: url } : c)),
          };
          saveStory(current);
        } catch {
          // Placeholder stays; try again next visit.
        }
      }
      setPainting(null);
    })();
  }, [story]);

  const [chapterIndex, setChapterIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("reading");
  const [picked, setPicked] = useState<CheckpointOption | null>(null);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [xp, setXp] = useState(0);

  const chapter = story?.chapters[chapterIndex];
  const checkpoint = chapter?.checkpoint;
  const totalChapters = story?.chapters.length ?? 0;

  const startedAt = useMemo(() => new Date().toISOString(), []);

  if (!story || !chapter) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-display text-4xl font-extrabold uppercase">Quest not found</h1>
        <p className="mt-3 font-medium text-ink/60">
          This story may have been cleared from this browser.
        </p>
        <Link
          to="/create"
          className="mt-6 inline-block border-2 border-ink bg-flame px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-paper"
        >
          Start a new quest
        </Link>
      </div>
    );
  }

  function persistSession(finalAnswers: AnswerRecord[], finalXp: number, done: boolean) {
    saveSession({
      storyId: story!.id,
      answers: finalAnswers,
      xp: finalXp,
      startedAt: getSession(story!.id)?.startedAt ?? startedAt,
      ...(done ? { completedAt: new Date().toISOString() } : {}),
    });
  }

  function handleAnswer(option: CheckpointOption) {
    if (!checkpoint) return;
    setPicked(option);
    const record: AnswerRecord = {
      chapterIndex,
      concept: checkpoint.concept,
      correct: option.isCorrect,
      ...(option.misconception ? { misconception: option.misconception } : {}),
    };
    const nextAnswers = [...answers, record];
    const nextXp = option.isCorrect ? xp + XP_PER_CORRECT : xp;
    setAnswers(nextAnswers);
    setXp(nextXp);

    const adaptation = adaptAfterAnswer(option.isCorrect, checkpoint.concept, option.misconception);
    if (adaptation.kind === "reteach") {
      setPhase("reteach");
      persistSession(nextAnswers, nextXp, false);
    } else {
      setPhase("feedback");
      const isLast = chapterIndex === totalChapters - 1;
      persistSession(nextAnswers, isLast ? nextXp + XP_COMPLETION_BONUS : nextXp, isLast);
      if (isLast) setXp(nextXp + XP_COMPLETION_BONUS);
    }
  }

  function advance() {
    if (chapterIndex >= totalChapters - 1) {
      // Final chapter may have no checkpoint — record completion here.
      const finalXp = xp + XP_COMPLETION_BONUS;
      setXp(finalXp);
      persistSession(answers, finalXp, true);
      setPhase("finished");
      return;
    }
    setChapterIndex(chapterIndex + 1);
    setPicked(null);
    setPhase("reading");
  }

  const progressPct = Math.round(((chapterIndex + 1) / totalChapters) * 100);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      {/* Progress header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="font-display text-sm font-bold uppercase tracking-widest text-flame">
            {story.world}
          </span>
          <h1 className="mt-1 font-display text-3xl font-extrabold uppercase sm:text-4xl">
            {story.title}
          </h1>
        </div>
        <div className="border-2 border-ink bg-white px-4 py-2 shadow-brutal">
          <span className="font-display text-xl font-extrabold text-flame">{xp} XP</span>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-ink/10">
          <div className="h-full bg-flame transition-all" style={{ width: `${progressPct}%` }} />
        </div>
        <span className="text-sm font-bold">
          Chapter {chapterIndex + 1} / {totalChapters}
        </span>
      </div>

      {phase === "finished" ? (
        <div className="mt-10 border-2 border-ink bg-white p-8 text-center shadow-brutal">
          <div className="stripes mx-auto h-3 w-24" />
          <h2 className="mt-6 font-display text-4xl font-extrabold uppercase">
            Quest complete! 🎉
          </h2>
          <p className="mx-auto mt-3 max-w-md font-medium text-ink/70">
            You finished <strong>{story.title}</strong> with {xp} XP. Your learning report
            shows exactly which ideas stuck — and which the next quest will re-teach.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/report"
              className="bg-flame px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-paper transition-transform hover:scale-[1.03]"
            >
              View learning report
            </Link>
            <Link
              to="/create"
              className="border-2 border-ink px-6 py-3 font-display text-sm font-bold uppercase tracking-wide transition-colors hover:bg-ink hover:text-paper"
            >
              New quest
            </Link>
          </div>
        </div>
      ) : (
        <div key={chapterIndex} className="mt-8 animate-page grid items-start gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ChapterImage
              src={chapter.imageUrl}
              alt={`Illustration: ${chapter.title}`}
              loading={painting === chapterIndex}
            />
          </div>
          {/* Story text */}
          <div className="border-2 border-ink bg-white p-6 lg:col-span-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-ink/50">
              Chapter {chapterIndex + 1}
            </span>
            <h2 className="mt-1 font-display text-2xl font-extrabold uppercase">{chapter.title}</h2>
            <div className="mt-4 space-y-3 text-lg font-medium leading-relaxed">
              {(phase === "reteach" && checkpoint ? checkpoint.reteach : chapter.text)
                .split(/\n\s*\n/)
                .map((para, pi) => (
                  <p key={pi}>
                    {para.split(/("[^"]+"|“[^”]+”)/).map((part, k) =>
                      /^["“]/.test(part) ? (
                        <span key={k} className="font-display font-bold text-sky">{part}</span>
                      ) : (
                        part
                      ),
                    )}
                  </p>
                ))}
            </div>
            {phase === "reteach" && (
              <p className="mt-4 border-l-4 border-sky bg-sky/10 p-3 text-sm font-semibold text-ink/70">
                The story noticed you found this tricky — so it's explaining{" "}
                <strong>{checkpoint?.concept}</strong> a new way before you try again.
              </p>
            )}

            {phase === "reading" && (
              <button
                onClick={() => (checkpoint ? setPhase("checkpoint") : advance())}
                className="mt-6 bg-ink px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-paper transition-colors hover:bg-flame"
              >
                {checkpoint ? "Face the checkpoint →" : "Continue →"}
              </button>
            )}
            {phase === "reteach" && (
              <button
                onClick={() => {
                  setPicked(null);
                  setPhase("checkpoint");
                }}
                className="mt-6 bg-sky px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-paper transition-colors hover:bg-flame"
              >
                Try the checkpoint again →
              </button>
            )}
            {phase === "feedback" && (
              <button
                onClick={advance}
                className="mt-6 bg-flame px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-paper transition-transform hover:scale-[1.03]"
              >
                {chapterIndex >= totalChapters - 1 ? "Finish the quest →" : "Continue the adventure →"}
              </button>
            )}
          </div>

          {/* Checkpoint panel */}
          {checkpoint && phase !== "reading" && (
          <div className="border-2 border-ink bg-white p-6 lg:col-span-5">
            <p className="font-display text-lg font-extrabold uppercase">Checkpoint</p>
            <p className="mt-1 text-sm font-medium text-ink/60">
              {checkpoint ? checkpoint.concept : "No checkpoint in this chapter"}
            </p>

            {checkpoint && (phase === "checkpoint" || phase === "feedback" || phase === "reteach") && (
              <>
                <p className="mt-4 text-sm font-bold">{checkpoint.question}</p>
                <div className="mt-3 space-y-2">
                  {checkpoint.options.map((option) => {
                    const isPicked = picked?.id === option.id;
                    const revealed = phase === "feedback";
                    let cls = "border-ink bg-white hover:bg-ink hover:text-paper";
                    if (revealed && option.isCorrect) cls = "border-sky bg-sky/10 text-ink";
                    else if (isPicked && !option.isCorrect) cls = "border-flame bg-flame/10";
                    else if (isPicked) cls = "border-sky bg-sky/10";
                    return (
                      <button
                        key={option.id}
                        disabled={phase !== "checkpoint"}
                        onClick={() => handleAnswer(option)}
                        className={`w-full border-2 p-3 text-left text-sm font-semibold transition-colors disabled:cursor-default ${cls}`}
                      >
                        {option.text}
                        {revealed && option.isCorrect && <span className="ml-2 text-sky">✓</span>}
                        {isPicked && !option.isCorrect && <span className="ml-2 text-flame">✗</span>}
                      </button>
                    );
                  })}
                </div>
                {phase === "feedback" && (
                  <p className="mt-4 border-t-2 border-dashed border-ink/15 pt-3 text-sm font-semibold text-ink/70">
                    {checkpoint.explanation}{" "}
                    <span className="font-display font-extrabold text-flame">+{XP_PER_CORRECT} XP</span>
                  </p>
                )}
              </>
            )}

          </div>
          )}
        </div>
      )}
    </div>
  );
}
