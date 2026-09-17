-- Trigger to automatically insert a user profile when a new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url, phone, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'User'),
    new.raw_user_meta_data->>'avatar_url',
    new.phone,
    'user'
  )
  ON CONFLICT (email) DO UPDATE
  SET id = EXCLUDED.id,
      name = COALESCE(EXCLUDED.name, public.users.name),
      avatar_url = COALESCE(EXCLUDED.avatar_url, public.users.avatar_url);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Sync existing users to public.users
INSERT INTO public.users (id, email, name, avatar_url, phone, role)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', 'User'),
  raw_user_meta_data->>'avatar_url',
  phone,
  'user'
FROM auth.users
ON CONFLICT (email) DO NOTHING;
