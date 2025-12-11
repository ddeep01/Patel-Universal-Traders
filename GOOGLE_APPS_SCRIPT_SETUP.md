# Google Apps Script Setup for Contact Form

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Patel Universal Traders - Contact Form Submissions"
4. Add the following column headers in Row 1:
   - A1: Timestamp
   - B1: Name
   - C1: Company
   - D1: Email
   - E1: Phone
   - F1: Country
   - G1: Product Interest
   - H1: Quantity
   - I1: Message

## Step 2: Create Google Apps Script

1. In your Google Sheet, click **Extensions** > **Apps Script**
2. Delete any code in the editor
3. Paste the following code:

```javascript
// Configuration - UPDATE THESE VALUES
const CONFIG = {
  OWNER_EMAIL: 'your-email@example.com', // Your email address
  OWNER_WHATSAPP: '+919876543210', // Your WhatsApp number with country code
  CUSTOMER_REPLY_EMAIL: 'info@primeimpex.com', // Reply-to email for customers
  COMPANY_NAME: 'Patel Universal Traders PVT.LTD.'
};

function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Add data to sheet
    sheet.appendRow([
      new Date(),
      data.name,
      data.company,
      data.email,
      data.phone,
      data.country,
      data.product_interest,
      data.quantity,
      data.message
    ]);
    
    // Send email to owner
    sendOwnerNotification(data);
    
    // Send confirmation email to customer
    sendCustomerConfirmation(data);
    
    // Send WhatsApp notification (using a third-party API)
    // You'll need to integrate with a WhatsApp Business API provider
    // Example providers: Twilio, MessageBird, WhatsApp Business API
    sendWhatsAppNotification(data);
    
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'Form submitted successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function sendOwnerNotification(data) {
  const subject = `New Contact Form Submission from ${data.name}`;
  
  const body = `
    New inquiry received from ${CONFIG.COMPANY_NAME} website:
    
    Name: ${data.name}
    Company: ${data.company}
    Email: ${data.email}
    Phone: ${data.phone}
    Country: ${data.country}
    Product Interest: ${data.product_interest}
    Quantity: ${data.quantity}
    
    Message:
    ${data.message}
    
    Submitted at: ${new Date().toLocaleString()}
  `;
  
  MailApp.sendEmail({
    to: CONFIG.OWNER_EMAIL,
    subject: subject,
    body: body,
    replyTo: data.email
  });
}

function sendCustomerConfirmation(data) {
  const subject = `Thank you for contacting ${CONFIG.COMPANY_NAME}`;
  
  const body = `
    Dear ${data.name},
    
    Thank you for your inquiry. We have received your message and will get back to you within 24 hours.
    
    Your Inquiry Details:
    Company: ${data.company}
    Product Interest: ${data.product_interest}
    Quantity: ${data.quantity}
    
    Message:
    ${data.message}
    
    If you have any urgent questions, please contact us directly at:
    Email: ${CONFIG.CUSTOMER_REPLY_EMAIL}
    Phone: ${CONFIG.OWNER_WHATSAPP}
    
    Best regards,
    ${CONFIG.COMPANY_NAME}
    India's Premier Rice & Spices Exporter
  `;
  
  MailApp.sendEmail({
    to: data.email,
    subject: subject,
    body: body,
    replyTo: CONFIG.CUSTOMER_REPLY_EMAIL
  });
}

function sendWhatsAppNotification(data) {
  // For WhatsApp integration, you need to use a third-party service
  // Option 1: Twilio WhatsApp API
  // Option 2: MessageBird WhatsApp API
  // Option 3: WhatsApp Business API (Official)
  
  // Example using Twilio (you'll need to set up a Twilio account):
  /*
  const TWILIO_ACCOUNT_SID = 'your_account_sid';
  const TWILIO_AUTH_TOKEN = 'your_auth_token';
  const TWILIO_WHATSAPP_NUMBER = 'whatsapp:+14155238886'; // Twilio Sandbox number
  
  const message = `New inquiry from ${data.name} (${data.company})\nProduct: ${data.product_interest}\nEmail: ${data.email}`;
  
  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
  
  const payload = {
    'From': TWILIO_WHATSAPP_NUMBER,
    'To': `whatsapp:${CONFIG.OWNER_WHATSAPP}`,
    'Body': message
  };
  
  const options = {
    'method': 'post',
    'payload': payload,
    'headers': {
      'Authorization': 'Basic ' + Utilities.base64Encode(TWILIO_ACCOUNT_SID + ':' + TWILIO_AUTH_TOKEN)
    }
  };
  
  try {
    UrlFetchApp.fetch(url, options);
  } catch (error) {
    Logger.log('WhatsApp notification error: ' + error.toString());
  }
  */
  
  Logger.log('WhatsApp notification would be sent for: ' + data.name);
}

// Test function to verify setup
function testSetup() {
  const testData = {
    name: 'Test User',
    company: 'Test Company',
    email: 'test@example.com',
    phone: '+1234567890',
    country: 'Test Country',
    product_interest: 'Basmati Rice',
    quantity: '100 MT',
    message: 'This is a test message'
  };
  
  sendOwnerNotification(testData);
  sendCustomerConfirmation(testData);
  
  Logger.log('Test emails sent successfully');
}
```

## Step 3: Deploy as Web App

1. Click **Deploy** > **New deployment**
2. Click the gear icon next to "Select type" and choose **Web app**
3. Fill in the details:
   - **Description**: Contact Form Handler
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click **Deploy**
5. **Copy the Web App URL** - you'll need this for your contact form

## Step 4: Update Contact Form

1. Open `static-site/pages/contact.html`
2. Find this line near the top of the JavaScript section:
   ```javascript
   const SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
   ```
3. Replace `'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE'` with your actual Web App URL from Step 3

## Step 5: Configure Email Settings

1. In the Apps Script, update the CONFIG object:
   ```javascript
   const CONFIG = {
     OWNER_EMAIL: 'your-actual-email@example.com',
     OWNER_WHATSAPP: '+919876543210', // Your actual WhatsApp number
     CUSTOMER_REPLY_EMAIL: 'info@primeimpex.com',
     COMPANY_NAME: 'Patel Universal Traders PVT.LTD.'
   };
   ```

## Step 6: Test the Form

1. Open your contact page in a browser
2. Fill out and submit the form
3. Check:
   - ✅ Data appears in your Google Sheet
   - ✅ You receive an email notification
   - ✅ Customer receives a confirmation email

## Optional: WhatsApp Integration

To enable WhatsApp notifications, you can use one of these services:

### Option 1: Twilio (Recommended)
1. Sign up at [Twilio](https://www.twilio.com)
2. Get WhatsApp Business API access
3. Update the `sendWhatsAppNotification` function with your Twilio credentials

### Option 2: MessageBird
1. Sign up at [MessageBird](https://messagebird.com)
2. Enable WhatsApp Business API
3. Use their API to send notifications

### Option 3: WhatsApp Business API (Official)
1. Apply for WhatsApp Business API access
2. Integrate with your Apps Script

## Troubleshooting

### Form not submitting
- Check browser console for errors
- Verify the Web App URL is correct
- Ensure the deployment is set to "Anyone" can access

### Emails not sending
- Check Apps Script execution log
- Verify email addresses in CONFIG
- Check Gmail spam folder

### CORS errors
- Make sure mode: 'no-cors' is set in the fetch request
- The script should still work even with CORS errors

## Security Notes

- The form uses client-side validation
- All data is sent over HTTPS
- Consider adding reCAPTCHA for spam protection
- Keep your Apps Script URL private
- Regularly backup your Google Sheet data
