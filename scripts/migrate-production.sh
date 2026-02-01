#!/bin/bash
# Production Database Migration and Seeding Script
# Usage: ./scripts/migrate-production.sh "postgresql://postgres:password@db.project.supabase.co:5432/postgres"

set -e  # Exit on any error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   MilAssist Production Database Setup Script         ║${NC}"
echo -e "${BLUE}║   Supabase Migration & Test Account Seeder           ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if connection string provided
if [ -z "$1" ]; then
    echo -e "${RED}❌ ERROR: No database connection string provided${NC}"
    echo ""
    echo "Usage:"
    echo "  ./scripts/migrate-production.sh \"postgresql://postgres:PASSWORD@db.PROJECT-REF.supabase.co:5432/postgres\""
    echo ""
    echo "Get your connection string from:"
    echo "  1. Go to https://app.supabase.com"
    echo "  2. Select your project"
    echo "  3. Settings → Database → Connection String (URI mode)"
    echo "  4. Copy and replace [YOUR-PASSWORD] with actual password"
    echo ""
    exit 1
fi

DATABASE_URL="$1"

# Navigate to server directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
SERVER_DIR="$PROJECT_ROOT/server"

if [ ! -d "$SERVER_DIR" ]; then
    echo -e "${RED}❌ ERROR: Server directory not found at $SERVER_DIR${NC}"
    exit 1
fi

cd "$SERVER_DIR"
echo -e "${GREEN}✓${NC} Working directory: $SERVER_DIR"
echo ""

# Test database connection
echo -e "${BLUE}[1/4] Testing database connection...${NC}"
export DATABASE_URL="$DATABASE_URL"

# Use node to test connection instead of psql (which might not be installed)
node -e "
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false }
  },
  logging: false
});

sequelize.authenticate()
  .then(() => {
    console.log('✓ Database connection successful');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  });
" || {
    echo -e "${RED}❌ Failed to connect to database${NC}"
    echo ""
    echo "Please check:"
    echo "  - Connection string is correct"
    echo "  - Password is correct (no typos)"
    echo "  - Database is accessible (check Supabase dashboard)"
    echo ""
    exit 1
}
echo ""

# Check migration status
echo -e "${BLUE}[2/4] Checking migration status...${NC}"
npx sequelize-cli db:migrate:status --env production 2>&1 | grep -E "(up|down|No migrations)" || true
echo ""

# Run migrations
echo -e "${BLUE}[3/4] Running database migrations...${NC}"
npx sequelize-cli db:migrate --env production

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Migrations completed successfully${NC}"
else
    echo -e "${RED}❌ Migration failed${NC}"
    exit 1
fi
echo ""

# Seed test accounts
echo -e "${BLUE}[4/4] Creating test accounts...${NC}"
echo -e "${YELLOW}ℹ This will create 9 test accounts (1 admin, 3 clients, 5 VAs)${NC}"
echo ""

read -p "Do you want to create test accounts? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    npx sequelize-cli db:seed --seed 20260201000000-test-accounts.js

    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✓ Test accounts created successfully${NC}"
        echo ""
        echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
        echo -e "${GREEN}✅ Database setup complete!${NC}"
        echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
        echo ""
        echo "Test Account Credentials:"
        echo ""
        echo "Admin:"
        echo "  Email:    admin@milassist.com"
        echo "  Password: Admin123!Test"
        echo ""
        echo "Clients:"
        echo "  Email:    client1@example.com"
        echo "  Password: Client123!"
        echo ""
        echo "Virtual Assistants:"
        echo "  Email:    va1@milassist.com"
        echo "  Password: Assistant123!"
        echo ""
        echo "See docs/TEST_ACCOUNTS.md for complete list"
        echo ""
    else
        echo -e "${RED}❌ Seeding failed${NC}"
        echo ""
        echo "This might happen if test accounts already exist."
        echo "To recreate them, first run:"
        echo "  npx sequelize-cli db:seed:undo --seed 20260201000000-test-accounts.js"
        echo "Then run this script again."
        echo ""
        exit 1
    fi
else
    echo ""
    echo -e "${YELLOW}⊘ Skipped test account creation${NC}"
    echo ""
    echo -e "${GREEN}✅ Migrations complete!${NC}"
    echo ""
fi

# Verify setup
echo -e "${BLUE}Verifying deployment...${NC}"
echo ""
echo "Next steps:"
echo "  1. Test health endpoint: curl https://your-app.vercel.app/api/health"
echo "  2. Try logging in with admin@milassist.com / Admin123!Test"
echo "  3. Check Supabase Table Editor to see all 32 tables"
echo ""
echo -e "${GREEN}🚀 Your production database is ready!${NC}"
echo ""
