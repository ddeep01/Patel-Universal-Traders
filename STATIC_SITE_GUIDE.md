# Static Site Deployment Guide

## Quick Start

Follow these steps to convert your Django site to a fully static site:

### Step 1: Export Data from Django

```bash
cd /path/to/your/django/project
python manage.py shell < export_data.py
```

This creates JSON files in `static-site/data/`:
- `products.json` - All products
- `categories.json` - Product categories
- `blogs.json` - All blog posts
- `blog-categories.json` - Blog categories

### Step 2: Copy Static Assets

```bash
# Copy all CSS, JS, images, and videos
cp -r static/css/* static-site/css/
cp -r static/js/* static-site/js/
cp -r static/images/* static-site/images/
cp -r static/videos/* static-site/videos/
```

### Step 3: Test Locally

```bash
cd static-site
python -m http.server 8000
```

Visit `http://localhost:8000` in your browser.

## Deployment Options

### Option 1: Netlify (Recommended)

1. Connect your GitHub repository or upload folder
2. Build settings: None (it's already static)
3. Publish directory: `static-site`
4. Deploy!

```bash
# Or use Netlify CLI
npm install -g netlify-cli
netlify deploy --prod --dir static-site
```

### Option 2: Vercel

```bash
npm i -g vercel
cd static-site
vercel --prod
```

### Option 3: GitHub Pages

```bash
# Push to gh-pages branch
git subtree push --prefix static-site origin gh-pages
```

### Option 4: Traditional Web Hosting

Upload the entire `static-site/` folder to your hosting provider using FTP/SSH.

**For Nginx:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/html/static-site;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**For Apache:**
```apache
<Directory /var/www/html/static-site>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</Directory>
```

### Option 5: AWS S3 + CloudFront

```bash
# Install AWS CLI
aws configure

# Upload to S3
aws s3 sync static-site s3://your-bucket-name --delete

# Create CloudFront distribution for CDN
```

## File Structure

```
static-site/
├── index.html                 # Homepage
├── pages/
│   ├── products.html
│   ├── product-detail.html
│   ├── blog.html
│   ├── blog-detail.html
│   ├── about.html
│   ├── contact.html
│   ├── privacy.html
│   └── terms.html
├── css/
│   ├── style.css
│   ├── cursor.css
│   └── ...
├── js/
│   ├── data-loader.js
│   ├── animations.js
│   ├── home.js
│   ├── products.js
│   ├── blog.js
│   ├── product-detail.js
│   ├── blog-detail.js
│   └── cursor.js
├── data/
│   ├── products.json
│   ├── categories.json
│   ├── blogs.json
│   └── blog-categories.json
├── images/                    # All images
└── videos/                    # All videos
```

## Updating Content

### Update Products
Edit `static-site/data/products.json`:
```json
{
  "id": 1,
  "name": "Premium Basmati Rice",
  "slug": "premium-basmati",
  "category": "Basmati",
  "short_description": "...",
  "description": "...",
  "main_image": "/static/images/products/basmati.webp",
  "is_featured": true,
  ...
}
```

### Update Blogs
Edit `static-site/data/blogs.json`:
```json
{
  "id": 1,
  "title": "Article Title",
  "slug": "article-title",
  "excerpt": "Short preview...",
  "content": "<p>Full HTML content...</p>",
  "featured_image": "/static/images/blog/article.webp",
  "is_featured": true,
  ...
}
```

## SEO Optimization

### Sitemap
Create `static-site/sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/pages/products.html</loc>
    <priority>0.8</priority>
  </url>
  <!-- Add more URLs -->
</urlset>
```

### robots.txt
Create `static-site/robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://yourdomain.com/sitemap.xml
```

## Performance Tips

1. **Image Optimization**
   - Use WebP format with fallbacks
   - Use `<picture>` elements for responsive images
   - Lazy load images with `loading="lazy"`

2. **Caching**
   - Set long cache expiry for static assets
   - Use CDN for global distribution

3. **Compression**
   - Enable gzip compression on server
   - Minify CSS and JavaScript

4. **Monitoring**
   - Use Google Analytics
   - Monitor Core Web Vitals
   - Set up error tracking

## Troubleshooting

**Products not showing?**
- Check browser console for errors
- Verify `data/products.json` is accessible
- Check image paths in JSON

**Styling looks broken?**
- Clear browser cache
- Verify CSS files are in `/static/css/`
- Check for 404 errors in Network tab

**Links not working?**
- Verify all links use relative paths like `/pages/product-detail.html?id=1`
- For server routing, ensure server redirects to `index.html` for 404s

## Support

For issues or questions, contact support@yourdomain.com

---

**Benefits of Static Sites:**
✅ Faster loading times
✅ Better SEO
✅ Lower hosting costs
✅ Improved security
✅ Easy to cache
✅ Works everywhere
