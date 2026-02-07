#!/bin/bash
# Pindah ke folder tempat kode aplikasi berada
cd /var/www/amazon-clone || exit 1 
# Ambil update kode terbaru dari GitHub
git pull origin main 
# Install library/paket yang dibutuhkan aplikasi
npm install --production 
# TES: Periksa apakah file server.js ada error tulis/syntax. Jika error, stop script di sini!
node --check server.js || { echo "❌ Error Syntax!"; exit 1; }
# Jika tes di atas lulus, barulah restart aplikasi agar kode baru aktif
pm2 restart amazon-backend


#!/bin/bash
# 1. Definisikan folder aplikasi (Ganti jalur ini sesuai folder Anda)
DIR="D:/CodeSistency/Udemy/mern-ecommerce-refactorV2"

echo "🚀 Memulai proses Deployment..."
cd "$DIR" || { echo "❌ Folder tidak ditemukan"; exit 1; }

echo "📥 Menarik kode terbaru dari GitHub..."
git pull origin main

echo "📦 Menginstall library (dependencies)..."
npm install --production

echo "🔍 Mengecek kesalahan kode (Syntax Check)..."
# Perintah ini akan mengetes file server.js tanpa menjalankannya
node --check backend/src/server.js || { echo "❌ KODE RUSAK! Berhenti di sini."; exit 1; }

echo "🔄 Me-restart server aplikasi..."
pm2 restart amazon-backend
echo "✅ Deployment selesai dengan sukses!"


#!/bin/bash
# Nama: deploy.sh
# Deskripsi: Script untuk update aplikasi secara otomatis

# Menggunakan lokasi folder saat ini agar jalan di Windows & Linux
APP_DIR="$(pwd)"

echo "------------------------------------------"
echo "🚀 MEMULAI PROSES DEPLOYMENT"
echo "------------------------------------------"

# 1. Pindah ke folder utama
cd "$APP_DIR" || exit

# 2. Tarik kode terbaru
echo "📥 Step 1: Menarik kode dari GitHub..."
git pull origin main

# 3. Install Library
echo "📦 Step 2: Menginstall library dependencies..."
npm install --production

# 4. Validasi Kode (Safety First!)
echo "🔍 Step 3: Mengecek kesalahan syntax..."
node --check backend/src/server.js || { echo "❌ ERROR: Kode rusak, restart dibatalkan!"; exit 1; }

# 5. Restart Aplikasi
echo "🔄 Step 4: Me-restart server PM2..."
pm2 restart amazon-backend || echo "⚠️ PM2 belum jalan, silakan jalankan manual."

echo "------------------------------------------"
echo "✅ DEPLOYMENT BERHASIL!"
echo "------------------------------------------"