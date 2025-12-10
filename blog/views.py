from django.shortcuts import render, get_object_or_404
from django.core.paginator import Paginator
from django.utils import timezone
from .models import BlogPost, BlogCategory

def blog_list(request):
    """Display all published blog posts"""
    category_slug = request.GET.get('category', None)
    
    posts = BlogPost.objects.filter(is_published=True, publish_date__lte=timezone.now())
    categories = BlogCategory.objects.all()
    selected_category = None
    
    if category_slug:
        selected_category = get_object_or_404(BlogCategory, slug=category_slug)
        posts = posts.filter(category=selected_category)
    
    # Pagination
    paginator = Paginator(posts, 9)  # 9 posts per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'page_obj': page_obj,
        'categories': categories,
        'selected_category': selected_category,
        'page_title': 'Blog & Insights - Rice Export Industry News',
        'meta_description': 'Read the latest insights on rice exports, market trends, and industry updates from Prime Impex.',
    }
    return render(request, 'blog/blog_list.html', context)


def blog_detail(request, slug):
    """Display individual blog post"""
    post = get_object_or_404(BlogPost, slug=slug, is_published=True)
    
    # Increment view count
    post.increment_views()
    
    # Get related posts
    related_posts = BlogPost.objects.filter(
        is_published=True,
        category=post.category
    ).exclude(id=post.id)[:3]
    
    context = {
        'post': post,
        'related_posts': related_posts,
        'page_title': post.meta_title,
        'meta_description': post.meta_description,
        'meta_keywords': post.meta_keywords,
    }
    return render(request, 'blog/blog_detail.html', context)
