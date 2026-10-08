import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSessions } from "../lib/story-store";
import { AVATARS, averageScore, learningMinutes, learningStreak } from "../lib/profile-stats";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — StoryQuest AI" },
      { name: "description", content: "Your StoryQuest profile, learning streak and progress." },
      { property: "og:title", content: "My Profile — StoryQuest AI" },
      { property: "og:description", content: "Your StoryQuest profile, learning streak and progress." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProfilePage,
});

type Role = "parent" | "teacher";

function ProfilePage() {
  const sessions = useSessions();
  const [userId, setUserId] = useState<string | null | undefined>(undefined);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("parent");
  const [avatar, setAvatar] = useState<string>(AVATARS[0]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    void supabase.auth.getUser().then(async ({ data }) => {
      const user = data.user;
      setUserId(user?.id ?? null);
      if (!user) return;
      setEmail(user.email ?? "");
      const { data: row } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (row) {
        setName(row.display_name);
        setRole(row.role === "teacher" ? "teacher" : "parent");
        if (row.avatar) setAvatar(row.avatar);
      } else {
        setName(user.email?.split("@")[0] ?? "");
      }
    });
  }, []);

  async function save() {
    if (!userId) return;
    const trimmed = name.trim().slice(0, 60);
    if (!trimmed) return setStatus("Please enter a name.");
    setStatus("Saving…");
    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      display_name: trimmed,
      role,
      avatar,
      updated_at: new Date().toISOString(),
    });
    setStatus(error ? "Couldn't save — please try again." : "Saved ✓");
    if (!error) window.dispatchEvent(new Event("profile-updated"));
  }

  if (userId === undefined) return <div className="py-24 text-center font-display">Loading…</div>;
  if (userId === null)
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <div className="text-7xl">🦊</div>
        <h1 className="mt-4 font-display text-4xl font-extrabold uppercase">Your profile</h1>
        <p className="mt-3 font-medium text-ink/60">Sign in to save your profile and progress.</p>
        <Link to="/auth" className="mt-6 inline-block bg-flame px-6 py-3 font-display text-sm font-bold uppercase text-paper">
          Sign in
        </Link>
      </div>
    );

  const completed = sessions.filter((s) => s.completedAt).length;
  const minutes = Math.round(learningMinutes(sessions));
  const stats = [
    { label: "Stories completed", value: completed },
    { label: "Average score", value: `${averageScore(sessions)}%` },
    { label: "Learning streak", value: `${learningStreak(sessions)} 🔥` },
    { label: "Learning time", value: minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : `${minutes} min` },
  ];

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <div className="flex flex-wrap items-center gap-6 border-2 border-ink bg-white p-6 shadow-brutal">
        <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-ink bg-sky/15 text-6xl">
          {avatar}
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-flame">My profile</span>
          <h1 className="font-display text-4xl font-extrabold uppercase">{name || "Explorer"}</h1>
          <p className="font-medium text-ink/60">
            {email} · {role === "teacher" ? "Teacher" : "Parent"}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="border-2 border-ink bg-white p-4">
            <p className="font-display text-3xl font-extrabold text-flame">{s.value}</p>
            <p className="text-xs font-bold uppercase tracking-wide text-ink/60">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-6 border-2 border-ink bg-white p-6">
        <h2 className="font-display text-xl font-extrabold uppercase">Edit profile</h2>
        <div>
          <label htmlFor="name" className="font-display text-sm font-bold uppercase tracking-widest">Name</label>
          <input
            id="name"
            value={name}
            maxLength={60}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full border-2 border-ink px-4 py-3 font-medium outline-none focus:shadow-brutal"
          />
        </div>
        <div>
          <p className="font-display text-sm font-bold uppercase tracking-widest">Avatar</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {AVATARS.map((a) => (
              <button
                key={a}
                type="button"
                aria-label={`Avatar ${a}`}
                onClick={() => setAvatar(a)}
                className={`h-14 w-14 rounded-full border-2 text-3xl transition-transform hover:scale-110 ${
                  avatar === a ? "border-flame bg-flame/15" : "border-ink bg-white"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="font-display text-sm font-bold uppercase tracking-widest">Role</p>
          <div className="mt-2 flex gap-2">
            {(["parent", "teacher"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`border-2 border-ink px-4 py-2 font-display text-sm font-bold uppercase ${
                  role === r ? "bg-flame text-paper" : "bg-white hover:bg-ink hover:text-paper"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={save} className="bg-ink px-6 py-3 font-display text-sm font-bold uppercase text-paper hover:bg-flame">
            Save profile
          </button>
          <span className="text-sm font-semibold text-ink/60">{status}</span>
        </div>
      </div>
    </div>
  );
}
