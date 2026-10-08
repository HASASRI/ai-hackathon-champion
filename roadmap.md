# StoryQuest AI — Build Roadmap

- [x] Phase 1: Design tokens, fonts, layout, landing page, hero image, route metadata
- [x] Phase 2: Story engine — Create Story, story player with checkpoints + adaptive logic, demo story, My Stories, Learning Report (local state)
- [x] Phase 3: Live AI generation via Lovable AI (strict JSON schema, Zod validation, local fallback)
- [x] Phase 4: Lovable Cloud — email + Google sign-in, stories/sessions tables with RLS, cloud sync of stories and sessions
- [ ] Phase 5: Final quality pass — full signed-in playthrough, publish

Notes:
- Local-first store (localStorage) mirrors to Cloud when signed in; cloud rows merge on sign-in.
- Email confirmation is ON: new sign-ups must confirm via email before signing in.
- Phase 5 remaining: verify a full signed-in flow (sign up → create AI story → play → report), then publish.
