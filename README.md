# AssetPro — Sistem Manajemen Aset

Aplikasi manajemen aset berbasis web (single-page), dibangun dengan HTML/CSS/JS murni dan **Supabase** sebagai backend database PostgreSQL.

## 🚀 Demo Live
> Deploy ke GitHub Pages — lihat bagian **Deployment** di bawah.

---

## 🛠️ Tech Stack
| Layer | Teknologi |
|-------|-----------|
| Frontend | HTML, CSS, Vanilla JS |
| Database | [Supabase](https://supabase.com) (PostgreSQL) |
| Hosting | GitHub Pages |
| Library | Tabler Icons, QRCode.js, jsQR, SheetJS, jsPDF |

---

## ⚡ Setup (10 menit)

### 1. Buat Project Supabase
1. Daftar/login di [supabase.com](https://supabase.com)
2. Klik **New Project** → isi nama dan password database
3. Tunggu project selesai di-provision (~1 menit)

### 2. Jalankan Schema Database
1. Di Supabase dashboard → **SQL Editor**
2. Copy-paste seluruh isi file `sql/schema.sql`
3. Klik **Run** — tabel, enum, trigger, dan data seed akan dibuat otomatis

### 3. Ambil Credentials
Di Supabase dashboard → **Project Settings → API**:
- **Project URL** → copy nilai `https://xxxx.supabase.co`
- **anon public key** → copy nilai `eyJ...`

### 4. Konfigurasi Aplikasi
Buka file `js/supabase-db.js`, ganti dua baris ini:

```js
const SUPABASE_CONFIG = {
  url: 'https://YOUR_PROJECT_ID.supabase.co',  // ← ganti ini (tanpa /rest/v1/)
  anonKey: 'YOUR_ANON_PUBLIC_KEY',             // ← ganti ini (JANGAN commit ke repo)
};
```

Keamanan kunci:

- Jangan commit `anonKey` ke repository publik. Kunci ini boleh digunakan di frontend untuk demo, tetapi lebih aman menyimpan dan memutar kunci jika aplikasinu production.
- Untuk development lokal, pertimbangkan membuat `js/config.local.js` (tidak di-commit) dan menaruh:

```js
// contoh js/config.local.js (JANGAN commit)
const SUPABASE_CONFIG = {
  url: 'https://YOUR_PROJECT_ID.supabase.co',
  anonKey: 'eyJ...'
};
```

Lalu tambahkan tag script untuk file ini sebelum `js/supabase-db.js` di `index.html` saat development:

```html
<script src="js/config.local.js"></script>
<script src="js/supabase-db.js"></script>
```

Atau simpan kredensial pada backend dan panggil API server-side daripada langsung dari frontend untuk keamanan lebih baik.

### 5. Push ke GitHub & Aktifkan GitHub Pages
```bash
git init
git add .
git commit -m "Initial commit — AssetPro"
git branch -M main
git remote add origin https://github.com/USERNAME/assetpro.git
git push -u origin main
```

Lalu di GitHub repo → **Settings → Pages → Source: Deploy from branch → main → / (root)** → Save.

URL aplikasi: `https://USERNAME.github.io/assetpro/`

---

## 🔑 Akun Demo (dari seed data)
| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Manager | `manager` | `mgr123` |
| Teknisi | `teknisi` | `tek123` |

---

## 📁 Struktur Repo
```
assetpro/
├── index.html          # Aplikasi utama (single file)
├── js/
│   └── supabase-db.js  # Supabase DB layer (ganti credentials di sini)
├── sql/
│   └── schema.sql      # Schema lengkap + seed data
└── README.md
```

## 🔒 Catatan Keamanan
- File ini menggunakan **anon key** Supabase yang aman untuk diexpose di frontend
- Untuk produksi, aktifkan **Row Level Security (RLS)** di Supabase — lihat komentar di `schema.sql`
- Password user saat ini disimpan plaintext untuk demo — di produksi gunakan Supabase Auth

## 📦 Fitur
- ✅ Manajemen Aset (CRUD + QR Code)
- ✅ Work Order (buat, update status, assign teknisi)
- ✅ Stok & Komponen
- ✅ Transfer Aset
- ✅ Purchase Order
- ✅ Preventive Maintenance & Kalender
- ✅ Export Excel & PDF
- ✅ Multi-role (Admin / Manager / Teknisi)
- ✅ Audit Log
- ✅ Offline-aware (toast notifikasi)
