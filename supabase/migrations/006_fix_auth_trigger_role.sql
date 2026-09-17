-- ============================================
-- FIX: Auth trigger seharusnya membaca role dari metadata
-- ============================================

-- 1. Update trigger function agar membaca role dari metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_role TEXT;
BEGIN
  -- Baca role dari metadata, default ke 'user' jika tidak ada
  v_role := COALESCE(new.raw_user_meta_data->>'role', 'user');
  
  -- Validasi role hanya boleh 'user' atau 'eo' (admin dibuat manual)
  IF v_role NOT IN ('user', 'eo') THEN
    v_role := 'user';
  END IF;

  INSERT INTO public.users (id, email, name, avatar_url, phone, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'User'),
    new.raw_user_meta_data->>'avatar_url',
    new.phone,
    v_role
  )
  ON CONFLICT (id) DO UPDATE
  SET
    name = COALESCE(EXCLUDED.name, public.users.name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.users.avatar_url),
    role = CASE 
      -- Jangan timpa role 'admin' yang sudah ada
      WHEN public.users.role = 'admin' THEN public.users.role
      ELSE EXCLUDED.role
    END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- FIX: Tambah INSERT policy untuk users
-- (dibutuhkan agar register flow bisa upsert role)
-- ============================================
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;
CREATE POLICY "Users can insert own data" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- FIX: Data yang sudah ada — update role user
-- yang seharusnya EO (punya eo_profiles) menjadi 'eo'
-- ============================================
UPDATE public.users u
SET role = 'eo'
WHERE u.role = 'user'
  AND EXISTS (
    SELECT 1 FROM public.eo_profiles ep WHERE ep.user_id = u.id
  );

-- ============================================
-- FIX: Admin dapat membaca semua data di users
-- (pastikan tidak ada konflik policy)
-- ============================================
DROP POLICY IF EXISTS "Admins have full access to users" ON public.users;
CREATE POLICY "Admins have full access to users" ON public.users
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());
