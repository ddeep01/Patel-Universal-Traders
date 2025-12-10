from django.shortcuts import render, redirect
from django.contrib import messages
from django.core.mail import send_mail, EmailMessage
from django.conf import settings
from django.template.loader import render_to_string
from .forms import ContactForm
from .models import ContactInquiry
import os

def send_whatsapp_notification(inquiry):
    """Send WhatsApp notification using Twilio (optional)"""
    try:
        # Only import if Twilio is configured
        if hasattr(settings, 'TWILIO_ACCOUNT_SID') and settings.TWILIO_ACCOUNT_SID:
            from twilio.rest import Client
            
            client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
            
            message_body = f"""
🔔 New Inquiry - Prime Impex

👤 Name: {inquiry.name}
🏢 Company: {inquiry.company or 'N/A'}
📧 Email: {inquiry.email}
📱 Phone: {inquiry.phone}
🌍 Country: {inquiry.country}
📦 Product: {inquiry.product_interest or 'N/A'}
📊 Quantity: {inquiry.quantity or 'N/A'}

💬 Message: {inquiry.message[:100]}...
            """
            
            message = client.messages.create(
                from_=f'whatsapp:{settings.TWILIO_WHATSAPP_FROM}',
                body=message_body,
                to=f'whatsapp:{settings.TWILIO_WHATSAPP_TO}'
            )
            return True
    except Exception as e:
        print(f"WhatsApp notification failed: {e}")
        return False


def contact_view(request):
    """Handle contact form submission with email and WhatsApp"""
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            inquiry = form.save()
            
            # Send email notification to admin
            try:
                subject = f'New Inquiry from {inquiry.name} - Prime Impex'
                
                # HTML email content
                html_content = f"""
                <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                        <h2 style="color: #2c5f2d; border-bottom: 2px solid #2c5f2d; padding-bottom: 10px;">
                            🔔 New Contact Inquiry
                        </h2>
                        
                        <h3>Contact Information:</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px; font-weight: bold; width: 150px;">Name:</td>
                                <td style="padding: 8px;">{inquiry.name}</td>
                            </tr>
                            <tr style="background-color: #f9f9f9;">
                                <td style="padding: 8px; font-weight: bold;">Company:</td>
                                <td style="padding: 8px;">{inquiry.company or 'N/A'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; font-weight: bold;">Email:</td>
                                <td style="padding: 8px;"><a href="mailto:{inquiry.email}">{inquiry.email}</a></td>
                            </tr>
                            <tr style="background-color: #f9f9f9;">
                                <td style="padding: 8px; font-weight: bold;">Phone:</td>
                                <td style="padding: 8px;">{inquiry.phone}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; font-weight: bold;">Country:</td>
                                <td style="padding: 8px;">{inquiry.country}</td>
                            </tr>
                        </table>
                        
                        <h3 style="margin-top: 20px;">Inquiry Details:</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr style="background-color: #f9f9f9;">
                                <td style="padding: 8px; font-weight: bold; width: 150px;">Product Interest:</td>
                                <td style="padding: 8px;">{inquiry.product_interest or 'N/A'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; font-weight: bold;">Quantity:</td>
                                <td style="padding: 8px;">{inquiry.quantity or 'N/A'}</td>
                            </tr>
                        </table>
                        
                        <h3 style="margin-top: 20px;">Message:</h3>
                        <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #2c5f2d; border-radius: 3px;">
                            {inquiry.message}
                        </div>
                        
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666;">
                            <p>Received on: {inquiry.created_at.strftime('%B %d, %Y at %I:%M %p')}</p>
                            <p style="font-size: 12px;">Prime Impex - Trusted Rice Exporters from India</p>
                        </div>
                    </div>
                </body>
                </html>
                """
                
                # Plain text version
                plain_content = f"""
New Contact Inquiry - Prime Impex

Contact Information:
- Name: {inquiry.name}
- Company: {inquiry.company or 'N/A'}
- Email: {inquiry.email}
- Phone: {inquiry.phone}
- Country: {inquiry.country}

Inquiry Details:
- Product Interest: {inquiry.product_interest or 'N/A'}
- Quantity: {inquiry.quantity or 'N/A'}

Message:
{inquiry.message}

Received on: {inquiry.created_at.strftime('%B %d, %Y at %I:%M %p')}
                """
                
                # Send email
                email = EmailMessage(
                    subject=subject,
                    body=plain_content,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to=[settings.CONTACT_EMAIL],
                    reply_to=[inquiry.email]
                )
                email.content_subtype = 'html'
                email.body = html_content
                email.send()
                
            except Exception as e:
                print(f"Email sending failed: {e}")
            
            # Send WhatsApp notification (if configured)
            send_whatsapp_notification(inquiry)
            
            # Success message
            messages.success(request, 'Thank you for contacting us! We will get back to you soon.')
            return redirect('contact:thank_you')
        else:
            messages.error(request, 'Please correct the errors below.')
    else:
        form = ContactForm()
    
    context = {
        'form': form,
        'page_title': 'Contact Us - Prime Impex | Rice Exporters',
        'meta_description': 'Get in touch with Prime Impex for premium rice export inquiries. We supply Basmati, Non-Basmati, and Organic rice worldwide.',
    }
    return render(request, 'contact/contact.html', context)


def thank_you_view(request):
    """Thank you page after form submission"""
    context = {
        'page_title': 'Thank You - Prime Impex',
    }
    return render(request, 'contact/thank_you.html', context)

