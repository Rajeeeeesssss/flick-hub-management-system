
-- Create a user profiles table to store name and phone number associated with Auth user
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,
  phone text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Enable row level security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS: Users can select, insert, update only their own profile
CREATE POLICY "Enable individual profile access" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Enable profile insert for self" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable profile update for self" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

