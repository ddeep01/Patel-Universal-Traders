from django import forms
from .models import ContactInquiry

class ContactForm(forms.ModelForm):
    """Contact form with all required fields"""
    
    class Meta:
        model = ContactInquiry
        fields = ['name', 'company', 'email', 'phone', 'country', 'product_interest', 'quantity', 'message']
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-control retro-field',
                'placeholder': 'Your Full Name *',
                'required': True
            }),
            'company': forms.TextInput(attrs={
                'class': 'form-control retro-field',
                'placeholder': 'Company Name (Optional)'
            }),
            'email': forms.EmailInput(attrs={
                'class': 'form-control retro-field',
                'placeholder': 'Email Address *',
                'required': True
            }),
            'phone': forms.TextInput(attrs={
                'class': 'form-control retro-field',
                'placeholder': 'Phone Number with Country Code *',
                'required': True
            }),
            'country': forms.TextInput(attrs={
                'class': 'form-control retro-field',
                'placeholder': 'Country *',
                'required': True
            }),
            'product_interest': forms.TextInput(attrs={
                'class': 'form-control retro-field',
                'placeholder': 'Product Interest (e.g., 1121 Basmati Rice)'
            }),
            'quantity': forms.TextInput(attrs={
                'class': 'form-control retro-field',
                'placeholder': 'Quantity Required (e.g., 100 MT)'
            }),
            'message': forms.Textarea(attrs={
                'class': 'form-control retro-field retro-textarea',
                'placeholder': 'Your Message *',
                'rows': 5,
                'required': True
            }),
        }
        labels = {
            'name': 'Full Name',
            'company': 'Company Name',
            'email': 'Email Address',
            'phone': 'Phone Number',
            'country': 'Country',
            'product_interest': 'Product Interest',
            'quantity': 'Quantity Required',
            'message': 'Message',
        }
