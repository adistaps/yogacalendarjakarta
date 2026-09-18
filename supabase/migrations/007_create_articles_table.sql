-- ============================================
-- ARTICLES (Bacaan Seru)
-- ============================================
CREATE TABLE IF NOT EXISTS articles (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  category      TEXT NOT NULL DEFAULT 'General',
  content       TEXT NOT NULL,
  image_url     TEXT NOT NULL,
  author_name   TEXT DEFAULT 'Tim Jakarta Yoga Calendar',
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies for articles
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Allow public read access to articles
CREATE POLICY "Public can read articles" ON articles
  FOR SELECT USING (true);

-- Allow authenticated admins full access
CREATE POLICY "Admins can manage articles" ON articles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Seed Initial Articles Data
INSERT INTO articles (title, slug, category, content, image_url, created_at)
VALUES
(
  'Harga Tiket Konser Kings of Jamsession Jakarta 2024',
  'harga-tiket-konser-kings-of-jamsession-jakarta-2024',
  'Konser',
  'Kings of Jamsession hadir kembali di Jakarta dengan penampilan spektakuler. Dapatkan tiket resminya hanya di Jakarta Yoga Calendar.',
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80',
  '2024-06-12 10:00:00+07'
),
(
  'Cara Beli Tiket di Belakang Daftar, Tips Dapet Tiket Pertama',
  'cara-beli-tiket-di-belakang-daftar-tips-dapet-tiket-pertama',
  'Tips',
  'Persiapkan koneksi internet dan pastikan data diri sudah tersimpan sebelum presale dimulai untuk mengamankan tiket impianmu.',
  'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=600&q=80',
  '2024-06-20 10:00:00+07'
),
(
  'Panduan Lengkap: Nikmati Jakarta Art Week 2024',
  'panduan-lengkap-nikmati-jakarta-art-week-2024',
  'Festival',
  'Eksplorasi pameran seni interaktif, workshop meditasi visual, dan berbagai pertunjukan menarik di pusat kota Jakarta.',
  'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&q=80',
  '2024-06-25 10:00:00+07'
),
(
  '5 Event Yoga Terbaik yang Wajib Kamu Datangi Tahun Ini',
  '5-event-yoga-terbaik-yang-wajib-kamu-datangi-tahun-ini',
  'Yoga',
  'Dari sunrise yoga di pantai hingga sound bath meditation di studio premium, ini 5 rekomendasi event yoga terbaik untukmu.',
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80',
  '2024-06-28 10:00:00+07'
)
ON CONFLICT (slug) DO NOTHING;
