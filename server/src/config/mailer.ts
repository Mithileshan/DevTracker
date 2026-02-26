import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import { log } from '@/config/logger';

let transporter: Transporter;

/**
 * Initialize email transporter
 * Supports: Mailtrap (dev), SMTP (prod), or console (test)
 */
export function initializeMailer() {
  const env = process.env.NODE_ENV || 'development';

  if (env === 'production') {
    // Production: Use SendGrid or SMTP
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpHost || !smtpUser || !smtpPass) {
      log.warn('Production email config incomplete. Emails will fail.');
    }

    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    log.info('Mailer initialized (Production SMTP)');
  } else if (env === 'test') {
    // Test: Console logging
    transporter = nodemailer.createTransport({
      name: 'TestSMTP',
      host: 'localhost',
      port: 1025,
      secure: false,
    });
    log.info('Mailer initialized (Test/Console)');
  } else {
    // Development: Mailtrap
    const mailtrapUser = process.env.MAILTRAP_USER || '00000000000000';
    const mailtrapPass = process.env.MAILTRAP_PASS || 'your_mailtrap_token';

    transporter = nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: mailtrapUser,
        pass: mailtrapPass,
      },
    });

    log.info('Mailer initialized (Mailtrap - Development)');
  }
}

/**
 * Send email using configured transporter
 */
export async function sendEmail(options: SendMailOptions): Promise<any> {
  if (!transporter) {
    throw new Error('Mailer not initialized. Call initializeMailer() first.');
  }

  try {
    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@devtracker.app',
      ...options,
    });

    log.info(`Email sent to ${options.to}`, { messageId: result.messageId });
    return result;
  } catch (error) {
    log.error('Failed to send email', { to: options.to, error });
    throw error;
  }
}

/**
 * Send invite email
 */
export async function sendInviteEmail(
  toEmail: string,
  orgName: string,
  inviterName: string,
  inviteToken: string,
  inviteLink: string
): Promise<void> {
  const subject = `You've been invited to join ${orgName} on DevTracker`;
  
  const htmlContent = `
    <h2>Welcome to ${orgName}!</h2>
    <p>Hi there,</p>
    <p><strong>${inviterName}</strong> has invited you to join <strong>${orgName}</strong> on DevTracker X.</p>
    <p>Click the button below to accept the invitation:</p>
    <p>
      <a href="${inviteLink}" style="
        display: inline-block;
        padding: 12px 24px;
        margin: 20px 0;
        background-color: #2563eb;
        color: white;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
      ">
        Accept Invitation
      </a>
    </p>
    <p>Or copy this link: <code>${inviteLink}</code></p>
    <p>This invitation expires in 7 days.</p>
    <p>Best regards,<br/>DevTracker Team</p>
  `;

  const textContent = `
    Welcome to ${orgName}!
    
    ${inviterName} has invited you to join ${orgName} on DevTracker X.
    
    Accept: ${inviteLink}
    
    This invitation expires in 7 days.
  `;

  await sendEmail({
    to: toEmail,
    subject,
    html: htmlContent,
    text: textContent,
  });
}

export function getTransporter(): Transporter {
  if (!transporter) {
    throw new Error('Mailer not initialized');
  }
  return transporter;
}
