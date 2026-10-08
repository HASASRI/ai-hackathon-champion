import { useState } from "react";

// Large storybook illustration with a styled placeholder — never a broken image.
export function ChapterImage({ src, alt, loading }: { src?: string | undefined; alt: string; loading?: boolean }) {
  const [failed, setFailed] = useState(false);
  const show = src && !failed;
  return (
    <div className="relative aspect-[3/2] w-full overflow-hidden border-2 border-ink bg-sky/10 shadow-brutal">
      {show ? (
        <img
          key={src}
          src={src}
          alt={alt}
          width={1536}
          height={1024}
          onError={() => setFailed(true)}
          className="h-full w-full animate-fade-in object-cover"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_30%_30%,var(--color-flame)_0,transparent_35%),radial-gradient(circle_at_75%_70%,var(--color-sky)_0,transparent_40%)] opacity-90">
          <span className={`text-6xl ${loading ? "animate-bounce" : ""}`}>🎨</span>
          <span className="bg-paper px-3 py-1 font-display text-sm font-bold uppercase tracking-wide">
            {loading ? "Painting this page…" : "Imagine this scene!"}
          </span>
        </div>
      )}
    </div>
  );
}
