from django.shortcuts import render, get_object_or_404
from django.db.models import Q
from .models import Product, ProductCategory
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

def product_list(request):
    """Display all products with category filtering"""
    category_slug = request.GET.get('category', None)
    search_query = request.GET.get('q', None)
    
    products = Product.objects.filter(is_active=True)
    categories = ProductCategory.objects.filter(is_active=True)
    selected_category = None
    
    if category_slug:
        selected_category = get_object_or_404(ProductCategory, slug=category_slug)
        products = products.filter(category=selected_category)
    
    if search_query:
        products = products.filter(
            Q(name__icontains=search_query) | 
            Q(description__icontains=search_query)
        )
    
    # paginate products: 9 per page
    paginator = Paginator(products, 9)
    page = request.GET.get('page', 1)
    try:
        products_page = paginator.page(page)
    except PageNotAnInteger:
        products_page = paginator.page(1)
    except EmptyPage:
        products_page = paginator.page(paginator.num_pages)

    context = {
        'products': products_page.object_list,
        'page_obj': products_page,
        'paginator': paginator,
        'categories': categories,
        'selected_category': selected_category,
        'search_query': search_query,
        'page_title': 'Our Products - Premium Rice Exporters',
        'meta_description': 'Explore our premium range of Basmati, Non-Basmati, and Organic rice. Quality guaranteed from India to the world.',
    }
    return render(request, 'products/product_list.html', context)


def product_detail(request, slug):
    """Display detailed product information"""
    product = get_object_or_404(Product, slug=slug, is_active=True)
    related_products = Product.objects.filter(
        category=product.category, 
        is_active=True
    ).exclude(id=product.id)[:3]
    
    context = {
        'product': product,
        'related_products': related_products,
        'page_title': product.meta_title,
        'meta_description': product.meta_description,
        'meta_keywords': product.meta_keywords,
    }
    return render(request, 'products/product_detail.html', context)
