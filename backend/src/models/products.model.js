
const mongoose = require("mongoose");
const metaInformationSchema = require('./metaInformation.schema');

const productsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        subtitle: {
            type: String,
        },
        description: {
            type: String,
            required: true,
        },
        key_features: [
            {
                type: String,
            },
        ],
        order: {
            type: Number,
        },
        images: [
            {
                type: String,
            },
        ],
        metaInformation: metaInformationSchema,
    },
    { timestamps: true }
);

const products = mongoose.model("PRODUCTS", productsSchema);

module.exports = products;
