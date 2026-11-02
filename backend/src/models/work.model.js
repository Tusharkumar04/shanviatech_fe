const mongoose = require('mongoose');
const metaInformationSchema = require('./metaInformation.schema');

const our_process = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    order: Number
})

const our_methodology = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    order: Number
})

const workSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        points: [String],
        image: {
            type: String,
            required: true
        },
        button_title: String,
        link: String,
        our_process,
        our_methodology,
        metaInformation: metaInformationSchema,
    },
    {
        timestamps: true,
    }
);

const Work = mongoose.model('Work', workSchema);

module.exports = Work;
