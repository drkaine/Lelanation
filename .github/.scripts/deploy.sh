#!/bin/bash
set -e

echo "Le script commence"
cd ~/production/Lelanation/ &&

# Pull la dernière version de l'application.
echo "pull origin main"
git pull

echo "Le déploiement commence ..."

pm2 restart all

cd /backend/ && npm install

cd ../frontend/ && npm install && npm run build

echo "Déploiement terminé!"