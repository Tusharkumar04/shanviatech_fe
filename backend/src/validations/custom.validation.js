const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message('password must be at least 8 characters');
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message('password must contain at least 1 letter and 1 number');
  }
  return value;
};

const MAX_PDF_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

// Returns the decoded byte length of a base64 payload (ignoring any data-url prefix).
const base64ByteLength = (base64 = '') => {
  const payload = base64.replace(/^data:.+;base64,/, '').replace(/\s/g, '');
  if (!payload) {
    return 0;
  }
  const padding = (payload.match(/=+$/) || [''])[0].length;
  return Math.floor((payload.length * 3) / 4) - padding;
};

// Validates a `{ file, filename }` upload object: PDF only, max 5MB.
// Existing files (a stored path/URL rather than a fresh base64 upload) are passed through untouched.
const pdfFile = (value, helpers) => {
  if (!value || typeof value !== 'object') {
    return value;
  }

  const { file, filename } = value;

  // Already-uploaded file referenced by its stored path/URL — nothing new to validate.
  const isNewUpload = typeof file === 'string' && file.startsWith('data:');
  if (!isNewUpload) {
    return value;
  }

  const mimeMatch = file.match(/^data:(.+);base64,/);
  const mimeType = mimeMatch ? mimeMatch[1].toLowerCase() : '';
  const hasPdfMime = mimeType.includes('application/pdf');
  const hasPdfExt = typeof filename === 'string' && filename.toLowerCase().endsWith('.pdf');

  if (!hasPdfMime || !hasPdfExt) {
    return helpers.message('"{{#label}}" must be a PDF file');
  }

  if (base64ByteLength(file) > MAX_PDF_SIZE_BYTES) {
    return helpers.message('"{{#label}}" must not exceed 5MB');
  }

  return value;
};

module.exports = {
  objectId,
  password,
  pdfFile,
};
