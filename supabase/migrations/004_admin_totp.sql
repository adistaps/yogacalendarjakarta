-- ============================================
-- ADMIN TOTP SECRETS
-- ============================================
CREATE TABLE IF NOT EXISTS public.admin_totp_secrets (
  user_id     UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  secret      TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.admin_totp_secrets ENABLE ROW LEVEL SECURITY;

-- No client-side policies are defined, which blocks SELECT/INSERT/UPDATE/DELETE 
-- from public/authenticated clients. Only the Service Role Client (server-side) 
-- is allowed to perform operations on this table.
