# AGENTS.md
## Jakarta Yoga Calendar — Agentic Coding Guide

Dokumen ini mendefinisikan cara AI agent bekerja di repository ini: pembagian tugas, urutan eksekusi, batasan, dan protokol koordinasi antar agent.

---

## 1. PRINSIP UTAMA

1. **PRD adalah hukum** — `PRD_Jakarta_Yoga_Calendar_v3.md` adalah sumber kebenaran. Jika ada ambiguitas, tanyakan ke developer, jangan asumsikan.
2. **Tidak ada keputusan arsitektur mandiri** — Perubahan struktur folder, tech stack, atau database schema harus dikonfirmasi developer.
3. **Security non-negotiable** — Pelanggaran aturan keamanan di `CLAUDE.md` Section 9 harus diperbaiki sebelum apapun dilanjutkan.
4. **One task, one branch** — Setiap task dikerjakan di branch terpisah, tidak pernah langsung di `main`.
5. **Selalu baca CLAUDE.md sebelum mulai** — Semua aturan coding di CLAUDE.md berlaku penuh.

---

## 2. PEMBAGIAN AGENT & TANGGUNG JAWAB

### Agent 1: Infrastructure Agent
**Tanggung jawab:**
- Setup Supabase: buat semua tabel sesuai schema di PRD Section 14
- Buat semua Supabase RLS policies sesuai PRD Section 14.4
- Buat Supabase RPC function `reserve_ticket_quota` (PRD Section 16.2)
- Setup Supabase Storage buckets: `event-images`, `eo-logos`, `payment-proofs`
- Setup Next.js Middleware untuk subdomain routing (PRD Section 6.4)
- Setup environment variables di `.env.example`
- Setup Supabase Auth + Google OAuth provider

**Output yang diharapkan:**
- `supabase/migrations/001_initial_schema.sql`
- `supabase/migrations/002_rls_policies.sql`
- `supabase/migrations/003_rpc_functions.sql`
- `src/middleware.ts`
- `.env.example`
- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`
- `src/lib/supabase/types.ts` (generated)

**Tidak boleh menyentuh:** komponen UI, halaman, API routes selain middleware

---

### Agent 2: Public Web Agent
**Tanggung jawab:**
- Semua halaman di `src/app/(public)/`
- Komponen di `src/components/public/`
- Komponen shared yang dibutuhkan web publik

**Urutan pengerjaan:**
1. Layout + Navbar + Footer
2. Homepage (`/`) — semua sections
3. Halaman Events (`/events`) — list + filter + search
4. Halaman Detail Event (`/events/[slug]`) — galeri, tiket, share
5. Halaman Profil EO (`/eo/[slug]`)
6. Halaman Checkout (`/checkout`)
7. Halaman Payment (success, pending, failed)
8. Halaman Account (`/account`)
9. Halaman statis (about, faq, partnership, contact)
10. Halaman 404 custom

**Dependencies:** Harus menunggu Agent 1 selesai setup Supabase schema dan types.

**Checklist per halaman:**
- [ ] Server Component + `generateMetadata` dengan OG tags
- [ ] JSON-LD di halaman detail event
- [ ] Responsive (mobile-first)
- [ ] Empty state terdefinisi
- [ ] Loading state dengan skeleton
- [ ] Error state

---

### Agent 3: EO Portal Agent
**Tanggung jawab:**
- Semua halaman di `src/app/(eo)/`
- Komponen di `src/components/eo/`
- Auth flow EO (register, login, pending, rejected)

**Urutan pengerjaan:**
1. Auth: login, register, halaman pending, halaman rejected
2. Route protection middleware untuk subdomain EO
3. Layout Portal EO (sidebar, header)
4. Dashboard EO
5. Form upload event (multi-image, multi-ticket type)
6. List & manajemen event (dengan status badge)
7. QR Code download per event
8. Halaman peserta per event + export CSV
9. Pengajuan iklan
10. Settings profil EO

**Dependencies:** Harus menunggu Agent 1 selesai. Bisa paralel dengan Agent 2.

**Checklist khusus EO:**
- [ ] EO dengan status `pending` → redirect ke `/pending`
- [ ] EO dengan status `rejected` → halaman rejected + info kontak admin
- [ ] Form upload: validasi MIME gambar di server, maks 10 foto, maks 5MB/foto
- [ ] Slug auto-generate dari nama event (`src/lib/utils/slug.ts`)
- [ ] QR Code: generate PNG berisi URL publik event
- [ ] Export CSV: semua kolom peserta sesuai PRD Section 8.2
- [ ] Soft delete: event dihapus → `deleted_at` diisi, tidak tampil di list publik

---

### Agent 4: Admin Dashboard Agent
**Tanggung jawab:**
- Semua halaman di `src/app/(admin)/`
- Komponen di `src/components/admin/`
- Auth admin dengan 2FA

**Urutan pengerjaan:**
1. Auth admin: login Google OAuth + TOTP 2FA
2. Route protection middleware untuk subdomain Admin
3. Layout Admin (sidebar, header)
4. Dashboard admin (statistik + antrian)
5. Kelola EO (approval/rejection)
6. Kelola Event (approval/rejection + trigger QR Code generation)
7. Kurasi homepage (hero, featured, kalender)
8. Kelola iklan (verifikasi pembayaran)
9. Kelola harga iklan + log perubahan
10. Keuangan: transaksi + disbursement

**Dependencies:** Harus menunggu Agent 1 selesai. Bisa paralel dengan Agent 2 dan 3.

**Checklist khusus Admin:**
- [ ] 2FA TOTP wajib aktif untuk semua akun admin
- [ ] Approval event → trigger generate QR Code (via Supabase service role)
- [ ] Tabel disbursement: input referensi transfer bank, catat timestamp
- [ ] Perubahan harga iklan → insert ke `ad_pricing_log`
- [ ] Akun admin dibuat manual di Supabase — tidak ada halaman register admin

---

### Agent 5: Integration Agent
**Tanggung jawab:**
- Xendit: buat Invoice, handle webhook
- Resend: kirim email konfirmasi tiket dengan PDF attachment
- QR Code generator utility
- PDF tiket generator
- Supabase Realtime untuk sisa kuota tiket

**File yang dibuat:**
- `src/app/api/checkout/route.ts` — buat Xendit Invoice + reserve kuota
- `src/app/api/webhooks/xendit/route.ts` — handle webhook PAID & EXPIRED
- `src/lib/xendit/client.ts` — Xendit API wrapper
- `src/lib/resend/client.ts` — Resend wrapper
- `src/lib/qrcode/generator.ts` — generate QR Code PNG
- `src/lib/pdf/ticket.tsx` — React PDF template tiket
- `src/emails/ticket-confirmation.tsx` — React Email template

**Checklist integration:**
- [ ] Webhook: verifikasi `x-callback-token` sebelum proses apapun
- [ ] Webhook: idempotency check via `xendit_invoice_id`
- [ ] Webhook PAID: update status → paid, update `quota_sold`, trigger email
- [ ] Webhook EXPIRED: update status → expired, rollback `quota_sold`
- [ ] Checkout: gunakan RPC `reserve_ticket_quota` — bukan update langsung
- [ ] Email: attachment PDF tiket otomatis
- [ ] QR Code: isi hanya URL publik event
- [ ] PDF: berisi semua field sesuai PRD Section 13.1

---

## 3. URUTAN EKSEKUSI YANG DIREKOMENDASIKAN

```
Phase 1 (Fondasi — harus selesai dulu):
  Agent 1: Infrastructure setup
    ↓
