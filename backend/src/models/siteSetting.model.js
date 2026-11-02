const mongoose = require('mongoose');
const metaInformationSchema = require('./metaInformation.schema');

const social_links = mongoose.Schema({
    facebook: String,
    instagram: String,
    twitter: String,
    linkedin: String,
    youtube: String
})

const address = mongoose.Schema({
    is_primary: {
        type: Boolean,
        default: false
    },
    email: String,
    locality: String,
    city: String,
    state: String,
    country: {
        type: String,
        required: true
    },
    pin_code: Number,
    latitude: Number,
    longitude: Number,
    image:String
})

const certificate = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    issue_date: Date,
    image: {
        type: String,
        required: true
    },
    pdf: String,
    description: String,
    order: Number
})

const siteSettingSchema = mongoose.Schema(
    {
        logo: {
            type: String,
            required: true
        },
        email: String,
        mobile: String,
        social_links,
        cin_no: String,
        is_admin_online: {
            type: Boolean,
            default: false
        },
        addresses: [address],
        certificates: [certificate],
        metaInformation: metaInformationSchema,
    },
    {
        timestamps: true,
    }
);

const Site_setting = mongoose.model('Site_setting', siteSettingSchema);

module.exports = Site_setting;
