
#!/bin/bash (Benteng Pertahanan)
echo "🔒 Memeriksa keamanan izin folder..."
# Mengubah izin folder agar tidak bisa diacak-acak sembarang orang (755)
# 755 artinya: Pemilik bisa edit, orang lain cuma bisa lihat/baca.
find . -type d -perm 777 -exec chmod 755 {} +
echo "✅ Audit keamanan selesai."