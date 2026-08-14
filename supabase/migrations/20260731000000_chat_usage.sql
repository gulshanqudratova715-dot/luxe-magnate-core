CREATE TABLE IF NOT EXISTS public.chat_usage (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  usage_count INT DEFAULT 0,
  last_reset TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.chat_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own usage"
  ON public.chat_usage FOR SELECT
  USING (auth.uid() = user_id);

-- Only admin (service role) should update the usage count, so no update policy for users is needed.
