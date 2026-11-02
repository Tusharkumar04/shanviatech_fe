import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { config } from "./config";
import { getApiHeaders } from "./apiConstants";

export const axiosInstance = axios.create({
  baseURL: config.baseURL,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: any) => {
    if (error.name === "CanceledError") {
      return Promise.reject(error);
    }

    const message = error?.response?.data?.message;
    const isExistToken = error?.response?.data?.isExistToken;

    if (message && isExistToken) {
      toast.error(message, {
        toastId: message,
      });
    }

    return Promise.reject(error);
  },
);

const _get = async (url: string, isAuthenticated = true) => {
  try {
    return await axiosInstance.get(url, {
      ...(isAuthenticated ? getApiHeaders() : {}),
    });
  } catch (error: any) {
    if (error.name === "CanceledError") return;
    const err = error as AxiosError;
    const errorMessage: any | {} = err?.response?.data;
    if (!errorMessage?.isExistToken) {
      return { err: errorMessage?.message };
    } else {
      toast.error(errorMessage?.message);
      return { err: errorMessage?.message };
    }
  }
};

const _post = async (url: string, data: any = {}, isAuthenticated = true) => {
  const headers: Record<string, string> = isAuthenticated
    ? getApiHeaders().headers
    : {};

  if (data instanceof FormData) {
    delete headers["Content-Type"];
  }

  const body = JSON.stringify(data);

  try {
    return await axiosInstance.post(url, data, {
      headers,
    });
  } catch (error: any) {
    if (error.name === "CanceledError") return;
    const err = error as AxiosError;

    const errorMessage: any | {} = err?.response?.data;

    if (!errorMessage?.isExistToken) {
      return { err: errorMessage?.message, code: errorMessage?.code };
    } else {
      toast.error(errorMessage?.message);
      return { err: errorMessage?.message, code: errorMessage?.code };
    }
  }
};

const _put = async (url: string, data: any = {}, isAuthenticated = true) => {
  const headers: Record<string, string> = isAuthenticated
    ? getApiHeaders().headers
    : {};

  if (data instanceof FormData) {
    delete headers["Content-Type"];
  }

  const body = JSON.stringify(data);

  try {
    return await axiosInstance.put(url, data, {
      headers,
    });
  } catch (error: any) {
    if (error.name === "CanceledError") return;
    const err = error as AxiosError;
    const errorMessage: any | {} = err?.response?.data;

    if (!errorMessage?.isExistToken) {
      return { err: errorMessage?.message };
    } else {
      toast.error(errorMessage?.message);
      return { err: errorMessage?.message };
    }
  }
};

const _patch = async (url: string, data: any = {}, isAuthenticated = true) => {
  const headers: Record<string, string> = isAuthenticated
    ? getApiHeaders().headers
    : {};

  if (data instanceof FormData) {
    delete headers["Content-Type"];
  }

  const body = JSON.stringify(data);

  try {
    return await axiosInstance.patch(url, data, {
      headers,
    });
  } catch (error: any) {
    if (error.name === "CanceledError") return;
    const err = error as AxiosError;
    const errorMessage: any | {} = err?.response?.data;

    if (!errorMessage?.isExistToken) {
      return { err: errorMessage?.message };
    } else {
      toast.error(errorMessage?.message);
      return { err: errorMessage?.message };
    }
  }
};

const _delete = async (url: string, data?: any, isAuthenticated = true) => {
  const configData = isAuthenticated ? getApiHeaders() : {};

  try {
    return await axiosInstance.delete(url, {
      ...configData,
      data,
    });
  } catch (error: any) {
    if (error.name === "CanceledError") return;
    const err = error as AxiosError;
    const errorMessage: any | {} = err?.response?.data;

    if (!errorMessage?.isExistToken) {
      return { err: errorMessage?.message };
    } else {
      toast.error(errorMessage?.message);
      return { err: errorMessage?.message };
    }
  }
};

export { _get, _post, _put, _patch, _delete };
