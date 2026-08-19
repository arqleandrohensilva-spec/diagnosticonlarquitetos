
-- asset_categories
DROP POLICY IF EXISTS "Authenticated users can select categories" ON public.asset_categories;
DROP POLICY IF EXISTS "Authenticated users can insert categories" ON public.asset_categories;
DROP POLICY IF EXISTS "Authenticated users can update categories" ON public.asset_categories;
CREATE POLICY "Admins can select categories" ON public.asset_categories FOR SELECT TO authenticated USING (authz.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert categories" ON public.asset_categories FOR INSERT TO authenticated WITH CHECK (authz.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update categories" ON public.asset_categories FOR UPDATE TO authenticated USING (authz.has_role(auth.uid(), 'admin')) WITH CHECK (authz.has_role(auth.uid(), 'admin'));

-- employees
DROP POLICY IF EXISTS "Authenticated users can select employees" ON public.employees;
DROP POLICY IF EXISTS "Authenticated users can insert employees" ON public.employees;
DROP POLICY IF EXISTS "Authenticated users can update employees" ON public.employees;
CREATE POLICY "Admins can select employees" ON public.employees FOR SELECT TO authenticated USING (authz.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert employees" ON public.employees FOR INSERT TO authenticated WITH CHECK (authz.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update employees" ON public.employees FOR UPDATE TO authenticated USING (authz.has_role(auth.uid(), 'admin')) WITH CHECK (authz.has_role(auth.uid(), 'admin'));

-- assets
DROP POLICY IF EXISTS "Authenticated users can select assets" ON public.assets;
CREATE POLICY "Owners or admins can select assets" ON public.assets FOR SELECT TO authenticated USING (created_by = auth.uid() OR authz.has_role(auth.uid(), 'admin'));

-- asset_assignments
DROP POLICY IF EXISTS "Authenticated users can select assignments" ON public.asset_assignments;
DROP POLICY IF EXISTS "Authenticated users can insert assignments" ON public.asset_assignments;
DROP POLICY IF EXISTS "Authenticated users can update assignments" ON public.asset_assignments;
CREATE POLICY "Admins or asset owners can select assignments" ON public.asset_assignments FOR SELECT TO authenticated USING (authz.has_role(auth.uid(), 'admin') OR EXISTS (SELECT 1 FROM public.assets a WHERE a.id = asset_id AND a.created_by = auth.uid()));
CREATE POLICY "Admins or asset owners can insert assignments" ON public.asset_assignments FOR INSERT TO authenticated WITH CHECK (authz.has_role(auth.uid(), 'admin') OR EXISTS (SELECT 1 FROM public.assets a WHERE a.id = asset_id AND a.created_by = auth.uid()));
CREATE POLICY "Admins or asset owners can update assignments" ON public.asset_assignments FOR UPDATE TO authenticated USING (authz.has_role(auth.uid(), 'admin') OR EXISTS (SELECT 1 FROM public.assets a WHERE a.id = asset_id AND a.created_by = auth.uid())) WITH CHECK (authz.has_role(auth.uid(), 'admin') OR EXISTS (SELECT 1 FROM public.assets a WHERE a.id = asset_id AND a.created_by = auth.uid()));
