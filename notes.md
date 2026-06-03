Berikut adalah versi yang lebih profesional, deskriptif, dan bisa langsung Anda kirim ke klien atau jadikan dokumen requirement awal proyek.

---

# PLATFORM EVENT YOGA

## Gambaran Umum

Website ini merupakan sebuah platform manajemen event yoga yang dirancang untuk mempertemukan peserta dengan penyelenggara acara (Event Organizer/EO) dalam satu sistem yang sederhana, modern, dan mudah digunakan.

Tujuan utama platform ini adalah memudahkan peserta dalam menemukan dan mendaftar event yoga, sekaligus memberikan kemudahan bagi EO untuk mempublikasikan dan mengelola acara mereka secara mandiri.

Platform akan memiliki tiga jenis pengguna utama, yaitu Peserta (User), Event Organizer (EO), dan Admin. Masing-masing memiliki hak akses dan fungsi yang berbeda sesuai kebutuhan.

---

# ALUR BISNIS WEBSITE

Secara umum alur website akan berjalan sebagai berikut:

1. EO membuat dan mempublikasikan event yoga.
2. Event yang telah dibuat akan tampil pada halaman website.
3. Peserta dapat mencari dan melihat event yang tersedia.
4. Peserta melakukan registrasi dan login akun.
5. Peserta mendaftar ke event yang dipilih.
6. Sistem menampilkan informasi pembayaran.
7. Peserta melakukan transfer pembayaran.
8. Peserta mengunggah bukti pembayaran.
9. Admin melakukan verifikasi pembayaran.
10. Setelah pembayaran terverifikasi, sistem mengirimkan email konfirmasi secara otomatis kepada peserta.
11. Peserta resmi terdaftar pada event tersebut.

---

# ROLE DAN HAK AKSES

## 1. USER (PESERTA)

User adalah orang yang ingin mengikuti event yoga yang tersedia pada platform.

### Fungsi User

User dapat:

* Login menggunakan akun Google.
* Melihat seluruh event yang tersedia.
* Mencari event berdasarkan lokasi.
* Mencari event berdasarkan tanggal.
* Melihat detail lengkap sebuah event.
* Melakukan pendaftaran event.
* Mengunggah bukti pembayaran.
* Melihat status pendaftaran.
* Melihat riwayat event yang pernah diikuti.
* Menerima email konfirmasi setelah pembayaran berhasil diverifikasi.

---

## User Flow

### Registrasi dan Login

Pengguna membuka website.

↓

Klik tombol Login.

↓

Login menggunakan akun Google.

↓

Akun otomatis dibuat pada sistem.

↓

Masuk ke Dashboard User.

---

### Pendaftaran Event

User memilih event yang diminati.

↓

Membuka halaman detail event.

↓

Melihat informasi acara.

↓

Klik tombol Daftar.

↓

Mengisi data yang diperlukan.

↓

Sistem menyimpan pendaftaran.

↓

Sistem menampilkan informasi rekening pembayaran.

↓

User melakukan transfer.

↓

User mengunggah bukti transfer.

↓

Status berubah menjadi "Menunggu Verifikasi".

↓

Admin melakukan pengecekan.

↓

Jika disetujui, status berubah menjadi "Terverifikasi".

↓

Sistem mengirim email konfirmasi.

↓

User resmi terdaftar pada event.

---

# 2. EVENT ORGANIZER (EO)

EO adalah pihak penyelenggara acara yang bertanggung jawab membuat dan mengelola event yoga.

Setiap EO hanya dapat mengelola event miliknya sendiri.

---

## Fungsi EO

EO dapat:

* Login ke dashboard EO.
* Membuat event baru.
* Mengedit event yang dibuat.
* Menghapus event miliknya.
* Mengatur kuota peserta.
* Mengatur harga event.
* Mengatur lokasi dan jadwal acara.
* Melihat daftar peserta.
* Melihat status pembayaran peserta.
* Memantau jumlah peserta yang telah mendaftar.

---

## EO Flow

EO Login.

↓

Masuk ke Dashboard EO.

↓

Klik Buat Event.

↓

Mengisi informasi acara:

* Nama Event
* Deskripsi
* Lokasi
* Tanggal
* Jam
* Harga
* Kuota Peserta
* Banner Event

↓

Event dipublikasikan.

↓

Event tampil pada website.

↓

Peserta mulai melakukan pendaftaran.

