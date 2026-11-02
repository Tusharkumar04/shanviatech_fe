const mongoose = require('mongoose');
const metaInformationSchema = require('./metaInformation.schema');

const projectSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        subtitle: String,
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

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
