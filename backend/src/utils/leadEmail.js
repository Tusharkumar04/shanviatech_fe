const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/**
 * Generic Shanvia-branded lead/notification email.
 * @param {object} opts
 * @param {string} opts.heading - Header bar + title text.
 * @param {string} opts.intro   - Intro sentence above the details list.
 * @param {object} opts.data    - Key/value pairs rendered as the detail list.
 */
const generateLeadEmail = ({ heading = 'New Submission', intro = '', data = {} } = {}) => {
  const rows = Object.entries(data || {})
    .filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== '')
    .map(
      ([k, v]) =>
        `<li style="margin-bottom:6px;"><strong>${escapeHtml(k)}:</strong> ${escapeHtml(v)}</li>`
    )
    .join('');

  const styles = {
    outerDiv: 'background-color:#f4f6f8;margin:0;padding:24px;font-family:Arial,Helvetica,sans-serif;',
    wrapper: 'margin:0 auto;max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb;',
    header: 'background:linear-gradient(135deg,#1E40AF,#2563EB);color:#ffffff;padding:18px 24px;font-size:18px;font-weight:bold;',
    bodyCell: 'padding:24px;font-size:14px;line-height:1.6;color:#333333;',
    footer: 'font-size:12px;color:#888888;text-align:center;border-top:1px solid #eeeeee;padding:14px 0;',
  };

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(heading)}</title>
  </head>
  <body style="${styles.outerDiv}">
    <div style="${styles.wrapper}">
      <div style="${styles.header}">${escapeHtml(heading)}</div>
      <div style="${styles.bodyCell}">
        <p>Hello Team,</p>
        ${intro ? `<p>${escapeHtml(intro)}</p>` : ''}
        <p><strong>Details:</strong></p>
        <ul style="padding-left:18px;margin:8px 0;">
          ${rows || '<li>No details provided.</li>'}
        </ul>
        <p>📌 Please follow up at the earliest.</p>
        <p>Thank you,<br/>Shanvia Tech Website</p>
      </div>
      <div style="${styles.footer}">
        © Shanvia Tech Solutions Pvt Ltd. All Rights Reserved.
      </div>
    </div>
  </body>
  </html>
  `;
};

module.exports = { generateLeadEmail };
