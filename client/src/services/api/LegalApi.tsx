import { getURL } from "@/utils/apiConstants";
import { _get } from "@/utils/axiosInstance";
import { AxiosResponse } from "axios";

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface LegalItem {
  _id?: string;
  type?: string;
  slug?: string;
  title?: string;
  description?: string;
  content?: string;
  [key: string]: unknown;
}

export interface LegalListData {
  items?: LegalItem[];
  [key: string]: unknown;
}

export const getLegalApiCall = async (): Promise<LegalListData> => {
  const response = await _get(getURL("LEGAL.LIST"), false);

  if (!response || typeof response !== "object" || !("data" in response)) {
    throw new Error("Unable to fetch legal list");
  }

  const apiResponse = (response as AxiosResponse<ApiResponse<LegalListData>>).data;

  if (apiResponse?.code === 200) {
    return apiResponse.data;
  }

  throw new Error(apiResponse?.message || "Unexpected response code");
};

export const getLegalByTypeApiCall = async (
  type: string
): Promise<LegalItem | null> => {
  const response = await _get(getURL("LEGAL.DETAILS", { type }), false);

  if (!response || typeof response !== "object" || !("data" in response)) {
    throw new Error("Unable to fetch legal details");
  }

  const apiResponse = (response as AxiosResponse<ApiResponse<LegalItem>>).data;

  if (apiResponse?.code === 200) {
    return apiResponse.data;
  }

  throw new Error(apiResponse?.message || "Unexpected response code");
};
