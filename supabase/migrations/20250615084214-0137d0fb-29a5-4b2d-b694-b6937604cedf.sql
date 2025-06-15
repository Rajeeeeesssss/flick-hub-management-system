
-- 1. Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  movie_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- values: 'active', 'cancelled'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  cancelled_at TIMESTAMPTZ
);

-- 2. RLS: Only allow a user to see/cancel their own bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read own bookings"
  ON public.bookings
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Allow insert own bookings"
  ON public.bookings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow update/cancel own bookings"
  ON public.bookings
  FOR UPDATE
  USING (auth.uid() = user_id);

-- (Admin reads/cancels can be added if you want admin control.)

