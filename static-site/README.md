# Static Site Conversion - Patel Universal Traders

This folder contains a fully static version of the Patel Universal Traders website, converted from Django to pure HTML/CSS/JavaScript.

## Directory Structure

```
static-site/
├── index.html                 # Homepage
├── pages/
│   ├── products.html         # Products listing page
│   ├── product-detail.html   # Individual product details
│   ├── blog.html             # Blog listing page
│   ├── blog-detail.html      # Individual blog post
│   ├── about.html            # About us page
│   ├── contact.html          # Contact form
│   ├── privacy.html          # Privacy policy
│   └── terms.html            # Terms of service
├── css/
│   ├── style.css             # Main stylesheet (copy from static/)
│   ├── cursor.css            # Custom cursor styles
│   └── ...other styles
├── js/
│   ├── data-loader.js        # Loads JSON data for products/blogs
│   ├── animations.js         # Animation effects
│   ├── home.js               # Homepage functionality
│   ├── products.js           # Products page functionality
│   ├── blog.js               # Blog page functionality
│   ├── product-detail.js     # Product detail page
│   ├── blog-detail.js        # Blog detail page
│   └── cursor.js             # Custom cursor script
├── data/
│   ├── products.json         # All products data
│   ├── categories.json       # Product categories
│   ├── blogs.json            # All blog posts
│   └── blog-categories.json  # Blog categories
├── images/                   # All images (copy from static/images/)
│   ├── hero/
│   ├── certs/
│   ├── product/
│   └── ...
└── videos/                   # Videos (copy from static/videos/)
```

## Setup Instructions

### 1. Export Data from Django

First, extract data from your Django database:

```bash
# From the Django project root
python manage.py shell < export_data.py
```

This will create JSON files in `static-site/data/`:
- `products.json` - All products with their images and specs
- `categories.json` - Product categories
- `blogs.json` - All published blog posts
- `blog-categories.json` - Blog categories

### 2. Copy Static Assets

Copy CSS, JavaScript, and images from the Django project:

```bash
# Copy CSS files
cp -r static/css/* static-site/css/

# Copy images
cp -r static/images/* static-site/images/

# Copy videos
cp -r static/videos/* static-site/videos/

# Copy existing JavaScript
cp static/js/cursor.js static-site/js/
```

### 3. Deploy

The static site is now ready to deploy. You can:

**Option A: Local Testing**
```bash
# Using Python's built-in server
cd static-site
python -m http.server 8000
# Visit http://localhost:8000
```

**Option B: Deploy to a Static Hosting**
- Upload the entire `static-site/` folder to:
  - Netlify
  - Vercel
  - GitHub Pages
  - AWS S3 + CloudFront
  - Any web server (Apache, Nginx, etc.)

## Key Features

### No Django Tags
- All `{% url %}`, `{% static %}`, `{% for %}` tags removed
- Pure HTML with static paths
- All images reference `/static/...` paths

### Dynamic Content via JSON
- Products and blogs loaded from JSON files
- JavaScript renders content dynamically
- Easy to update: just update the JSON files

### Same Design & Animations
- All CSS animations preserved
- Hero carousel, product sliders working
- Parallax effects maintained
- IntersectionObserver animations intact

### Fully Responsive
- Mobile-first design
- Bootstrap 5 grid system
- Touch-friendly navigation

## Updating Content

### Adding a New Product
1. Edit `data/products.json`
2. Add a new product object:
```json
{
  "id": 7,
  "name": "New Product Name",
  "slug": "new-product-name",
  "category": "Category Name",
  "short_description": "...",
  "description": "...",
  "main_image": "/static/images/products/product.webp",
  "is_featured": true,
  ...
}
```
3. Images should be copied to `/static/images/products/`

### Adding a New Blog Post
1. Edit `data/blogs.json`
2. Add a new blog object with content in HTML format
3. Featured image should be in `/static/images/blog/`

## Image Optimization

All images use WebP format with fallbacks. To optimize:
```bash
# Convert images to WebP
cwebp input.jpg -o output.webp
```

## Performance

- Fully static = fast load times
- No server-side rendering
- JSON files cached in JavaScript
- Images optimized and cached by browser

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Notes

- Product details and blog articles are loaded via JavaScript
- Each page has no external dependencies except Bootstrap and FontAwesome
- The site works completely offline (except video playback from external URLs)
- URLs are clean and SEO-friendly

## Troubleshooting

**Products/Blogs not showing?**
- Check browser console for errors
- Ensure `data/*.json` files are being loaded (check Network tab)
- Verify image paths are correct

**Images not loading?**
- Check that `/static/images/` folder exists
- Verify image paths in JSON files use `/static/...`

**Styling looks broken?**
- Ensure CSS files are copied to `/static/css/`
- Check that font files are available

## Future Enhancements

- Add search functionality
- Implement lazy loading for images
- Add service worker for offline support
- Add PWA manifest for mobile app-like experience
- Implement contact form submission handler
