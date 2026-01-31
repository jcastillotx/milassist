#!/bin/bash
# Script to replace hardcoded localhost URLs with environment variable

echo "Replacing hardcoded API URLs with config import..."

# Find all JSX files with hardcoded URLs
FILES=$(grep -rl "http://localhost:3000" src/pages src/components 2>/dev/null | grep ".jsx$")

COUNT=0
for file in $FILES; do
    # Check if file already imports API_URL
    if ! grep -q "import.*API_URL.*from.*config/api" "$file"; then
        # Add import at the top after other imports
        if grep -q "^import" "$file"; then
            # Find the last import line and add after it
            sed -i.bak '/^import/a\
import API_URL from "../config/api";
' "$file" || sed -i.bak '1a\
import API_URL from "../config/api";
' "$file"
        else
            # No imports, add at very top
            sed -i.bak '1i\
import API_URL from "../config/api";\
' "$file"
        fi
    fi
    
    # Replace fetch calls
    sed -i.bak "s|fetch('http://localhost:3000/|fetch(\`\${API_URL}/|g" "$file"
    sed -i.bak 's|fetch("http://localhost:3000/|fetch(`${API_URL}/|g' "$file"
    sed -i.bak 's|fetch(`http://localhost:3000/|fetch(`${API_URL}/|g' "$file"
    
    # Clean up backup files
    rm -f "${file}.bak"
    
    COUNT=$((COUNT + 1))
    echo "  Updated: $file"
done

echo ""
echo "✓ Updated $COUNT files"
echo ""
echo "Next steps:"
echo "1. Create .env file with: VITE_API_URL=http://localhost:5000"
echo "2. Review changes and fix any import path issues"
echo "3. Test the application"
