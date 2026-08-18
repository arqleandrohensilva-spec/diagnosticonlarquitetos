-- Create a non-public schema for internal security functions
CREATE SCHEMA IF NOT EXISTS authz;

-- Move has_role to authz schema
CREATE OR REPLACE FUNCTION authz.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = authz, public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Move handle_new_user_role to authz schema
CREATE OR REPLACE FUNCTION authz.handle_new_user_role()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = authz, public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

-- Update user_roles policies to use authz.has_role
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
CREATE POLICY "Admins can insert roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (authz.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;
CREATE POLICY "Admins can update roles"
  ON public.user_roles FOR UPDATE
  TO authenticated
  USING (authz.has_role(auth.uid(), 'admin'))
  WITH CHECK (authz.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;
CREATE POLICY "Admins can delete roles"
  ON public.user_roles FOR DELETE
  TO authenticated
  USING (authz.has_role(auth.uid(), 'admin'));

-- Update business table policies to use authz.has_role
DROP POLICY IF EXISTS "Admins can delete categories" ON public.asset_categories;
CREATE POLICY "Admins can delete categories"
  ON public.asset_categories FOR DELETE
  TO authenticated
  USING (authz.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete employees" ON public.employees;
CREATE POLICY "Admins can delete employees"
  ON public.employees FOR DELETE
  TO authenticated
  USING (authz.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Owner or admin can update assets" ON public.assets;
CREATE POLICY "Owner or admin can update assets"
  ON public.assets FOR UPDATE
  TO authenticated
  USING ((created_by = auth.uid()) OR authz.has_role(auth.uid(), 'admin'))
  WITH CHECK ((created_by = auth.uid()) OR authz.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete assets" ON public.assets;
CREATE POLICY "Admins can delete assets"
  ON public.assets FOR DELETE
  TO authenticated
  USING (authz.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete assignments" ON public.asset_assignments;
CREATE POLICY "Admins can delete assignments"
  ON public.asset_assignments FOR DELETE
  TO authenticated
  USING (authz.has_role(auth.uid(), 'admin'));

-- Recreate trigger using authz function
DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION authz.handle_new_user_role();

-- Lock down execute privileges
REVOKE ALL ON FUNCTION authz.has_role(UUID, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION authz.has_role(UUID, public.app_role) TO authenticated;

REVOKE ALL ON FUNCTION authz.handle_new_user_role() FROM PUBLIC;

-- Drop old public copies
DROP FUNCTION IF EXISTS public.has_role(UUID, public.app_role);
DROP FUNCTION IF EXISTS public.handle_new_user_role();
