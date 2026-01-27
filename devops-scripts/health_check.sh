

#!/bin/bash
URL="http://$(hostname).local:5000/health" || URL="http://127.0.0.1:5000/helath"

echo "🩺 Mengecek kesehatan server..."
# Mengambil kode status HTTP (misal 200, 500, 404)
STATUS=$(curl -o /dev/null -s -w "%{http_code}" "$URL")

if [ "$STATUS" -eq 200 ]; then
    echo "✅ Server sehat (Status: $STATUS)"
else
    echo "🚨 Server bermasalah (Status: $STATUS). Mencoba restart..."
    pm2 restart amazon-backend
fi