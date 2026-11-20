# 📸 HMTI Fair 2026 — Official Photobooth Kiosk System

> **Sistem Photobooth Interaktif & Silent Print Bridge Resmi HMTI Fair 2026**  
> **Tema Acara**: *Kaca Jendela Patri & Infinity Crystals — "United Beyond Limits, Rise Beyond Infinity"*  
> **Lokasi Acara**: Pollux Mall Batam Center (28–29 November 2026)  
> **Penyelenggara**: Himpunan Mahasiswa Teknik Informatika (HMTI) — Politeknik Negeri Batam  

---

## 🌟 Gambaran Umum Sistem

Sistem ini dirancang khusus untuk operasional stan photobooth acara kampus dan mall berskala ribuan pengunjung. Memadukan pengalaman pengguna interaktif (*live camera sequence*, suara shutter mekanik sintetis, pemilihan frame kaca patri, dan studio stiker maskot Gobi) dengan sistem cetak fisik tanpa hambatan (*silent automated printing*) ke printer lab foto 4R.

### Keunggulan Utama:
- ⚡ **Tanpa Login / Registrasi**: Kiosk langsung siap digunakan antrean pengunjung tanpa penghalang formulir.
- 🎨 **100% Grafis Resmi HMTI Fair**: Menggunakan ornamen kaca patri asli (*stained glass*), bebatuan kristal elemen, serta maskot resmi "Gobi The Guardian".
- 📐 **Presisi Cetak 300 DPI 4R (1200 × 1800 px)**: Output kanvas terkunci pada rasio kertas foto fisik 4R dengan *safe bleed margin* 48 px agar logo dan teks tidak terpotong saat dicetak *borderless*.
- 🖨️ **Silent Hot-Folder Print Bridge**: File komposit otomatis disimpan ke folder antrean lokal `C:\Photobooth_PrintQueue` dan dicetak langsung oleh printer tanpa memunculkan dialog popup browser.
- 📲 **Distribusi Digital Instan (QR Code & Web Share)**: Pengunjung tinggal scan QR Code di layar booth untuk mengunduh soft-copy resolusi tinggi ke galeri smartphone.
- 🔄 **Toleransi Masalah Lapangan**: Dilengkapi tombol *Ulang Foto Satuan (Per-Shot Retake)* jika salah satu pose kurang pas, tombol *Reprint Terakhir* jika kertas macet, serta timer *auto-reset* 12 detik untuk antrean berikutnya.

---

## 🏛️ Arsitektur Sistem

```
┌────────────────────────────────┐     ┌─────────────────────────────┐
│      Frontend Kiosk (React)    │────▶│    Backend API (Laravel)    │
│  - Live Webcam Feed & Beeps    │     │  - POST /photos/print-queue │
│  - 4R Canvas Template Renderer │     │  - POST /photos/reprint-last│
│  - Sticker Studio & Presets    │     │  - Database Token Soft-Copy │
└────────────────────────────────┘     └──────────────┬──────────────┘
                                                      │
                                                      ▼ Menulis File 1200x1800
                                       ┌─────────────────────────────┐
                                       │   C:\Photobooth_PrintQueue  │
                                       └──────────────┬──────────────┘
                                                      │
                                                      ▼ Memantau File Baru
                                       ┌─────────────────────────────┐
                                       │  print_bridge.py (Python)   │
                                       │  - Windows Spooler API      │
                                       │  - Kirim ke Default Printer │
                                       └──────────────┬──────────────┘
                                                      │
                                                      ▼
                                       ┌─────────────────────────────┐
                                       │  Printer Fisik Foto 4R      │
                                       │  (Cetak Otomatis 1-2 Lembar)│
                                       └─────────────────────────────┘
```

---

## 📋 Prasyarat Sistem (*Prerequisites*)

Sebelum menjalankan sistem di laptop operator booth:
1. **Node.js**: Versi 18.0 atau lebih baru (Disarankan Node.js 20+)
2. **PHP**: Versi 8.2 atau lebih baru dengan ekstensi SQLite & GD/Imagick
3. **Composer**: Manajer paket PHP
4. **Python**: Versi 3.9+ dengan pustaka `watchdog` dan `pywin32`
5. **Printer Foto 4R**: Driver printer terpasang di Windows dan dijadikan **Default Printer** (misalnya: *Canon Selphy CP1300/1500*, *DNP DS-RX1HS*, *Epson L8050/L850*, dll).

---

## 🚀 Panduan Menjalankan Sistem (Hari-H)

Untuk menjalankan seluruh sistem di booth, buka **3 jendela terminal**:

### Terminal 1: Backend API (Laravel)
```bash
cd "d:\projects\Photobooth web\backend"
# Jika belum menginstall dependensi:
composer install
php artisan migrate
# Jalankan server lokal:
php artisan serve --port=8000
```
*Backend berjalan di `http://127.0.0.1:8000`*

