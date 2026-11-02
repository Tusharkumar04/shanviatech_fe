const mongoose = require('mongoose');
const metaInformationSchema = require('./metaInformation.schema');

const testimonialSchema = mongoose.Schema(
    {
        author_name: {
            type: String,
            required: true
        },
        author_image: String,
        author_location: String,
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

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

module.exports = Testimonial;
