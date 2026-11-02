import { AxiosResponse } from "axios";
import { _get } from "@/utils/axiosInstance";
import { getURL } from "@/utils/apiConstants";

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface ProjectItem {
  _id?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  order?: number;
  [key: string]: unknown;
}

export interface ProjectsData {
  items?: ProjectItem[];
  meta?: { total?: number; page?: number; limit?: number; totalPages?: number };
  [key: string]: unknown;
}

export const getProjectsApiCall = async (): Promise<ProjectsData> => {
  const response = await _get(getURL("PROJECT.LIST"), false);

  if (!response || typeof response !== "object" || !("data" in response)) {
    throw new Error("Unable to fetch projects");
  }

  const apiResponse = (response as AxiosResponse<ApiResponse<ProjectsData>>).data;

  if (apiResponse?.code === 200) {
    return apiResponse.data;
  }

  throw new Error(apiResponse?.message || "Unexpected response code");
};
