#!/bin/bash
# Nama: dashboard.sh
# Menampilkan status terakhir dari semua log otomatisasi

clear
echo "==============================================="
echo "   🚀 AMAZON-CLONE DEVOPS DASHBOARD 🚀"
echo "==============================================="
echo "📅 Waktu Sekarang: $(date)"
echo "-----------------------------------------------"

echo "💾 STATUS RAM TERAKHIR:"
tail -n 1 /mnt/d/CodeSistency/Udemy/mern-ecommerce-refactorV2/devops-scripts/monitor.log || echo "Belum ada data."

echo -e "\n🩺 STATUS KESEHATAN SERVER:"
tail -n 1 /mnt/d/CodeSistency/Udemy/mern-ecommerce-refactorV2/devops-scripts/health.log || echo "Belum ada data."

echo -e "\n📦 BACKUP TERAKHIR:"
tail -n 1 /mnt/d/CodeSistency/Udemy/mern-ecommerce-refactorV2/devops-scripts/backup.log || echo "Belum ada data."

echo -e "\n🛡️ AKTIVITAS SECURITY:"
tail -n 1 /mnt/d/CodeSistency/Udemy/mern-ecommerce-refactorV2/devops-scripts/security.log || echo "Belum ada data."

echo "-----------------------------------------------"
echo "Tips: Ketik 'bash devops-scripts/dashboard.sh' untuk update."