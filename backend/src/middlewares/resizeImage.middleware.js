const sharp = require('sharp');
const https = require('https');
const aws = require('aws-sdk');
const config = require("../config/config");

const s3 = new aws.S3({
  accessKeyId: config.s3.S3_ACCESS_KEY,
  secretAccessKey: config.s3.S3_SECRET_KEY,
  region: config.s3.S3_REGION,
});

const downloadImage = async (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', (err) => reject(err));
    });
  });
}

const resizeImage = async (url, folderName) => {
  try {
    const key = `resize_${url.split("/")[url.split("/").length - 1]}`
    const imageBuffer = await downloadImage(url);

    const compressedImageBuffer = await sharp(imageBuffer)
      .resize({ width: 500 })
      .jpeg({ quality: 80 })
      .toBuffer();

    let finalBuffer = compressedImageBuffer;
    let quality = 80;
    while (finalBuffer.length > 30 * 1024 && quality > 10) {
      quality -= 10;
      finalBuffer = await sharp(imageBuffer)
        .jpeg({ quality })
        .toBuffer();
    }

    const uploadParams = {
      Bucket: `${config.s3.S3_BUCKET}/${folderName}`,
      Key: key,
      Body: finalBuffer,
      ACL: 'public-read',
    };

    const result = await s3.upload(uploadParams).promise();
    return result.Location;
  } catch (error) {
    console.error('Error compressing or uploading the image:', error);
    throw error;
  }
}

module.exports = { resizeImage };
// resizeImage();
