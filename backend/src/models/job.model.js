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

const jobSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        slug: String,
        description: {
            type: String,
            required: true
        },
        experience: {
            type: String,
            required: true
        },
        location: String,
        salary: String,
        employment_type: {
            type: String,
            enum: ['full_time', 'contractual', 'part_time', 'remote']
        },
        priority: {
            type: String,
            enum: ['urgent', '15_days_notice_period', '30_days_notice_period', '2_months_notice_period']
        },
        image: String,
        skills: [String],
        soft_skills: [String],
        responsibilities: [String],
        requirements: [String],
        we_offer: [String],
        order: Number,
        metaInformation: metaInformationSchema,
    },
    {
        timestamps: true,
    }
);

jobSchema.pre('save', function (next) {
    if (this.title) {
        this.slug = generateSlug(this.title);
    }
    next();
});

jobSchema.pre('findOneAndUpdate', function (next) {
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
const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
