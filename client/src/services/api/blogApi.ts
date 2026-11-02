import { getURL } from "@/utils/apiConstants";
import { _get } from "@/utils/axiosInstance";
import { AxiosResponse } from "axios";

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface BlogAuthor {
  name?: string;
  [key: string]: unknown;
}

export interface BlogItem {
  _id?: string;
  id?: string;
  slug?: string;
  title?: string;
  description?: string;
  short_description?: string;
  image?: string;
  updatedAt?: string;
  author?: BlogAuthor;
  metaInformation?: {
    meta_keywords?: string[];
    meta_title?: string;
    meta_description?: string;
    og_title?: string;
    og_image?: string;
    og_description?: string;
    slug?: string;
    h1?: string;
  };
  [key: string]: unknown;
}

export interface BlogData {
  items?: BlogItem[];
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
  [key: string]: unknown;
}

interface BlogListParams {
  page?: number;
  limit?: number;
  sort?: string;
}

export const getBlogApiCall = async (
  params: BlogListParams = {}
): Promise<BlogData> => {
  const response = await _get(getURL("BLOG.LIST", params), false);

  if (!response || typeof response !== "object" || !("data" in response)) {
    throw new Error("Unable to fetch blog list");
  }

  const apiResponse = (response as AxiosResponse<ApiResponse<BlogData>>).data;

  if (apiResponse?.code === 200) {
    return apiResponse.data;
  }

  throw new Error(apiResponse?.message || "Unexpected response code");
};

export const getBlogBySlugApiCall = async (
  blogSlug: string
): Promise<BlogItem | null> => {
  const response = await _get(getURL("BLOG.DETAILS", { slug: blogSlug }), false);

  if (!response || typeof response !== "object" || !("data" in response)) {
    throw new Error("Unable to fetch blog details");
  }

  const apiResponse = (response as AxiosResponse<ApiResponse<BlogItem>>).data;

  if (apiResponse?.code === 200) {
    return apiResponse.data;
  }

  throw new Error(apiResponse?.message || "Unexpected response code");
};
