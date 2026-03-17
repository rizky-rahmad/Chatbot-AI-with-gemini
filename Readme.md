Tentu, berikut adalah versi `README.md` dalam bahasa Indonesia yang telah dikumpulkan dalam satu blok Markdown agar mudah Anda salin dan gunakan di repositori proyek Anda:

````markdown
# Gemini AI Chatbot

Aplikasi Chatbot AI yang modern dan siap produksi (*production-ready*), dibangun menggunakan **Node.js**, **Express**, dan **Google Gemini API** (`@google/genai`). Antarmuka pengguna (UI) dirancang menggunakan **Tailwind CSS** untuk memberikan tampilan yang bersih, responsif, dan profesional.

## 🌟 Fitur Utama

- **Chat Multi-turn:** Percakapan bolak-balik yang memahami konteks dari pesan sebelumnya.
- **UI Modern:** Dibangun dengan Tailwind CSS, menampilkan perataan pesan menggunakan Flexbox, gelembung *chat* yang elegan, dan animasi *scroll* yang mulus.
- **Kemampuan Multimodal:**
  - Menghasilkan teks berdasarkan perintah (prompt) standar.
  - Menganalisis dan menghasilkan konten dari unggahan **Gambar**.
  - Merangkum dan menganalisis unggahan **Dokumen** (seperti PDF).
- **Keamanan *Production-Ready*:**
  - **Rate Limiting:** Mencegah *spamming* pada API dan serangan DDoS ringan.
  - **Batasan Ukuran File:** Melindungi server dari kehabisan memori (OOM / *Out-Of-Memory*) dengan membatasi ukuran unggahan maksimal 5MB menggunakan `multer`.
  - **Validasi *Fail-fast*:** Server akan menolak untuk berjalan jika API Key tidak ditemukan.
  - **Penanganan Error yang Aman:** Menyembunyikan detail *stack trace* server internal dari sisi pengguna / *client*.

## 🚀 Prasyarat

Sebelum memulai, pastikan Anda telah menginstal hal-hal berikut di sistem Anda:
- [Node.js](https://nodejs.org/) (Sangat disarankan menggunakan versi 18 atau lebih baru)
- [Google Gemini API Key](https://aistudio.google.com/app/apikey)

## 🛠️ Cara Instalasi

1. **Clone repositori ini** (atau ekstrak folder proyek Anda):
   ```bash
   git clone <url-repo-anda>
   cd chatbot-ai
````

2.  **Instal semua dependensi:**

    ```bash
    npm install
    ```

3.  **Atur Variabel Lingkungan (Environment Variables):**
    Buat sebuah file bernama `.env` di folder utama (root) proyek dan tambahkan API Key Google Gemini Anda:

    ```env
    GOOGLE_API_KEY=masukkan_api_key_anda_di_sini
    PORT=3000
    ```

## 💻 Menjalankan Aplikasi

Jalankan server menggunakan Node:

```bash
node index.js
```

Setelah server berhasil berjalan, buka browser Anda dan akses alamat berikut:
**[http://localhost:3000](https://www.google.com/search?q=http://localhost:3000)**

## 📂 Struktur Proyek

```text
chatbot-ai/
│
├── public/                 # Folder statis untuk frontend
│   └── index.html          # Antarmuka Chat (HTML/Tailwind/JS)
│
├── .env                    # Variabel lingkungan (API Key, Port)
├── index.js                # Server utama Express dan endpoint API
├── package.json            # Metadata proyek dan daftar dependensi
└── README.md               # Dokumentasi proyek
```

## 📡 Endpoint API

  - `POST /api/chat`: Menerima array `conversation` (riwayat obrolan) dan mengembalikan respons AI.
  - `POST /generate-text`: Menerima string `prompt` dan mengembalikan teks yang dihasilkan AI.
  - `POST /generate-from-image`: Menerima form multipart yang berisi file `image` dan sebuah `prompt`.
  - `POST /generate-from-doc`: Menerima form multipart yang berisi file `document` dan opsi `prompt` tambahan.

## 🛡️ Dependensi yang Digunakan

  - `express`: Framework web untuk Node.js.
  - `@google/genai`: SDK resmi Google Gemini.
  - `multer`: Middleware untuk menangani unggahan file (multipart/form-data).
  - `cors`: Mengaktifkan *Cross-Origin Resource Sharing*.
  - `dotenv`: Modul untuk memuat variabel lingkungan dari file `.env`.
  - `express-rate-limit`: Middleware untuk membatasi jumlah *request* dasar.

<!-- end list -->
