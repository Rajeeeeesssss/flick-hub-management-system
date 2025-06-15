
-- 1. Create a roles enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'employee', 'customer');

-- 2. Create a user_roles table to assign roles to users
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- 3. Insert admin user role for rajesh9933123@gmail.com
-- (Note: The AI cannot insert a user until the user is signed up. After admin signs up, we will assign admin role by user_id)

-- 4. Add Row Level Security to user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 5. Allow a user to select, insert, update, and delete their own roles
CREATE POLICY "Users can manage own roles"
  ON public.user_roles
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 6. Create helper function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;
