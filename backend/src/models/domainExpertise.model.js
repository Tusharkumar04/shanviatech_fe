const mongoose = require('mongoose');
const metaInformationSchema = require('./metaInformation.schema');

const domainExpertiseSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        description: String,
        order: Number,
        metaInformation: metaInformationSchema,
    },
    {
        timestamps: true,
    }
);

const Domain_expertise = mongoose.model('Domain_expertise', domainExpertiseSchema);

module.exports = Domain_expertise;
