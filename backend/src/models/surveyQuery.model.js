const mongoose = require('mongoose');

const formFieldSchema = mongoose.Schema(
    {
        label: {
            type: String,
            required: true
        },
        is_required: {
            type: Boolean,
            default: false
        }
    },
    { _id: false }
);

const surveyQuerySchema = mongoose.Schema(
    {
        name: String,
        parent_category_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SurveyQuery',
            default: null
        },
        question: String,
        sequence: {
            type: Number,
            required: true
        },
        sub_sequence: {
            type: Number,
            default: 0
        },
        form: [formFieldSchema],
    },
    {
        timestamps: true,
    }
);

const SurveyQuery = mongoose.model('SurveyQuery', surveyQuerySchema);

module.exports = SurveyQuery;
