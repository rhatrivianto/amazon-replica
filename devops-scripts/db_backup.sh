
#!/bin/bash (Keamanan Data)
# Tentukan folder tempat menyimpan hasil backup
BACKUP_DIR="./backups/db"

echo "📂 Menyiapkan folder backup..."
mkdir -p "$BACKUP_DIR"

echo "💾 Memulai backup database MongoDB..."
# Menyimpan data database amazon_clone ke folder dengan nama tanggal hari ini
mongodump --db=amazon_clone --out="$BACKUP_DIR/$(date +%Y-%m-%d)"

echo "🧹 Menghapus backup lama yang lebih dari 30 hari..."
# Mencari folder yang modifikasinya lebih dari 30 hari lalu menghapusnya
find "$BACKUP_DIR" -type d -mtime +30 -exec rm -rf {} +
echo "✅ Backup database berhasil disimpan."