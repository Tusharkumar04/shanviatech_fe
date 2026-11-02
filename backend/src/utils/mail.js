const logger = require('../config/logger');

/** Mask a secret for safe logging: keep first 2 chars, show the length. */
const mask = (secret) => {
  if (!secret) return '(empty)';
  const s = String(secret);
  return `${s.slice(0, 2)}***(len:${s.length})`;
};

const isConfigured = () =>
  Boolean(process.env.EMAIL_URL && process.env.SMTP_USERNAME && process.env.SMTP_PASSWORD);

/**
 * POST the message to the shared mail relay (EMAIL_URL). The body shape matches
 * the other Shanvia projects exactly; the transport is the global fetch rather
 * than the deprecated `request` package.
 */
const postToRelay = async (to, subject, html) => {
  const url = process.env.EMAIL_URL;
  const toEmail = String(to)
    .split(',')
    .map((addr) => addr.trim())
    .filter(Boolean)
    .join(',');

  const body = {
    port: '',
    host: '',
    email_user: process.env.SMTP_USERNAME,
    email_password: process.env.SMTP_PASSWORD,
    email_body: {
      from_email: process.env.SMTP_USERNAME,
      to_email: toEmail,
      subject,
      text: '',
      html,
    },
  };

  logger.info(
    `[mail] POST ${url} | login=${process.env.SMTP_USERNAME} | password=${mask(
      process.env.SMTP_PASSWORD
    )} | from=${body.email_body.from_email} | to=${toEmail} | subject="${subject}"`
  );

  // Third-party HTTP call — cap it so a hung socket can't pin the request
  // handler open indefinitely.
  const controller = new AbortController();
  const timer = setTimeout(
    () => controller.abort(),
    Number(process.env.EMAIL_TIMEOUT_MS) || 20000
  );

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'cache-control': 'no-cache',
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const raw = await res.text();
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = raw;
    }
    logger.info(`[mail] Relay response (HTTP ${res.status}): ${raw}`);

    if (!res.ok) {
      throw new Error(`Relay rejected (HTTP ${res.status}): ${raw}`);
    }
    // A 200 doesn't guarantee delivery — the relay can report failure in the body.
    if (!parsed) {
      throw new Error('Relay returned an empty body');
    }
    if (typeof parsed === 'object' && (parsed.error || parsed.success === false)) {
      throw new Error(`Relay reported failure: ${JSON.stringify(parsed)}`);
    }

    logger.info(`[mail] ✅ Email accepted by relay for: ${toEmail}`);
    return { relay: true, status: res.status, body: parsed };
  } finally {
    clearTimeout(timer);
  }
};

/**
 * Send an HTML email via the relay. Resolves to { skipped: true } when the relay
 * isn't configured and { error } on failure — it never throws, so the callers
 * that fire-and-forget stay safe.
 */
const sendMail = async (to, subject, html) => {
  if (!isConfigured()) {
    logger.warn('[mail] ⚠ Email skipped: set EMAIL_URL, SMTP_USERNAME and SMTP_PASSWORD.');
    return { skipped: true };
  }

  logger.info(`[mail] sendMail -> to=${to} | subject="${subject}"`);

  try {
    return await postToRelay(to, subject, html);
  } catch (err) {
    logger.error(`[mail] ❌ Relay send failed: ${err.message || err}`);
    return { error: err.message || err };
  }
};

module.exports = { sendMail };
