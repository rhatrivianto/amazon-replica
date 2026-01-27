#!/bin/bash

echo "��� Starting deployment process..."

# 1. Cek Sintaks (Mencegah push kode yang rusak)
echo "��� Checking for syntax errors..."
node --check backend/src/server.js

# 2. Git Workflow
echo "��� Staging changes..."
git add .

# 3. Commit dengan pesan standar + Timestamp
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
COMMIT_MSG="fix: non-blocking mail connection and startup optimization ($TIMESTAMP)"

echo "��� Committing: $COMMIT_MSG"
git commit -m "$COMMIT_MSG"

# 4. Push ke GitHub
echo "��� Pushing to GitHub (Triggering Deploy)..."
git push origin main

echo "✅ Process complete! Please check your Cloud Dashboard logs."
