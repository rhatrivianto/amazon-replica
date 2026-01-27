

#!/bin/bash (Jaga HTTPS Tetap Hijau)
echo "📜 Memperbarui sertifikat keamanan (SSL)..."
# Perintah otomatis untuk memperpanjang masa aktif HTTPS
certbot renew --quiet
echo "🔄 Me-reload server Nginx untuk menerapkan SSL baru..."
systemctl reload nginx
echo "✅ SSL berhasil diperbarui."