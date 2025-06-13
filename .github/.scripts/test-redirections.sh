#!/bin/bash
set -e

echo "🔍 Testing HTTPS Redirections for Lelanation..."
echo ""

# Test 1: HTTP lelanation.fr -> HTTPS www.lelanation.fr
echo "1️⃣ Testing: http://lelanation.fr/ -> https://www.lelanation.fr/"
response1=$(curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}" http://lelanation.fr/)
echo "   Result: $response1"

# Test 2: HTTP www.lelanation.fr -> HTTPS www.lelanation.fr  
echo "2️⃣ Testing: http://www.lelanation.fr/ -> https://www.lelanation.fr/"
response2=$(curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}" http://www.lelanation.fr/)
echo "   Result: $response2"

# Test 3: HTTPS lelanation.fr -> HTTPS www.lelanation.fr
echo "3️⃣ Testing: https://lelanation.fr/ -> https://www.lelanation.fr/"
response3=$(curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}" https://lelanation.fr/)
echo "   Result: $response3"

# Test 4: HTTPS www.lelanation.fr (final destination)
echo "4️⃣ Testing: https://www.lelanation.fr/ (final destination)"
response4=$(curl -s -o /dev/null -w "%{http_code}" https://www.lelanation.fr/)
echo "   Result: $response4"

echo ""
echo "🔒 Testing SSL Certificates..."

# Test SSL certificate
echo "5️⃣ Testing SSL certificate for lelanation.fr"
ssl_test1=$(echo | timeout 5 openssl s_client -connect lelanation.fr:443 -servername lelanation.fr 2>/dev/null | grep "Verification: OK" || echo "SSL test failed")
echo "   Result: $ssl_test1"

echo "6️⃣ Testing SSL certificate for www.lelanation.fr"  
ssl_test2=$(echo | timeout 5 openssl s_client -connect www.lelanation.fr:443 -servername www.lelanation.fr 2>/dev/null | grep "Verification: OK" || echo "SSL test failed")
echo "   Result: $ssl_test2"

echo ""
echo "📊 Summary:"
if [[ "$response1" == "301 -> https://www.lelanation.fr/" ]] && 
   [[ "$response2" == "301 -> https://www.lelanation.fr/" ]] &&
   [[ "$response3" == "301 -> https://www.lelanation.fr/" ]] &&
   [[ "$response4" == "200" ]]; then
    echo "✅ All redirections are working correctly!"
else
    echo "❌ Some redirections are not working properly"
    exit 1
fi 