import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { logger } from '../utils/logger';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
});

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
    h2 { font-size: 22px; color: #0f0f0f; margin-bottom: 16px; font-weight: 400; letter-spacing: 0.05em; }
    p { font-size: 15px; color: #3a3a3a; line-height: 1.8; margin-bottom: 16px; font-family: sans-serif; }
    .btn { display: inline-block; background: #c9a96e; color: #0f0f0f; padding: 14px 36px; text-decoration: none; font-family: sans-serif; font-size: 13px; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 500; margin: 16px 0; }
    .divider { border: none; border-top: 1px solid #e8e0d5; margin: 32px 0; }
    .order-table { width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 14px; }
    .order-table th { background: #f5f0eb; padding: 10px 12px; text-align: left; color: #6a6a6a; font-weight: 500; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; }
    .order-table td { padding: 12px; border-bottom: 1px solid #f0ebe3; color: #2a2a2a; }
    .total-row td { font-weight: 600; color: #0f0f0f; border-bottom: none; }
    .status-badge { display: inline-block; padding: 4px 12px; background: #f0ebe3; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #6a6a6a; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo">LUXORA</div>
      <div class="tagline">Luxury Home Décor</div>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      <p>LUXORA — Premium Decorative Items & Home Décor</p>
      <p>© ${new Date().getFullYear()} Luxora. All rights reserved.</p>
      <p style="margin-top:8px;color:#3a3a3a;">hello@luxora.in · +91 98765 43210</p>
    </div>
  </div>
</body>
</html>
`;

// ─── VERIFICATION EMAIL ───────────────────────────────────────────────────────

export async function sendVerificationEmail(email: string, firstName: string, token: string) {
  const link = `${env.FRONTEND_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to: email,
    subject: 'Verify your LUXORA account',
    html: baseTemplate(`
      <h2>Welcome to LUXORA, ${firstName}</h2>
      <p>Thank you for creating your account. Please verify your email address to access the full LUXORA experience.</p>
      <div style="text-align:center;margin:32px 0">
        <a href="${link}" class="btn">Verify Email Address</a>
      </div>
      <p style="font-size:13px;color:#8a8a8a">This link expires in 24 hours. If you did not create a LUXORA account, you can safely ignore this email.</p>
    `),
  });

  logger.info(`Verification email sent to ${email}`);
}

// ─── PASSWORD RESET EMAIL ─────────────────────────────────────────────────────

export async function sendPasswordResetEmail(email: string, firstName: string, token: string) {
  const link = `${env.FRONTEND_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to: email,
    subject: 'Reset your LUXORA password',
    html: baseTemplate(`
      <h2>Password Reset</h2>
      <p>Hello ${firstName},</p>
      <p>We received a request to reset your LUXORA account password. Click below to set a new password.</p>
      <div style="text-align:center;margin:32px 0">
        <a href="${link}" class="btn">Reset Password</a>
      </div>
      <p style="font-size:13px;color:#8a8a8a">This link expires in 1 hour. If you did not request a password reset, please ignore this email. Your password will not be changed.</p>
    `),
  });
}

// ─── ORDER CONFIRMATION EMAIL ─────────────────────────────────────────────────

export async function sendOrderConfirmationEmail(email: string, firstName: string, order: any) {
  const itemRows = order.items.map((item: any) => `
    <tr>
      <td>${item.productName}</td>
      <td style="text-align:center">${item.quantity}</td>
      <td style="text-align:right">₹${Number(item.totalPrice).toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to: email,
    subject: `Order Confirmed — ${order.orderNumber}`,
    html: baseTemplate(`
      <h2>Order Confirmed</h2>
      <p>Hello ${firstName},</p>
      <p>Your LUXORA order has been confirmed and is being prepared with care.</p>
      <hr class="divider">
      <p><strong style="font-family:sans-serif;font-size:12px;letter-spacing:.1em;text-transform:uppercase">Order Number</strong><br>
        <span style="font-size:18px;color:#c9a96e;font-family:sans-serif">${order.orderNumber}</span>
      </p>
      <table class="order-table" style="margin-top:24px">
        <thead>
          <tr>
            <th>Item</th>
            <th style="text-align:center">Qty</th>
            <th style="text-align:right">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
          <tr class="total-row">
            <td colspan="2">Shipping</td>
            <td style="text-align:right">${Number(order.shippingCost) === 0 ? 'Free' : '₹' + Number(order.shippingCost)}</td>
          </tr>
          <tr class="total-row" style="background:#f5f0eb">
            <td colspan="2"><strong>Total</strong></td>
            <td style="text-align:right"><strong>₹${Number(order.totalAmount).toLocaleString('en-IN')}</strong></td>
          </tr>
        </tbody>
      </table>
      <hr class="divider">
      <div style="text-align:center">
        <a href="${env.FRONTEND_URL}/dashboard/orders/${order.id}" class="btn">Track Your Order</a>
      </div>
    `),
  });
}
