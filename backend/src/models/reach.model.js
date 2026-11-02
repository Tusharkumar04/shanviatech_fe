const mongoose = require('mongoose');
const metaInformationSchema = require('./metaInformation.schema');

const reachSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        mobile: {
            type: String,
            required: true
        },
        subject: {
            type: String,
            required: true
        },
        message: String,
        status: {
            type: String,
            enum: ['pending', 'read', 'archived'],
            default: 'pending'
        },
        metaInformation: metaInformationSchema,
    },
    {
        timestamps: true,
    }
);

const Reach = mongoose.model('Reach', reachSchema);

module.exports = Reach;
