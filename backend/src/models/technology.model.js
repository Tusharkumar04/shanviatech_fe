const mongoose = require('mongoose');
const metaInformationSchema = require('./metaInformation.schema');

const generateSlug = (value = '') =>
    value
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

const technologySchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        slug: String,
        description: String,
        image: {
            type: String,
            required: true
        },
        button_title: String,
        link: String,
        order: Number,
        metaInformation: metaInformationSchema,
    },
    {
        timestamps: true,
    }
);

technologySchema.pre('save', function (next) {
    if (this.title) {
        this.slug = generateSlug(this.title);
    }
    next();
});

technologySchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate() || {};
    const title = update.title || (update.$set && update.$set.title);

    if (title) {
        const slug = generateSlug(title);
        if (update.$set) {
            update.$set.slug = slug;
        } else {
            update.slug = slug;
        }
        this.setUpdate(update);
    }

    next();
});

const Technology = mongoose.model('Technology', technologySchema);

module.exports = Technology;
