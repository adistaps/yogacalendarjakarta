-- ============================================
-- USERS
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  avatar_url  TEXT,
  phone       TEXT,
  role        TEXT CHECK (role IN ('user', 'eo', 'admin')) DEFAULT 'user',
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- EO PROFILES
-- ============================================
CREATE TABLE IF NOT EXISTS eo_profiles (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID REFERENCES users(id) ON DELETE CASCADE,
  org_name          TEXT NOT NULL,
  slug              TEXT UNIQUE NOT NULL,
  bio               TEXT,
  logo_url          TEXT,
  whatsapp          TEXT,
  contact_email     TEXT,
  status            TEXT CHECK (status IN ('pending','approved','rejected')) DEFAULT 'pending',
  rejection_reason  TEXT,
  created_at        TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- EVENTS
-- ============================================
CREATE TABLE IF NOT EXISTS events (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  eo_id               UUID REFERENCES eo_profiles(id) ON DELETE CASCADE,
  title               TEXT NOT NULL,
  slug                TEXT UNIQUE NOT NULL,
  description         TEXT NOT NULL,
  facilities          TEXT,
  collaboration_info  TEXT,
  date_start          DATE NOT NULL,
  date_end            DATE NOT NULL,
  time_start          TIME NOT NULL,
  time_end            TIME NOT NULL,
  location_area       TEXT NOT NULL,
  location_address    TEXT NOT NULL,
  whatsapp_group_link TEXT,
  qr_code_url         TEXT,
  admin_note          TEXT,
  status              TEXT CHECK (status IN ('draft','pending','approved','rejected')) DEFAULT 'draft',
  rejection_reason    TEXT,
  deleted_at          TIMESTAMPTZ DEFAULT NULL,  -- soft delete
  created_at          TIMESTAMPTZ DEFAULT now(),
  updated_at          TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- EVENT IMAGES (multiple per event)
-- ============================================
CREATE TABLE IF NOT EXISTS event_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    UUID REFERENCES events(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,  -- 0 = foto utama/thumbnail
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- TICKET TYPES (multiple per event)
-- ============================================
CREATE TABLE IF NOT EXISTS ticket_types (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    UUID REFERENCES events(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  price       BIGINT NOT NULL,
  quota       INTEGER NOT NULL,
  quota_sold  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- TICKET ORDERS
-- ============================================
CREATE TABLE IF NOT EXISTS ticket_orders (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id             UUID REFERENCES events(id),
  user_id              UUID REFERENCES users(id),
  total_price          BIGINT NOT NULL,
  status               TEXT CHECK (status IN ('pending_payment','paid','expired','cancelled')) DEFAULT 'pending_payment',
  xendit_invoice_id    TEXT UNIQUE,
  xendit_payment_url   TEXT,
  buyer_name           TEXT NOT NULL,
  buyer_email          TEXT NOT NULL,
  buyer_phone          TEXT NOT NULL,
  pdf_url              TEXT,  -- URL PDF tiket yang sudah di-generate
  paid_at              TIMESTAMPTZ,
  created_at           TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- TICKET ORDER ITEMS
-- ============================================
CREATE TABLE IF NOT EXISTS ticket_order_items (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id         UUID REFERENCES ticket_orders(id) ON DELETE CASCADE,
  ticket_type_id   UUID REFERENCES ticket_types(id),
  attendee_name    TEXT NOT NULL,
  attendee_phone   TEXT,
  quantity         INTEGER DEFAULT 1
);

-- ============================================
-- AD SLOTS
-- ============================================
CREATE TABLE IF NOT EXISTS ad_slots (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  eo_id               UUID REFERENCES eo_profiles(id),
  event_id            UUID REFERENCES events(id),
  slot_type           TEXT CHECK (slot_type IN ('hero','featured')) NOT NULL,
  date_start          DATE NOT NULL,
  date_end            DATE NOT NULL,
  amount_paid         BIGINT NOT NULL,
  status              TEXT CHECK (status IN ('pending_payment','paid','rejected')) DEFAULT 'pending_payment',
  payment_proof_url   TEXT,
  rejection_reason    TEXT,
  is_active           BOOLEAN DEFAULT false,
  created_at          TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- AD PRICING
-- ============================================
CREATE TABLE IF NOT EXISTS ad_pricing (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_type         TEXT CHECK (slot_type IN ('hero','featured')) UNIQUE NOT NULL,
  price_per_day     BIGINT NOT NULL,
  updated_by_admin  UUID REFERENCES users(id),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- AD PRICING LOG (audit trail)
-- ============================================
CREATE TABLE IF NOT EXISTS ad_pricing_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_type   TEXT NOT NULL,
  old_price   BIGINT,
  new_price   BIGINT NOT NULL,
  changed_by  UUID REFERENCES users(id),
  changed_at  TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- CALENDAR EVENTS (kurasi admin)
-- ============================================
CREATE TABLE IF NOT EXISTS calendar_events (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id         UUID REFERENCES events(id),
  display_date     DATE NOT NULL,
  created_by_admin UUID REFERENCES users(id),
  created_at       TIMESTAMPTZ DEFAULT now(),
  UNIQUE(event_id, display_date)
);

-- ============================================
-- DISBURSEMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS disbursements (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  eo_id             UUID REFERENCES eo_profiles(id),
  amount            BIGINT NOT NULL,
  reference_number  TEXT,
  note              TEXT,
  disbursed_by      UUID REFERENCES users(id),
  disbursed_at      TIMESTAMPTZ DEFAULT now(),
  status            TEXT CHECK (status IN ('pending','completed')) DEFAULT 'completed'
);
