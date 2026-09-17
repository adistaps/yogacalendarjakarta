-- ============================================
-- HELPER FUNCTIONS FOR RLS
-- ============================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_eo()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'eo'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_my_eo_profile_id()
RETURNS UUID AS $$
DECLARE
  v_eo_id UUID;
BEGIN
  SELECT id INTO v_eo_id FROM public.eo_profiles
  WHERE user_id = auth.uid();
  RETURN v_eo_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eo_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_pricing_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disbursements ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES FOR 'users'
-- ============================================
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (auth.uid() = id OR public.is_admin());

CREATE POLICY "Admins have full access to users" ON public.users
  FOR ALL USING (public.is_admin());

-- ============================================
-- RLS POLICIES FOR 'eo_profiles'
-- ============================================
CREATE POLICY "Anyone can read approved EO profiles" ON public.eo_profiles
  FOR SELECT USING (status = 'approved' OR auth.uid() = user_id OR public.is_admin());

CREATE POLICY "EOs can update own profile" ON public.eo_profiles
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "EOs can insert own profile" ON public.eo_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins have full access to eo_profiles" ON public.eo_profiles
  FOR ALL USING (public.is_admin());

-- ============================================
-- RLS POLICIES FOR 'events'
-- ============================================
CREATE POLICY "Anyone can read approved and non-deleted events" ON public.events
  FOR SELECT USING ((status = 'approved' AND deleted_at IS NULL) OR eo_id = public.get_my_eo_profile_id() OR public.is_admin());

CREATE POLICY "EOs can insert own events" ON public.events
  FOR INSERT WITH CHECK (eo_id = public.get_my_eo_profile_id());

CREATE POLICY "EOs can update own events" ON public.events
  FOR UPDATE USING (eo_id = public.get_my_eo_profile_id() OR public.is_admin())
  WITH CHECK (eo_id = public.get_my_eo_profile_id() OR public.is_admin());

CREATE POLICY "Admins have full access to events" ON public.events
  FOR ALL USING (public.is_admin());

-- ============================================
-- RLS POLICIES FOR 'event_images'
-- ============================================
CREATE POLICY "Anyone can read event images" ON public.event_images
  FOR SELECT USING (true);

CREATE POLICY "EOs can manage images of own events" ON public.event_images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE id = event_images.event_id AND eo_id = public.get_my_eo_profile_id()
    ) OR public.is_admin()
  );

-- ============================================
-- RLS POLICIES FOR 'ticket_types'
-- ============================================
CREATE POLICY "Anyone can read ticket types" ON public.ticket_types
  FOR SELECT USING (true);

CREATE POLICY "EOs can manage ticket types of own events" ON public.ticket_types
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE id = ticket_types.event_id AND eo_id = public.get_my_eo_profile_id()
    ) OR public.is_admin()
  );

-- ============================================
-- RLS POLICIES FOR 'ticket_orders'
-- ============================================
CREATE POLICY "Users can view own orders" ON public.ticket_orders
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can create own orders" ON public.ticket_orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Note: Paid status updates will be handled via webhook using service role, bypassing RLS
CREATE POLICY "EOs can view orders of their events" ON public.ticket_orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE id = ticket_orders.event_id AND eo_id = public.get_my_eo_profile_id()
    ) OR public.is_admin()
  );

-- ============================================
-- RLS POLICIES FOR 'ticket_order_items'
-- ============================================
CREATE POLICY "Users can view own order items" ON public.ticket_order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.ticket_orders
      WHERE id = ticket_order_items.order_id AND user_id = auth.uid()
    ) OR public.is_admin()
  );

CREATE POLICY "EOs can view order items of their events" ON public.ticket_order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.ticket_orders
      JOIN public.events ON events.id = ticket_orders.event_id
      WHERE ticket_orders.id = ticket_order_items.order_id AND events.eo_id = public.get_my_eo_profile_id()
    ) OR public.is_admin()
  );

-- ============================================
-- RLS POLICIES FOR 'ad_slots'
-- ============================================
CREATE POLICY "EOs can manage own ad slots" ON public.ad_slots
  FOR ALL USING (eo_id = public.get_my_eo_profile_id() OR public.is_admin());

-- ============================================
-- RLS POLICIES FOR 'ad_pricing'
-- ============================================
CREATE POLICY "Anyone can read ad pricing" ON public.ad_pricing
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage ad pricing" ON public.ad_pricing
  FOR ALL USING (public.is_admin());

-- ============================================
-- RLS POLICIES FOR 'ad_pricing_log'
-- ============================================
CREATE POLICY "Admins can read ad pricing logs" ON public.ad_pricing_log
  FOR SELECT USING (public.is_admin());

-- ============================================
-- RLS POLICIES FOR 'calendar_events'
-- ============================================
CREATE POLICY "Anyone can read calendar events" ON public.calendar_events
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage calendar events" ON public.calendar_events
  FOR ALL USING (public.is_admin());

-- ============================================
-- RLS POLICIES FOR 'disbursements'
-- ============================================
CREATE POLICY "EOs can view own disbursements" ON public.disbursements
  FOR SELECT USING (eo_id = public.get_my_eo_profile_id() OR public.is_admin());

CREATE POLICY "Admins can manage disbursements" ON public.disbursements
  FOR ALL USING (public.is_admin());
