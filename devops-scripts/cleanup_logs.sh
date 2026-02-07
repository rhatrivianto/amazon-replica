

#!/bin/bash (Penjaga Disk)
LOG_PATH="./backend/src/logs"

echo "🧹 Mencari file log lama di $LOG_PATH..."
# Menghapus semua file berakhiran .log yang sudah berumur lebih dari 7 hari
find "$LOG_PATH" -name "*.log" -mtime +7 -delete

echo "✅ Pembersihan log selesai."