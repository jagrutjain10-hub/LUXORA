// ─── LUXORA UPI PAYMENT CONFIGURATION ────────────────────────────────────────
// Edit this file to update UPI details across the entire platform

export const UPI_CONFIG = {
  upiId: 'jagrutjain10@okaxis',
  businessName: 'LUXORA',
  // Place your QR code image at: public/images/upi-qr.png
  qrCodeUrl: '/images/upi-qr.png',
  instructions: [
    'Open GPay, PhonePe, Paytm or any UPI app',
    'Scan the QR code or search UPI ID above',
    'Complete the payment for the exact amount shown',
    'Take a screenshot of the successful payment',
    'Upload the screenshot below and submit your order',
  ],
};
