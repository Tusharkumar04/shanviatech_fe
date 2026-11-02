import { _get, _post } from "@/utils/axiosInstance";
import { getURL } from "@/utils/apiConstants";

/** Reference response envelope used by the survey popup. */
export interface SurveyEnvelope<T = unknown> {
  errorCode?: number;
  statusCode?: number;
  message?: string;
  details?: T;
}

const unwrap = <T>(response: unknown): SurveyEnvelope<T> => {
  if (response && typeof response === "object" && "data" in response) {
    return (response as { data: SurveyEnvelope<T> }).data;
  }
  return {} as SurveyEnvelope<T>;
};

/**
 * Like `unwrap`, but never loses a failure.
 *
 * `_post`/`_get` swallow axios errors and resolve to `{ err, code }` instead of
 * throwing, which plain `unwrap` would flatten to `{}` — indistinguishable from
 * success to a caller checking `errorCode`. Verification has to tell the visitor
 * *why* it failed (bad OTP, rate limited, provider down), so map that shape back
 * onto the envelope. Covers non-200s: Joi 400s and rate-limiter 429s.
 */
const unwrapStrict = <T>(response: unknown): SurveyEnvelope<T> => {
  if (response && typeof response === "object") {
    if ("data" in response) {
      return (response as { data: SurveyEnvelope<T> }).data;
    }
    if ("err" in response) {
      const { err } = response as { err?: string };
      return {
        errorCode: 1,
        message: err || "Something went wrong. Please try again.",
      } as SurveyEnvelope<T>;
    }
  }
  return {
    errorCode: 1,
    message: "Something went wrong. Please try again.",
  } as SurveyEnvelope<T>;
};

/** Flat list of survey queries (popup builds the category tree client-side). */
export const getQuries = async (): Promise<SurveyEnvelope> => {
  const response = await _get(getURL("SURVEY.QUERIES_CMS_LIST"), false);
  return unwrap(response);
};

/** Existing survey response (chat + answers) for a guest uid. */
export const getResponses = async (params: {
  uid?: string;
}): Promise<SurveyEnvelope> => {
  const url = `${getURL("SURVEY.RESPONSE_GET")}?uid=${params?.uid || ""}`;
  const response = await _get(url, false);
  return unwrap(response);
};

/** Create or update the survey response for a guest uid. */
export const submitQuestions = async (data: {
  uid: string;
  responses: unknown[];
  user_data?: Record<string, unknown>;
}): Promise<SurveyEnvelope> => {
  const response = await _post(getURL("SURVEY.RESPONSE_CREATE_OR_UPDATE"), data, false);
  // Strict: the backend rejects unverified email/phone here, and the visitor
  // needs to be told rather than silently losing their submission.
  return unwrapStrict(response);
};

// ===== OTP verification =====

export type VerificationChannel = "email" | "phone";

export interface VerificationSendDetails {
  channel: VerificationChannel;
  target: string;
  status: "pending" | "verified";
  expires_in_seconds?: number;
  resend_available_in_seconds?: number;
  retry_after_seconds?: number;
}

export interface VerificationStatusDetails {
  uid: string;
  verified: Array<{
    channel: VerificationChannel;
    target: string;
    country_code?: string;
    verified_at: string;
  }>;
}

/** Send an OTP to an email address or phone number. */
export const sendVerificationOtp = async (data: {
  uid: string;
  channel: VerificationChannel;
  target: string;
  country_code?: string;
}): Promise<SurveyEnvelope<VerificationSendDetails>> => {
  const response = await _post(getURL("SURVEY.VERIFICATION_SEND"), data, false);
  return unwrapStrict<VerificationSendDetails>(response);
};

/** Re-send an OTP. Subject to the same server-side cooldown as send. */
export const resendVerificationOtp = async (data: {
  uid: string;
  channel: VerificationChannel;
  target: string;
  country_code?: string;
}): Promise<SurveyEnvelope<VerificationSendDetails>> => {
  const response = await _post(getURL("SURVEY.VERIFICATION_RESEND"), data, false);
  return unwrapStrict<VerificationSendDetails>(response);
};

/** Verify an OTP for a given contact. */
export const verifyOtp = async (data: {
  uid: string;
  channel: VerificationChannel;
  target: string;
  otp: string;
}): Promise<SurveyEnvelope<VerificationSendDetails>> => {
  const response = await _post(getURL("SURVEY.VERIFICATION_VERIFY"), data, false);
  return unwrapStrict<VerificationSendDetails>(response);
};

/** Contacts this uid has already verified — lets the popup survive a refresh. */
export const getVerificationStatus = async (params: {
  uid?: string;
}): Promise<SurveyEnvelope<VerificationStatusDetails>> => {
  const url = `${getURL("SURVEY.VERIFICATION_STATUS")}?uid=${params?.uid || ""}`;
  const response = await _get(url, false);
  return unwrap<VerificationStatusDetails>(response);
};
