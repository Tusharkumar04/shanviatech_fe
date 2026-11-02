const mongoose = require('mongoose');

const metaInformationSchema = mongoose.Schema(
  {
    meta_title: String,
    meta_description: String,
    meta_keywords: [String],
    slug: String,
    og_title: String,
    og_description: String,
    og_image: String,
  },
  {
    _id: false,
  }
);

module.exports = metaInformationSchema;
