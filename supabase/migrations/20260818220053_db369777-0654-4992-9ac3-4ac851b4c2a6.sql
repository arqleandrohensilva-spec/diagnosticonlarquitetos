-- 1. Role enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
  END IF;
END
$$;

-- 2. User roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Role-checking security definer function (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 4. User roles policies
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
CREATE POLICY "Admins can insert roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;
CREATE POLICY "Admins can update roles"
  ON public.user_roles FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;
CREATE POLICY "Admins can delete roles"
  ON public.user_roles FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 5. Replace wide-open RLS policies on business tables with granular ones

-- asset_categories
DROP POLICY IF EXISTS "Authenticated users can select categories" ON public.asset_categories;
CREATE POLICY "Authenticated users can select categories"
  ON public.asset_categories FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert categories" ON public.asset_categories;
CREATE POLICY "Authenticated users can insert categories"
  ON public.asset_categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update categories" ON public.asset_categories;
CREATE POLICY "Authenticated users can update categories"
  ON public.asset_categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can delete categories" ON public.asset_categories;
CREATE POLICY "Admins can delete categories"
  ON public.asset_categories FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- employees
DROP POLICY IF EXISTS "Authenticated users can select employees" ON public.employees;
CREATE POLICY "Authenticated users can select employees"
  ON public.employees FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert employees" ON public.employees;
CREATE POLICY "Authenticated users can insert employees"
  ON public.employees FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update employees" ON public.employees;
CREATE POLICY "Authenticated users can update employees"
  ON public.employees FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can delete employees" ON public.employees;
CREATE POLICY "Admins can delete employees"
  ON public.employees FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- assets
DROP POLICY IF EXISTS "Authenticated users can select assets" ON public.assets;
CREATE POLICY "Authenticated users can select assets"
  ON public.assets FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert assets" ON public.assets;
CREATE POLICY "Authenticated users can insert assets"
  ON public.assets FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "Owner or admin can update assets" ON public.assets;
CREATE POLICY "Owner or admin can update assets"
  ON public.assets FOR UPDATE
  TO authenticated
  USING ((created_by = auth.uid()) OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK ((created_by = auth.uid()) OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete assets" ON public.assets;
CREATE POLICY "Admins can delete assets"
  ON public.assets FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- asset_assignments
DROP POLICY IF EXISTS "Authenticated users can select assignments" ON public.asset_assignments;
CREATE POLICY "Authenticated users can select assignments"
  ON public.asset_assignments FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert assignments" ON public.asset_assignments;
CREATE POLICY "Authenticated users can insert assignments"
  ON public.asset_assignments FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update assignments" ON public.asset_assignments;
CREATE POLICY "Authenticated users can update assignments"
  ON public.asset_assignments FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can delete assignments" ON public.asset_assignments;
CREATE POLICY "Admins can delete assignments"
  ON public.asset_assignments FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 6. Auto-assign 'user' role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- 7. Grants for Data API access
GRANT SELECT, INSERT, UPDATE, DELETE ON public.asset_categories TO authenticated;
GRANT ALL ON public.asset_categories TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.employees TO authenticated;
GRANT ALL ON public.employees TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.assets TO authenticated;
GRANT ALL ON public.assets TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.asset_assignments TO authenticated;
GRANT ALL ON public.asset_assignments TO service_role;

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
