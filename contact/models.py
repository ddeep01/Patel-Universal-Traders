from django.db import models

class ContactInquiry(models.Model):
    """Store contact form submissions"""
    
    # Contact Information
    name = models.CharField(max_length=100)
    company = models.CharField(max_length=200, blank=True)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    country = models.CharField(max_length=100)
    
    # Inquiry Details
    product_interest = models.CharField(max_length=200, blank=True, help_text="Product they're interested in")
    quantity = models.CharField(max_length=100, blank=True)
    message = models.TextField()
    
    # Status
    is_read = models.BooleanField(default=False)
    is_contacted = models.BooleanField(default=False)
    notes = models.TextField(blank=True, help_text="Admin notes")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = "Contact Inquiries"
    
    def __str__(self):
        return f"{self.name} - {self.email} ({self.created_at.strftime('%Y-%m-%d')})"

