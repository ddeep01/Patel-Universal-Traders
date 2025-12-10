from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView

# Main pages views
def home_view(request):
    from products.models import Product
    from blog.models import BlogPost
    from django.shortcuts import render
    
    featured_products = Product.objects.filter(is_active=True, is_featured=True)[:6]
    latest_posts = BlogPost.objects.filter(is_published=True)[:3]
    
    context = {
        'featured_products': featured_products,
        'latest_posts': latest_posts,
        'page_title': 'Patel Universal Traders PVT.LTD. - Trusted Rice Exporters from India',
        'meta_description': 'Patel Universal Traders PVT.LTD. is a leading exporter of premium Basmati, Non-Basmati, and Organic rice from India. Supplying quality rice worldwide with certified excellence.',
        'meta_keywords': 'rice exporters India, basmati rice exporters, 1121 basmati rice, premium rice suppliers, organic rice India',
    }
    return render(request, 'home.html', context)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Main pages
    path('', home_view, name='home'),
    path('about/', TemplateView.as_view(template_name="about.html"), name='about'),
    path('careers/', TemplateView.as_view(template_name="careers.html"), name='careers'),
    path('quality/', TemplateView.as_view(template_name="quality.html"), name='quality'),
    path('privacy/', TemplateView.as_view(template_name="privacy.html"), name='privacy'),
    path('terms/', TemplateView.as_view(template_name="terms.html"), name='terms'),

    # Apps
    path('products/', include('products.urls')),
    path('blog/', include('blog.urls')),
    path('contact/', include('contact.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Customize admin site
admin.site.site_header = "Patel Universal Traders PVT.LTD. Administration"
admin.site.site_title = "Patel Universal Traders PVT.LTD. Admin"
admin.site.index_title = "Welcome to Patel Universal Traders PVT.LTD. Admin Panel"

