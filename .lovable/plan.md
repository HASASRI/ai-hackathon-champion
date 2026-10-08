# Pictures for every story, not just the demo

## Why it happens
Pictures are only painted for chapters that carry a scene description. Stories created before the update (and stories made by the offline backup builder) have no scene description, so the player skips them. No picture requests show up in the app's logs.

## Fix
- When a chapter has no scene description, build one from the story itself: world, chapter title, the first lines of the chapter text, and the topic. Every story, old or new, then gets pictures.
- For stories without a saved character description, create a simple one from the story (hero, world, outfit style) and save it, so all chapters of that story match.
- Give the offline backup builder scene descriptions too.
- Show a small "Painting pictures… 2 of 4" note while a story's pictures are being made, and a "Retry pictures" button if one fails.
- Keep the rule that each picture is made once, saved, and reused.

## Check
- Open an older AI story and a new one, and confirm each chapter gets its own picture that is saved and reused when you open it again.

## Technical details
- `story.$storyId.tsx` fill effect: replace the `!c.imagePrompt` filter with a fallback `sceneFor(story, chapter)` helper in a shared lib file; set `characterSheet` fallback once and `saveStory`.
- `local-generator.ts`: add `imagePrompt` per chapter.
- Surface the server error state per chapter (currently swallowed) to drive the retry button.
