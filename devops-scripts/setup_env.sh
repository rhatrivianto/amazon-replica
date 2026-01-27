

#!/bin/bash (Otomatisasi Setup)
echo "🛠️ Mengecek konfigurasi file .env..."

# Jika file .env tidak ditemukan (! -f)
if [[ ! -f .env ]]; then
    echo "📄 File .env tidak ada. Membuat dari template .env.example..."
    cp .env.example .env
else
    echo "✅ File .env sudah tersedia."
fi