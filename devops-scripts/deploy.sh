#!/bin/bash
# Nama: deploy.sh
# Deskripsi: Script untuk update aplikasi secara otomatis, termasuk build frontend.

# Pastikan script berhenti jika ada error
set -e

# Menggunakan lokasi folder saat ini agar jalan di Windows & Linux
APP_DIR="$(pwd)"

echo "------------------------------------------"
echo "🚀 MEMULAI PROSES DEPLOYMENT"
echo "------------------------------------------"

# 1. Pindah ke folder utama aplikasi
cd "$APP_DIR" || exit

# 2. Tarik kode terbaru dari main branch
echo "📥 Step 1: Menarik kode dari GitHub..."
git pull origin main

# 3. Install dependencies dan bangun ulang frontend
# Script 'npm run build' di root package.json akan menjalankan:
#   - npm install di backend & frontend
#   - vite build di frontend untuk menghasilkan aset baru (termasuk logo)
echo "📦 Step 2: Menginstall dependencies & membangun ulang frontend..."
npm run build

# 4. Validasi Kode Backend (Safety Check sebelum restart)
echo "🔍 Step 3: Mengecek syntax backend..."
node --check backend/src/server.js || { echo "❌ ERROR: Kode backend rusak, restart dibatalkan!"; exit 1; }

# 5. Restart Aplikasi dengan PM2
echo "🔄 Step 4: Me-restart server PM2..."
pm2 restart amazon-backend

echo "------------------------------------------"
echo "✅ DEPLOYMENT BERHASIL!"
echo "Server telah di-restart dan frontend telah diperbarui."
echo "------------------------------------------"