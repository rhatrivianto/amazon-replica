

#!/bin/bash (Kecepatan Database)
echo "🚀 Mengoptimalkan performa Database..."
# Menjalankan perintah perbaikan internal agar database tidak lambat
mongosh amazon_clone --eval "db.repairDatabase()"
echo "✅ Performa Database ditingkatkan."