Phase 2 (Paralel — bisa jalan bersamaan):
  Agent 2: Public Web
  Agent 3: EO Portal
  Agent 4: Admin Dashboard
    ↓
Phase 3 (Setelah semua UI selesai):
  Agent 5: Integrations (Xendit, Resend, QR, PDF)
    ↓
Phase 4: QA, bug fix, deployment
```

---

## 4. PROTOKOL KOMUNIKASI ANTAR AGENT

### Ketika Agent Menemukan Ketidakjelasan di PRD
1. Jangan asumsikan — **stop dan tanyakan ke developer**
2. Format pertanyaan: `[AGENT-N] Pertanyaan: {detail pertanyaan}. Context: {halaman/fitur yang sedang dikerjakan}.`

### Ketika Agent Butuh Output dari Agent Lain
- Periksa folder output agent yang dibutuhkan
- Jika belum ada → tambahkan ke antrian atau tanyakan developer
- Jangan duplikasi kode yang sudah dibuat agent lain

### Ketika Agent Menemukan Bug di Kode Agent Lain
1. Dokumentasikan bug di file `BUGS.md` (buat jika belum ada)
2. Format: `[BUG] {nama file}: {deskripsi bug}. Ditemukan oleh: Agent {N}`
3. Lanjutkan task sendiri, beri tahu developer

---

## 5. ATURAN YANG TIDAK BOLEH DILANGGAR OLEH AGENT MANAPUN

```
❌ DILARANG KERAS:
- Menggunakan SUPABASE_SERVICE_ROLE_KEY di client component
- Menggunakan XENDIT_SECRET_KEY di client component
- Hard delete tabel events (gunakan soft delete)
- Menyimpan data sensitif (token, key) di QR Code atau PDF
- Bypass RLS tanpa alasan yang valid
- Commit langsung ke branch main
- Install library baru tanpa konfirmasi developer
- Membuat akun admin via halaman register
- Mengubah status order dari client-side
- Mengabaikan webhook idempotency check
```

```
✅ WAJIB DILAKUKAN:
- Baca CLAUDE.md sebelum mulai
- Validasi Zod di server untuk semua form submission
- Filter deleted_at IS NULL di semua query events (kecuali admin)
- Gunakan TypeScript strict, tidak ada 'any'
- Mobile-first di semua komponen UI
- Empty state di semua list view
- Loading skeleton di semua data-fetching component
- generateMetadata di semua halaman web publik
- JSON-LD di halaman detail event
```

---

## 6. REFERENSI CEPAT

| Butuh apa | Lihat di mana |
|---|---|
| Fitur lengkap per halaman | PRD Section 8 |
| Database schema | PRD Section 14 |
| Flow pembayaran Xendit | PRD Section 10 |
| Flow sistem iklan | PRD Section 11 |
| Aturan slug | PRD Section 15 |
| Strategi kuota | PRD Section 16 |
| Semua edge cases | PRD Section 18 |
| Empty states per halaman | PRD Section 19 |
| SEO per halaman | PRD Section 20 |
| Env vars lengkap | PRD Section 21 |
| Aturan coding | CLAUDE.md |

---

*Semua agent wajib membaca dokumen ini dan CLAUDE.md sebelum memulai task apapun.*
