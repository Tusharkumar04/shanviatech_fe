const mongoose = require('mongoose');
const metaInformationSchema = require('./metaInformation.schema');

const caseStudySchema = mongoose.Schema(
    {
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
        order: Number,
        metaInformation: metaInformationSchema,
    },
    {
        timestamps: true,
    }
);

const Case_study = mongoose.model('Case_study', caseStudySchema);

module.exports = Case_study;
