const mongoose = require('mongoose');
const metaInformationSchema = require('./metaInformation.schema');

const why_choose_us = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    highlights: [mongoose.Schema({
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        logo: {
            type: String,
            required: true
        }
    })]
})

const technical_craft = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    highlights: [mongoose.Schema({
        title: {
            type: String,
            required: true
        },
        logo: {
            type: String,
            required: true
        }
    })]
})

const hiring_impressive = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    button_title: String,
    link: String
})

const approachSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        subtitle: {
            type: String,
            required: true
        },
        images: [String],
        description: String,
        our_approach: String,
        our_mission: String,
        why_choose_us,
        technical_craft,
        hiring_impressive,
        metaInformation: metaInformationSchema,
    },
    {
        timestamps: true,
    }
);

const Approach = mongoose.model('Approach', approachSchema);

module.exports = Approach;
