# News Portal - Next.js Application

Proyek ini merupakan aplikasi portal berita berbasis Next.js yang mendukung autentikasi menggunakan akun Google melalui NextAuth.js.
Link Hosting Vercel : https://news-portal-smoky.vercel.app/ 

## 📦 Clone Repository

Langkah pertama adalah mengunduh project dari GitHub:

```bash
git clone https://github.com/Dzaki-G/news-portal.git
cd news-portal
```

Perintah di atas akan menyalin semua file project ke dalam folder lokal dengan nama `news-portal`.

## 📁 Install Dependencies

Setelah repository berhasil di-clone, instal semua dependensi yang dibutuhkan:

```bash
npm install
```

Perintah ini akan membaca file `package.json` dan menginstal semua library yang dibutuhkan oleh aplikasi seperti Next.js, Tailwind CSS, dan NextAuth.js.

## Konfigurasi Environment

Buat file baru bernama `.env.local` di root direktori dan isi dengan konfigurasi berikut:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_random_secret
NEXTAUTH_URL=http://localhost:3000
```

- **GOOGLE_CLIENT_ID** & **GOOGLE_CLIENT_SECRET**: Dapatkan dari [Google Developer Console](https://console.developers.google.com/) setelah membuat aplikasi OAuth2.
- **NEXTAUTH_SECRET**: Gunakan string acak (bisa dibuat menggunakan `openssl rand -base64 32`).
- **NEXTAUTH_URL**: Alamat URL aplikasi saat development.
  

## Menjalankan Server Development

Untuk menjalankan aplikasi dalam mode development:

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`.

## Mengakses Web Aplikasi

Buka browser dan akses halaman login:

```
http://localhost:3000
```

Pengguna dapat login menggunakan akun Google sesuai konfigurasi OAuth yang telah dibuat.

---

