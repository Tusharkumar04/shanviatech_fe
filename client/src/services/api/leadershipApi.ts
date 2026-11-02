import { getURL } from "@/utils/apiConstants";
import { _get } from "@/utils/axiosInstance";
import { AxiosResponse } from "axios";

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface LeadershipData {
  [key: string]: unknown;
}

export const getLeadershipApiCall = async () => {
  const response = await _get(getURL("LEADERSHIP.LIST"), false);

  if (!response || typeof response !== "object" || !("data" in response)) {
    throw new Error("Unable to fetch leadership list");
  }

  const apiResponse = (response as AxiosResponse<ApiResponse<LeadershipData>>).data;

  if (apiResponse?.code === 200) {
    return apiResponse.data;
  }

  throw new Error(apiResponse?.message || "Unexpected response code");
};
