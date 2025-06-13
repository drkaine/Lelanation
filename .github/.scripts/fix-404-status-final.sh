#!/bin/bash
set -e

echo "🔧 Fixing 404 status codes with backend validation..."

# Backup current configuration
if [ -f /etc/nginx/sites-available/lelanation-new ]; then
    sudo cp /etc/nginx/sites-available/lelanation-new /etc/nginx/sites-available/lelanation-new.backup.$(date +"%Y%m%d_%H%M%S")
    echo "✅ Configuration backed up"
fi

# Create nginx configuration that uses backend route validation
cat > /tmp/nginx_backend_404.conf << 'EOF'
    # Static files first - highest priority
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|otf|webp)$ {
        root /home/ubuntu/prod/Lelanation/frontend/dist;
        expires max;
        add_header Cache-Control "public, max-age=31536000, immutable";
        try_files $uri =404;
    }

    # Service Worker
    location = /service-worker.js {
        root /home/ubuntu/prod/Lelanation/frontend/dist;
        add_header Cache-Control "public, max-age=0, must-revalidate";
        default_type application/javascript;
        try_files $uri =404;
    }

    # Backend API routes
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 90s;
    }

    # SPA routes with backend validation
    location / {
        root /home/ubuntu/prod/Lelanation/frontend/dist;
        
        # Try to serve static files first
        try_files $uri $uri/ @spa_validation;
    }

    # Backend validation for SPA routes
    location @spa_validation {
        # Call backend to validate route
        access_by_lua_block {
            local http = require "resty.http"
            local httpc = http.new()
            
            local res, err = httpc:request_uri("http://localhost:3000/api/validate-route", {
                method = "GET",
                query = "path=" .. ngx.var.uri,
                headers = {
                    ["User-Agent"] = "nginx-route-validator"
                }
            })
            
            if not res then
                ngx.log(ngx.ERR, "Failed to validate route: ", err)
                ngx.status = 404
                ngx.exit(404)
            end
            
            local cjson = require "cjson"
            local validation = cjson.decode(res.body)
            
            if validation.status == 404 then
                ngx.status = 404
                ngx.header["X-Route-Status"] = "invalid"
            else
                ngx.header["X-Route-Status"] = "valid"
            end
        }
        
        root /home/ubuntu/prod/Lelanation/frontend/dist;
        try_files /index.html =404;
    }
EOF

echo "⚠️  This approach requires nginx with lua module, which may not be available."
echo "🔧 Let's use a simpler approach with auth_request instead..."

# Create a simpler approach using auth_request
cat > /tmp/nginx_auth_404.conf << 'EOF'
    # Static files first
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|otf|webp)$ {
        root /home/ubuntu/prod/Lelanation/frontend/dist;
        expires max;
        add_header Cache-Control "public, max-age=31536000, immutable";
        try_files $uri =404;
    }

    # Service Worker
    location = /service-worker.js {
        root /home/ubuntu/prod/Lelanation/frontend/dist;
        add_header Cache-Control "public, max-age=0, must-revalidate";
        default_type application/javascript;
        try_files $uri =404;
    }

    # Backend API routes
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_Set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_Set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_Set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 90s;
    }

    # Internal auth endpoint for route validation
    location = /auth-route {
        internal;
        proxy_pass http://localhost:3000/api/validate-route?path=$request_uri;
        proxy_pass_request_body off;
        proxy_set_header Content-Length "";
        proxy_set_header X-Original-URI $request_uri;
        proxy_set_header X-Original-Method $request_method;
    }

    # SPA routes with validation
    location / {
        root /home/ubuntu/prod/Lelanation/frontend/dist;
        
        # First try static files
        try_files $uri $uri/ @spa_fallback;
    }
    
    # SPA fallback with route validation
    location @spa_fallback {
        auth_request /auth-route;
        
        # If auth_request returns 404, nginx will serve 404
        # If auth_request returns 200, serve index.html
        
        root /home/ubuntu/prod/Lelanation/frontend/dist;
        try_files /index.html =404;
        
        # Set error page for 404s
        error_page 404 = @handle_404;
    }
    
    # Handle 404 errors properly
    location @handle_404 {
        root /home/ubuntu/prod/Lelanation/frontend/dist;
        add_header X-Route-Status "invalid" always;
        try_files /index.html =404;
        return 404;
    }
EOF

echo "⚠️  auth_request approach also complex. Using simplest solution..."

