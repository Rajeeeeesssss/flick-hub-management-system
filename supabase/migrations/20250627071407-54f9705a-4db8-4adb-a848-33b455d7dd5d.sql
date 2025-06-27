
-- Create staff table
CREATE TABLE public.staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  position TEXT NOT NULL,
  department TEXT,
  hire_date DATE NOT NULL DEFAULT CURRENT_DATE,
  salary DECIMAL(10,2),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create leave requests table
CREATE TABLE public.leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID REFERENCES public.staff(id) ON DELETE CASCADE NOT NULL,
  leave_type TEXT NOT NULL CHECK (leave_type IN ('sick', 'vacation', 'personal', 'maternity', 'emergency')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days_requested INTEGER NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by UUID REFERENCES public.staff(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create promotions table
CREATE TABLE public.promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  discount_percentage DECIMAL(5,2) CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  discount_amount DECIMAL(10,2) CHECK (discount_amount >= 0),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  promo_code TEXT UNIQUE,
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create movies table (to replace the static data) - fixed "cast" keyword issue
CREATE TABLE public.movies (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  genre TEXT[] NOT NULL DEFAULT '{}',
  duration INTEGER NOT NULL,
  rating TEXT,
  release_date DATE,
  poster_url TEXT,
  hero_url TEXT,
  trailer_url TEXT,
  director TEXT,
  actors TEXT[],
  language TEXT DEFAULT 'english',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;

-- RLS Policies for staff table
CREATE POLICY "Admins can manage all staff" ON public.staff
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Staff can view their own profile" ON public.staff
  FOR SELECT USING (user_id = auth.uid());

-- RLS Policies for leave_requests table
CREATE POLICY "Admins can manage all leave requests" ON public.leave_requests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Staff can manage their own leave requests" ON public.leave_requests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.staff 
      WHERE id = leave_requests.staff_id AND user_id = auth.uid()
    )
  );

-- RLS Policies for promotions table
CREATE POLICY "Admins can manage all promotions" ON public.promotions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Everyone can view active promotions" ON public.promotions
  FOR SELECT USING (is_active = true);

-- RLS Policies for movies table
CREATE POLICY "Admins can manage all movies" ON public.movies
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Everyone can view active movies" ON public.movies
  FOR SELECT USING (is_active = true);

-- RLS Policies for bookings table (update existing)
CREATE POLICY "Admins can manage all bookings" ON public.bookings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Insert some sample data
INSERT INTO public.movies (title, description, genre, duration, rating, release_date, poster_url, hero_url, director, actors, language) VALUES
('Avengers: Endgame', 'The epic conclusion to the Infinity Saga', ARRAY['Action', 'Adventure', 'Drama'], 181, 'PG-13', '2019-04-26', 'https://via.placeholder.com/300x450', 'https://via.placeholder.com/1920x1080', 'Russo Brothers', ARRAY['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo'], 'english'),
('Spider-Man: No Way Home', 'Spider-Man faces his greatest challenge yet', ARRAY['Action', 'Adventure', 'Sci-Fi'], 148, 'PG-13', '2021-12-17', 'https://via.placeholder.com/300x450', 'https://via.placeholder.com/1920x1080', 'Jon Watts', ARRAY['Tom Holland', 'Zendaya', 'Benedict Cumberbatch'], 'english');

INSERT INTO public.promotions (title, description, discount_percentage, start_date, end_date, promo_code) VALUES
('Holiday Special', 'Get 20% off on all movie tickets', 20.00, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 'HOLIDAY20'),
('Student Discount', 'Special discount for students', 15.00, CURRENT_DATE, CURRENT_DATE + INTERVAL '90 days', 'STUDENT15');
