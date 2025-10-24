#!/bin/bash

echo "🔄 Updating Oracklez Server to Latest Version"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found${NC}"
    echo "Please run this script from the Oraclez directory"
    exit 1
fi

echo -e "${BLUE}📍 Current directory: $(pwd)${NC}"
echo ""

# Step 1: Stop old server
echo -e "${YELLOW}Step 1: Stopping old server...${NC}"
if command -v pm2 &> /dev/null; then
    pm2 stop youtube-adapter 2>/dev/null || echo "   (No running instance found)"
    pm2 delete youtube-adapter 2>/dev/null || echo "   (No PM2 instance to delete)"
else
    echo "   PM2 not installed, skipping..."
fi
echo -e "${GREEN}✅ Old server stopped${NC}"
echo ""

# Step 2: Backup current version
echo -e "${YELLOW}Step 2: Creating backup...${NC}"
BACKUP_DIR="backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "../$BACKUP_DIR"
cp -r . "../$BACKUP_DIR/" 2>/dev/null || true
echo -e "${GREEN}✅ Backup created at ../$BACKUP_DIR${NC}"
echo ""

# Step 3: Fetch latest changes
echo -e "${YELLOW}Step 3: Fetching latest changes...${NC}"
git fetch origin
CURRENT_BRANCH=$(git branch --show-current)
echo "   Current branch: $CURRENT_BRANCH"

if [ "$CURRENT_BRANCH" = "main" ] || [ "$CURRENT_BRANCH" = "master" ]; then
    git pull origin main 2>/dev/null || git pull origin master
else
    echo "   Merging main into $CURRENT_BRANCH..."
    git merge origin/main 2>/dev/null || git merge origin/master
fi
echo -e "${GREEN}✅ Repository updated${NC}"
echo ""

# Step 4: Install dependencies
echo -e "${YELLOW}Step 4: Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Step 5: Verify new files
echo -e "${YELLOW}Step 5: Verifying new files...${NC}"
FILES=(
    "ORACLEZ_IMPLEMENTATION.md"
    "QUICK_SETUP.md"
    "SERVER_UPDATE_GUIDE.md"
    "scripts/check-status.js"
    "scripts/set-source-code.js"
    "scripts/request-views.js"
    "scripts/monitor-events.js"
    "public/index.html"
)

ALL_FOUND=true
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "   ${GREEN}✅${NC} $file"
    else
        echo -e "   ${RED}❌${NC} $file (missing)"
        ALL_FOUND=false
    fi
done

if [ "$ALL_FOUND" = true ]; then
    echo -e "${GREEN}✅ All new files found!${NC}"
else
    echo -e "${YELLOW}⚠️  Some files missing - you may need to pull again${NC}"
fi
echo ""

# Step 6: Show new contract info
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 Update Complete!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}📝 IMPORTANT CHANGES:${NC}"
echo ""
echo "1. Your new contract uses Chainlink Functions (serverless!)"
echo "2. You DON'T need server.js running anymore"
echo "3. No Supabase required"
echo ""
echo -e "${BLUE}📍 Your Deployed Contract:${NC}"
echo "   Address: 0xD66544E49c7407AcdE0a577BFB176f950a18DAAA"
echo "   Network: Arbitrum Sepolia"
echo "   Subscription: 532"
echo ""
echo -e "${YELLOW}🚀 Next Steps:${NC}"
echo ""
echo "1. Check oracle status:"
echo "   ${BLUE}npm run oracle:status${NC}"
echo ""
echo "2. Set up source code (one time):"
echo "   ${BLUE}npm run oracle:setup${NC}"
echo ""
echo "3. Request YouTube data:"
echo "   ${BLUE}npm run oracle:request${NC}"
echo ""
echo "4. Monitor events:"
echo "   ${BLUE}npm run oracle:monitor${NC}"
echo ""
echo "5. Launch web dashboard:"
echo "   ${BLUE}npm install -g serve && npm run web${NC}"
echo ""
echo -e "${BLUE}📚 Documentation:${NC}"
echo "   - Read QUICK_SETUP.md for quick start"
echo "   - Read ORACLEZ_IMPLEMENTATION.md for full guide"
echo "   - Read SERVER_UPDATE_GUIDE.md for migration details"
echo ""
echo -e "${GREEN}✨ Your oracle is now serverless and ready to use!${NC}"
echo ""
