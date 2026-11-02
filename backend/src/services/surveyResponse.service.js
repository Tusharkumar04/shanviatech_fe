const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');
const SurveyResponseModel = require('../models/surveyResponse.model');
const SiteSettingModel = require('../models/siteSetting.model');
const verificationService = require('./verification.service');
const { sendMail } = require('../utils/mail');
const { generateUserDataEmail } = require('../utils/surveyLeadEmail');

// Fire the "new lead" email once the visitor has shared Name + Email + Phone.
// Marks the survey as emailed (caller persists it) so re-submits / go-backs
// don't trigger duplicate emails. Fire-and-forget so it never blocks the API.
const sendLeadEmailIfReady = (survey, userData) => {
  const ud = userData || {};
  const ready =
    ud['Full Name'] && ud['Email Address'] && ud['Phone Number'];
    // console.log(`ready to send email?`, { ready, userData: ud });
  if (!ready) return;

  survey.emailSent = true;
  // Fall back to these recipients when EMAIL_TO isn't configured in the env.
  const to =
    process.env.EMAIL_TO || 'sahilsharma126@gmail.com,avinash@shanviatech.com';
  if (!to) {
    logger.warn('EMAIL_TO not set; survey lead email not sent.');
    return;
  }
  const subject = `New Lead from Shanvia Tech Website Chat - ${ud['Full Name']}`;
  // console.log(`Preparing to send email to ${to} with subject "${subject}"`);
  const html = generateUserDataEmail(ud);
  // console.log(`sending email to ${to} with subject "${subject}" and html: ${html}`);
  sendMail(to, subject, html).catch((err) =>
    logger.error(`Failed to send survey lead email: ${err.message || err}`)
  );
};

// Contacts the visitor must have proven ownership of before we'll store them,
// mapped to the user_data keys the popup sends.
const VERIFIED_CONTACT_FIELDS = [
  { key: 'Email Address', channel: 'email', label: 'email address' },
  { key: 'Phone Number', channel: 'phone', label: 'phone number' },
];

/**
 * Reject contacts this uid hasn't verified via OTP.
 *
 * Only checks fields actually present in the payload: the popup saves
 * incrementally as the visitor answers, so enforcing an absent field would
 * break every partial save before the contact step is reached.
 *
 * Returns an error envelope, or null when the payload is acceptable.
 */
const checkContactsVerified = async (uid, userData) => {
  const ud = userData || {};

  for (const field of VERIFIED_CONTACT_FIELDS) {
    const value = ud[field.key];
    if (!value || !String(value).trim()) continue;

    const verified = await verificationService.isVerified({
      uid,
      channel: field.channel,
      target: value,
    });

    if (!verified) {
      return {
        errorCode: 1,
        statusCode: 403,
        message: `Please verify your ${field.label} before submitting.`,
        details: { unverified_channel: field.channel, field: field.key },
      };
    }
  }

  return null;
};

// ===== Public (popup) — reference response envelope {errorCode, statusCode, details} =====

const createOrUpdate = async (data) => {
  try {
    const verificationError = await checkContactsVerified(data.uid, data.user_data);
    if (verificationError) return verificationError;

    let survey = await SurveyResponseModel.findOne({ uid: data.uid });
    let message;

    if (survey) {
      survey.responses = data.responses;
      survey.user_data = data.user_data;
      message = 'Survey response updated successfully.';
    } else {
      survey = new SurveyResponseModel({
        uid: data.uid,
        responses: data.responses,
        user_data: data.user_data,
      });
      message = 'Survey response created successfully.';
    }

    sendLeadEmailIfReady(survey, data.user_data);
    const saved = await survey.save();

    return {
      errorCode: 0,
      statusCode: 200,
      message,
      details: saved,
    };
  } catch (error) {
    return { errorCode: 1, message: error.message || error };
  }
};

const getUserResponse = async (uid) => {
  try {
    const existingSurvey = await SurveyResponseModel.findOne({ uid });
    return {
      errorCode: 0,
      statusCode: 200,
      details: existingSurvey,
    };
  } catch (error) {
    return { errorCode: 1, message: error.message || error };
  }
};

// ===== Socket helpers =====

