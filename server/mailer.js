import nodemailer from 'nodemailer';

// Configure SMTP transporter
// For production, set SMTP_USER and SMTP_PASS environment variables
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER || 'noreply@example.com',
        pass: process.env.SMTP_PASS || 'app-password-here',
    },
});

export async function sendOTPEmail(toEmail, otp) {
    const mailOptions = {
        from: `"Indotech Transformers" <${process.env.SMTP_USER || 'noreply@example.com'}>`,
        to: toEmail,
        subject: 'Password Reset OTP - Indotech Transformers',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0a0a0f; color: #e0e0e0; border-radius: 12px; border: 1px solid #00d4ff33;">
        <h2 style="color: #00d4ff; text-align: center; margin-bottom: 8px;">🔐 Password Reset</h2>
        <p style="text-align: center; color: #888;">Indotech Transformers Ltd</p>
        <div style="text-align: center; margin: 32px 0;">
          <div style="display: inline-block; padding: 16px 48px; background: #1a1a2e; border: 2px solid #00d4ff; border-radius: 8px; font-size: 32px; letter-spacing: 8px; color: #00d4ff; font-weight: bold;">
            ${otp}
          </div>
        </div>
        <p style="text-align: center; color: #888; font-size: 14px;">This OTP expires in 10 minutes.<br/>Do not share this code with anyone.</p>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`📧 OTP email sent to ${toEmail}`);
        return true;
    } catch (error) {
        console.error('❌ Email send failed:', error.message);
        console.log(`📧 [FALLBACK] OTP for password reset: ${otp}`);
        return false;
    }
}
