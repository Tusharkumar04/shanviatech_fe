import { AxiosResponse } from "axios";
import { _get, _post } from "@/utils/axiosInstance";
import { getURL } from "@/utils/apiConstants";

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface JobCvPayload {
  file: string;
  filename: string;
}

export interface JobPayload {
  name: string;
  email: string;
  job_id: string;
  mobile: string;
  gender: "male" | "female";
  cv: JobCvPayload;
  message?: string;
}

export interface JobData {
  [key: string]: unknown;
}

export const getJobApiCall = async () => {
  const response = await _get(getURL("JOBAPPLICATION.LIST"), false);

  if (!response || typeof response !== "object" || !("data" in response)) {
    throw new Error("Unable to fetch about details");
  }

  const apiResponse = (response as AxiosResponse<ApiResponse<JobData>>).data;

  if (apiResponse?.code === 200) {
    return apiResponse.data;
  }

  throw new Error(apiResponse?.message || "Unexpected response code");
};

export const createCarrerApiCall = async (
  payload: JobPayload,
): Promise<string> => {
  const response = await _post(getURL("JOBAPPLICATION.CREATE"), payload, false);

  if (!response || typeof response !== "object") {
    throw new Error("Unable to submit career form");
  }

  if ("err" in response && response.err) {
    throw new Error(String(response.err));
  }

  if (!("data" in response)) {
    throw new Error("Unable to submit career form");
  }

  const apiResponse = (response as AxiosResponse<ApiResponse<unknown>>).data;

  if (apiResponse?.code === 200 || apiResponse?.code === 201) {
    return apiResponse.message || "Application submitted successfully";
  }

  throw new Error(apiResponse?.message || "Unexpected response code");
};
