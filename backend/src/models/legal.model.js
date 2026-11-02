
const mongoose = require("mongoose");
const metaInformationSchema = require('./metaInformation.schema');

const legalSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["privacy-policy", "terms-and-conditions","cookie-policy", "refund-policy", "shipping-policy"],
            required: true,
            unique: true,
        },
        title: {
            type: String,
            required: true,
        },
        version: {
            type: String,
            default: "1.0",
        },
        effectiveDate: {
            type: Date
        },
        content: {
            type: String,
            required: true,
        },
        sections: [
            {
                heading: String,
                content: String,
                order: Number,
            },
        ],
        publishedAt: Date,
        metaInformation: metaInformationSchema,
    },
    { timestamps: true }
);

const Legal = mongoose.model("Legal", legalSchema);

module.exports = Legal;
