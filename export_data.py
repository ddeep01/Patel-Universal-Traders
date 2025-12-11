#!/usr/bin/env python
"""
Export Django data to JSON files for static site generation
Run: python manage.py shell < export_data.py
OR: python export_data.py
"""

import json
import os
import django
from datetime import datetime
from pathlib import Path

# Setup Django if running standalone
if __name__ == '__main__':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'prime_impex.settings')
    django.setup()

from products.models import Product, ProductCategory
from blog.models import BlogPost, BlogCategory

def export_products():
    """Export all active products to JSON"""
    categories = ProductCategory.objects.filter(is_active=True)
    products = Product.objects.filter(is_active=True)
    
    categories_data = []
    for cat in categories:
        categories_data.append({
            "id": cat.id,
            "name": cat.name,
            "slug": cat.slug,
            "description": cat.description,
            "image": cat.image.url if cat.image else "",
            "order": cat.order
        })
    
    products_data = []
    for prod in products:
        images = [prod.main_image.url if prod.main_image else ""]
        if prod.image_2:
            images.append(prod.image_2.url)
        if prod.image_3:
            images.append(prod.image_3.url)
        
        products_data.append({
            "id": prod.id,
            "name": prod.name,
            "slug": prod.slug,
            "category_id": prod.category_id,
            "category": prod.category.name if prod.category else "",
            "short_description": prod.short_description,
            "description": prod.description,
            "images": images,
            "main_image": prod.main_image.url if prod.main_image else "",
            "grain_length": prod.grain_length,
            "purity": prod.purity,
            "moisture": prod.moisture,
            "broken_grains": prod.broken_grains,
            "packaging_options": prod.packaging_options,
            "additional_specs": prod.additional_specs,
            "spec_sheet": prod.spec_sheet.url if prod.spec_sheet else "",
            "meta_title": prod.meta_title,
            "meta_description": prod.meta_description,
            "meta_keywords": prod.meta_keywords,
            "is_featured": prod.is_featured,
            "order": prod.order
        })
    
    # Export categories
    with open('static-site/data/categories.json', 'w', encoding='utf-8') as f:
        json.dump(categories_data, f, indent=2, ensure_ascii=False)
    
    # Export products
    with open('static-site/data/products.json', 'w', encoding='utf-8') as f:
        json.dump(products_data, f, indent=2, ensure_ascii=False)
    
    print(f"✓ Exported {len(categories_data)} categories")
    print(f"✓ Exported {len(products_data)} products")

def export_blogs():
    """Export all published blog posts to JSON"""
    categories = BlogCategory.objects.all()
    posts = BlogPost.objects.filter(is_published=True)
    
    categories_data = []
    for cat in categories:
        categories_data.append({
            "id": cat.id,
            "name": cat.name,
            "slug": cat.slug,
            "description": cat.description
        })
    
    posts_data = []
    for post in posts:
        posts_data.append({
            "id": post.id,
            "title": post.title,
            "slug": post.slug,
            "category_id": post.category_id,
            "category": post.category.name if post.category else "",
            "author": post.author.get_full_name() if post.author else "Admin",
            "excerpt": post.excerpt,
            "content": post.content,
            "featured_image": post.featured_image.url if post.featured_image else "",
            "meta_title": post.meta_title,
            "meta_description": post.meta_description,
            "meta_keywords": post.meta_keywords,
            "is_featured": post.is_featured,
            "publish_date": post.publish_date.isoformat() if post.publish_date else "",
            "created_at": post.created_at.isoformat(),
            "updated_at": post.updated_at.isoformat(),
            "views_count": post.views_count
        })
    
    # Export blog categories
    with open('static-site/data/blog-categories.json', 'w', encoding='utf-8') as f:
        json.dump(categories_data, f, indent=2, ensure_ascii=False)
    
    # Export blog posts
    with open('static-site/data/blogs.json', 'w', encoding='utf-8') as f:
        json.dump(posts_data, f, indent=2, ensure_ascii=False)
    
    print(f"✓ Exported {len(categories_data)} blog categories")
    print(f"✓ Exported {len(posts_data)} blog posts")

if __name__ == '__main__':
    # Create data directory if it doesn't exist
    Path('static-site/data').mkdir(parents=True, exist_ok=True)
    
    try:
        export_products()
        export_blogs()
        print("\n✓ All data exported successfully!")
    except Exception as e:
        print(f"✗ Error exporting data: {e}")
        import traceback
        traceback.print_exc()
