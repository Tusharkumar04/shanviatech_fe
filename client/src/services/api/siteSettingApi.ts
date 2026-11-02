import { getURL } from "@/utils/apiConstants";
import { _get } from "@/utils/axiosInstance";
import { AxiosResponse } from "axios";

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface SiteSettingData {
  [key: string]: unknown;
}

export const getSiteSettingApiCall = async () => {
  const response = await _get(getURL("SITESETTING.DETAILS"), false);

  if (!response || typeof response !== "object" || !("data" in response)) {
    throw new Error("Unable to fetch Site Settings details");
  }

  const apiResponse = (response as AxiosResponse<ApiResponse<SiteSettingData>>).data;

  if (apiResponse?.code === 200) {
    return apiResponse.data;
  }

  throw new Error(apiResponse?.message || "Unexpected response code");
};
