# CLAUDE.md
## Jakarta Yoga Calendar — AI Coding Guide

Dokumen ini adalah panduan wajib bagi AI coding agent (Claude Code, Copilot, Cursor, dll) sebelum menyentuh satu baris kode pun di repository ini.

---

## 1. IDENTITAS PROYEK

- **Nama:** Jakarta Yoga Calendar
- **Deskripsi:** Platform ticketing yoga niche untuk wilayah Jabodetabek
- **Arsitektur:** Monorepo Next.js 16 dengan 3 subdomain (public, eo, admin)
- **Domain produksi:**
  - Web Publik: `yogacalendar.id`
  - Portal EO: `eo.yogacalendar.id`
  - Dashboard Admin: `admin.yogacalendar.id`
- **PRD Acuan:** `PRD_Jakarta_Yoga_Calendar_v3.md` — ini adalah sumber kebenaran tunggal

---

## 2. TECH STACK — JANGAN GANTI TANPA KONFIRMASI

| Layer | Library | Versi |
|---|---|---|
| Framework | Next.js (App Router) | 16 |
| Language | TypeScript | Latest |
| Styling | Tailwind CSS v4 + shadcn/ui | v4 |
| State | Zustand | Latest |
| Forms | React Hook Form + Zod | Latest |
| Data fetching | TanStack Query | Latest |
| Animation | Framer Motion | Latest |
| Database | Supabase (PostgreSQL) | Latest |
| Auth | Supabase Auth + Google OAuth | - |
| Payment | Xendit Invoice API | - |
| Email | Resend + React Email | - |
| QR Code | `qrcode` (npm) | Latest |
| PDF | `@react-pdf/renderer` | Latest |
| Hosting | Vercel | - |
| DNS | Cloudflare | - |

**Jangan install library baru tanpa konfirmasi developer.** Jika ada kebutuhan library baru, ajukan dulu di PR description.

---

## 3. STRUKTUR FOLDER

```
src/
├── app/
│   ├── (public)/          ← Web publik (yogacalendar.id)
│   │   ├── page.tsx       ← Homepage
│   │   ├── events/
│   │   ├── eo/[slug]/
│   │   ├── checkout/
│   │   ├── payment/
│   │   ├── account/
│   │   └── ...
│   ├── (eo)/              ← Portal EO (eo.yogacalendar.id)
│   │   ├── login/
│   │   ├── register/
│   │   ├── dashboard/
│   │   ├── events/
│   │   ├── ads/
│   │   └── settings/
│   ├── (admin)/           ← Dashboard Admin (admin.yogacalendar.id)
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── eo/
│   │   ├── events/
│   │   ├── ads/
│   │   ├── homepage/
│   │   └── finance/
│   └── api/
│       ├── checkout/      ← Buat Xendit Invoice
│       └── webhooks/
│           └── xendit/    ← Terima webhook Xendit
├── components/
│   ├── ui/                ← shadcn/ui components
│   ├── public/            ← Komponen khusus web publik
│   ├── eo/                ← Komponen khusus Portal EO
│   ├── admin/             ← Komponen khusus Admin
│   └── shared/            ← Komponen yang dipakai semua
├── lib/
│   ├── supabase/
│   │   ├── client.ts      ← Supabase browser client
│   │   ├── server.ts      ← Supabase server client (dengan service role)
│   │   └── types.ts       ← Generated database types
│   ├── xendit/
│   │   └── client.ts      ← Xendit API wrapper
│   ├── resend/
│   │   └── client.ts      ← Resend wrapper
│   ├── qrcode/
│   │   └── generator.ts   ← QR Code generator
│   ├── pdf/
│   │   └── ticket.tsx     ← PDF tiket template
│   ├── utils/
│   │   ├── slug.ts        ← Slug generator + uniqueness check
│   │   ├── format.ts      ← Format currency, date, dll
│   │   └── validation.ts  ← Zod schemas
│   └── constants.ts       ← Konstanta aplikasi
├── hooks/                 ← Custom React hooks
├── stores/                ← Zustand stores
├── emails/                ← React Email templates
├── types/                 ← TypeScript type definitions
└── middleware.ts          ← Subdomain routing
```

---

## 4. ATURAN CODING WAJIB

### 4.1 TypeScript
- **Selalu gunakan TypeScript.** Tidak ada file `.js` kecuali config.
- Definisikan types eksplisit — hindari `any`
- Gunakan generated types dari Supabase (`lib/supabase/types.ts`) untuk semua operasi DB

