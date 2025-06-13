#!/bin/bash
set -e

echo "Le script commence"
cd ~/prod/Lelanation/ &&

echo "pull origin main"
git pull

echo "Le déploiement commence ..."

echo "Nettoyage du cache Redis..."
redis-cli FLUSHALL

echo "install backend"
cd backend/ && npm install

echo "install frontend"
cd ../frontend/ && npm install 

BUILD_ID=$(date +"%Y%m%d%H%M%S")
echo "VITE_BUILD_ID=$BUILD_ID" > .env.production
echo "Génération d'un identifiant de build unique: $BUILD_ID"

echo "Construction du frontend avec nouvel ID de build..."
npm run build

echo "restart pm2"
pm2 restart all --update-env

echo "Déploiement terminé!"
