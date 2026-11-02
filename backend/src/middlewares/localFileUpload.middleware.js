const fs = require('fs/promises');
const path = require('path');

const sanitizePathSegment = (segment = '') => segment.replace(/[^a-zA-Z0-9-_]/g, '-');

const getExtensionFromDataUrl = (dataUrl = '') => {
  const match = dataUrl.match(/^data:(.+);base64,/);
  if (!match || !match[1]) {
    return 'png';
  }

  const mimeType = match[1].toLowerCase();
  if (mimeType.includes('jpeg') || mimeType.includes('jpg')) {
    return 'jpg';
  }
  if (mimeType.includes('png')) {
    return 'png';
  }
  if (mimeType.includes('webp')) {
    return 'webp';
  }
  if (mimeType.includes('gif')) {
    return 'gif';
  }
  if (mimeType.includes('svg')) {
    return 'svg';
  }
  if (mimeType.includes('pdf')) {
    return 'pdf';
  }

  return mimeType.split('/')[1] || 'png';
};

const uploadOriginalFile = async (data, folderName) => {
  try {
    if (!data) {
      return '';
    }

    if (data?.file && data?.filename && folderName) {
      const safeFolderPath = folderName
        .split('/')
        .filter(Boolean)
        .map(sanitizePathSegment)
        .join('/');

      const publicRootPath = path.join(process.cwd(), 'public');
      const destinationPath = path.join(publicRootPath, safeFolderPath);

      await fs.mkdir(destinationPath, { recursive: true });

      const fileParts = data.filename.split('.');
      const fileExtFromName = fileParts.length > 1 ? fileParts[fileParts.length - 1] : '';
      const fileExt = (fileExtFromName || getExtensionFromDataUrl(data.file)).toLowerCase();
      const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExt}`;
      const filePath = path.join(destinationPath, fileName);

      const base64Payload = data.file.replace(/^data:.+;base64,/, '');
      const fileBuffer = Buffer.from(base64Payload, 'base64');

      await fs.writeFile(filePath, fileBuffer);

      return `/public/${safeFolderPath}/${fileName}`;
    }

    if (data?.file && !data?.filename) {
      const fileParts = data.file.split('/public/');
      return `/public/${fileParts[1]}`
    }

    return '';
  } catch (err) {
    console.log('error uploading file : ', err);
    return '';
  }
};

module.exports = { uploadOriginalFile };