### 4.2 Komponen
- Gunakan **functional components** dengan hooks
- Gunakan **shadcn/ui** untuk semua komponen UI dasar (Button, Input, Dialog, dll)
- Gunakan **Framer Motion** untuk animasi dan transisi — tidak ada CSS animation manual kecuali Tailwind utility
- Pisahkan Server Components dan Client Components dengan jelas
  - Default: Server Component
  - Tambahkan `'use client'` hanya jika butuh interaktivitas, hooks, atau browser API

### 4.3 Data Fetching
- **Server Components:** fetch langsung dari Supabase server client
- **Client Components:** gunakan TanStack Query untuk semua data fetching + caching
- **Mutations:** gunakan Next.js Server Actions atau Route Handlers
- Tidak ada `fetch()` langsung ke Supabase dari client component — selalu via TanStack Query + Server Action/API Route

### 4.4 Forms
- Semua form menggunakan **React Hook Form + Zod**
- Validasi **wajib dilakukan di dua tempat:**
  1. Client-side: React Hook Form + Zod (UX)
  2. Server-side: Zod di Server Action / Route Handler (security)
- Tidak ada form yang hanya validasi client-side

### 4.5 Error Handling
- Semua Server Actions dan Route Handlers wajib menggunakan try-catch
- Return format error yang konsisten:
  ```typescript
  // Success
  { success: true, data: T }
  // Error
  { success: false, error: string }
  ```
- Tampilkan error kepada user dengan toast notification (shadcn/ui Toast)
- Log error di server dengan `console.error` — jangan log data sensitif

### 4.6 Styling
- **Tailwind CSS only** — tidak ada inline style kecuali untuk nilai dinamis yang tidak bisa di-handle Tailwind
- Brand colors: putih, pink, hijau — gunakan CSS variables yang sudah didefinisikan
- Mobile-first: selalu mulai dari mobile, gunakan breakpoint `md:` dan `lg:` untuk desktop
- Semua komponen harus responsive

### 4.7 Environment Variables
- `NEXT_PUBLIC_*` — boleh di client dan server
- Semua env lain (tanpa `NEXT_PUBLIC_`) — **hanya di server** (Server Components, Server Actions, Route Handlers)
- **JANGAN PERNAH** menggunakan `SUPABASE_SERVICE_ROLE_KEY` atau `XENDIT_SECRET_KEY` di client component
- Semua env vars terdaftar di `.env.example` — update jika menambah env baru

---

## 5. SUPABASE — ATURAN WAJIB

### 5.1 Client vs Server

```typescript
// Browser (Client Components, hooks)
import { createBrowserClient } from '@/lib/supabase/client'

// Server (Server Components, Server Actions, Route Handlers)
import { createServerClient } from '@/lib/supabase/server'
```

### 5.2 RLS — Jangan Bypass Sembarangan

- **Jangan gunakan `service_role`** kecuali untuk operasi yang benar-benar butuh bypass RLS:
  - Generate QR Code setelah event approved
  - Proses webhook Xendit (update status order)
  - Generate PDF tiket
  - Export CSV peserta oleh EO (via Server Action)
- Semua operasi user biasa harus menggunakan `anon_key` dengan RLS aktif

### 5.3 Soft Delete

Semua query yang melibatkan tabel `events` **WAJIB** menambahkan filter:

```typescript
.filter('deleted_at', 'is', null)
```

Kecuali di Dashboard Admin yang membutuhkan visibilitas event yang dihapus.

### 5.4 Timezone

- Data waktu dari DB (UTC) harus dikonversi ke WIB saat ditampilkan:
  ```typescript
  import { format } from 'date-fns-tz'
  format(new Date(timestamp), 'dd MMM yyyy, HH:mm', { timeZone: 'Asia/Jakarta' })
  ```

### 5.5 Realtime

Gunakan Supabase Realtime hanya untuk sisa kuota tiket di halaman detail event. Tidak perlu Realtime di halaman lain untuk MVP ini.

---

## 6. XENDIT — ATURAN WAJIB

### 6.1 Webhook Security

File: `src/app/api/webhooks/xendit/route.ts`