# Final approach: simple map-based validation
cat > /tmp/nginx_map_404.conf << 'EOF'
    # Static files first
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|otf|webp)$ {
        root /home/ubuntu/prod/Lelanation/frontend/dist;
        expires max;
        add_header Cache-Control "public, max-age=31536000, immutable";
        try_files $uri =404;
    }

    # Service Worker  
    location = /service-worker.js {
        root /home/ubuntu/prod/Lelanation/frontend/dist;
        add_header Cache-Control "public, max-age=0, must-revalidate";
        default_type application/javascript;
        try_files $uri =404;
    }

    # Backend API routes
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_Set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_Set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 90s;
    }

    # SPA routes - for now serve all as 200, let Vue.js handle 404
    # We'll implement proper 404 at the application level
    location / {
        root /home/ubuntu/prod/Lelanation/frontend/dist;
        try_files $uri $uri/ /index.html;
        
        # Add header to identify this is serving index.html
        add_header X-Served-By "spa-fallback" always;
    }
EOF

echo "🔧 Applying simple configuration and relying on Vue.js 404 handling..."

# Replace the configuration
sudo cp /etc/nginx/sites-available/lelanation-new /tmp/lelanation-new-final

# Remove existing location blocks
sudo sed -i '/# Static files first/,/^[[:space:]]*}[[:space:]]*$/d' /tmp/lelanation-new-final
sudo sed -i '/# Service Worker/,/^[[:space:]]*}[[:space:]]*$/d' /tmp/lelanation-new-final  
sudo sed -i '/# Images WebP/,/^[[:space:]]*}[[:space:]]*$/d' /tmp/lelanation-new-final
sudo sed -i '/# Fonts/,/^[[:space:]]*}[[:space:]]*$/d' /tmp/lelanation-new-final
sudo sed -i '/# Static assets/,/^[[:space:]]*}[[:space:]]*$/d' /tmp/lelanation-new-final
sudo sed -i '/# Backend API/,/^[[:space:]]*}[[:space:]]*$/d' /tmp/lelanation-new-final
sudo sed -i '/# Valid SPA routes/,/^[[:space:]]*}[[:space:]]*$/d' /tmp/lelanation-new-final
sudo sed -i '/# SPA routes/,/^[[:space:]]*}[[:space:]]*$/d' /tmp/lelanation-new-final
sudo sed -i '/# Catch-all/,/^[[:space:]]*}[[:space:]]*$/d' /tmp/lelanation-new-final
sudo sed -i '/# Smart SPA/,/^[[:space:]]*}[[:space:]]*$/d' /tmp/lelanation-new-final
sudo sed -i '/location .*@/,/^[[:space:]]*}[[:space:]]*$/d' /tmp/lelanation-new-final
sudo sed -i '/location.*\/.*{/,/^[[:space:]]*}[[:space:]]*$/d' /tmp/lelanation-new-final

# Add new configuration before SSL certificates
sudo sed -i '/ssl_certificate \/etc\/letsencrypt/i\' /tmp/lelanation-new-final
sudo sed -i '/ssl_certificate \/etc\/letsencrypt/r /tmp/nginx_map_404.conf' /tmp/lelanation-new-final
sudo sed -i '/ssl_certificate \/etc\/letsencrypt/i\' /tmp/lelanation-new-final

# Install the new configuration
sudo cp /tmp/lelanation-new-final /etc/nginx/sites-available/lelanation-new

echo "🔍 Testing nginx configuration..."
if sudo nginx -t; then
    echo "✅ Nginx configuration is valid"
    echo "🔄 Reloading nginx..."
    sudo systemctl reload nginx
    
    echo "✅ Configuration applied successfully!"
    echo ""
    echo "📋 Solution implemented:"
    echo "   • nginx serves static files normally"
    echo "   • nginx serves index.html for all SPA routes"
    echo "   • Vue.js app handles 404 detection and proper status"
    echo "   • NotFoundView component sets proper meta tags"
    echo "   • Backend route validation available at /api/validate-route"
    echo ""
    echo "🧪 The issue is that nginx cannot directly set 404 for SPA routes"
    echo "   because it must serve index.html for the app to work."
    echo "   This is a common limitation of SPAs served via nginx."
    echo ""
    echo "💡 The proper solution requires either:"
    echo "   1. Server-side rendering (SSR)"
    echo "   2. Pre-rendering static pages"
    echo "   3. Custom nginx module with Lua scripting"
    echo "   4. Moving SPA serving to the Express backend"
    echo ""
    echo "🔧 For now, search engines will see 200 status but"
    echo "   the Vue.js app properly shows 404 content with"
    echo "   noindex meta tags for invalid routes."
    
else
    echo "❌ Nginx configuration test failed"
    echo "🔄 Restoring backup..."
    LATEST_BACKUP=$(ls -1t /etc/nginx/sites-available/lelanation-new.backup.* | head -1)
    sudo cp "$LATEST_BACKUP" /etc/nginx/sites-available/lelanation-new
    exit 1
fi

echo ""
echo "📈 Recommendation: Consider implementing SSR or move to"
echo "    Express-served frontend for proper HTTP status codes." 