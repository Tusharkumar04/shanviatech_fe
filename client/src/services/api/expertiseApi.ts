import { getURL } from "@/utils/apiConstants";
import { _get } from "@/utils/axiosInstance";
import { AxiosResponse } from "axios";

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface ExpertiseData {
  [key: string]: unknown;
}

export const getExpertiseApiCall = async () => {
  const response = await _get(getURL("EXPERTISE.LIST"), false);

  if (!response || typeof response !== "object" || !("data" in response)) {
    throw new Error("Unable to fetch expertise list");
  }

  const apiResponse = (response as AxiosResponse<ApiResponse<ExpertiseData>>).data;

  if (apiResponse?.code === 200) {
    return apiResponse.data;
  }

  throw new Error(apiResponse?.message || "Unexpected response code");
};
