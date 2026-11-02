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

const blogSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        slug: String,
        short_description: {
            type: String,
            required: true
        },
        description: String,
        image: String,
        author: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            // required: true,
        },
        order: Number,
        metaInformation: metaInformationSchema,
    },
    {
        timestamps: true,
    }
);

blogSchema.pre('save', function (next) {
    if (this.title) {
        this.slug = generateSlug(this.title);
    }
    next();
});

blogSchema.pre('findOneAndUpdate', function (next) {
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

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
