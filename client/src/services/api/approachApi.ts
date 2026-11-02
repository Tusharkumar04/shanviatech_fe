import { getURL } from "@/utils/apiConstants";
import { _get } from "@/utils/axiosInstance";
import { AxiosResponse } from "axios";

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface ApproachData {
  [key: string]: unknown;
}

export const getApproachApiCall = async () => {
  const response = await _get(getURL("APPROACH.DETAILS"), false);

  if (!response || typeof response !== "object" || !("data" in response)) {
    throw new Error("Unable to fetch approach details");
  }

  const apiResponse = (response as AxiosResponse<ApiResponse<ApproachData>>).data;

  if (apiResponse?.code === 200) {
    return apiResponse.data;
  }

  throw new Error(apiResponse?.message || "Unexpected response code");
};