```typescript
// WAJIB: Verifikasi token sebelum proses apapun
const callbackToken = request.headers.get('x-callback-token')
if (callbackToken !== process.env.XENDIT_WEBHOOK_TOKEN) {
  return Response.json({ error: 'Unauthorized' }, { status: 401 })
}

// WAJIB: Idempotency check
const existing = await checkIfAlreadyProcessed(invoiceId)
if (existing) return Response.json({ message: 'Already processed' })
```

### 6.2 Kuota — Gunakan RPC

Saat membuat order, gunakan Supabase RPC function bukan update langsung:

```typescript
const { data: reserved } = await supabase
  .rpc('reserve_ticket_quota', {
    p_ticket_type_id: ticketTypeId,
    p_quantity: quantity
  })

if (!reserved) {
  throw new Error('TICKET_SOLD_OUT')
}
```

### 6.3 Status Order

Status hanya boleh berubah mengikuti flow berikut:
```
pending_payment → paid       (dari webhook PAID)
pending_payment → expired    (dari webhook EXPIRED)
paid → cancelled             (hanya admin, manual)
```
Tidak boleh ada perubahan status dari client-side.

---

## 7. FILE UPLOAD — ATURAN WAJIB

```typescript
// Validasi MIME type di server — JANGAN percaya ekstensi file
const validImageTypes = ['image/jpeg', 'image/png', 'image/webp']
const validDocTypes = ['image/jpeg', 'image/png', 'application/pdf']

// Maksimal ukuran file (enforce di server)
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

// Nama file selalu di-replace dengan UUID
const filename = `${randomUUID()}.${ext}`
```

**Storage buckets:**
- `event-images` — public read, authenticated write
- `eo-logos` — public read, authenticated write
- `payment-proofs` — private (hanya admin yang bisa read)

---

## 8. SEO — CHECKLIST PER HALAMAN

Setiap halaman di web publik wajib punya:

```typescript
// app/(public)/events/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const event = await getEvent(params.slug)
  return {
    title: `${event.title} | Jakarta Yoga Calendar`,
    description: event.description.substring(0, 160),
    openGraph: {
      title: event.title,
      description: event.description.substring(0, 160),
      images: [{ url: event.images[0]?.url, width: 1200, height: 630 }],
      url: `https://yogacalendar.id/events/${params.slug}`,
    },
  }
}
```

Halaman detail event wajib punya JSON-LD structured data (lihat PRD Section 20).

---

## 9. KEAMANAN — RED FLAGS

Jika menemukan salah satu di bawah ini dalam kode, **langsung perbaiki:**

- `SUPABASE_SERVICE_ROLE_KEY` di client component atau `NEXT_PUBLIC_*`
- `XENDIT_SECRET_KEY` di client component
- Tidak ada validasi Zod di server untuk form submission
- Tidak ada idempotency check di webhook handler
- Upload file tanpa validasi MIME type server-side
- Query Supabase tanpa filter `deleted_at IS NULL` di tabel events
- Soft delete yang di-replace dengan hard delete
- Status order yang diupdate dari client-side

---

## 10. COMMIT & BRANCH CONVENTION

```
main          ← Production (auto-deploy ke Vercel)
develop       ← Staging / integration branch
feature/*     ← Fitur baru (dari develop)
fix/*         ← Bug fix (dari develop)
hotfix/*      ← Critical fix (dari main, merge ke main + develop)
```

**Commit message format:**
```
feat: add xendit webhook handler
fix: correct quota rollback on expired order
chore: update dependencies
docs: update CLAUDE.md
```

---

## 11. TESTING CHECKLIST SEBELUM COMMIT

Sebelum commit kode yang menyentuh flow kritis, pastikan sudah ditest:

- [ ] Flow beli tiket end-to-end (checkout → Xendit → webhook → success page)
- [ ] Race condition: dua user checkout tiket terakhir bersamaan
- [ ] Order expired: kuota dikembalikan dengan benar
- [ ] Upload event: foto multiple, validasi MIME, maksimal ukuran
- [ ] Approval flow: EO register → admin approve → EO bisa upload event
- [ ] Subdomain isolation: user tidak bisa akses `/eo` atau `/admin`
- [ ] QR Code: berisi URL yang benar, bisa di-scan dan menuju event yang tepat
- [ ] Email konfirmasi: terkirim dengan PDF attachment yang benar
- [ ] Soft delete: event yang dihapus tidak tampil di web publik

---

*Baca dokumen ini setiap kali memulai sesi coding baru di repository ini.*
