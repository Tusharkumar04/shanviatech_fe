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

const applyServiceSlugs = (services = []) => {
    if (!Array.isArray(services)) {
        return services;
    }

    return services.map((item) => {
        if (!item || typeof item !== 'object') {
            return item;
        }

        if (item.name) {
            return {
                ...item,
                slug: generateSlug(item.name),
            };
        }

        return item;
    });
};

const highlight = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: [String],
    order: Number
})

const service = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        slug: String,
        title: {
            type: String,
            required: true
        },
        subtitle: String,
        image: {
            type: String,
            required: true
        },
        highlights: [highlight],
        order: Number,
        show_in_page: {
            type: Boolean,
            default: true
        },
        metaInformation: metaInformationSchema,
    }
);

const digital_solution = mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        subtitle: String,
        highlights: [mongoose.Schema({
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
            description2: {
                type: String,
                required: true
            },
            image: {
                type: String,
                required: true
            },
            button_title: String,
            link: String,
            order: Number,
        })]
    }
);

const serviceSchema = mongoose.Schema(
    {
        services: [service],
        digital_experiences: mongoose.Schema({
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
            button_title: String,
            link: String
        }),
        agile_project: mongoose.Schema({
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
            button_title: String,
            link: String,
            image: String
        }),
        digital_solutions: [digital_solution],
        quality_assurance: mongoose.Schema({
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
            image: {
                type: String,
                required: true
            },
            button_title: String,
            link: String
        }),
        metaInformation: metaInformationSchema,
    },
    {
        timestamps: true,
    }
);

serviceSchema.pre('save', function (next) {
    if (Array.isArray(this.services)) {
        this.services = applyServiceSlugs(this.services);
    }
    next();
});

serviceSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate() || {};

    if (Array.isArray(update.services)) {
        update.services = applyServiceSlugs(update.services);
    }

    if (update.$set && Array.isArray(update.$set.services)) {
        update.$set.services = applyServiceSlugs(update.$set.services);
    }

    this.setUpdate(update);
    next();
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
