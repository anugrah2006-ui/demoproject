-- Belle AI Supabase Schema Setup

-- 1. Conversations Table
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS conversations_user_id_idx ON public.conversations(user_id);

-- 2. Messages Table
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

-- 3. Combinations Table
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

-- RLS (Row Level Security) Policies
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.combinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY ""Users can manage their own conversations"" 
  ON public.conversations FOR ALL 
  USING (auth.uid() = user_id);

CREATE POLICY ""Users can manage their own messages"" 
  ON public.messages FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = messages.conversation_id AND c.user_id = auth.uid()));

CREATE POLICY ""Users can manage their own combinations"" 
  ON public.combinations FOR ALL 
  USING (auth.uid() = user_id);
