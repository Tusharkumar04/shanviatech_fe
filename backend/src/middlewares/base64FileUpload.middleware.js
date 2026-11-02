const aws = require('aws-sdk');
const config = require('../config/config');

const s3 = new aws.S3({
  accessKeyId: config.s3.S3_ACCESS_KEY,
  secretAccessKey: config.s3.S3_SECRET_KEY,
  region: config.s3.S3_REGION,
});

const uploadOriginalFile = async (data, folderName) => {
  try {
    if (!data) {
      return '';
    }
    if (data?.file && data?.filename && folderName) {
      let base64Data = new Buffer.from(data.file.replace(/^data:.+;base64,/, ''), 'base64');
      let fileExt = data.filename.split('.')[data.filename.split('.').length - 1];
      if (fileExt == undefined || fileExt == '') {
        fileExt = data.file.mimetype.split('/')[1];
      }

      const filename = `${Date.now()}.${fileExt || 'png'}`;
      const params = {
        Bucket: `${config.s3.S3_BUCKET}/${folderName}`,
        Key: filename,
        ACL: 'public-read',
        Body: base64Data,
      };
      const stored = await s3.upload(params).promise();
      return stored.Location;
    } else if (data?.file && !data?.filename) {
      return data.file;
    } else {
      return '';
    }
  } catch (err) {
    console.log('error uploading file : ', err);
    return '';
  }
};

module.exports = { uploadOriginalFile };
