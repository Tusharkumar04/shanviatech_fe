const mongoose = require('mongoose');
const metaInformationSchema = require('./metaInformation.schema');

const banners = mongoose.Schema({
    title: String,
    subtitle: String,
    image: {
        type: String,
        required: true
    },
    button_title: String,
    link: String,
    order: Number
})

const about = mongoose.Schema({
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
        image: {
            type: String,
            required: true
        },
        button_title: String,
        link: String,
        order: Number
    })]
})

const our_approach = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: String,
    description: {
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

const we_do = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: String,
    description: {
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

const why_choose = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: String,
    description: {
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

const homeSchema = mongoose.Schema(
    {
        banners: [banners],
        about: about,
        our_approach: our_approach,
        we_do: we_do,
        why_choose: why_choose,
        metaInformation: metaInformationSchema,
    },
    {
        timestamps: true,
    }
);

const Home = mongoose.model('Home', homeSchema);

module.exports = Home;
