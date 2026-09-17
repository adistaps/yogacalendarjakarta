# Product Requirements Document (PRD)
## Jakarta Yoga Calendar
**Versi:** 3.0 — Final  
**Tanggal:** Juni 2026  
**Developer:** Adista Putra Suyatno — adistaputras.my.id  
**Status:** Final — Ready for Development

---

## DAFTAR ISI

1. [Overview Produk](#1-overview-produk)
2. [Tujuan Produk](#2-tujuan-produk)
3. [Stakeholder & User Roles](#3-stakeholder--user-roles)
4. [Scope & Batasan](#4-scope--batasan)
5. [Tech Stack & Architecture](#5-tech-stack--architecture)
6. [Arsitektur Subdomain](#6-arsitektur-subdomain)
7. [Struktur Aplikasi & Routing](#7-struktur-aplikasi--routing)
8. [Fitur Detail per Modul](#8-fitur-detail-per-modul)
9. [Alur Bisnis & User Flow](#9-alur-bisnis--user-flow)
10. [Sistem Pembayaran Tiket — Xendit](#10-sistem-pembayaran-tiket--xendit)
11. [Sistem Iklan — Manual](#11-sistem-iklan--manual)
12. [Sistem Keuangan & Disbursement](#12-sistem-keuangan--disbursement)
13. [Sistem Notifikasi Email](#13-sistem-notifikasi-email)
14. [Database Schema — Final](#14-database-schema--final)
15. [Slug Generation & Uniqueness](#15-slug-generation--uniqueness)
16. [Kuota Tiket & Concurrency Strategy](#16-kuota-tiket--concurrency-strategy)
17. [Checkout Reservation & Expiry](#17-checkout-reservation--expiry)
18. [Error Handling & Edge Cases](#18-error-handling--edge-cases)
19. [Halaman 404 & Empty State](#19-halaman-404--empty-state)
20. [SEO & Meta Strategy](#20-seo--meta-strategy)
21. [Environment Variables](#21-environment-variables)
22. [Security Requirements](#22-security-requirements)
23. [Non-Functional Requirements](#23-non-functional-requirements)
24. [Program Timeline](#24-program-timeline)
25. [Estimasi Biaya Infrastruktur](#25-estimasi-biaya-infrastruktur)
26. [Garansi & Support Pasca-Launch](#26-garansi--support-pasca-launch)

---

## 1. OVERVIEW PRODUK

Jakarta Yoga Calendar adalah platform digital ticketing berbasis web yang menghubungkan para pecinta yoga dengan event-event yoga terbaik di wilayah Jabodetabek. Platform ini bekerja seperti Loket.com namun dengan niche spesifik yoga dan wellness, memungkinkan pengguna menemukan, mendaftar, dan membayar event yoga secara online dalam satu ekosistem terintegrasi.

Platform terdiri dari tiga sistem utama yang berjalan di subdomain terpisah dalam satu codebase Next.js:

| Sistem | Domain | Target Pengguna | Fungsi Utama |
|---|---|---|---|
| Web Publik | `yogacalendar.id` | Peserta / User | Browse & beli tiket event yoga |
| Portal EO | `eo.yogacalendar.id` | Event Organizer | Kelola event, peserta, dan slot iklan |
| Dashboard Admin | `admin.yogacalendar.id` | Tim Internal | Moderasi, approval, keuangan, monitoring |

**Cakupan wilayah:** Jabodetabek (Jakarta Pusat, Jakarta Selatan, Jakarta Utara, Jakarta Barat, Jakarta Timur, Bogor, Depok, Tangerang, Bekasi)

**Revenue model platform:**
- Slot iklan homepage berbayar (Hero Banner & Featured Section) — pembayaran manual ke rekening admin
- Pendapatan tiket masuk ke rekening platform via Xendit — admin mentransfer ke EO secara manual

---

## 2. TUJUAN PRODUK

- Menyediakan platform terpusat untuk ekosistem yoga di Jabodetabek
- Memudahkan EO mengelola dan mempromosikan event yoga secara mandiri
- Memberikan pengalaman pembelian tiket yang mudah dan aman bagi peserta
- Menghasilkan revenue platform melalui sistem slot iklan homepage berbayar
- Memusatkan aliran dana tiket ke platform sebelum didistribusikan ke EO
- Membangun database komunitas yoga Jabodetabek yang terstruktur

---

## 3. STAKEHOLDER & USER ROLES

### 3.1 User (Peserta)
- Login hanya menggunakan Google OAuth
- Dapat browse dan melihat semua event yang sudah approved
- Mengisi data diri (nama, email, nomor HP) saat checkout
- Jika membeli lebih dari 1 tiket, mengisi nama dan nomor HP peserta per tiket tambahan
- Melihat riwayat transaksi dan status tiket di halaman `/account`
- Menerima email konfirmasi beserta detail pembelian + link WhatsApp group setelah pembayaran berhasil

### 3.2 Event Organizer (EO)
- Admin membagikan link `eo.yogacalendar.id` kepada calon EO via WhatsApp
- EO mendaftar di `eo.yogacalendar.id/register` — akun berstatus `pending` hingga diapprove Admin
- Setelah approved, EO dapat upload event (tidak ada batas jumlah upload)
- Setiap event wajib melalui approval Admin sebelum tayang di web publik
- Setelah event approved: mendapat link event publik + QR Code event (PNG) untuk promosi
- Dapat melihat data peserta per event dan export CSV
- Dapat mengajukan slot iklan dengan pembayaran manual ke rekening admin
- Menerima disbursement pendapatan tiket dari admin secara manual
- EO **tidak** mendapat notifikasi email dari sistem — semua komunikasi via dashboard + WhatsApp admin

### 3.3 Admin
- Satu-satunya penerima notifikasi email sistem selain user
- Melakukan approval/rejection akun EO baru
- Review dan approval setiap event yang disubmit EO
- Mengelola semua konten homepage (hero banner, featured events, kalender interaktif)
- Menerima dan memverifikasi pembayaran iklan manual dari EO
- Mengelola harga slot iklan dari dashboard
- Monitor semua transaksi tiket masuk via Xendit
- Melakukan disbursement (transfer manual) ke EO dan mencatatnya di sistem
- Monitor statistik dan laporan keuangan platform

---

## 4. SCOPE & BATASAN

### In Scope
- Web Publik di `yogacalendar.id`
- Portal EO di `eo.yogacalendar.id`
- Dashboard Admin di `admin.yogacalendar.id`
- Subdomain routing via Next.js Middleware + Cloudflare Wildcard DNS
- Xendit sebagai payment gateway tiket (dana ke rekening platform)
- Pembayaran iklan manual (transfer bank + upload bukti)
- Supabase untuk database, auth, storage, RLS
- Google OAuth sebagai satu-satunya metode login semua role
- QR Code PNG per event (berisi URL halaman detail event)
- Notifikasi email via Resend — hanya untuk user (konfirmasi tiket) dan admin (konfirmasi penerimaan pembayaran iklan)
- Multiple ticket types per event (EO bebas menentukan)
- Multiple images per event (gallery foto)
- Soft delete untuk event
- Data peserta per tiket jika pembelian lebih dari 1 tiket
- Export data peserta per event ke CSV
- Halaman 404 custom + empty states di semua list
- SEO lengkap: meta tags, OG image dinamis per event, JSON-LD, sitemap, robots.txt
- Deployment ke Vercel + Cloudflare

### Out of Scope
- Aplikasi mobile (iOS / Android)
- Disbursement otomatis ke EO
- Live streaming event
- Forum atau fitur komunitas
- Multi-bahasa (Bahasa Indonesia only)
- Refund otomatis
- QR Code tiket per peserta untuk scan check-in
- Komisi per tiket
- Notifikasi email untuk EO (semua komunikasi EO via dashboard + WA admin)
- Push notification

---

## 5. TECH STACK & ARCHITECTURE

| Layer | Teknologi | Keterangan |
|---|---|---|
| Frontend | Next.js 16 (App Router) + TypeScript | SSR/SSG, subdomain routing via Middleware |
| Styling | Tailwind CSS v4 + shadcn/ui | Palet: putih, pink, hijau |
| State Management | Zustand | Cart, session user, UI state global |
| Form Handling | React Hook Form + Zod | Validasi client + server-side |
| Data Fetching | TanStack Query | Cache, optimistic update, refetch |
| Animation | Framer Motion | Transisi halaman & micro-interaction |
| Database | Supabase (PostgreSQL) | Database utama + RLS + Storage |
| Auth | Supabase Auth + Google OAuth | Satu metode login untuk semua role |
| Payment | Xendit | Invoice API + webhook untuk tiket |
| Email | Resend + React Email | Template email transaksional |
| QR Code | `qrcode` (npm) | Generate QR Code URL → PNG |
| PDF Tiket | `@react-pdf/renderer` | Generate PDF konfirmasi tiket otomatis |
| Hosting | Vercel | SSL otomatis, Edge Functions, CDN |
| DNS & Security | Cloudflare | Wildcard DNS, DDoS protection, WAF |
| Domain | `yogacalendar.id` | Via Niagahoster / Namecheap |
| Version Control | GitHub | Source code + CI/CD trigger ke Vercel |

---

## 6. ARSITEKTUR SUBDOMAIN

### 6.1 Konsep

Satu codebase Next.js, satu Vercel project, tiga subdomain. Next.js Middleware membaca `request.headers.get('host')` dan melakukan routing berdasarkan subdomain.

```
yogacalendar.id          →  src/app/(public)/
eo.yogacalendar.id       →  src/app/(eo)/
admin.yogacalendar.id    →  src/app/(admin)/
```

### 6.2 Konfigurasi Cloudflare DNS

```
Type   Name     Value            Proxy
A      @        76.76.21.21      ✅ Proxied (Vercel IP)
CNAME  eo       yogacalendar.id  ✅ Proxied
CNAME  admin    yogacalendar.id  ✅ Proxied
```

### 6.3 Konfigurasi Vercel

Tambahkan custom domains di Vercel project settings:
- `yogacalendar.id`
- `eo.yogacalendar.id`
- `admin.yogacalendar.id`

### 6.4 Next.js Middleware

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const url = request.nextUrl.clone()

  if (hostname.startsWith('admin.')) {
    url.pathname = `/admin${url.pathname}`
    return NextResponse.rewrite(url)
  }

  if (hostname.startsWith('eo.')) {
    url.pathname = `/eo${url.pathname}`
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}
```

### 6.5 Keamanan Subdomain

- Session cookie di-scope ke subdomain masing-masing — session EO tidak valid di Admin dan sebaliknya
- Setiap request ke subdomain EO dan Admin diverifikasi dua lapis:
  1. **Subdomain check** — Next.js Middleware
  2. **Role check** — Supabase RLS + server-side session validation
- User dengan role `user` yang mencoba akses `eo.yogacalendar.id` → redirect ke `yogacalendar.id`
- User dengan role `eo` yang mencoba akses `admin.yogacalendar.id` → redirect ke `eo.yogacalendar.id`

---

## 7. STRUKTUR APLIKASI & ROUTING

### 7.1 Web Publik (`yogacalendar.id`)

```
/                          → Homepage
/events                    → Daftar semua event (approved)
/events/[slug]             → Detail event + galeri foto + pilih tiket
/about                     → Tentang Jakarta Yoga Calendar
/faq                       → FAQ
/partnership               → Info EO + showcase partner + CTA WA
/contact                   → Kontak
/eo/[slug]                 → Profil publik EO
/checkout                  → Halaman checkout & pengisian data
/payment/success           → Pembayaran berhasil
/payment/pending           → Menunggu pembayaran
/payment/failed            → Pembayaran gagal / expired
/account                   → Dashboard user (tiket & riwayat)
/404                       → Halaman tidak ditemukan (custom)
```

### 7.2 Portal EO (`eo.yogacalendar.id`)

```
/login                     → Login Google OAuth
/register                  → Daftar akun EO baru
/pending                   → Halaman tunggu approval
/dashboard                 → Dashboard utama EO
/events                    → Daftar event EO
/events/create             → Form upload event baru
/events/[id]/edit          → Form edit event
/events/[id]/participants  → Data peserta + export CSV
/ads                       → Riwayat pengajuan iklan
/ads/create                → Form ajukan slot iklan
/settings                  → Pengaturan profil EO
/404                       → Halaman tidak ditemukan
```

### 7.3 Dashboard Admin (`admin.yogacalendar.id`)

```
/login                     → Login Google OAuth + 2FA
/dashboard                 → Ringkasan statistik & antrian
/eo                        → Daftar & approval akun EO
/eo/[id]                   → Detail profil EO
/events                    → Daftar & approval event
/events/[id]               → Detail review event
/ads                       → Kelola pengajuan iklan
/ads/pricing               → Kelola harga slot
/homepage                  → Kurasi konten homepage
/homepage/hero             → Kelola hero banner
/homepage/featured         → Kelola featured section
/homepage/calendar         → Kelola kalender interaktif
/finance                   → Laporan keuangan
/finance/transactions      → Riwayat transaksi Xendit
/finance/disbursements     → Riwayat & catat disbursement ke EO
/404                       → Halaman tidak ditemukan
```

---

## 8. FITUR DETAIL PER MODUL

### 8.1 Web Publik

#### Navbar
- Logo Jakarta Yoga Calendar
- Menu: Home | Events | About Us | FAQ | Partnership | Contact Us
- Icon Search
- Tombol Login Google / Avatar + dropdown (Akun, Logout) jika sudah login

#### Homepage (`/`)
- **Hero Banner Slider** — menampilkan iklan Hero Banner aktif sesuai kurasi admin
- **Section "Event Minggu Ini"** — menampilkan Featured Section yang aktif
- **Kalender Interaktif** — klik tanggal → tampil event pada tanggal tersebut
- **Section "Event Terbaru"** — event approved diurutkan dari terbaru
- **Section "Event Populer"** — event diurutkan berdasarkan tiket terjual terbanyak
- **Footer** — deskripsi, navigasi, sosmed, metode pembayaran

#### Halaman Events (`/events`)
- Filter: tanggal (date picker), wilayah Jabodetabek, harga (range)
- Search: keyword nama event atau nama EO
- Card: foto utama event, nama event, nama EO, tanggal, lokasi, harga mulai dari
- Pagination
- Empty state jika tidak ada hasil filter

#### Halaman Detail Event (`/events/[slug]`)
- Galeri foto event (multiple images — foto pertama sebagai thumbnail)
- Nama event, tanggal, waktu, lokasi lengkap
- Deskripsi event (full)
- Fasilitas & layanan yang disediakan
- Informasi kolaborasi (jika ada)
- Nama & logo EO + link ke profil publik EO (`/eo/[slug]`)
- Pilihan tipe tiket: nama, harga, sisa kuota
- Jika tiket habis: tampil badge "Tiket Habis" per tipe tiket, tombol beli disabled
- Jika semua tipe tiket habis: tombol "Sold Out" dan pesan informatif
- Tombol Beli Tiket → redirect ke `/login` jika belum login
- Share: WhatsApp, Copy Link
- **Tidak ada QR Code di halaman ini**

#### Halaman Checkout (`/checkout`)
- Ringkasan: nama event, tipe tiket, jumlah, total harga
- Form data pembeli: nama lengkap, email (pre-fill dari Google), nomor HP
- Jika quantity > 1: form nama + nomor HP peserta per tiket tambahan
- Tombol Bayar → buat Xendit Invoice → redirect ke halaman bayar Xendit
- Jika tiket habis saat klik bayar (race condition): tampil notifikasi "Maaf, tiket yang Anda pilih sudah habis" dan arahkan kembali ke halaman event

#### Halaman Payment Success (`/payment/success`)
- Konfirmasi pembayaran berhasil
- Detail pesanan: nama event, tipe tiket, jumlah, total bayar
- Nama semua peserta (jika lebih dari 1)
- Link join WhatsApp group event
- Tombol download PDF konfirmasi tiket (generate otomatis via `@react-pdf/renderer`)
- CTA: Lihat Tiket Saya / Kembali ke Beranda

#### Halaman Payment Pending (`/payment/pending`)
- Instruksi menunggu konfirmasi pembayaran
- Informasi: order akan expired dalam X jam (sesuai Xendit)
- Tombol: Cek Status Pembayaran, Kembali ke Beranda

#### Halaman Payment Failed (`/payment/failed`)
- Informasi pembayaran gagal atau expired
- Tombol: Coba Lagi (kembali ke detail event), Kembali ke Beranda

#### Halaman Akun User (`/account`)
- Profil: foto Google, nama, email, nomor HP (editable)
- Tab "Tiket Aktif" — event yang belum berlangsung, status `paid`
- Tab "Riwayat" — semua transaksi, semua status
- Per tiket: nama event, tipe tiket, tanggal event, status, tombol download PDF
- Empty state jika belum ada transaksi

#### Halaman Partnership (`/partnership`)
- Deskripsi benefit bergabung jadi EO
- Grid logo + nama EO yang sudah bergabung (hanya EO dengan status approved)
- CTA: tombol "Daftar Jadi EO" → buka WhatsApp admin
- Tidak ada form registrasi langsung

#### Profil Publik EO (`/eo/[slug]`)
- Logo + nama organisasi EO
- Bio/deskripsi
- Kontak WhatsApp EO
- Grid event aktif EO (status approved, belum berakhir)
- Empty state jika EO belum punya event aktif

---

### 8.2 Portal EO (`eo.yogacalendar.id`)

#### Register (`/register`)
- Form: nama organisasi, nama PIC, email, nomor WhatsApp
- Login via Google OAuth
- Setelah submit → status `pending`, redirect ke `/pending`
- Halaman `/pending`: pesan "Akun Anda sedang dalam proses review. Admin akan menghubungi Anda via WhatsApp."

#### Dashboard EO (`/dashboard`)
- Total event aktif (approved & belum berakhir)
- Total tiket terjual bulan ini
- Estimasi pendapatan bulan ini (total dari tiket terjual)
- Event terdekat yang akan berlangsung (card: nama, tanggal, sisa kuota)
- Antrian status: berapa event pending review, berapa event rejected
- Status disbursement terakhir

#### Manajemen Event (`/events`)
- List event dengan badge status: Draft / Pending Review / Approved / Rejected
- Aksi per event:
  - Draft: Edit, Hapus (soft delete)
  - Pending Review: Lihat (read-only)
  - Approved: Lihat link publik, Unduh QR Code PNG, Lihat Peserta
  - Rejected: Edit ulang + kirim kembali untuk review, Hapus
- Empty state jika belum ada event

#### Form Upload Event (`/events/create` & `/events/[id]/edit`)
Field yang diisi EO:
- **Nama event** (wajib)
- **Foto event** (wajib, multiple images, min 1 — JPG/PNG/WebP, maks 5MB per foto, maks 10 foto)
- **Deskripsi event** (wajib, textarea)
- **Fasilitas & layanan** (wajib — contoh: yoga mat, air mineral, snack, instruktur bersertifikat)
- **Informasi kolaborasi** (opsional)
- **Tanggal mulai & selesai** (wajib)
- **Jam mulai & selesai** (wajib)
- **Wilayah** (wajib, dropdown Jabodetabek)
- **Alamat lengkap** (wajib)
- **Link WhatsApp group** (wajib — diberikan ke peserta setelah bayar)
- **Tipe tiket** (wajib, minimal 1, bisa multiple):
  - Nama tipe tiket (Early Bird, Regular, VIP, dll)
  - Harga (Rupiah)
  - Kuota
- **Catatan untuk Admin** (opsional, tidak tampil di publik)
- Tombol: Simpan sebagai Draft / Submit untuk Review

#### QR Code Event
- Hanya tersedia setelah event approved
- Di-generate otomatis saat Admin approve event
- Konten QR Code: `https://yogacalendar.id/events/[slug]` (URL publik, tidak ada data sensitif)
- Format: PNG, resolusi cukup untuk cetak
- Tombol "Unduh QR Code" di halaman daftar event dan detail event

#### Data Peserta (`/events/[id]/participants`)
- Tabel: No, Nama, Email, No HP, Tipe Tiket, Jumlah, Total Bayar, Status, Tanggal Transaksi
- Filter by tipe tiket, status pembayaran
- Search by nama atau email
- Tombol **Export CSV** dengan semua kolom di atas
- Empty state jika belum ada peserta

#### Pengajuan Iklan (`/ads/create`)
- Pilih event (hanya Approved)
- Pilih jenis slot: Hero Banner / Featured Section
- Lihat harga per hari (real-time dari `ad_pricing`)
- Pilih tanggal mulai — sistem tampilkan ketersediaan slot
- Ringkasan: jenis, tanggal, durasi, total biaya
- Setelah konfirmasi: tampil nomor rekening admin + instruksi transfer
- Upload bukti pembayaran (JPG/PNG/PDF, maks 5MB)
- Status pengajuan: Pending Verifikasi / Aktif / Ditolak
- Tidak ada refund setelah terverifikasi

#### Profil EO (`/settings`)
- Edit: nama organisasi, bio, logo, nomor WhatsApp, email kontak

---

### 8.3 Dashboard Admin (`admin.yogacalendar.id`)

#### Login Admin
- Google OAuth + TOTP 2FA (Google Authenticator)
- Akun admin dibuat manual oleh developer di Supabase

#### Dashboard Admin (`/dashboard`)
- Statistik: total EO, total event aktif, total transaksi bulan ini, total pendapatan iklan bulan ini
- Antrian: EO pending, event pending, iklan pending verifikasi
- Grafik tren pendapatan tiket & iklan

#### Kelola EO (`/eo`)
- Daftar semua EO + status
- Approve: ubah status → `approved`, kirim notif internal
- Reject: isi alasan → ubah status → `rejected`, kirim notif internal
- Klik EO → detail profil lengkap

#### Kelola Event (`/events`)
- Daftar semua event semua EO, filter by status/EO/tanggal
- Approve: ubah status → `approved`, generate QR Code, kirim notif ke EO via dashboard
- Reject: isi alasan → `rejected`, kirim notif ke EO via dashboard

#### Kurasi Homepage (`/homepage`)

**Hero Banner:** assign slot iklan `paid` ke tanggal tertentu, preview banner

**Featured Section:** assign event ke featured section per tanggal

**Kalender Interaktif:** tambah/hapus event di kalender per tanggal (hanya event Approved)

#### Kelola Iklan (`/ads`)
- Daftar pengajuan iklan semua EO
- Detail: EO, event, slot, tanggal, bukti transfer
- Tombol Verifikasi: status → `paid`, iklan terjadwal aktif
- Tombol Tolak: isi alasan, ubah status → `rejected`

**Harga Iklan (`/ads/pricing`):**
- Form edit harga Hero Banner per hari
- Form edit harga Featured Section per hari
- Log riwayat perubahan harga (admin, nominal lama, nominal baru, timestamp)

#### Keuangan (`/finance`)

**Transaksi (`/finance/transactions`):**
- Semua transaksi tiket dari Xendit
- Filter by event, EO, tanggal, status
- Total per event / per EO / per periode

**Disbursement (`/finance/disbursements`):**
- Daftar EO dengan saldo pending disbursement
- Input nominal transfer + nomor referensi transfer bank
- Catat tanggal disbursement
- Riwayat lengkap semua disbursement

---

## 9. ALUR BISNIS & USER FLOW

### 9.1 Flow Pembelian Tiket (User)

```
Browse event di yogacalendar.id
→ Klik event → Halaman Detail Event
→ Pilih tipe tiket & jumlah
→ Klik Beli Tiket
→ Jika belum login → redirect ke /login → Google OAuth
→ Redirect kembali ke checkout
→ Isi data pembeli (nama, email, HP)
→ Jika qty > 1 → isi nama + HP peserta per tiket
→ Klik Bayar
→ Platform buat Xendit Invoice
→ Platform atomic-decrement sisa kuota (reserve)
→ Redirect ke Xendit payment page
→ User bayar
→ Xendit kirim webhook ke platform
→ Platform verifikasi signature → update status order → paid
→ Redirect ke /payment/success
→ Tampil detail pesanan + link WA group + tombol download PDF
→ Email konfirmasi otomatis terkirim ke user (detail + PDF attachment)
```

### 9.2 Flow EO

```
Admin bagikan link eo.yogacalendar.id via WA
→ EO register → status pending
→ Admin approve di dashboard admin
→ EO login ke Portal EO
→ EO upload event → status pending review
→ Admin review → approve/reject
→ Jika approved: event tayang, EO dapat link + QR Code
→ EO promosi (pamflet, IG, WA)
→ Peserta beli tiket
→ Dana masuk ke platform (Xendit)
→ EO pantau peserta & penjualan di dashboard
→ Admin disbursement dana ke EO
→ [Opsional] EO ajukan iklan → transfer manual → upload bukti
→ Admin verifikasi → iklan tayang
```

### 9.3 Flow Admin (Harian)

```
Login admin.yogacalendar.id (Google OAuth + 2FA)
→ Cek antrian dashboard
→ Review & approve/reject EO baru
→ Review & approve/reject event
→ Verifikasi pembayaran iklan manual
→ Kurasi konten homepage
→ Monitor transaksi Xendit
→ Catat disbursement ke EO
→ Update harga iklan jika perlu
```

---

## 10. SISTEM PEMBAYARAN TIKET — XENDIT

### 10.1 Overview

Semua pembayaran tiket menggunakan **Xendit Invoice API**. Dana masuk ke rekening platform yang terhubung ke akun Xendit. Admin mentransfer ke EO secara manual.

### 10.2 Metode Pembayaran (via Xendit)
- Transfer Bank Virtual Account (BCA, Mandiri, BNI, BRI, Permata, dll)
- QRIS
- E-wallet: OVO, Dana, GoPay, ShopeePay

### 10.3 Flow Teknis Pembayaran

```typescript
// 1. Buat Xendit Invoice saat user klik Bayar
POST /api/checkout
→ Validasi stok tiket (atomic check)
→ Buat ticket_orders dengan status pending_payment
→ Buat Xendit Invoice via API
→ Simpan xendit_invoice_id + xendit_payment_url ke order
→ Return payment_url ke client
→ Client redirect ke Xendit

// 2. Xendit kirim webhook setelah bayar
POST /api/webhooks/xendit
→ Verifikasi x-callback-token header
→ Idempotency check: apakah invoice_id sudah diproses?
→ Jika paid: update order status → paid, update quota_sold
→ Trigger email konfirmasi ke user
→ Trigger generate PDF tiket
→ Return 200 OK ke Xendit

// 3. Jika expired (Xendit kirim webhook EXPIRED)
→ Update order status → expired
→ Kembalikan kuota yang di-reserve (jika ada)
```

### 10.4 Webhook Security

```typescript
// /api/webhooks/xendit/route.ts
export async function POST(request: Request) {
  const callbackToken = request.headers.get('x-callback-token')

  // Bandingkan dengan XENDIT_WEBHOOK_TOKEN di env server
  if (callbackToken !== process.env.XENDIT_WEBHOOK_TOKEN) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const invoiceId = body.id

  // Idempotency check
  const existing = await supabase
    .from('ticket_orders')
    .select('status')
    .eq('xendit_invoice_id', invoiceId)
    .single()

  if (existing.data?.status === 'paid') {
    return Response.json({ message: 'Already processed' }, { status: 200 })
  }

  // Update status
  if (body.status === 'PAID') {
    await updateOrderPaid(invoiceId)
  } else if (body.status === 'EXPIRED') {
    await updateOrderExpired(invoiceId)
  }

  return Response.json({ success: true })
}
```

### 10.5 Status Order Tiket

| Status | Kapan | Aksi Sistem |
|---|---|---|
| `pending_payment` | Order dibuat, menunggu bayar | Kuota di-reserve |
| `paid` | Webhook Xendit PAID diterima | Kuota dikonfirmasi terjual, email dikirim |
| `expired` | Webhook Xendit EXPIRED diterima | Kuota dikembalikan ke pool |
| `cancelled` | Manual oleh admin | Kuota dikembalikan (jika perlu) |

### 10.6 Expiry

- Default expiry Xendit Invoice: **24 jam**
- Saat expired, webhook `EXPIRED` dikirim Xendit ke platform
- Platform update status order → `expired`
- Kuota tiket yang sempat di-reserve dikembalikan

---

## 11. SISTEM IKLAN — MANUAL

### 11.1 Jenis Slot

| Jenis Slot | Posisi | Harga | Catatan |
|---|---|---|---|
| Hero Banner | Slider utama homepage (paling atas) | Diatur Admin | Dapat diubah kapan saja |
| Featured Section | Section di bawah hero | Diatur Admin | Dapat diubah kapan saja |

### 11.2 Alur Pengajuan Iklan

```
EO ajukan di eo.yogacalendar.id/ads/create
→ Pilih event (hanya Approved)
→ Pilih jenis slot
→ Pilih tanggal (sistem tampilkan ketersediaan real-time)
→ Lihat total biaya
→ Konfirmasi → sistem tampilkan nomor rekening admin
→ EO transfer manual → upload bukti bayar
→ Status: Pending Verifikasi
→ Admin verifikasi bukti di admin.yogacalendar.id/ads
→ Approve: status → paid, iklan terjadwal otomatis aktif sesuai tanggal
→ Tolak: isi alasan, status → rejected
```

### 11.3 Aturan

- Satu slot hanya bisa diisi satu iklan per hari
- EO tidak bisa pesan slot yang sudah terisi
- Tidak ada refund setelah diverifikasi
- Iklan hanya bisa diajukan untuk event Approved
- Iklan otomatis nonaktif setelah durasi selesai (`is_active = false`)
- Perubahan harga iklan hanya berlaku untuk pengajuan baru

---

## 12. SISTEM KEUANGAN & DISBURSEMENT

### 12.1 Aliran Dana

```
User bayar tiket
→ Dana masuk ke Xendit (rekening platform)
→ Admin monitor via Xendit dashboard + admin panel
→ Admin hitung total pendapatan per EO per periode
→ Admin transfer manual ke rekening EO
→ Admin catat disbursement di sistem:
   - EO yang dituju
   - Nominal transfer
   - Nomor referensi transfer bank
   - Tanggal
→ EO dapat melihat status disbursement di dashboard mereka
```

### 12.2 Transparansi ke EO

EO dapat melihat di dashboard:
- Total tiket terjual per event
- Estimasi pendapatan (total nilai tiket yang paid)
- Status disbursement per periode: `Pending` / `Sudah Ditransfer`
- Riwayat disbursement yang sudah diterima

---

## 13. SISTEM NOTIFIKASI EMAIL

Menggunakan **Resend** + **React Email** untuk template.

### 13.1 Email untuk User (Peserta)

**Konfirmasi Pembelian Tiket Berhasil**
- Trigger: webhook Xendit status PAID terproses
- Penerima: email pembeli (dari `ticket_orders.buyer_email`)
- Konten:
  - Header: logo Jakarta Yoga Calendar
  - Judul: "Pembayaran Berhasil! 🎉"
  - Detail event: nama event, tanggal, waktu, lokasi
  - Detail pesanan: tipe tiket, jumlah tiket, total bayar
  - Daftar nama peserta (jika lebih dari 1)
  - Tombol: "Join WhatsApp Group" (link WA group event)
  - Tombol: "Lihat Tiket Saya" (link ke `/account`)
  - **Attachment: PDF konfirmasi tiket** (generate otomatis via `@react-pdf/renderer`)
  - Footer: kontak support, unsubscribe link

**PDF Konfirmasi Tiket (attachment)**
- Generate otomatis setelah pembayaran berhasil
- Konten PDF:
  - Logo Jakarta Yoga Calendar
  - Nama event + tanggal + lokasi
  - Nama pembeli + email + no HP
  - Tipe tiket + jumlah
  - Total bayar + tanggal transaksi
  - Order ID
  - Pesan: "Tunjukkan email atau PDF ini kepada panitia event"

### 13.2 Notifikasi Internal Admin

Notifikasi untuk admin bukan via email otomatis — admin memantau antrian langsung dari dashboard `admin.yogacalendar.id`. Tidak ada email otomatis ke EO dari sistem.

---

## 14. DATABASE SCHEMA — FINAL

### 14.1 Tabel Lengkap

```sql
-- ============================================
-- USERS
-- ============================================
CREATE TABLE users (
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
CREATE TABLE eo_profiles (
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
CREATE TABLE events (
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
CREATE TABLE event_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    UUID REFERENCES events(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,  -- 0 = foto utama/thumbnail
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- TICKET TYPES (multiple per event)
-- ============================================
CREATE TABLE ticket_types (
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
CREATE TABLE ticket_orders (
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
CREATE TABLE ticket_order_items (
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
CREATE TABLE ad_slots (
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
CREATE TABLE ad_pricing (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_type         TEXT CHECK (slot_type IN ('hero','featured')) UNIQUE NOT NULL,
  price_per_day     BIGINT NOT NULL,
  updated_by_admin  UUID REFERENCES users(id),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- AD PRICING LOG (audit trail)
-- ============================================
CREATE TABLE ad_pricing_log (
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
CREATE TABLE calendar_events (
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
CREATE TABLE disbursements (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  eo_id             UUID REFERENCES eo_profiles(id),
  amount            BIGINT NOT NULL,
  reference_number  TEXT,
  note              TEXT,
  disbursed_by      UUID REFERENCES users(id),
  disbursed_at      TIMESTAMPTZ DEFAULT now(),
  status            TEXT CHECK (status IN ('pending','completed')) DEFAULT 'completed'
);
```

### 14.2 Timezone Convention

- Semua kolom `TIMESTAMPTZ` disimpan dalam **UTC** di database
- Semua kolom `DATE` dan `TIME` untuk event disimpan apa adanya (representasi WIB secara konvensi)
- Frontend selalu menampilkan waktu dalam **WIB (Asia/Jakarta, UTC+7)**
- Konversi dilakukan di layer frontend menggunakan `Intl.DateTimeFormat` atau `date-fns-tz`

### 14.3 Soft Delete Convention

- Tabel `events` menggunakan soft delete via kolom `deleted_at TIMESTAMPTZ DEFAULT NULL`
- Event yang dihapus EO: `deleted_at` diisi timestamp saat ini
- Semua query event di web publik dan Portal EO wajib menambahkan filter `WHERE deleted_at IS NULL`
- Admin dapat melihat semua event termasuk yang sudah dihapus untuk audit

### 14.4 Row Level Security (RLS) — Summary

| Tabel | User | EO | Admin |
|---|---|---|---|
| `users` | Read/update own | Read/update own | Full |
| `eo_profiles` | Read approved only | Read/update own | Full |
| `events` | Read approved + not deleted | CRUD own + soft delete | Full |
| `event_images` | Read | CRUD own events | Full |
| `ticket_types` | Read | CRUD own events | Full |
| `ticket_orders` | CRUD own | Read own event orders | Full |
| `ticket_order_items` | Read own | Read own event orders | Full |
| `ad_slots` | No access | CRUD own | Full |
| `ad_pricing` | Read | Read | Full |
| `ad_pricing_log` | No access | No access | Full |
| `calendar_events` | Read | No access | Full |
| `disbursements` | No access | Read own | Full |

---

## 15. SLUG GENERATION & UNIQUENESS

### 15.1 Format Slug

```
"Yoga Pagi & Meditasi!" → "yoga-pagi-meditasi"
"Vinyasa Flow @Studio 27" → "vinyasa-flow-studio-27"
```

**Rules:**
1. Lowercase semua huruf
2. Strip karakter selain huruf, angka, spasi
3. Ganti spasi dengan `-`
4. Trim `-` di awal dan akhir
5. Maksimal 80 karakter

### 15.2 Handling Duplikat

Jika slug sudah ada di database, append suffix numerik:

```
yoga-pagi-meditasi        (ada)
yoga-pagi-meditasi-2      (ada)
yoga-pagi-meditasi-3      ← gunakan ini
```

Implementasi menggunakan recursive check di server sebelum insert.

### 15.3 Implementasi

```typescript
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .substring(0, 80)
}

async function createUniqueSlug(text: string, table: 'events' | 'eo_profiles') {
  const base = generateSlug(text)
  let slug = base
  let counter = 2

  while (true) {
    const { data } = await supabase.from(table).select('id').eq('slug', slug).single()
    if (!data) return slug
    slug = `${base}-${counter}`
    counter++
  }
}
```

---

## 16. KUOTA TIKET & CONCURRENCY STRATEGY

### 16.1 Masalah

Multiple user bisa checkout tiket yang sama secara bersamaan, berpotensi oversell.

### 16.2 Solusi: Atomic Update via Supabase RPC

Gunakan PostgreSQL function dengan `FOR UPDATE` lock untuk atomic decrement kuota.

```sql
-- Supabase RPC: reserve_ticket_quota
CREATE OR REPLACE FUNCTION reserve_ticket_quota(
  p_ticket_type_id UUID,
  p_quantity INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  v_available INTEGER;
BEGIN
  SELECT (quota - quota_sold)
  INTO v_available
  FROM ticket_types
  WHERE id = p_ticket_type_id
  FOR UPDATE;  -- lock row

  IF v_available >= p_quantity THEN
    UPDATE ticket_types
    SET quota_sold = quota_sold + p_quantity
    WHERE id = p_ticket_type_id;
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql;
```

### 16.3 Flow

```
User klik Bayar
→ Server call reserve_ticket_quota(ticket_type_id, quantity)
→ Jika return FALSE: tiket habis → tampil notifikasi ke user → batalkan checkout
→ Jika return TRUE: kuota ter-reserve → buat order → buat Xendit Invoice
→ Jika user tidak jadi bayar (expired): webhook EXPIRED dari Xendit
→ Server rollback quota_sold: UPDATE quota_sold = quota_sold - quantity
```

### 16.4 Notifikasi Tiket Habis

Jika race condition terjadi (tiket habis saat user sedang di checkout):
- Tampilkan toast error: "Maaf, tiket [nama tipe tiket] sudah habis."
- Redirect kembali ke halaman detail event
- Badge sisa kuota di halaman event diupdate real-time via Supabase Realtime

---

## 17. CHECKOUT RESERVATION & EXPIRY

### 17.1 Strategi

**Tidak ada cart reservation sebelum klik Bayar.** Kuota baru di-reserve saat user klik tombol Bayar (saat platform buat Xendit Invoice).

**Alasan:**
- Mencegah ghost reservation (user membuka halaman checkout lalu pergi)
- Lebih simple, tidak perlu timer reservation di frontend
- Risk: user bisa saja isi form checkout lalu saat klik Bayar tiket sudah habis — ini ditangani dengan pesan error yang jelas (lihat 16.4)

### 17.2 Expiry Order

- Order `pending_payment` akan expired setelah **24 jam** (default Xendit)
- Kuota dikembalikan saat webhook EXPIRED diterima
- User yang punya order expired mendapat status "Kedaluwarsa" di `/account`

---

## 18. ERROR HANDLING & EDGE CASES

### 18.1 Pembayaran

| Kondisi | Penanganan |
|---|---|
| Xendit down saat buat invoice | Return error 503 ke user, tampil pesan "Layanan pembayaran sedang tidak tersedia, coba beberapa saat lagi" |
| User tutup tab di halaman Xendit | Order tetap `pending_payment`, user bisa kembali via `/account` → "Lanjutkan Pembayaran" |
| Xendit kirim webhook duplikat | Idempotency check via `xendit_invoice_id` — duplikat diabaikan |
| Webhook gagal diterima platform | Xendit retry otomatis beberapa kali — platform harus return 200 setelah proses |
| Tiket habis saat klik Bayar | Rollback order, tampil notifikasi, redirect ke halaman event |
| Xendit EXPIRED tapi user sudah bayar di menit terakhir | Xendit handle ini — status PAID selalu menang atas EXPIRED |

### 18.2 Upload File

| Kondisi | Penanganan |
|---|---|
| File > 5MB | Validasi client-side (pesan error langsung) + validasi server-side (reject) |
| MIME type tidak sesuai | Validasi server-side — cek actual MIME, bukan ekstensi |
| Upload gagal (timeout) | Tampil toast error, tombol retry tersedia |
| Foto event pertama dihapus | Foto ke-2 otomatis jadi thumbnail (berdasarkan `order_index`) |

### 18.3 Autentikasi & Akses

| Kondisi | Penanganan |
|---|---|
| Session expired | Redirect ke halaman login subdomain yang sesuai |
| EO akses admin subdomain | Redirect ke `eo.yogacalendar.id/dashboard` |
| User akses EO subdomain | Redirect ke `yogacalendar.id` |
| EO dengan status `pending` login ke portal | Redirect ke `/pending` |
| EO dengan status `rejected` login ke portal | Tampil halaman rejected + instruksi hubungi admin |
| Admin akses event yang di-soft delete | Tetap tampil dengan badge "Dihapus" |

### 18.4 Event & Tiket

| Kondisi | Penanganan |
|---|---|
| User akses event yang belum approved | Halaman 404 |
| User akses event yang soft-deleted | Halaman 404 |
| Event berakhir tapi masih diakses | Halaman tetap tampil dengan badge "Event Sudah Berakhir", tombol beli disabled |
| EO edit event yang sudah Approved | Tidak bisa edit — harus submit event baru |

---

## 19. HALAMAN 404 & EMPTY STATE

### 19.1 Halaman 404 Custom

Tiga versi 404 per subdomain:

**Web Publik (`/404`):**
- Ilustrasi yoga pose + pesan "Halaman ini sepertinya sedang meditasi..."
- Tombol: Kembali ke Beranda, Lihat Semua Event

**Portal EO (`/404`):**
- Pesan: "Halaman tidak ditemukan"
- Tombol: Kembali ke Dashboard

**Dashboard Admin (`/404`):**
- Pesan: "Halaman tidak ditemukan"
- Tombol: Kembali ke Dashboard

### 19.2 Empty States

Setiap list view harus memiliki empty state yang informatif:

| Halaman | Empty State |
|---|---|
| `/events` (web publik, tidak ada hasil filter) | "Tidak ada event yang sesuai filter. Coba ubah filter pencarian." |
| `/events` (web publik, belum ada event sama sekali) | "Belum ada event tersedia saat ini. Pantau terus ya!" |
| `/eo/[slug]` (EO belum punya event aktif) | "EO ini belum memiliki event aktif saat ini." |
| `/account` (user belum punya tiket) | "Kamu belum punya tiket. Yuk, temukan event yoga!" + tombol Browse Event |
| Portal EO `/events` (belum upload event) | "Belum ada event. Mulai upload event pertamamu!" + tombol Upload Event |
| Portal EO `/ads` (belum pernah ajukan iklan) | "Belum ada pengajuan iklan." + tombol Ajukan Iklan |
| Portal EO `/events/[id]/participants` (belum ada peserta) | "Belum ada peserta terdaftar untuk event ini." |
| Admin `/eo` (belum ada EO daftar) | "Belum ada akun EO yang mendaftar." |
| Admin `/events` (belum ada event) | "Belum ada event yang disubmit." |
| Admin `/ads` (belum ada pengajuan iklan) | "Belum ada pengajuan iklan." |

---

## 20. SEO & META STRATEGY

### 20.1 Meta Tags Dasar (semua halaman publik)

```html
<title>{page_title} | Jakarta Yoga Calendar</title>
<meta name="description" content="{page_description}" />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="https://yogacalendar.id{current_path}" />
```

### 20.2 Open Graph & Twitter Card

Setiap halaman event memiliki OG tags dinamis:

```html
<meta property="og:title" content="{event_title} | Jakarta Yoga Calendar" />
<meta property="og:description" content="{event_description_truncated}" />
<meta property="og:image" content="{event_banner_url}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:url" content="https://yogacalendar.id/events/{slug}" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
```

OG image menggunakan foto pertama event (`event_images` dengan `order_index = 0`).

### 20.3 Structured Data (JSON-LD)

Setiap halaman detail event menyertakan JSON-LD untuk Google Rich Results:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "{event_title}",
  "startDate": "{date_start}T{time_start}+07:00",
  "endDate": "{date_end}T{time_end}+07:00",
  "location": {
    "@type": "Place",
    "name": "{location_address}",
    "address": "{location_area}, Indonesia"
  },
  "image": "{event_banner_url}",
  "description": "{event_description}",
  "organizer": {
    "@type": "Organization",
    "name": "{eo_org_name}",
    "url": "https://yogacalendar.id/eo/{eo_slug}"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://yogacalendar.id/events/{slug}",
    "priceCurrency": "IDR",
    "price": "{lowest_ticket_price}",
    "availability": "https://schema.org/InStock"
  }
}
</script>
```

### 20.4 Sitemap & Robots

**`/sitemap.xml`** — generate dinamis via Next.js:
- Semua halaman statis (/, /events, /about, /faq, /partnership, /contact)
- Semua halaman event yang approved (`/events/[slug]`)
- Semua halaman profil EO yang approved (`/eo/[slug]`)

**`/robots.txt`:**
```
User-agent: *
Allow: /
Disallow: /account
Disallow: /checkout
Disallow: /payment/

Sitemap: https://yogacalendar.id/sitemap.xml
```

### 20.5 Canonical URL

- Web publik: canonical ke `https://yogacalendar.id{path}`
- Subdomain EO dan Admin: tag `<meta name="robots" content="noindex, nofollow" />` — tidak perlu diindex

### 20.6 Performance SEO

- Semua gambar menggunakan `next/image` dengan lazy loading
- Hero banner menggunakan `priority` prop untuk LCP optimization
- Font loading via `next/font` (tidak ada render blocking)
- Target: Lighthouse score ≥ 85 mobile dan desktop

---

## 21. ENVIRONMENT VARIABLES

Semua env vars diset di Vercel project settings. Tidak pernah di-commit ke GitHub.

```bash
# ============================================
# SUPABASE
# ============================================
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # Server-side only, JANGAN expose ke client

# ============================================
# XENDIT
# ============================================
XENDIT_SECRET_KEY=                  # Server-side only
XENDIT_WEBHOOK_TOKEN=               # Server-side only, untuk verifikasi webhook
NEXT_PUBLIC_XENDIT_PUBLIC_KEY=      # Boleh di client (untuk Xendit.js jika dipakai)

# ============================================
# RESEND (EMAIL)
# ============================================
RESEND_API_KEY=                     # Server-side only
RESEND_FROM_EMAIL=noreply@yogacalendar.id

# ============================================
# APP CONFIG
# ============================================
NEXT_PUBLIC_APP_URL=https://yogacalendar.id
NEXT_PUBLIC_EO_URL=https://eo.yogacalendar.id
NEXT_PUBLIC_ADMIN_URL=https://admin.yogacalendar.id
ADMIN_WHATSAPP_NUMBER=              # Nomor WA admin untuk CTA Partnership
ADMIN_BANK_ACCOUNT=                 # Info rekening admin untuk iklan manual

# ============================================
# GOOGLE OAUTH (via Supabase Auth)
# ============================================
# Dikonfigurasi langsung di Supabase dashboard
# Google Client ID & Secret diset di Supabase Auth providers
```

**Catatan:** `SUPABASE_SERVICE_ROLE_KEY` dan `XENDIT_SECRET_KEY` hanya boleh digunakan di Server Components, Route Handlers, dan Server Actions. Tidak boleh ada di `NEXT_PUBLIC_*`.

---

## 22. SECURITY REQUIREMENTS

### 22.1 Authentication & Authorization

| Layer | Implementasi |
|---|---|
| Authentication | Supabase Auth + Google OAuth (satu-satunya metode) |
| Session Isolation | Cookie di-scope ke subdomain masing-masing |
| Authorization | RLS Supabase — role: user, eo, admin |
| Admin 2FA | TOTP via Google Authenticator |
| Route Protection | Next.js Middleware (subdomain) + Server-side session check |

### 22.2 Xendit Webhook

- Verifikasi `x-callback-token` header setiap request
- Idempotency check via `xendit_invoice_id` — cegah double-processing
- Endpoint webhook hanya memproses method POST
- Semua webhook response harus return 200 (agar Xendit tidak retry terus)

### 22.3 File Upload

- Validasi MIME type di server (bukan ekstensi)
- Maksimal ukuran file di-enforce server-side
- Banner & foto event → Supabase Storage bucket `public` (akses publik read)
- Bukti transfer iklan → Supabase Storage bucket `private` (hanya admin yang bisa akses)
- Nama file di-replace dengan UUID saat upload (cegah path traversal)

### 22.4 Input & API Security

- Validasi semua input dengan Zod di server (Server Actions / Route Handlers)
- Sanitasi output HTML pada field rich text (deskripsi event)
- Tidak ada raw SQL — semua query via Supabase client SDK
- `SUPABASE_SERVICE_ROLE_KEY` hanya di server, tidak pernah di client
- Rate limiting pada endpoint `/api/checkout` dan auth endpoints

### 22.5 QR Code

- Konten hanya URL publik: `https://yogacalendar.id/events/[slug]`
- Tidak ada token, user ID, atau data sensitif di QR Code

### 22.6 Infrastructure

| Komponen | Implementasi |
|---|---|
| HTTPS | SSL otomatis Vercel + Cloudflare |
| DDoS / WAF | Cloudflare |
| DB Backup | Backup harian otomatis Supabase |
| Env Secrets | Vercel Environment Variables, tidak di Git |
| Dependencies | `npm audit` sebelum setiap deployment |

---

## 23. NON-FUNCTIONAL REQUIREMENTS

| Aspek | Target |
|---|---|
| Performance | Lighthouse ≥ 85 (mobile & desktop) |
| SEO | Meta tags + OG + JSON-LD + sitemap di semua halaman event |
| Responsiveness | Mobile-first, fully responsive (320px – 1920px) |
| Uptime | 99.9% via Vercel |
| Timezone | UTC di DB, WIB di frontend |
| Soft Delete | Events menggunakan soft delete |
| Skalabilitas | Serverless architecture, siap scale |
| Kapasitas Awal | 1.000–2.000 user/bulan, 5–10 event/minggu |
| Bahasa | Bahasa Indonesia only |
| Brand Colors | Putih, Pink, Hijau |
| Aksesibilitas | WCAG 2.1 AA pada elemen interaktif utama |
| Browser Support | Chrome, Safari, Firefox, Edge (2 versi terakhir) |

---

## 24. PROGRAM TIMELINE

| Stage | Hari | Output |
|---|---|---|
| Discovery & Setup | 1 – 2 | Repo setup, Supabase schema, konfigurasi subdomain Vercel + Cloudflare, env vars, finalisasi PRD |
| Frontend Web Publik | 3 – 8 | Homepage, events, detail event (galeri), checkout, payment pages, account, partnership, profil EO, 404 |
| Portal EO | 9 – 13 | Auth, register, dashboard, upload event (multi-image, multi-ticket), peserta, export CSV, pengajuan iklan, settings |
| Dashboard Admin | 14 – 17 | Auth + 2FA, approval EO & event, kurasi homepage, kelola iklan + harga, keuangan & disbursement |
| Integrasi & Backend | 18 – 21 | Xendit (invoice + webhook), Resend (email + PDF), QR Code generator, Supabase RLS, file upload, concurrency handling |
| Testing, Revisi & Launch | 22 – 23 | QA end-to-end, revisi final, deployment live, konfigurasi DNS final |

**Total: 23 Hari Kerja**

### Activity Plan

- Google Meet di awal: pembahasan teknis, akses tools (Xendit sandbox, Supabase, Resend)
- Progress report mingguan via WhatsApp
- Demo klien setelah frontend web publik selesai (Hari 8)
- QA testing end-to-end semua flow sebelum launch
- Deployment ke Vercel + konfigurasi subdomain
- Serah terima: source code via GitHub + dokumentasi teknis + `.env.example`
- Training: Admin dashboard + Portal EO untuk tim klien

---

## 25. ESTIMASI BIAYA INFRASTRUKTUR

Ditanggung klien setelah serah terima.

| Layanan | Biaya | Keterangan |
|---|---|---|
| Domain `yogacalendar.id` | Rp 150.000–300.000/tahun | Via Niagahoster |
| Vercel Hobby | Gratis | Cukup untuk traffic awal |
| Vercel Pro | $20/bulan | Jika traffic melebihi batas Hobby |
| Supabase Free | Gratis | Cukup untuk skala awal (500MB DB, 50K MAU) |
| Supabase Pro | $25/bulan | Jika data sudah besar |
| Cloudflare | Gratis | Wildcard DNS, DDoS, WAF |
| Resend Free | Gratis | Hingga 3.000 email/bulan |
| Xendit | ~1.5%–2.9% per transaksi | Tergantung metode pembayaran |

---

## 26. GARANSI & SUPPORT PASCA-LAUNCH

- Free bug fixing **60 hari** sejak tanggal launch untuk bug dari proses development
- Free migrasi & konfigurasi akun layanan (Xendit, Supabase, Resend, Vercel)
- Revisi tampilan maksimal **4x** selama periode garansi
- 1x konsultasi gratis untuk roadmap pengembangan fitur lanjutan
- Penambahan fitur di luar scope awal melalui paket terpisah

---

*Dokumen ini bersifat confidential dan hanya diperuntukkan bagi pihak-pihak yang terlibat dalam pengembangan Jakarta Yoga Calendar.*

**Adista Putra Suyatno**  
adistaputras.my.id | bondyladista@gmail.com
