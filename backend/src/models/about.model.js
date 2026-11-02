const mongoose = require('mongoose');
const metaInformationSchema = require('./metaInformation.schema');

const our_journey = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        required: true
    },
    year: Number,
    description: String,
    order: Number
})

const aboutSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        subtitle: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        our_journey: [our_journey],
        metaInformation: metaInformationSchema,
    },
    {
        timestamps: true,
    }
);

const About = mongoose.model('About', aboutSchema);

module.exports = About;
