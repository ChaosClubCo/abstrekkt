#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Claude Code CLI Skills Bundle Installer               ║${NC}"
echo -e "${BLUE}║  64 Production-Ready Skills for Claude Code            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Detect OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macOS"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="Linux"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    OS="Windows"
else
    OS="Unknown"
fi

echo -e "${YELLOW}Detected OS: $OS${NC}"
echo ""

# Ask user for installation type
echo "Choose installation type:"
echo "  1) Personal (~/.claude/skills/) - Your personal skills across all projects"
echo "  2) Project (./.claude/skills/) - Team skills in current project"
echo ""
read -p "Enter choice (1 or 2): " choice

case $choice in
    1)
        INSTALL_DIR="$HOME/.claude/skills"
        SCOPE="personal"
        echo -e "${GREEN}✓ Personal installation selected${NC}"
        ;;
    2)
        if [ ! -d ".claude" ]; then
            mkdir -p .claude
            echo -e "${GREEN}✓ Created .claude directory${NC}"
        fi
        INSTALL_DIR="./.claude/skills"
        SCOPE="project"
        echo -e "${GREEN}✓ Project installation selected${NC}"
        ;;
    *)
        echo -e "${RED}❌ Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""

# Create target directory
if [ ! -d "$INSTALL_DIR" ]; then
    mkdir -p "$INSTALL_DIR"
    echo -e "${GREEN}✓ Created $INSTALL_DIR${NC}"
fi

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SKILLS_SOURCE="$SCRIPT_DIR/skills"

if [ ! -d "$SKILLS_SOURCE" ]; then
    echo -e "${RED}❌ Error: skills directory not found at $SKILLS_SOURCE${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Installing skills...${NC}"
echo ""

# Copy skills
TOTAL=0
COPIED=0
SKIPPED=0

for skill_folder in "$SKILLS_SOURCE"/*; do
    if [ ! -d "$skill_folder" ]; then
        continue
    fi
    
    skill_name=$(basename "$skill_folder")
    TOTAL=$((TOTAL + 1))
    
    # Check if skill already exists
    if [ -d "$INSTALL_DIR/$skill_name" ]; then
        echo -e "  ${YELLOW}⏭  $skill_name${NC} (already exists, skipping)"
        SKIPPED=$((SKIPPED + 1))
    elif [ ! -f "$skill_folder/SKILL.md" ]; then
        echo -e "  ${RED}❌ $skill_name${NC} (no SKILL.md, invalid)"
        SKIPPED=$((SKIPPED + 1))
    else
        cp -r "$skill_folder" "$INSTALL_DIR/$skill_name"
        echo -e "  ${GREEN}✓  $skill_name${NC}"
        COPIED=$((COPIED + 1))
    fi
done

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Installation Complete!                               ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "📊 Summary:"
echo -e "   ${GREEN}✓ Skills copied:  $COPIED${NC}"
echo -e "   ${YELLOW}⏭  Skills skipped: $SKIPPED${NC}"
echo -e "   📦 Total processed: $TOTAL"
echo ""
echo -e "📁 Installation directory:"
echo -e "   ${GREEN}$INSTALL_DIR${NC}"
echo ""
echo -e "💾 Skills size: $(du -sh $INSTALL_DIR | cut -f1)"
echo -e "📝 Skills count: $(find $INSTALL_DIR -maxdepth 1 -type d ! -name 'skills' 2>/dev/null | wc -l)"
echo ""

# Post-installation instructions
echo -e "${BLUE}Next Steps:${NC}"
echo ""

if [ "$SCOPE" = "personal" ]; then
    echo "1️⃣  Restart Claude Code for changes to take effect:"
    echo "   ${GREEN}claude${NC}"
    echo ""
    echo "2️⃣  Verify installation:"
    echo "   ${GREEN}ls ~/.claude/skills/ | head -10${NC}"
    echo ""
    echo "3️⃣  Try using a skill:"
    echo "   ${GREEN}claude -p \"Generate a Python FastAPI endpoint\"${NC}"
    echo "   (should auto-trigger: backend-dev-guidelines)"
else
    echo "1️⃣  Commit skills to git:"
    echo "   ${GREEN}git add .claude/skills/${NC}"
    echo "   ${GREEN}git commit -m \"Add 64 Claude Code skills\"${NC}"
    echo ""
    echo "2️⃣  Share with team:"
    echo "   ${GREEN}git push origin main${NC}"
    echo ""
    echo "3️⃣  Team members will get skills automatically on next ${GREEN}claude${NC} run"
fi

echo ""
echo -e "${GREEN}✨ You're all set!${NC}"
echo ""
echo "📚 Documentation:"
echo "   • All skills: $INSTALL_DIR"
echo "   • Read skill: ${GREEN}cat ~/.claude/skills/skill-name/SKILL.md${NC}"
echo "   • Official docs: https://code.claude.com/docs/en/skills"
echo ""
