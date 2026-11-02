import { getURL } from "@/utils/apiConstants";
import { _get } from "@/utils/axiosInstance";
import { AxiosResponse } from "axios";

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface CmsData {
  [key: string]: unknown;
}

export const getCmsApiCall = async () => {
  const response = await _get(getURL("CMSCONTENT.DETAILS"), false);

  if (!response || typeof response !== "object" || !("data" in response)) {
    throw new Error("Unable to fetch about details");
  }

  const apiResponse = (response as AxiosResponse<ApiResponse<CmsData>>).data;

  if (apiResponse?.code === 200) {
    return apiResponse.data;
  }

  throw new Error(apiResponse?.message || "Unexpected response code");
};
