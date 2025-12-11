#!/bin/bash
# 
# STATIC SITE CONVERSION - SETUP SCRIPT
# Run this script to complete the conversion setup
#

set -e  # Exit on error

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║   Static Site Conversion - Complete Setup Script      ║"
echo "║        Patel Universal Traders                         ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${BLUE}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -d "static-site" ]; then
    print_error "static-site directory not found!"
    echo "Please run this script from the project root directory."
    exit 1
fi

print_success "Found static-site directory"
echo ""

# Step 1: Check Python and Django
print_step "Checking Python and Django..."
if ! command -v python &> /dev/null; then
    print_error "Python not found!"
    exit 1
fi
print_success "Python found: $(python --version)"

if ! python -c "import django" 2>/dev/null; then
    print_error "Django not installed!"
    exit 1
fi
print_success "Django installed"
echo ""

# Step 2: Export data
print_step "Exporting data from Django database..."
if [ ! -f "export_data.py" ]; then
    print_error "export_data.py not found!"
    exit 1
fi

# Create data directory if it doesn't exist
mkdir -p static-site/data

# Run export script
python manage.py shell << 'EOF'
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'prime_impex.settings')

import django
django.setup()

exec(open('export_data.py').read())
EOF

print_success "Data exported successfully"
echo ""

# Step 3: Check CSS directory
print_step "Checking CSS files..."
if [ ! -d "static/css" ]; then
    print_warning "static/css directory not found - skipping CSS copy"
else
    mkdir -p static-site/css
    cp -r static/css/* static-site/css/
    print_success "CSS files copied"
fi
echo ""

# Step 4: Check images directory
print_step "Checking images..."
if [ ! -d "static/images" ]; then
    print_warning "static/images directory not found - skipping images copy"
else
    mkdir -p static-site/images
    cp -r static/images/* static-site/images/ 2>/dev/null || true
    print_success "Images copied"
fi
echo ""

# Step 5: Check videos directory
print_step "Checking videos..."
if [ ! -d "static/videos" ]; then
    print_warning "static/videos directory not found - skipping videos copy"
else
    mkdir -p static-site/videos
    cp -r static/videos/* static-site/videos/ 2>/dev/null || true
    print_success "Videos copied"
fi
echo ""

# Step 6: Verify all files
print_step "Verifying all files..."
FILES=(
    "static-site/index.html"
    "static-site/pages/products.html"
    "static-site/pages/blog.html"
    "static-site/js/data-loader.js"
    "static-site/js/animations.js"
    "static-site/data/products.json"
)

all_exist=true
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
    else
        print_error "Missing: $file"
        all_exist=false
    fi
done
echo ""

if [ "$all_exist" = true ]; then
    print_success "All essential files present!"
else
    print_error "Some files are missing!"
    exit 1
fi

# Final summary
echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║              SETUP COMPLETE! ✅                        ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "Next Steps:"
echo ""
print_step "1. Test locally:"
echo "   cd static-site"
echo "   python -m http.server 8000"
echo "   Visit: http://localhost:8000"
echo ""
print_step "2. Deploy to Netlify (easiest):"
echo "   Go to: https://netlify.com"
echo "   Drag & drop static-site folder"
echo ""
print_step "3. Or deploy to Vercel:"
echo "   npm i -g vercel"
echo "   vercel --prod"
echo ""
print_step "4. Or upload to your host via FTP/SSH"
echo ""
echo "📖 For detailed instructions, read:"
echo "   - CONVERSION_COMPLETE.md"
echo "   - STATIC_SITE_GUIDE.md"
echo "   - static-site/README.md"
echo ""
print_success "Your static site is ready! 🚀"
echo ""
