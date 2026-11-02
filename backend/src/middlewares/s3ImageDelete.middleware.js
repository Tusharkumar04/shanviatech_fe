
const aws = require('aws-sdk');
const config = require("../config/config");

const s3 = new aws.S3({
    accessKeyId: config.s3.S3_ACCESS_KEY,
    secretAccessKey: config.s3.S3_SECRET_KEY,
    region: config.s3.S3_REGION,
});
const deleteUploadFile = async (old_url, folderPath) => {
    let key = old_url.split(folderPath + '/');
    const params1 = {
        Bucket: config.s3.S3_BUCKET,
        Key: folderPath + '/' + decodeURIComponent(key[1]),
    };
    s3.deleteObject(params1, (error, data) => {
        if (error) {
            console.log(error);
        }
    });
};

module.exports = deleteUploadFile;
