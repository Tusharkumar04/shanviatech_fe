const mongoose = require('mongoose');
const metaInformationSchema = require('./metaInformation.schema');

const jobApplicationSchema = mongoose.Schema(
    {
        job_id: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Job',
            required: true,
        },
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
        message: {
            type: String,
        },
        gender: {
            type: String,
            enum: ['male', 'female']
        },
        cv: {
            type: String,
            required: true
        },
        location: String,
        status: {
            type: String,
            enum: ['pending', 'reviewed', 'rejected', 'accepted'],
            default: 'pending'
        },
        metaInformation: metaInformationSchema,
    },
    {
        timestamps: true,
    }
);

const Job_application = mongoose.model('Job_application', jobApplicationSchema);

module.exports = Job_application;
