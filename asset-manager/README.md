# AssetIT — Sistem Manajemen Aset IT

Web app manajemen aset IT untuk tim kecil (15 user, 4 perangkat per orang). Berjalan 100% di browser — tidak perlu server, tidak perlu database.

## Fitur

- **Dashboard** — ringkasan real-time: status aset, biaya, aktivitas terbaru
- **Data per User** — satu tabel lengkap semua aset + spesifikasi terkini per karyawan
- **Master Aset** — CRUD semua perangkat (CPU, LCD, Printer, UPS) + tombol **Tukar** langsung dari tabel
- **Spesifikasi PC** — spek hardware otomatis update saat ada log pergantian komponen (RAM, SSD, HDD, VGA, dll) — sel berwarna hijau = sudah pernah diganti
- **Log Pertukaran Aset** — riwayat perpindahan aset antar user, otomatis swap kepemilikan di Master Aset
- **Log Komponen** — riwayat upgrade/penggantian sparepart, **langsung memperbarui Spesifikasi PC**
- **Log Servis** — riwayat servis & perbaikan, otomatis ubah status aset jadi "Servis" / "Aktif"
- **Export JSON** — backup semua data

## Cara Pakai

1. Buka `index.html` di browser (Chrome/Edge/Firefox)
2. Data disimpan di `localStorage` browser secara otomatis
3. Klik **↓ Export JSON** untuk backup data kapan saja

## Deploy ke GitHub Pages

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/USERNAME/asset-manager.git
git push -u origin main
```

Lalu aktifkan **GitHub Pages** di Settings → Pages → Source: `main` / `root`.

## Alur Kerja

| Aktivitas | Yang Diisi | Efek Otomatis |
|---|---|---|
| Aset berpindah user | Log Pertukaran → isi form + klik Tukar | Kepemilikan di Master Aset ikut berubah |
| Ganti RAM/SSD/dll | Log Komponen → isi form | Spesifikasi PC halaman user terupdate |
| Aset masuk servis | Log Servis → status "Proses Servis" | Status aset di Master → "Servis" |
| Servis selesai | Log Servis → status "Selesai" | Status aset → "Aktif" |

## Struktur File

```
index.html   — layout utama + sidebar
style.css    — dark industrial theme
data.js      — seed data + localStorage engine
app.js       — semua logika: render, filter, modal, CRUD
```

## Tech Stack

- Vanilla HTML/CSS/JS (zero dependencies)
- Google Fonts: Syne + DM Mono + DM Sans
- localStorage untuk persistensi data
