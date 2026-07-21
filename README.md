# Surat Jalan MBG

Aplikasi web untuk membuat dan mencetak **Surat Jalan Program Makan Bergizi Gratis**,
mengikuti format resmi dari SPPG. Dibuat dengan React + Vite, semua data disimpan
langsung di browser (localStorage) — tidak pakai Supabase atau database pihak ketiga,
jadi bisa langsung dideploy sebagai situs statis di GitHub Pages.

## Fitur

- **Data Sekolah**: simpan daftar sekolah beserta daftar kelas dan porsi default-nya
  (jadi template, tidak perlu ketik ulang tiap hari).
- **Buat Surat Jalan**: pilih sekolah, tanggal otomatis menampilkan nama hari, daftar
  kelas & porsi otomatis terisi dari template sekolah dan tinggal disesuaikan.
- **Daftar Surat Jalan**: lihat semua surat jalan yang pernah dibuat, filter per
  tanggal, **centang beberapa sekaligus untuk dicetak bersamaan** (satu surat jalan
  = satu halaman cetak, otomatis berganti halaman).
- **Pengaturan**: ubah nama SPPG, alamat, nama Ahli Gizi & Koordinator Lapangan yang
  muncul di setiap surat jalan. Ada juga tombol unduh/pulihkan cadangan data (.json)
  karena data hanya tersimpan di browser perangkat ini.

## Menjalankan di komputer sendiri

```bash
npm install
npm run dev
```

Buka alamat yang muncul di terminal (biasanya `http://localhost:5173`).

## Deploy ke GitHub Pages

1. Buat repository baru di GitHub, misalnya bernama `surat-jalan-mbg`.
2. Ganti isi `base` di `vite.config.js` sesuai nama repository:
   ```js
   base: '/surat-jalan-mbg/',
   ```
3. Push semua file ke branch `main`:
   ```bash
   git init
   git add .
   git commit -m "Setup awal Surat Jalan MBG"
   git branch -M main
   git remote add origin https://github.com/USERNAME/surat-jalan-mbg.git
   git push -u origin main
   ```
4. Di GitHub, buka **Settings → Pages**, pada bagian **Build and deployment**
   pilih source **GitHub Actions**. Workflow di `.github/workflows/deploy.yml`
   akan otomatis build & deploy setiap kali ada push ke `main`.
5. Setelah selesai, situs akan tersedia di:
   `https://USERNAME.github.io/surat-jalan-mbg/`

## Catatan penting soal penyimpanan data

Data (sekolah, surat jalan, pengaturan) disimpan di **localStorage browser**, per
perangkat/browser yang dipakai. Ini artinya:

- Data **tidak otomatis tersinkron** antar perangkat/browser berbeda (misalnya HP dan
  laptop dianggap "database" terpisah).
- Kalau cache/data browser dibersihkan, data ikut hilang.
- Karena itu, gunakan fitur **Unduh Cadangan** di tab Pengaturan secara berkala
  (misalnya tiap minggu), supaya ada file `.json` yang bisa dipulihkan kapan saja
  lewat tombol **Pulihkan dari File**.

Kalau nanti jumlah sekolah dan penggunanya sudah banyak dan butuh data yang
tersinkron otomatis di banyak perangkat, langkah selanjutnya adalah mengganti isi
`src/db.js` dengan pemanggilan API/database sungguhan — bagian lain aplikasi tidak
perlu diubah karena semua akses data sudah lewat file itu.

## Struktur data contoh

Aplikasi ini sudah diisi contoh data **SMA NEGERI 1 TEMPEL** berdasarkan dokumen
aslinya (14 kelas + GTK + SAMPEL), supaya langsung terlihat cara pakainya. Hapus
atau ubah sesuai kebutuhan lewat tab **Data Sekolah**.

## Logo

Logo Badan Gizi Nasional yang dipakai (`public/logo-seal-bw.png`) sudah diproses
ke hitam-putih (grayscale) dari logo asli, khusus untuk kebutuhan cetak dokumen.
