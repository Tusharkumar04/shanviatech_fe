const mongoose = require('mongoose');
const metaInformationSchema = require('./metaInformation.schema');

const member = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: String,
    designation: {
        type: String,
        required: true
    },
    qualification: {
        type: String,
        required: true
    },
    order: Number
})

const leadershipSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        subtitle: {
            type: String,
            required: true
        },
        members: [member],
        order: Number,
        metaInformation: metaInformationSchema,
    },
    {
        timestamps: true,
    }
);

const Leadership = mongoose.model('Leadership', leadershipSchema);

module.exports = Leadership;