### Terminal 2: Silent Print Bridge (Python Hot Folder Daemon)
```bash
cd "d:\projects\Photobooth web"
# Jika belum menginstall dependensi:
pip install watchdog pywin32
# Jalankan watcher antrean cetak:
python print_bridge.py
```
*Daemon akan otomatis membuat folder `C:\Photobooth_PrintQueue` dan memantau file gambar baru untuk langsung dikirim ke printer.*

### Terminal 3: Frontend Studio Kiosk (React + Vite)
```bash
cd "d:\projects\Photobooth web\frontend"
# Jika belum menginstall dependensi:
npm install
# Jalankan antarmuka:
npm run dev
```
*Buka browser Google Chrome di `http://localhost:5173`.*

> 💡 **Tips Operator**: Di browser, klik tombol **Mode Kiosk** di pojok kanan atas layar (atau tekan tombol `F11`) untuk mengunci tampilan layar penuh tanpa bilah address bar browser.

---

## 🖼️ 4 Pilihan Frame Template 4R

| No | Nama Frame | Format | Jumlah Pose | Karakteristik |
|---|---|---|---|---|
| 1 | **The Grand Patriarch** | 4R Single | 3 Pose | Format 4R klasik dengan kubah kaca patri ungu-emas megah, logo Polibatam, HMTI, dan Permikomnas. |
| 2 | **Crystal Arcana & Gobi** | 4R Single | 3 Pose | Edisi ceria bersama maskot Gorila Penyihir Gobi, batu kristal elemen, dan badge Shard mistis. |
| 3 | **Twin Strips (2x6 Cut)** | 4R Dual Strip | 3 Pose | Format 4R berisi 2 photostrip berdampingan lengkap dengan garis potong putus-putus untuk dibagi dua orang. |
| 4 | **Royal Quad (2x2 Grid)** | 4R Grid | 4 Pose | Format grid 2x2 klasik ala photobooth Korea (*Life4Cuts*) yang sangat digemari anak muda. |

---

## 🛠️ Panduan Pengembangan & Modifikasi

### Menambah atau Mengubah Template Frame
Template dikelola secara terpusat pada file:
`frontend/src/components/TemplateRenderer.tsx`

1. Daftarkan konfigurasi template pada objek `TEMPLATES`:
```typescript
export const TEMPLATES: Record<number, TemplateData> = {
  // Tambah ID baru:
  5: {
    id: 5,
    name: "Nama Frame Baru",
    category: "Special",
    photosRequired: 3,
    description: "Deskripsi singkat frame...",
    printFormat: '4R Single',
    badge: '🔥 New'
  }
};
```
2. Tambahkan blok perender JSX di dalam fungsi `TemplateRenderer` dengan dimensi `w-[600px] h-[900px]` (skala dari 1200×1800 px). Pastikan menggunakan `flex-1 min-h-0` pada slot foto agar tidak terjadi *overflow*.

### Struktur Aset Resmi (`frontend/public/hmti_assets/`)
```
hmti_assets/
├── 1. INFINITY STONE/        # Kristal elemen (Gemstone Amethyst, Emerald, dll)
├── 2. BACKGROUND/            # Latar belakang kaca patri beresolusi tinggi
├── 3. BUTTON & BOX/          # Frame judul, banner, dan button grafis
├── 4.  PATRI WINDOWS/        # Tekstur jendela katedral kaca patri
├── 5. LOGO HMTI, POLIBATAM/  # Logo resmi Polibatam, HMTI, Permikomnas
├── 6. HEADER & FOOTER/       # Aset header footer feed & story
├── 7. RANDOM STONE/          # Maskot Gobi The Guardian pose 2 & kristal
├── 8. ICON LOMBA/            # Ikon lomba resmi HMTI Fair
└── 9. HEADLINE/              # Tipografi resmi acara
```

---

## 🧰 Checklist Kesiapan Stan Acara (Operator)

- [ ] **Kertas & Tinta**: Pasang kertas foto 4R glossy dan pastikan ribbon tinta printer terpasang rapat.
- [ ] **Test Print**: Lakukan 1 kali foto uji coba sebelum stan dibuka untuk memastikan warna hasil cetak printer sudah sesuai dengan kalibrasi layar.
- [ ] **Pencahayaan Booth**: Pastikan lampu sorot (*ring light / softbox*) di stan mengarah ke wajah pengunjung agar hasil foto terang dan jernih.
- [ ] **Kamera**: Pilih sumber webcam resolusi tinggi (1080p) pada dropdown kamera di bilah atas layar booth.
- [ ] **Koneksi Lokal**: Walaupun internet mall terganggu, proses ambil foto, simpan lokal, dan cetak fisik tetap berjalan 100% normal tanpa koneksi internet.

---

## 👥 Tim Pengembang
Dikembangkan untuk menyemarakkan **HMTI Fair 2026** di Pollux Mall Batam Center.
*Hak Cipta © 2026 Himpunan Mahasiswa Teknik Informatika — Politeknik Negeri Batam.*
