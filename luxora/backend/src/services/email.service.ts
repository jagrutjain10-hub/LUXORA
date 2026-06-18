import { TransactionalEmailsApi, SendSmtpEmail, TransactionalEmailsApiApiKeys } from '@getbrevo/brevo';
import { env } from '../config/env';
import { logger } from '../utils/logger';

const apiInstance = new TransactionalEmailsApi();
apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY || '');

const baseTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Georgia', serif; background: #f5f0eb; color: #1a1a1a; }
    .wrapper { max-width: 600px; margin: 40px auto; background: #fff; }
    .header { background: #0f0f0f; padding: 32px; text-align: center; }
    .logo { color: #c9a96e; font-size: 28px; letter-spacing: 0.3em; font-weight: 400; }
    .tagline { color: #8a7a6a; font-size: 11px; letter-spacing: 0.2em; margin-top: 6px; text-transform: uppercase; }
    .body { padding: 48px 40px; }
    .footer { background: #0f0f0f; padding: 24px 40px; text-align: center; }
    .footer p { color: #5a5a5a; font-size: 12px; line-height: 1.8; font-family: sans-serif; }
    h2 { font-size: 22px; color: #0f0f0f; margin-bottom: 16px; font-weight: 400; }
    p { font-size: 15px; color: #3a3a3a; line-height: 1.8; margin-bottom: 16px; font-family: sans-serif; }
    .btn { display: inline-block; background: #c9a96e; color: #0f0f0f; padding: 14px 36px; text-decoration: none; font-family: sans-serif; font-size: 13px; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 500; margin: 16px 0; }
    .divider { border: none; border-top: 1px solid #e8e0d5; margin: 32px 0; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo">LUXORA</div>
      <div class="tagline">Luxury Home Decor</div>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      <p>LUXORA - Premium Decorative Items & Home Decor</p>
      <p>© ${new Date().getFullYear()} Luxora. All rights reserved.</p>
      <p style="margin-top:8px;color:#3a3a3a;">hello@luxora.in</p>
    </div>
  </div>
</body>
</html>
`;

async function sendEmail(to: string, subject: string, html: string) {
  const sendSmtpEmail = new SendSmtpEmail();
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = html;
  sendSmtpEmail.sender = { name: 'LUXORA', email: 'luxora2010@gmail.com' };
  sendSmtpEmail.to = [{ email: to }];
  await apiInstance.sendTransacEmail(sendSmtpEmail);
}

export async function sendVerificationEmail(email: string, firstName: string, token: string) {
  const link = `${env.FRONTEND_URL}/verify-email?token=${token}`;
  await sendEmail(
    email,
    'Verify your LUXORA account',
    baseTemplate(`
      <h2>Welcome to LUXORA, ${firstName}</h2>
      <p>Thank you for creating your account. Please verify your email address to access the full LUXORA experience.</p>
      <div style="text-align:center;margin:32px 0">
        <a href="${link}" class="btn">Verify Email Address</a>
      </div>
      <p style="font-size:13px;color:#8a8a8a">This link expires in 24 hours. If you did not create a LUXORA account, you can safely ignore this email.</p>
    `)
  );
  logger.info(`Verification email sent to ${email}`);
}

export async function sendPasswordResetEmail(email: string, firstName: string, token: string) {
  const link = `${env.FRONTEND_URL}/reset-password?token=${token}`;
  await sendEmail(
    email,
    'Reset your LUXORA password',
    baseTemplate(`
      <h2>Password Reset</h2>
      <p>Hello ${firstName},</p>
      <p>We received a request to reset your LUXORA account password. Click below to set a new password.</p>
      <div style="text-align:center;margin:32px 0">
        <a href="${link}" class="btn">Reset Password</a>
      </div>
      <p style="font-size:13px;color:#8a8a8a">This link expires in 1 hour. If you did not request a password reset, please ignore this email.</p>
    `)
  );
}

export async function sendOrderConfirmationEmail(email: string, firstName: string, order: any) {
  const itemRows = order.items.map((item: any) => `
    <tr>
      <td style="padding:12px;border-bottom:1px solid #f0ebe3">${item.productName}</td>
      <td style="padding:12px;border-bottom:1px solid #f0ebe3;text-align:center">${item.quantity}</td>
      <td style="padding:12px;border-bottom:1px solid #f0ebe3;text-align:right">Rs.${Number(item.totalPrice).toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  await sendEmail(
    email,
    `Order Confirmed - ${order.orderNumber}`,
    baseTemplate(`
      <h2>Order Confirmed</h2>
      <p>Hello ${firstName},</p>
      <p>Your LUXORA order has been confirmed and is being prepared with care.</p>
      <hr class="divider">
      <p><strong>Order Number:</strong> ${order.orderNumber}</p>
      <table style="width:100%;border-collapse:collapse;margin-top:16px">
        <thead>
          <tr style="background:#f5f0eb">
            <th style="padding:10px 12px;text-align:left;font-size:12px">Item</th>
            <th style="padding:10px 12px;text-align:center;font-size:12px">Qty</th>
            <th style="padding:10px 12px;text-align:right;font-size:12px">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
          <tr>
            <td colspan="2" style="padding:12px;font-weight:600">Total</td>
            <td style="padding:12px;text-align:right;font-weight:600">Rs.${Number(order.totalAmount).toLocaleString('en-IN')}</td>
          </tr>
        </tbody>
      </table>
    `)
  );
}