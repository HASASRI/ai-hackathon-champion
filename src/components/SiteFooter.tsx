import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-6 px-6 py-14 md:flex-row md:items-center">
        <div>
          <span className="font-display text-2xl font-extrabold">
            StoryQuest<span className="text-flame">AI</span>
          </span>
          <p className="mt-1 text-sm text-paper/50">
            Every lesson is a mission. Every answer is a move forward.
          </p>
        </div>
        <div className="flex gap-6 text-sm font-semibold text-paper/60">
          <Link to="/about" className="hover:text-flame">
            How it works
          </Link>
          <Link to="/report" className="hover:text-flame">
            For parents
          </Link>
          <Link to="/create" className="hover:text-flame">
            Start a quest
          </Link>
        </div>
      </div>
    </footer>
  );
}
