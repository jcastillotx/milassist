#!/bin/bash

###############################################################################
# Environment Setup Script for MilAssist Payload CMS
# 
# This script helps you set up your .env file for local development
# 
# Usage:
#   chmod +x scripts/setup-env.sh
#   ./scripts/setup-env.sh
###############################################################################

set -e

echo "🚀 MilAssist Environment Setup"
echo "================================"
echo ""

# Check if .env already exists
if [ -f .env ]; then
    echo "⚠️  Warning: .env file already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled. Existing .env file preserved."
        exit 0
    fi
    echo ""
fi

# Get Supabase connection string
echo "📍 Step 1: Supabase Database Connection"
echo "   Get this from: Supabase Dashboard → Settings → Database → Connection string (URI)"
echo ""
read -p "Enter your Supabase DATABASE_URI: " DATABASE_URI

# Validate connection string
if [[ ! $DATABASE_URI =~ ^postgresql:// ]]; then
    echo "❌ Error: Invalid connection string. Must start with 'postgresql://'"
    exit 1
fi

# Check if SSL mode is included
if [[ ! $DATABASE_URI =~ sslmode=require ]]; then
    echo "⚠️  Warning: Connection string doesn't include ?sslmode=require"
    read -p "Add it automatically? (Y/n): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Nn]$ ]]; then
        if [[ $DATABASE_URI =~ \? ]]; then
            DATABASE_URI="${DATABASE_URI}&sslmode=require"
        else
            DATABASE_URI="${DATABASE_URI}?sslmode=require"
        fi
        echo "✅ Added ?sslmode=require to connection string"
    fi
fi

echo ""

# Generate Payload secret
echo "🔐 Step 2: Generate Payload Secret"
PAYLOAD_SECRET=$(openssl rand -base64 32)
echo "   Generated: ${PAYLOAD_SECRET:0:20}..."
echo ""

# Get server URL
echo "🌐 Step 3: Server URL"
read -p "Enter PAYLOAD_PUBLIC_SERVER_URL (default: http://localhost:3000): " SERVER_URL
SERVER_URL=${SERVER_URL:-http://localhost:3000}
echo ""

# Create .env file
echo "📝 Creating .env file..."
cat > .env << EOF
# Supabase Database Connection
DATABASE_URI=$DATABASE_URI

# Payload CMS Secret
PAYLOAD_SECRET=$PAYLOAD_SECRET

# Server URL
PAYLOAD_PUBLIC_SERVER_URL=$SERVER_URL

# Node Environment
NODE_ENV=development
EOF

echo "✅ .env file created successfully!"
echo ""

# Test connection
echo "🔍 Testing database connection..."
if command -v node &> /dev/null; then
    if [ -f scripts/test-db-connection.js ]; then
        node scripts/test-db-connection.js
    else
        echo "⚠️  Test script not found. Skipping connection test."
        echo "   You can test manually with: npm run test:db"
    fi
else
    echo "⚠️  Node.js not found. Skipping connection test."
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Install dependencies: npm install"
echo "   2. Build application: npm run build"
echo "   3. Start dev server: npm run dev"
echo "   4. Open browser: http://localhost:3000/admin"
echo ""
echo "📚 For more information, see:"
echo "   • QUICK_START_SUPABASE.md"
echo "   • SUPABASE_SETUP.md"
echo ""
