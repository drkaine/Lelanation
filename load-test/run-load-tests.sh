#!/bin/bash

# Script pour exécuter des tests de charge sur l'application Lelanation
# Permet de tester la capacité à supporter une charge significative d'utilisateurs

# Définir les couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# S'assurer que nous sommes dans le dossier load-test
cd "$(dirname "$0")"

# Vérifier si k6 est installé
if ! command -v k6 &> /dev/null; then
    echo -e "${RED}K6 n'est pas installé. Veuillez l'installer d'abord.${NC}"
    echo "Voir: https://k6.io/docs/get-started/installation/"
    exit 1
fi

# Fonction pour afficher un message d'information
info() {
    echo -e "${BLUE}INFO: $1${NC}"
}

# Fonction pour afficher un avertissement
warning() {
    echo -e "${YELLOW}ATTENTION: $1${NC}"
}

# Fonction pour afficher une erreur
error() {
    echo -e "${RED}ERREUR: $1${NC}"
}

# Fonction pour afficher un succès
success() {
    echo -e "${GREEN}SUCCÈS: $1${NC}"
}

# Définir les URL à tester
read -p "Entrez l'URL du frontend (par défaut: https://www.lelanation.fr): " FRONTEND_URL
FRONTEND_URL=${FRONTEND_URL:-https://www.lelanation.fr}

read -p "Entrez l'URL de l'API (par défaut: https://www.lelanation.fr): " API_URL
API_URL=${API_URL:-https://www.lelanation.fr}

# Demander confirmation
warning "Vous êtes sur le point de lancer des tests de charge sur:"
echo "  - Frontend: $FRONTEND_URL"
echo "  - API: $API_URL"
warning "Ces tests vont simuler des utilisateurs simultanés et peuvent générer une charge importante."
warning "NE PAS exécuter sur un environnement de production sans préparation adéquate."

read -p "Êtes-vous sûr de vouloir continuer? (o/n): " CONFIRM
if [[ $CONFIRM != "o" && $CONFIRM != "O" ]]; then
    info "Tests annulés."
    exit 0
fi

# Créer un dossier pour les résultats
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
RESULTS_DIR="../load-test-results-$TIMESTAMP"
mkdir -p "$RESULTS_DIR"

# Mettre à jour les URLs dans les fichiers de test
sed -i "s|const BASE_URL = '.*';|const BASE_URL = '$FRONTEND_URL';|" loadtest.js
sed -i "s|const API_URL = '.*';|const API_URL = '$API_URL';|" api-loadtest.js
sed -i "s|const BUILDS_API_URL = '.*';|const BUILDS_API_URL = '$API_URL/api';|" build-creation-loadtest.js

# Exécuter les tests et sauvegarder les résultats
run_test() {
    local test_file=$1
    local test_name=$2
    local output_file="$RESULTS_DIR/${test_name}-results.json"
    
    info "Démarrage du test: $test_name"
    info "Le test peut prendre 3-5 minutes. Veuillez patienter..."
    
    k6 run --out json="$output_file" "$test_file"
    
    if [ $? -eq 0 ]; then
        success "Test $test_name terminé avec succès. Résultats sauvegardés dans $output_file"
    else
        error "Erreur lors de l'exécution du test $test_name"
    fi
    
    # Attendre un peu entre les tests pour éviter la surcharge
    info "Pause de 15 secondes avant le prochain test..."
    sleep 15
}

# Menu pour choisir les tests à exécuter
echo "Quels tests souhaitez-vous exécuter?"
echo "1) Test du Frontend (navigation utilisateur)"
echo "2) Test des API (endpoints principaux)"
echo "3) Test de création de builds"
echo "4) Tous les tests (séquentiellement)"
echo "0) Annuler"

read -p "Votre choix (0-4): " TEST_CHOICE

case $TEST_CHOICE in
    1)
        run_test "loadtest.js" "frontend"
        ;;
    2)
        run_test "api-loadtest.js" "api"
        ;;
    3)
        run_test "build-creation-loadtest.js" "build-creation"
        ;;
    4)
        info "Exécution de tous les tests en séquence..."
        run_test "loadtest.js" "frontend"
        run_test "api-loadtest.js" "api"
        run_test "build-creation-loadtest.js" "build-creation"
        ;;
    0)
        info "Tests annulés."
        exit 0
        ;;
    *)
        error "Choix invalide."
        exit 1
        ;;
esac

# Résumé final
success "Tous les tests demandés ont été exécutés."
info "Résultats sauvegardés dans le dossier: $RESULTS_DIR"

echo ""
warning "Points importants à vérifier après les tests:"
echo "1. Vérifiez le taux d'erreur HTTP (http_req_failed)"
echo "2. Vérifiez la durée des requêtes (http_req_duration)"
echo "3. Pour les builds, vérifiez les compteurs successful_build_creations et failed_build_creations"
echo "4. Vérifiez si les pages du frontend se chargent correctement (page_load_success)"
echo "5. Examinez les messages d'erreur dans les logs du serveur si des problèmes ont été détectés"

info "Pour une analyse détaillée des résultats, vous pouvez utiliser:"
echo "k6 view $RESULTS_DIR/<nom-du-test>-results.json"

exit 0 