import { getURL } from "@/utils/apiConstants";
import { _get } from "@/utils/axiosInstance";
import { AxiosResponse } from "axios";

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface TestimonialItem {
  _id?: string;
  author_image?: string;
  author_name?: string;
  author_location?: string;
  description?: string;
  [key: string]: unknown;
}

export interface TestimonialsData {
  items?: TestimonialItem[];
  [key: string]: unknown;
}

export const getTestimonialsApiCall = async (): Promise<TestimonialsData> => {
  const response = await _get(getURL("TESTIMONIALS.LIST"), false);

  if (!response || typeof response !== "object" || !("data" in response)) {
    throw new Error("Unable to fetch testimonials list");
  }

  const apiResponse = (response as AxiosResponse<ApiResponse<TestimonialsData>>).data;

  if (apiResponse?.code === 200) {
    return apiResponse.data;
  }

  throw new Error(apiResponse?.message || "Unexpected response code");
};
