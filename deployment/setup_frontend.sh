#!/bin/bash
# --- AWS EC2 FRONTEND INSTANCE SETUP (Ubuntu 22.04) ---
# TARGET: Instance 1 (Gateway)

# 1. Update and Install Nginx & Node
sudo apt update
sudo apt install nginx -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 2. Build the Frontend
# cd phdadmissions
# npm install
# npm run build

# 3. Move files to Nginx folder
sudo rm -rf /var/www/html/*
sudo cp -r dist/* /var/www/html/

# 4. Apply Nginx Configuration
# (See nginx.conf file in this directory)
sudo cp nginx.conf /etc/nginx/sites-available/default
sudo systemctl restart nginx

echo "✅ Frontend Gateway Setup Complete!"
