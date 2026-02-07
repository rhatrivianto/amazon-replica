#!/bin/bash
# Nama: live_logs.sh
# Fungsi: Memantau aktivitas pengunjung secara real-time

LOG_FILE="access.log"

echo "--------------------------------------------------------"
echo "📺 MEMULAI REAL-TIME LOG MONITOR (MATRIX MODE)"
echo "Tekan [CTRL+C] untuk berhenti"
echo "--------------------------------------------------------"

# Cek apakah file log ada
if [ ! -f "$LOG_FILE" ]; then
    echo "❌ File $LOG_FILE tidak ditemukan. Membuat file kosong..."
    touch "$LOG_FILE"
fi

# Menggunakan perintah 'tail -f' untuk memantau baris baru secara langsung
# Ditambah awk untuk mempercantik tampilan
tail -f "$LOG_FILE" | awk '{print "🌐 IP: " $1 " | 📅 Time: " $4 " | 🚀 Action: " $6 " " $7}'