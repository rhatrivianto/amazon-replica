

#!/bin/bash (Cek Beban)
echo "📊 Mengecek penggunaan sumber daya..."
# Ambil info RAM yang kosong
RAM_BEBAS=$(free -m | awk '/^Mem:/{print $4}')

echo "💻 Sisa RAM: ${RAM_BEBAS}MB"
if [ "$RAM_BEBAS" -lt 100 ]; then
    echo "⚠️ PERINGATAN: RAM hampir habis!"
fi