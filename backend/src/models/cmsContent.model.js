const mongoose = require('mongoose');
const metaInformationSchema = require('./metaInformation.schema');

const cmsContentSchema = mongoose.Schema(
    {
        reach_us: mongoose.Schema({
            title: {
                type: String,
                required: true
            },
            image: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            button_title: String,
            link: String
        }),
        client: mongoose.Schema({
            title: {
                type: String,
                required: true
            },
            image: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            key_points: [String],
            button_title: String,
            link: String
        }),
        metaInformation: metaInformationSchema,
    },
    {
        timestamps: true,
    }
);

const Cms_content = mongoose.model('Cms_content', cmsContentSchema);

module.exports = Cms_content;
