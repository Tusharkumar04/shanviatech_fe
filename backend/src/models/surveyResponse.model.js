const mongoose = require('mongoose');

const responseFormSchema = mongoose.Schema(
    {
        label: String,
        value: String,
    },
    { _id: false }
);

const responseItemSchema = mongoose.Schema(
    {
        question: String,
        answer: String,
        form: [responseFormSchema],
    },
    { _id: false }
);

const chatMessageSchema = mongoose.Schema(
    {
        from: {
            type: String,
            enum: ['user', 'admin'],
            required: true
        },
        text: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    { _id: false }
);

const surveyResponseSchema = mongoose.Schema(
    {
        uid: {
            type: String,
            required: true
        },
        unseenChatByAdmin: {
            type: Number,
            default: 0
        },
        unseenChatByUser: {
            type: Number,
            default: 0
        },
        user_data: {
            type: mongoose.Schema.Types.Mixed,
        },
        emailSent: {
            type: Boolean,
            default: false
        },
        responses: [responseItemSchema],
        chat: [chatMessageSchema],
    },
    {
        timestamps: true,
    }
);

const SurveyResponse = mongoose.model('SurveyResponse', surveyResponseSchema);

module.exports = SurveyResponse;
