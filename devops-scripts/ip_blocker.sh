

#!/bin/bash (Anti Hacker/Spam)
echo "🛡️ Memindai log untuk aktivitas mencurigakan..."
# Mencari IP yang muncul lebih dari 50 kali dalam waktu singkat
IP_JAHAT=$(tail -n 100 access.log | awk '{print $1}' | sort | uniq -c | awk '$1 > 50 {print $2}')

for ip in $IP_JAHAT; do
    echo "🚫 Memblokir IP: $ip"
    # Perintah blokir di firewall server
    iptables -A INPUT -s "$ip" -j DROP
done
echo "✅ Selesai memantau IP."