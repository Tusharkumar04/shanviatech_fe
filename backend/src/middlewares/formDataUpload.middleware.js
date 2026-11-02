const multer = require("multer");
const sharp = require('sharp');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const multerS3 = require('multer-s3');
const config = require("../config/config");
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

const s3 = new S3Client({
  region: config.s3.S3_REGION,
  credentials: {
    accessKeyId: config.s3.S3_ACCESS_KEY,
    secretAccessKey: config.s3.S3_SECRET_KEY,
  },
  sslEnabled: false,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
});

const storage = multer.memoryStorage();

const uploadFileUsingMulter = (fileName) => multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } }).single(fileName);

const uploadSingleImageWithResize = (folderName)=> async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ApiError(httpStatus.NOT_FOUND, 'File not found');
    }
    
    const resizedBuffer = await sharp(req.file.buffer).toFormat('jpeg').resize({ width: 800 }).jpeg({ quality: 80 }).toBuffer();

    const key = `${req?.user?.slug || "anonymous"}/${folderName}/${Date.now()}_${req.file.originalname}`;

    const uploadParams = {
      Bucket: config.s3.S3_BUCKET,
      Key: key,
      Body: resizedBuffer,
      ContentType: req.file.mimetype,
      ACL: "public-read",
    };

    const command = new PutObjectCommand(uploadParams);
    await s3.send(command);

    req.file.location = `https://${config.s3.S3_BUCKET}.s3.${config.s3.S3_REGION}.amazonaws.com/${key}`;
    req.file.key = key;
    next();
  } catch (error) {
    console.error("Error resizing or uploading file:", error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error');
  }
}

const uploadSingleFile = multer({
  storage: multerS3({
    s3: s3,
    bucket: config.s3.S3_BUCKET,
    acl: 'public-read',
    key: function (req, file, cb) {
      const folderName = req?.query?.folderName || 'default-folder';
      cb(null, `${req?.user?.slug}/${folderName}/${Date.now()}_${file.originalname}`);
    },
  }),
});

module.exports = { uploadFileUsingMulter, uploadSingleImageWithResize, uploadSingleFile }