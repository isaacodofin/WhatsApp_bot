#!/bin/bash

# WhatsApp Bot Deployment Script for VPS

echo "🚀 Starting WhatsApp Bot deployment..."

# Update system packages
sudo apt update

# Install Node.js if not present
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install PM2 if not present
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    sudo npm install -g pm2
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create logs directory
mkdir -p logs

# Stop existing instance if running
pm2 delete whatsapp-bot 2>/dev/null || true

# Start the bot with PM2
echo "🤖 Starting WhatsApp Bot..."
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup

echo "✅ WhatsApp Bot deployed successfully!"
echo "📊 Monitor with: pm2 monit"
echo "📋 Check logs with: pm2 logs whatsapp-bot"
echo "🔗 Access status at: http://your-server-ip:5000/status"
