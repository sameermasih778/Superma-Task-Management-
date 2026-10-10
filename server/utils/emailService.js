const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');
const { sendMail } = require('../config/mailer');

dotenv.config({ path: path.join(__dirname, '../.env') });

/**
 * Send OTP Verification Email via Nodemailer Gmail SMTP
 * Fallback to Node console log in dev mode if credentials aren't set yet.
 *
 * Uses the shared pooled transporter (config/mailer) so the SMTP handshake is
 * paid once per process instead of on every verification email.
 */
async function sendOtpEmail(toEmail, otpCode) {
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    const mailOptions = {
      from: `"Suprema OS" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: `🔑 ${otpCode} is your Suprema Email Verification Code`,
      html: `
          <div style="font-family: Arial, sans-serif; background-color: #09090b; color: #ffffff; padding: 40px 20px;">
            <div style="max-width: 480px; margin: 0 auto; background-color: #18181b; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 32px; text-align: center;">
              <h2 style="color: #ffffff; margin-bottom: 8px; font-size: 24px; font-weight: 800;">Suprema OS Security</h2>
              <p style="color: #a1a1aa; font-size: 14px; margin-bottom: 24px;">Please enter the 6-digit verification code below to verify your email address and activate your account:</p>
              
              <div style="background-color: #000000; border: 1px solid #6366f1; border-radius: 14px; padding: 18px; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #818cf8; margin-bottom: 24px;">
                ${otpCode}
              </div>

              <p style="color: #71717a; font-size: 12px; margin-bottom: 0;">This code is valid for 10 minutes. If you did not request this code, please ignore this email.</p>
            </div>
          </div>
        `
    };

    const result = await sendMail(mailOptions);
    if (result.sent) {
      console.log(`✉️ [Nodemailer] OTP email successfully sent to ${toEmail}`);
      return { sent: true };
    }

    console.log(`🔑 [DEV FALLBACK OTP CODE] Email: ${toEmail} | Code: ${otpCode}`);
    return { sent: false, devCode: otpCode, error: result.error };
  } else {
    console.log(`\n======================================================`);
    console.log(`📧 [SUPREMA OTP VERIFICATION CODE]`);
    console.log(`   To Email: ${toEmail}`);
    console.log(`   OTP Code: ${otpCode}`);
    console.log(`   (Configure SMTP_USER & SMTP_PASS in server/.env to send real emails)`);
    console.log(`======================================================\n`);
    return { sent: false, isDevMode: true, devCode: otpCode };
  }
}

module.exports = { sendOtpEmail };
