import { Link } from "@tanstack/react-router";

const NAV_LINKS = [
  { to: "/create", label: "Create Story" },
  { to: "/stories", label: "My Stories" },
  { to: "/report", label: "Learning Report" },
  { to: "/about", label: "How It Works" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-block h-6 w-6 rotate-45 bg-flame" />
          <span className="font-display text-xl font-extrabold tracking-tight">
            StoryQuest<span className="text-flame">AI</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-semibold md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="transition-colors hover:text-flame"
              activeProps={{ className: "text-flame" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          to="/create"
          className="border-2 border-ink bg-flame px-4 py-2 font-display text-sm font-bold uppercase tracking-wide text-paper transition-transform hover:-rotate-1 hover:scale-[1.03]"
        >
          🚀 Start Learning
        </Link>
      </div>
    </header>
  );
}
