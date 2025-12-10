from django.contrib import admin
from .models import ContactInquiry

@admin.register(ContactInquiry)
class ContactInquiryAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'phone', 'country', 'product_interest', 'is_read', 'is_contacted', 'created_at']
    list_editable = ['is_read', 'is_contacted']
    list_filter = ['is_read', 'is_contacted', 'country', 'created_at']
    search_fields = ['name', 'email', 'phone', 'company', 'message']
    date_hierarchy = 'created_at'
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Contact Information', {
            'fields': ('name', 'company', 'email', 'phone', 'country')
        }),
        ('Inquiry Details', {
            'fields': ('product_interest', 'quantity', 'message')
        }),
        ('Status & Notes', {
            'fields': ('is_read', 'is_contacted', 'notes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

