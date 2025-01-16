#!/bin/bash
set -e

echo "Le script commence"
cd ~/production/Lelanation/ &&

# Pull la dernière version de l'application.
echo "pull origin main"
git pull

echo "Le déploiement commence ..."

echo "install backend"
cd backend/ && npm install

echo "install frontend"
cd ../frontend/ && npm install && npm run build

echo "restart pm2"
pm2 restart all --update-env

echo "Déploiement terminé!"
