const { rateLimit, ipKeyGenerator } = require('express-rate-limit');

// Existing limiter for auth-sensitive routes (login/register/etc).
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
});

// Global per-HTTP-method limiter over a rolling 60s window, keyed on client IP.
// Reads are generous (profile browsing) while writes/deletes are tighter.
const methodLimiter = rateLimit({
  windowMs: 60 * 1000,
  standardHeaders: true,
  legacyHeaders: false,
  // express-rate-limit v7+ uses `limit` (accepts a function); `max` is a deprecated alias.
  limit: (req) => {
    switch (req.method) {
      case 'GET':
        return 120;
      case 'POST':
        return 30;
      case 'PUT':
      case 'PATCH':
        return 15;
      case 'DELETE':
        return 10;
      default:
        return 60;
    }
  },
});

// OTP sends cost real money and land in someone's inbox/handset, so the global
// methodLimiter (30 POST/min) is far too generous. Keyed on IP *and* target so
// that one IP can't enumerate many numbers, and a pool of IPs can't gang up on
// a single victim's phone. Failed sends still count — that's the point.
const otpSendLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  // ipKeyGenerator normalizes IPv6 to a /56 subnet — required by v8's
  // validation, and it stops a single IPv6 host rotating addresses to reset.
  keyGenerator: (req) => {
    const target = String(req.body?.target || '').trim().toLowerCase();
    return `${ipKeyGenerator(req.ip)}:${target}`;
  },
  message: {
    errorCode: 1,
    statusCode: 429,
    message: 'Too many verification codes requested. Please try again later.',
  },
});

// Guards against brute-forcing the code itself. The per-record attempt cap in
// verification.service is the real defence; this stops an attacker cycling
// fresh OTPs to widen their guessing window.
const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    errorCode: 1,
    statusCode: 429,
    message: 'Too many verification attempts. Please try again later.',
  },
});

module.exports = {
  authLimiter,
  methodLimiter,
  otpSendLimiter,
  otpVerifyLimiter,
};
