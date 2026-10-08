import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { loadCloudData } from "../lib/story-store";

const NAV_LINKS = [
  { to: "/create", label: "Create Story" },
  { to: "/stories", label: "My Stories" },
  { to: "/report", label: "Learning Report" },
  { to: "/about", label: "How It Works" },
] as const;

export function SiteHeader() {
  const navigate = useNavigate();
  const [signedIn, setSignedIn] = useState(false);
  const [avatar, setAvatar] = useState("🦊");

  useEffect(() => {
    const loadAvatar = () =>
      void supabase.auth.getUser().then(async ({ data }) => {
        setSignedIn(!!data.user);
        if (!data.user) return;
        const { data: row } = await supabase.from("profiles").select("avatar").eq("id", data.user.id).maybeSingle();
        if (row?.avatar) setAvatar(row.avatar);
      });
    loadAvatar();
    window.addEventListener("profile-updated", loadAvatar);
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      setSignedIn(!!session?.user);
      if (event === "SIGNED_IN") void loadCloudData();
    });
    void loadCloudData();
    return () => {
      sub.subscription.unsubscribe();
      window.removeEventListener("profile-updated", loadAvatar);
    };
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

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
        <div className="flex items-center gap-3">
          {signedIn && (
            <Link
              to="/profile"
              aria-label="My profile"
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink bg-sky/15 text-xl transition-transform hover:scale-110"
            >
              {avatar}
            </Link>
          )}
          {signedIn ? (
            <button
              type="button"
              onClick={handleSignOut}
              className="border-2 border-ink bg-white px-4 py-2 font-display text-sm font-bold uppercase tracking-wide transition-colors hover:bg-ink hover:text-paper"
            >
              Sign out
            </button>
          ) : (
            <Link
              to="/auth"
              className="border-2 border-ink bg-white px-4 py-2 font-display text-sm font-bold uppercase tracking-wide transition-colors hover:bg-ink hover:text-paper"
            >
              Sign in
            </Link>
          )}
          <Link
            to="/create"
            className="border-2 border-ink bg-flame px-4 py-2 font-display text-sm font-bold uppercase tracking-wide text-paper transition-transform hover:-rotate-1 hover:scale-[1.03]"
          >
            🚀 Start Learning
          </Link>
        </div>
      </div>
    </header>
  );
}
