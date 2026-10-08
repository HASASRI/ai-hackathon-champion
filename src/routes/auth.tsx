import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — StoryQuest AI" },
      { name: "description", content: "Sign in to save your stories and learning reports." },
      { property: "og:title", content: "Sign In — StoryQuest AI" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleEmail(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (err) throw err;
        if (!data.session) {
          setNotice("Check your email to confirm your account, then sign in.");
          return;
        }
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
      }
      navigate({ to: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) setError(result.error.message ?? "Google sign-in failed");
    // On success the browser redirects or the session is set automatically.
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-6 py-20">
      <span className="inline-block w-fit -rotate-2 bg-ink px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-paper">
        Parent & teacher access
      </span>
      <h1 className="mt-4 font-display text-5xl font-extrabold uppercase leading-[0.92]">
        {mode === "signin" ? "Welcome back" : "Join the quest"}
      </h1>
      <p className="mt-3 text-lg font-medium text-ink/70">
        Sign in to save stories and learning reports across devices.
      </p>

      <button
        type="button"
        onClick={handleGoogle}
        className="mt-8 border-2 border-ink bg-white px-6 py-3.5 font-display text-base font-bold uppercase tracking-wide transition-colors hover:bg-ink hover:text-paper"
      >
        Continue with Google
      </button>

      <div className="my-6 flex items-center gap-3">
        <div className="h-0.5 flex-1 bg-ink/20" />
        <span className="text-xs font-bold uppercase tracking-widest text-ink/50">or email</span>
        <div className="h-0.5 flex-1 bg-ink/20" />
      </div>

      <form onSubmit={handleEmail} className="space-y-4">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full border-2 border-ink bg-white px-4 py-3 font-medium outline-none placeholder:text-ink/40 focus:shadow-brutal"
        />
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (6+ characters)"
          className="w-full border-2 border-ink bg-white px-4 py-3 font-medium outline-none placeholder:text-ink/40 focus:shadow-brutal"
        />
        {error && (
          <p className="border-2 border-flame bg-flame/10 px-4 py-2 text-sm font-semibold text-flame">
            {error}
          </p>
        )}
        {notice && (
          <p className="border-2 border-sky bg-sky/10 px-4 py-2 text-sm font-semibold text-ink">
            {notice}
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="w-full bg-flame px-6 py-3.5 font-display text-base font-bold uppercase tracking-wide text-paper transition-transform hover:scale-[1.02] disabled:opacity-60"
        >
          {busy ? "One moment…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => {
          setMode(mode === "signin" ? "signup" : "signin");
          setError(null);
          setNotice(null);
        }}
        className="mt-5 text-sm font-bold text-ink/60 underline underline-offset-4 hover:text-flame"
      >
        {mode === "signin" ? "New here? Create an account" : "Already have an account? Sign in"}
      </button>
    </div>
  );
}