↓

EO dapat melihat perkembangan jumlah peserta melalui dashboard.

---

# 3. ADMIN

Admin merupakan pengelola utama sistem.

Admin memiliki akses penuh terhadap seluruh data yang ada pada platform.

---

## Fungsi Admin

Admin dapat:

* Mengelola seluruh akun pengguna.
* Mengelola seluruh akun EO.
* Mengelola seluruh event.
* Menghapus event.
* Mengedit event.
* Menentukan event unggulan yang tampil pada homepage.
* Memverifikasi pembayaran peserta.
* Mengelola status pendaftaran peserta.
* Melihat statistik sistem.

---

## Admin Flow

Admin Login.

↓

Masuk ke Dashboard Admin.

↓

Melihat daftar event.

↓

Melihat pendaftaran baru.

↓

Melakukan verifikasi bukti pembayaran.

↓

Mengubah status menjadi:

* Pending
* Verified
* Rejected

↓

Jika status Verified.

↓

Sistem otomatis mengirim email konfirmasi kepada peserta.

↓

Peserta resmi masuk ke daftar peserta event.

---

# STRUKTUR WEBSITE

## Homepage

Homepage menjadi halaman utama yang menampilkan informasi penting.

Berisi:

### Hero Banner

Banner promosi utama.

### Featured Event

Event pilihan yang ditentukan oleh Admin.

### Upcoming Event

Event yang akan segera berlangsung.

### Search & Filter

Filter berdasarkan:

* Lokasi
* Tanggal

### Informasi Platform

Penjelasan singkat mengenai platform dan komunitas yoga.

---

## Halaman Daftar Event

Menampilkan seluruh event yang tersedia.

Setiap event menampilkan:

* Banner Event
* Nama Event
* Tanggal
* Lokasi
* Harga
* Kuota Tersisa

---

## Halaman Detail Event

Menampilkan informasi lengkap event.

Meliputi:

* Foto/Banner Event
* Deskripsi Event
* Lokasi Acara
* Jadwal Acara
* Nama EO
* Harga
* Kuota Peserta
* Tombol Daftar

---

## Dashboard User

Menampilkan:

* Profil User
* Riwayat Event
* Status Pembayaran
* Event Yang Diikuti

---

## Dashboard EO

Menampilkan:

* Event Aktif
* Jumlah Peserta
* Event Selesai
* Daftar Peserta
* Kelola Event

---

## Dashboard Admin

Menampilkan:

* Total User
* Total EO
* Total Event
* Total Pendaftaran
* Verifikasi Pembayaran
* Pengelolaan Event
* Pengelolaan User

---

# SISTEM PEMBAYARAN

Pada tahap awal, pembayaran dilakukan secara manual melalui transfer bank.

Alur pembayaran:

Peserta mendaftar event.

↓

Sistem menampilkan rekening tujuan.

↓

Peserta melakukan transfer.

↓

Peserta mengunggah bukti transfer.

↓

Admin melakukan verifikasi.

↓

Sistem mengirim email konfirmasi otomatis.

↓

Peserta dinyatakan terdaftar.

Metode ini dipilih karena lebih sederhana, tidak memerlukan integrasi payment gateway, dan mudah digunakan pada tahap awal pengembangan platform.

---

# SISTEM EMAIL OTOMATIS

Email otomatis dikirim ketika:

* Pembayaran berhasil diverifikasi.
* Pendaftaran event berhasil.
* Informasi penting terkait event (opsional di masa depan).

Tujuan email ini adalah memberikan kepastian kepada peserta bahwa proses pendaftaran telah berhasil.

---

# KESIMPULAN

Platform ini merupakan sistem manajemen event yoga berbasis web yang menghubungkan peserta dan penyelenggara acara dalam satu ekosistem digital. Dengan tiga role utama (User, EO, dan Admin), platform memungkinkan pengelolaan event secara mandiri oleh EO, pendaftaran peserta secara online, proses verifikasi pembayaran yang terpusat, serta komunikasi otomatis melalui email.

Versi awal difokuskan pada kemudahan penggunaan, tampilan yang sederhana dan profesional, serta proses pendaftaran yang efisien. Struktur sistem juga dirancang agar mudah dikembangkan di masa mendatang, seperti penambahan payment gateway otomatis, QR Ticket, check-in peserta, promo, membership, dan fitur komunitas yoga yang lebih lengkap.
