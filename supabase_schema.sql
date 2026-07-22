-- Belle AI Supabase Schema Setup

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  onboarding_completed BOOLEAN DEFAULT false,
  subscription TEXT DEFAULT 'free',
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view and edit their own profile" ON public.profiles;
CREATE POLICY "Users can view and edit their own profile" 
  ON public.profiles FOR ALL 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 2. Conversations Table
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS conversations_user_id_idx ON public.conversations(user_id);

-- RLS for Conversations
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own conversations" 
  ON public.conversations FOR ALL 
  USING (auth.uid() = user_id);

-- 3. Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for conversation history retrieval
CREATE INDEX IF NOT EXISTS messages_conversation_id_idx ON public.messages(conversation_id);

-- RLS for Messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own messages" 
  ON public.messages FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.conversations c 
    WHERE c.id = messages.conversation_id AND c.user_id = auth.uid()
  ));

-- 4. Combinations Table
CREATE TABLE IF NOT EXISTS public.combinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  image_url TEXT,
  type TEXT NOT NULL CHECK (type IN ('outfit', 'hairstyle', 'skincare', 'image_generation')),
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for combinations retrieval
CREATE INDEX IF NOT EXISTS combinations_user_id_idx ON public.combinations(user_id);

-- RLS for Combinations
ALTER TABLE public.combinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own combinations" 
  ON public.combinations FOR ALL 
  USING (auth.uid() = user_id);

-- 5. Trends Cache Table
CREATE TABLE IF NOT EXISTS public.trends_cache (
  category TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for Trends Cache
ALTER TABLE public.trends_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read trends cache" 
  ON public.trends_cache FOR SELECT 
  USING (auth.uid() IS NOT NULL OR true);

CREATE POLICY "Service role can manage trends cache" 
  ON public.trends_cache FOR ALL 
  USING (true);

-- 6. Chat History View for Memory Engine
CREATE OR REPLACE VIEW public.chat_history AS
SELECT 
  m.role,
  m.content,
  c.user_id,
  m.created_at
FROM public.messages m
JOIN public.conversations c ON m.conversation_id = c.id;
