#!/bin/bash
set -e

echo "📝 Generating valid routes for nginx configuration..."

# Extract static routes from router/index.ts
ROUTES_FILE="frontend/src/router/index.ts"

if [ ! -f "$ROUTES_FILE" ]; then
    echo "❌ Router file not found: $ROUTES_FILE"
    exit 1
fi

# Create nginx location blocks for valid routes
cat > /tmp/nginx_routes.conf << 'EOF'
    # Valid SPA routes - serve index.html with 200 status
    location = / { 
        root /home/ubuntu/prod/Lelanation/frontend/dist;
        try_files /index.html =404;
    }
    
    location = /build { 
        root /home/ubuntu/prod/Lelanation/frontend/dist;
        try_files /index.html =404;
    }
    
    location ^~ /build/edit { 
        root /home/ubuntu/prod/Lelanation/frontend/dist;
        try_files /index.html =404;
    }
    
    location = /builds { 
        root /home/ubuntu/prod/Lelanation/frontend/dist;
        try_files /index.html =404;
    }
    
    location = /builds-publics { 
        root /home/ubuntu/prod/Lelanation/frontend/dist;
        try_files /index.html =404;
    }
    
    location ^~ /connexion/ { 
        root /home/ubuntu/prod/Lelanation/frontend/dist;
        try_files /index.html =404;
    }
    
    location = /lelariva-builds { 
        root /home/ubuntu/prod/Lelanation/frontend/dist;
        try_files /index.html =404;
    }
    
    location = /dictionnaire { 
        root /home/ubuntu/prod/Lelanation/frontend/dist;
        try_files /index.html =404;
    }
    
    location = /dictionnaire/proposition { 
        root /home/ubuntu/prod/Lelanation/frontend/dist;
        try_files /index.html =404;
    }
    
    location = /statistique { 
        root /home/ubuntu/prod/Lelanation/frontend/dist;
        try_files /index.html =404;
    }
    
    location ^~ /admin/ { 
        root /home/ubuntu/prod/Lelanation/frontend/dist;
        try_files /index.html =404;
    }
    
    location = /legal { 
        root /home/ubuntu/prod/Lelanation/frontend/dist;
        try_files /index.html =404;
    }
    
    location ^~ /build/ { 
        root /home/ubuntu/prod/Lelanation/frontend/dist;
        try_files /index.html =404;
    }
    
    location = /videos { 
        root /home/ubuntu/prod/Lelanation/frontend/dist;
        try_files /index.html =404;
    }

    # Catch-all for invalid routes - return 404
    location / {
        root /home/ubuntu/prod/Lelanation/frontend/dist;
        return 404;
    }
EOF

echo "✅ Valid routes configuration generated in /tmp/nginx_routes.conf"
echo ""
echo "📋 Generated routes:"
grep "location" /tmp/nginx_routes.conf | grep -v "Catch-all"

echo ""
echo "🔧 To apply these routes, update the nginx configuration:"
echo "   sudo cp /tmp/nginx_routes.conf /etc/nginx/conf.d/spa-routes.conf" 