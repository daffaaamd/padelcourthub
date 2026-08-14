# 🎾 PadelCourt — Platform Penyewaan Lapangan Padel Digital

PadelCourt adalah platform digital profesional untuk mencari, melihat ketersediaan jadwal, dan melakukan booking lapangan padel secara online di berbagai kota di Indonesia.

---

## 🚀 Fitur Utama

### 👤 Customer Facing
1. **Homepage Interaktif**:
   - Hero search panel (filter kota, tanggal, jam mulai, durasi).
   - Live metrics (Total Lapangan, Total Venue, Total Booking, Rating).
   - Venue Populer dengan badge tipe lapangan (Indoor/Outdoor), rating bintang, fasilitas, dan harga mulai.
   - Mengapa PadelCourt & 4 Langkah Booking.
2. **Katalog & Detail Venue**:
   - Filter kota, pencarian nama/fasilitas.
   - Galeri foto autentik padel (lapangan Mondo turf biru, dinding kaca 12mm, net, dan raket berlubang).
   - Daftar court di venue beserta spesifikasi dan jadwal.
   - Ulasan & rating pengguna dengan ringkasan distribusi bintang.
3. **Pencarian Lapangan (Courts)**:
   - Filter cepat berdasarkan tipe (Indoor/Outdoor), kota, rentang harga, dan status.
4. **Sistem Booking & Slot Realtime**:
   - Kalender tanggal dengan availability matrix per jam.
   - Perhitungan harga dinamis (Weekday Morning, Weekday Evening, Weekend).
   - Validasi kode voucher promo diskon persentase / nominal dengan minimum transaksi.
   - Proteksi double booking (database locking & transaction).
5. **Checkout & Pembayaran**:
   - Integrasi simulator pembayaran (BCA Virtual Account, Mandiri, BRI, QRIS Gopay/OVO/ShopeePay, Kartu Kredit).
   - Timer countdown pembayaran (15 menit).
6. **E-Ticket & Manajemen Booking**:
   - Detail booking dengan QR Code check-in untuk resepsionis.
   - Cetak e-ticket PDF / printer-friendly.
   - Modal pembatalan booking sesuai kebijakan.
   - Form kirim ulasan & rating bintang setelah selesai bermain.
7. **User Dashboard & History**:
   - Tab riwayat pemesanan (Menunggu Pembayaran, Aktif, Selesai, Dibatalkan).
   - Ringkasan total main, jam bermain, dan voucher tersimpan.
8. **Katalog Promo**:
   - Daftar voucher promo aktif dengan copy-to-clipboard kode voucher.

---

### 🛡️ Admin Panel
1. **Executive Dashboard**:
   - Metrik total pendapatan, total booking, total customer, dan venue aktif.
   - Grafik riwayat pendapatan 7 hari terakhir.
   - Top ranking venue berdasarkan omzet.
   - Tabel booking terkini dengan aksi cepat.
2. **Manajemen Venue (CRUD)**:
   - Tambah/edit informasi venue, koordinat GPS, jam buka/tutup, checklist fasilitas, dan foto cover.
3. **Manajemen Lapangan (Courts)**:
   - Tambah court per venue (Indoor/Outdoor), toggle status (Available / Maintenance).
   - Konfigurasi aturan harga (Weekday pagi/malam, Weekend).
4. **Manajemen Booking**:
   - Filter status booking (Pending, Confirmed, Completed, Cancelled).
   - Update status manual (Konfirmasi, Selesai, Batalkan).
5. **Manajemen Promo / Voucher**:
   - Buat kode voucher baru, tentukan tipe potongan (fixed/percentage), kuota, periode berlaku, dan min transaksi.
6. **Manajemen Customer**:
   - Pantau daftar customer, total pemesanan, dan total pengeluaran belanja.

---

## 🛠️ Tech Stack

- **Backend**: Laravel 12 (PHP 8.2+), Eloquent ORM, SQLite / MySQL.
- **Frontend**: React 18, Inertia.js, TypeScript, Tailwind CSS, Lucide React Icons.
- **Build Tool**: Vite.
- **Assets**: 100% Autentik High-Resolution Padel Imagery (Blue Mondo turf, 12mm glass walls, metal mesh, padel rackets with perforated holes).

---

## 🔑 Akun Demo (1-Click Login di Halaman Login)

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@padelcourt.id` | `password` |
| **Customer** | `daffa@padelcourt.id` | `password` |

---

## ⚡ Cara Menjalankan

1. **Jalankan Database & Server PHP**:
   ```bash
   php artisan serve
   ```
   Aplikasi akan berjalan di `http://127.0.0.1:8000`.

2. **Build Asset Frontend (Jika ada perubahan UI)**:
   ```bash
   npm run build
   ```
   Atau untuk mode development dengan hot-reload:
   ```bash
   npm run dev
   ```

3. **Jalankan Test Suite**:
   ```bash
   php artisan test
   ```
