import { getURL } from "@/utils/apiConstants";
import { _get } from "@/utils/axiosInstance";
import { AxiosResponse } from "axios";

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface IndustryData {
  [key: string]: unknown;
}

export const getIndustriesApiCall = async () => {
  const response = await _get(getURL("INDUSTRY.LIST"), false);

  if (!response || typeof response !== "object" || !("data" in response)) {
    throw new Error("Unable to fetch Site Settings details");
  }

  const apiResponse = (response as AxiosResponse<ApiResponse<IndustryData>>).data;

  if (apiResponse?.code === 200) {
    return apiResponse.data;
  }

  throw new Error(apiResponse?.message || "Unexpected response code");
};
