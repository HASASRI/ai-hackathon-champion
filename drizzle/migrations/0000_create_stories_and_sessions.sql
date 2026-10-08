CREATE TABLE public.stories (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  topic TEXT NOT NULL,
  world TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  age INT NOT NULL,
  chapters JSONB NOT NULL,
  source TEXT NOT NULL DEFAULT 'ai',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stories TO authenticated;
GRANT ALL ON public.stories TO service_role;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own stories" ON public.stories FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own stories" ON public.stories FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own stories" ON public.stories FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own stories" ON public.stories FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.story_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  story_id TEXT NOT NULL,
  answers JSONB NOT NULL DEFAULT '[]',
  xp INT NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  UNIQUE (user_id, story_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.story_sessions TO authenticated;
GRANT ALL ON public.story_sessions TO service_role;
ALTER TABLE public.story_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own sessions" ON public.story_sessions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own sessions" ON public.story_sessions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own sessions" ON public.story_sessions FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own sessions" ON public.story_sessions FOR DELETE TO authenticated USING (auth.uid() = user_id);