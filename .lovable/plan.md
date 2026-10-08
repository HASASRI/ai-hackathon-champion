# StoryQuest AI — Build Plan

Adaptive AI learning platform: a child enters age + topic, gets an interactive adventure story with learning checkpoints; the story adapts when they struggle; parents/teachers get a learning report.

**Design direction:** "Kinetic story sprint" — bold Bricolage Grotesque display type, paper/ink/flame-red/sky-blue palette, hard borders, rotated cards, offset shadows. Storybook-game energy, not an LMS.

## Build order (credit-efficient: working demo after each phase)

### Phase 1 — Core app shell + design system
- Tokens in `src/styles.css`: ink #111111, paper #f6f4ee, flame #ff3d2e, sky #1f5cff; Bricolage Grotesque + Inter via `<link>` in root head
- Shared layout: sticky header (Home, Create Story, My Stories, Learning Report, How It Works), 🚀 Start Learning CTA, footer
- Landing page `/`: hero with headline "Stories children can't stop reading. Lessons they actually remember.", 🚀 Create My Story + ✨ Try Demo buttons, live-adventure preview, report teaser, quest cards — matching the chosen direction
- Generated hero illustration (child explorer on mountain of books)
- Per-route head() metadata (title, description, og tags)

### Phase 2 — Story engine (front-end, local state first)
- Create Story page `/create`: age (6–12), topic, story world, difficulty, length — with full client-side validation
- Story player `/story/$id`: chapter text, checkpoint questions (multiple choice), XP, progress bar, correct/incorrect feedback, page-turn transitions
- Adaptive logic: wrong answers trigger a re-teach segment before continuing; misconception tracking per concept
- Demo mode: one pre-written adaptive story ("The Fraction Peaks") so the app demos with zero AI dependency
- My Stories `/stories` and Learning Report `/report` reading from local state

### Phase 3 — Live AI generation (Lovable AI Gateway, server-side)
- `createServerFn` story generator: strict JSON schema (chapters, checkpoints, questions, answers, misconception tags), validated with Zod, safe error messages, no keys in frontend
- Adaptive continuation call: sends child's answers, gets next chapter adjusted to their difficulty
- Report analysis call: mastery %, misconceptions, engagement, recommended activities

### Phase 4 — Lovable Cloud: auth + persistence
- Enable Lovable Cloud; email/password auth page `/auth` (+ password reset page)
- `profiles` table (display name, role: parent/child) with RLS + auto-create trigger
- `stories`, `story_sessions`, `checkpoint_answers` tables with RLS, GRANTs, owner policies
- Protected routes under `_authenticated/`; sign-out hygiene; session-aware header
- Learning Report reads real session data

### Phase 5 — Quality pass
- Loading/empty/error states everywhere; malformed-AI-response handling
- Server-side input validation (age range, topic length, enum checks)
- Small tests for validation + adaptive rules; build/typecheck clean; final demo walkthrough

## Technical details
- TanStack Start + Tailwind v4 tokens; server functions via `createServerFn` (no edge functions)
- AI: Lovable AI Gateway, default model `openai/gpt-6-astra` on `/v1/responses`, strict json_schema output, streamed, keys server-only
- DB: Supabase via Lovable Cloud; roles in separate table per security rules
- Fonts loaded via `<link>` in `__root.tsx` head, never CSS @import

## Credit strategy
Phases 1–2 deliver a fully demoable app without AI/auth. Phases 3–5 layer on live AI and accounts. If credits run short, the demo story keeps the app presentable for judging.
