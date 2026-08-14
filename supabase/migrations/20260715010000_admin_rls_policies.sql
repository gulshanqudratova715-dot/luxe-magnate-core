-- Allow admins to update any profile (role-based)
CREATE POLICY "Admins can update any profile (role)" ON public.profiles
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE public.profiles.id = auth.uid() AND public.profiles.role = 'admin'
    )
    OR auth.jwt()->>'email' = 'gulshanqudratova715@gmail.com'
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE public.profiles.id = auth.uid() AND public.profiles.role = 'admin'
    )
    OR auth.jwt()->>'email' = 'gulshanqudratova715@gmail.com'
  );

-- Allow admins to manage bookings
CREATE POLICY "Admins can manage all bookings" ON public.bookings
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE public.profiles.id = auth.uid() AND public.profiles.role = 'admin'
    )
    OR auth.jwt()->>'email' = 'gulshanqudratova715@gmail.com'
  );

-- Allow admins to manage products
CREATE POLICY "Admins can manage all products" ON public.products
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE public.profiles.id = auth.uid() AND public.profiles.role = 'admin'
    )
    OR auth.jwt()->>'email' = 'gulshanqudratova715@gmail.com'
  );

-- Allow admins to manage orders
CREATE POLICY "Admins can manage all orders" ON public.orders
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE public.profiles.id = auth.uid() AND public.profiles.role = 'admin'
    )
    OR auth.jwt()->>'email' = 'gulshanqudratova715@gmail.com'
  );
