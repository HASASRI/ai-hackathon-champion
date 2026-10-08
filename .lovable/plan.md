# StoryQuest AI — Profile + Illustrated Storybook

Improve the existing app; keep everything that works today.

## 1. Profile
- Avatar button in the top bar (shown when signed in) opens a new **My Profile** page.
- Shows: avatar, name, email, role (Parent / Teacher), stories completed, average score, current streak (consecutive days with activity), total learning time (from session start/finish times).
- Edit: name, role, avatar — choose from a set of friendly preset avatars (no photo needed; optional photo upload).
- Saved to the signed-in account, so it's there after signing out and back in.

## 2. Illustrated chapters
- AI story generation now also writes, per chapter, an `imagePrompt` plus one shared "character sheet" and art style for the whole story, so characters look the same in every chapter.
- After the story is created, one illustration per chapter is generated (prompt = style + character sheet + chapter scene, focused on the learning concept, e.g. pizza slices for fractions).
- Images are saved once to file storage and their address stored with the chapter — reopened chapters reuse them; only missing images are generated.
- Demo story "The Fraction Peaks" gets 4 pre-made matching illustrations (mountain arrival, pizza, guardian, final challenge) so it works instantly.
- While an image is loading, or if it fails, a styled illustrated placeholder shows — never a broken image.

## 3. Storybook player
- Large chapter illustration on top, then title, short text split into pages, dialogue highlighted, Continue button.
- Smooth page-turn transition between chapters.
- During a checkpoint, the chapter image stays visible next to (desktop) or above (mobile) the question.
- Mobile/tablet: image → title → text → Continue, comfortable reading size.

## Technical details
- Migration: `profiles` table (id = auth user, display_name, role check parent/teacher, avatar) with RLS own-row policies + signup trigger; public `story-images` storage bucket.
- Extend `Chapter` type with optional `imagePrompt`, `imageUrl`; `Story` with optional `characterSheet`/`artStyle`. Stored in existing chapters JSON.
- Server function generates each chapter image via the AI gateway default image model, uploads to storage, returns URL; client fills missing images sequentially and saves the story.
- Demo illustrations generated now as bundled assets.
- Tests: streak and average-score calculations.
