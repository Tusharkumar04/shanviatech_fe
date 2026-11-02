import { AxiosResponse } from "axios";
import { _get } from "@/utils/axiosInstance";
import { getURL } from "@/utils/apiConstants";

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface WorkStep {
  _id?: string;
  title?: string;
  description?: string;
  icon?: string;
  order?: number;
}

export interface WorkMethod {
  _id?: string;
  title?: string;
  description?: string;
  order?: number;
}

export interface WorkData {
  title?: string;
  image?: string;
  points?: string[];
  button_title?: string;
  link?: string;
  our_process?: WorkStep[];
  our_methodology?: WorkMethod[];
  [key: string]: unknown;
}

export const getWorkApiCall = async (): Promise<WorkData> => {
  const response = await _get(getURL("WORK.DETAILS"), false);

  if (!response || typeof response !== "object" || !("data" in response)) {
    throw new Error("Unable to fetch work details");
  }

  const apiResponse = (response as AxiosResponse<ApiResponse<WorkData>>).data;

  if (apiResponse?.code === 200) {
    return apiResponse.data;
  }

  throw new Error(apiResponse?.message || "Unexpected response code");
};
