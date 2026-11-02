import { AxiosResponse } from "axios";
import { _get } from "@/utils/axiosInstance";
import { getURL } from "@/utils/apiConstants";

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface ProductData {
  [key: string]: unknown;
}

export const getProductsApiCall = async () => {
  const response = await _get(getURL("PRODUCT.LIST"), false);

  if (!response || typeof response !== "object" || !("data" in response)) {
    throw new Error("Unable to fetch products");
  }

  const apiResponse = (response as AxiosResponse<ApiResponse<ProductData>>).data;

  if (apiResponse?.code === 200) {
    return apiResponse;
  }

  throw new Error(apiResponse?.message || "Unexpected response code");
};
export interface ProductDetail {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  key_features?: string[];
  images?: string[];
  order?: number;
  image?: string;
  imageUrl?: string;
  livePreviewUrl?: string;
  supportTitle?: string;
  supportSub?: string;
}

export const getProductDetailsApiCall = async (productId: string): Promise<ProductDetail> => {
  const response = await _get(getURL("PRODUCT.DETAILS", { id: productId }), false);

  if (!response || typeof response !== "object" || !("data" in response)) {
    throw new Error("Unable to fetch product details");
  }

  const apiResponse = (response as AxiosResponse<ApiResponse<ProductDetail>>).data;

  if (apiResponse?.code === 200) {
    return apiResponse.data;
  }

  throw new Error(apiResponse?.message || "Unexpected response code");
};