const saveChatMessage = async (uid, message, from) => {
  try {
    let survey = await SurveyResponseModel.findOne({ uid });

    if (!survey) {
      survey = new SurveyResponseModel({
        uid,
        chat: [],
        unseenChatByAdmin: 0,
        unseenChatByUser: 0,
      });
    }

    if (!survey.chat) {
      survey.chat = [];
    }

    survey.chat.push({ text: message, from, createdAt: new Date() });

    if (from === 'user') {
      survey.unseenChatByAdmin = (survey.unseenChatByAdmin || 0) + 1;
    } else if (from === 'admin') {
      survey.unseenChatByUser = (survey.unseenChatByUser || 0) + 1;
    }

    await survey.save();

    return {
      errorCode: 0,
      statusCode: 200,
      message: 'Chat message saved successfully.',
      details: message,
      responseId: survey._id,
    };
  } catch (error) {
    return { errorCode: 1, message: error.message || error };
  }
};

const createNewSurvey = async (uid) => {
  try {
    const survey = await SurveyResponseModel.findOne({ uid });
    if (survey) {
      return {
        errorCode: 1,
        message: 'Survey already exists for this user.',
        details: survey,
      };
    }

    const createdSurvey = await SurveyResponseModel.create({
      uid,
      responses: [],
      chat: [],
      unseenChatByAdmin: 0,
      unseenChatByUser: 0,
    });

    return {
      errorCode: 0,
      statusCode: 200,
      message: 'Survey created successfully.',
      details: createdSurvey,
    };
  } catch (error) {
    return { errorCode: 1, message: error.message || error };
  }
};

const markChatAsSeen = async (uid, seenBy) => {
  try {
    const survey = await SurveyResponseModel.findOne({ uid });
    if (!survey) {
      return { errorCode: 1, message: 'Survey not found for this user.' };
    }

    if (seenBy === 'user') {
      survey.unseenChatByUser = 0;
    } else if (seenBy === 'admin') {
      survey.unseenChatByAdmin = 0;
    }

    await survey.save();

    return {
      errorCode: 0,
      statusCode: 200,
      details: {
        unseenChatByAdmin: survey.unseenChatByAdmin,
        unseenChatByUser: survey.unseenChatByUser,
      },
    };
  } catch (error) {
    return { errorCode: 1, message: error.message || error };
  }
};

const findSiteSetting = async () => {
  const siteSettingData = await SiteSettingModel.findOne({}).select('is_admin_online');
  return {
    errorCode: 0,
    statusCode: 200,
    isAdminOnline: siteSettingData?.is_admin_online || false,
  };
};

const updateOnlineStatus = async (onlineStatus) => {
  const siteSettingData = await SiteSettingModel.findOne({});
  if (!siteSettingData) {
    return { errorCode: 1, statusCode: 404, message: 'Site setting not found' };
  }
  siteSettingData.is_admin_online = onlineStatus;
  const updated = await siteSettingData.save();
  return { errorCode: 0, statusCode: 200, details: updated };
};

// ===== Admin (React) — project response envelope {code, message, data} =====

const getList = async (filter = {}, options = {}) => {
  const page = Math.max(parseInt(options.page, 10) || 1, 1);
  const limit = Math.max(parseInt(options.limit, 10) || 10, 1);
  const sort = options.sort || '-updatedAt';
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    SurveyResponseModel.find(filter).sort(sort).skip(skip).limit(limit),
    SurveyResponseModel.countDocuments(filter),
  ]);

  return {
    items,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getDetails = async (filter = {}) => {
  const survey = await SurveyResponseModel.findOne(filter);
  if (!survey) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Survey response not found');
  }
  return survey;
};

const remove = async (surveyResponseId) => {
  const deleted = await SurveyResponseModel.findByIdAndDelete(surveyResponseId);
  if (!deleted) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Survey response not found');
  }
  return deleted;
};

const multiDelete = async (ids = []) => {
  const result = await SurveyResponseModel.deleteMany({ _id: { $in: ids } });
  return { deletedCount: result.deletedCount };
};

module.exports = {
  createOrUpdate,
  getUserResponse,
  saveChatMessage,
  createNewSurvey,
  markChatAsSeen,
  findSiteSetting,
  updateOnlineStatus,
  getList,
  getDetails,
  remove,
  multiDelete,
};
