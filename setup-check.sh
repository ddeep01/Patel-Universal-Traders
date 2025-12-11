#!/bin/bash

# Static Site Conversion - Setup Checklist Script
# Run this to verify all files are in place and set up the static site

echo "======================================"
echo "Static Site Conversion - Setup Check"
echo "======================================"
echo ""

# Check if static-site directory exists
if [ ! -d "static-site" ]; then
    echo "❌ static-site directory not found!"
    exit 1
fi

echo "✅ static-site directory found"

# Check essential files
declare -a files=(
    "static-site/index.html"
    "static-site/pages/products.html"
    "static-site/pages/product-detail.html"
    "static-site/pages/blog.html"
    "static-site/pages/blog-detail.html"
    "static-site/pages/about.html"
    "static-site/pages/contact.html"
    "static-site/pages/privacy.html"
    "static-site/pages/terms.html"
    "static-site/js/data-loader.js"
    "static-site/js/animations.js"
    "static-site/js/home.js"
    "static-site/js/products.js"
    "static-site/js/blog.js"
    "static-site/js/product-detail.js"
    "static-site/js/blog-detail.js"
    "export_data.py"
    "STATIC_SITE_GUIDE.md"
    "STATIC_CONVERSION_SUMMARY.md"
)

echo ""
echo "Checking essential files..."
missing=0
for file in "${files[@]}"
do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (MISSING)"
        missing=$((missing + 1))
    fi
done

echo ""
echo "======================================"
echo "Directory Structure:"
echo "======================================"

if command -v tree &> /dev/null; then
    tree -L 2 static-site
else
    find static-site -maxdepth 2 -type f | sort
fi

echo ""
echo "======================================"
echo "Next Steps:"
echo "======================================"
echo ""
echo "1️⃣  Export data from Django:"
echo "    python manage.py shell < export_data.py"
echo ""
echo "2️⃣  Copy CSS, images, and videos:"
echo "    cp -r static/css/* static-site/css/"
echo "    cp -r static/images/* static-site/images/"
echo "    cp -r static/videos/* static-site/videos/"
echo ""
echo "3️⃣  Test locally:"
echo "    cd static-site"
echo "    python -m http.server 8000"
echo "    # Visit http://localhost:8000"
echo ""
echo "4️⃣  Deploy to Netlify, Vercel, or your host"
echo ""
echo "======================================"
if [ $missing -eq 0 ]; then
    echo "✅ All files are ready!"
else
    echo "❌ $missing files are missing. Please check."
fi
echo "======================================"
