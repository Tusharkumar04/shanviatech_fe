import { AxiosResponse } from "axios";
import { _post } from "@/utils/axiosInstance";
import { getURL } from "@/utils/apiConstants";

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface ReachUsPayload {
  name: string;
  email: string;
  mobile: string;
  subject: string;
  message: string;
  uid?: string;
}

export type VerificationChannel = "email" | "phone";

/** Response envelope used by the public OTP endpoints. */
export interface OtpEnvelope<T = unknown> {
  errorCode?: number;
  statusCode?: number;
  message?: string;
  details?: T;
}

export interface OtpSendDetails {
  channel: VerificationChannel;
  target: string;
  status: "pending" | "verified";
  expires_in_seconds?: number;
  resend_available_in_seconds?: number;
  retry_after_seconds?: number;
}

/**
 * `_post` swallows axios errors into `{ err, code }`, so map that back onto the
 * envelope to preserve the failure message the form needs to show.
 */
const unwrapStrict = <T>(response: unknown): OtpEnvelope<T> => {
  if (response && typeof response === "object") {
    if ("data" in response) {
      return (response as { data: OtpEnvelope<T> }).data;
    }
    if ("err" in response) {
      const { err } = response as { err?: string };
      return {
        errorCode: 1,
        message: err || "Something went wrong. Please try again.",
      } as OtpEnvelope<T>;
    }
  }
  return {
    errorCode: 1,
    message: "Something went wrong. Please try again.",
  } as OtpEnvelope<T>;
};

/** Send an OTP to the visitor's email for the Reach Us form. */
export const sendReachOtpApiCall = async (data: {
  uid: string;
  channel: VerificationChannel;
  target: string;
  country_code?: string;
}): Promise<OtpEnvelope<OtpSendDetails>> => {
  const response = await _post(getURL("REACHUS.SEND_OTP"), data, false);
  return unwrapStrict<OtpSendDetails>(response);
};

/** Verify the OTP the visitor received. */
export const verifyReachOtpApiCall = async (data: {
  uid: string;
  channel: VerificationChannel;
  target: string;
  otp: string;
}): Promise<OtpEnvelope<OtpSendDetails>> => {
  const response = await _post(getURL("REACHUS.VERIFY_OTP"), data, false);
  return unwrapStrict<OtpSendDetails>(response);
};

export const createReachUsApiCall = async (
  payload: ReachUsPayload
): Promise<string> => {
  const response = await _post(getURL("REACHUS.CREATE"), payload, false);

  if (!response || typeof response !== "object") {
    throw new Error("Unable to submit contact form");
  }

  if ("err" in response && response.err) {
    throw new Error(String(response.err));
  }

  if (!("data" in response)) {
    throw new Error("Unable to submit contact form");
  }

  const apiResponse = (response as AxiosResponse<ApiResponse<unknown>>).data;

  if (apiResponse?.code === 200 || apiResponse?.code === 201) {
    return apiResponse.message || "Message submitted successfully";
  }

  throw new Error(apiResponse?.message || "Unexpected response code");
};

