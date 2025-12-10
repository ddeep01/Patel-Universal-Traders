from django.db import models
from django.utils.text import slugify

class ProductCategory(models.Model):
    """Categories for products: Basmati, Non-Basmati, Organic"""
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    order = models.IntegerField(default=0, help_text="Display order")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Product Categories"
        ordering = ['order', 'name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Product(models.Model):
    """Rice products with detailed specifications"""
    
    # Basic Info
    name = models.CharField(max_length=200, help_text="e.g., 1121 Basmati Rice")
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    category = models.ForeignKey(ProductCategory, on_delete=models.CASCADE, related_name='products')
    short_description = models.CharField(max_length=300, help_text="Brief tagline")
    description = models.TextField(help_text="Detailed product description")
    
    # Images
    main_image = models.ImageField(upload_to='products/', help_text="Main product image")
    image_2 = models.ImageField(upload_to='products/', blank=True, null=True)
    image_3 = models.ImageField(upload_to='products/', blank=True, null=True)
    
    # Specifications
    grain_length = models.CharField(max_length=50, blank=True, help_text="e.g., 8.3mm")
    purity = models.CharField(max_length=50, blank=True, help_text="e.g., 95%")
    moisture = models.CharField(max_length=50, blank=True, help_text="e.g., 12%")
    broken_grains = models.CharField(max_length=50, blank=True, help_text="e.g., 1%")
    packaging_options = models.TextField(blank=True, help_text="e.g., 1kg, 5kg, 10kg, 25kg bags")
    
    # Additional Specs (JSON-like field)
    additional_specs = models.TextField(blank=True, help_text="Other specifications, one per line")

    # Spec sheet file (PDF) that can be uploaded via admin for each product
    spec_sheet = models.FileField(upload_to='spec-sheets/', blank=True, null=True, help_text="Upload product spec sheet PDF")
    
    # SEO
    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.CharField(max_length=300, blank=True)
    meta_keywords = models.CharField(max_length=300, blank=True)
    
    # Status
    is_featured = models.BooleanField(default=False, help_text="Show on homepage")
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0, help_text="Display order")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        if not self.meta_title:
            self.meta_title = f"{self.name} - Patel Universal Traders PVT.LTD."
        if not self.meta_description:
            self.meta_description = self.short_description
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    def get_specifications(self):
        """Returns a dict of specifications"""
        specs = {}
        if self.grain_length:
            specs['Grain Length'] = self.grain_length
        if self.purity:
            specs['Purity'] = self.purity
        if self.moisture:
            specs['Moisture'] = self.moisture
        if self.broken_grains:
            specs['Broken Grains'] = self.broken_grains
        if self.packaging_options:
            specs['Packaging'] = self.packaging_options
        return specs
