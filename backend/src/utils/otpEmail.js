/**
 * Build the OTP verification email sent to a survey popup visitor.
 * `otp` is always server-generated digits, so there's nothing to escape here.
 */
const generateOtpEmail = ({ otp, expiryMinutes }) => {
  const styles = {
    outerDiv: 'background-color:#f4f6f8;margin:0;padding:24px;font-family:Arial,Helvetica,sans-serif;',
    wrapper: 'margin:0 auto;max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb;',
    header: 'background:linear-gradient(135deg,#1E40AF,#2563EB);color:#ffffff;padding:18px 24px;font-size:18px;font-weight:bold;',
    bodyCell: 'padding:24px;font-size:14px;line-height:1.6;color:#333333;',
    otpBox: 'margin:20px 0;padding:16px;background:#f7fafc;border:1px solid #e2e8f0;border-radius:6px;text-align:center;',
    otpText: 'font-size:30px;font-weight:bold;letter-spacing:7px;color:#1a202c;',
    footer: 'font-size:12px;color:#888888;text-align:center;border-top:1px solid #eeeeee;padding:14px 0;',
  };

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify your email address</title>
  </head>
  <body style="${styles.outerDiv}">
    <div style="${styles.wrapper}">
      <div style="${styles.header}">Verify your email address</div>
      <div style="${styles.bodyCell}">
        <p>Hello,</p>
        <p>Use the code below to confirm your email address and finish your request on the Shanvia Tech website.</p>
        <div style="${styles.otpBox}">
          <span style="${styles.otpText}">${otp}</span>
        </div>
        <p>This code expires in <strong>${expiryMinutes} minute${expiryMinutes === 1 ? '' : 's'}</strong>.</p>
        <p style="color:#718096;">If you didn't request this, you can safely ignore this email — nobody can act on it without the code.</p>
        <p>Thank you,<br/>Shanvia Tech</p>
      </div>
      <div style="${styles.footer}">
        © Shanvia Tech Solutions Pvt Ltd. All Rights Reserved.
      </div>
    </div>
  </body>
  </html>
  `;
};

module.exports = { generateOtpEmail };
