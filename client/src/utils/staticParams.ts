import { API_BASE_URL } from "@/utils/config";

interface ApiResponse<T> {
  code?: number;
  data?: T;
}

interface BlogListItem {
  slug?: string;
}

interface BlogListData {
  items?: BlogListItem[];
  meta?: {
    total?: number;
  };
}

interface ServiceListItem {
  slug?: string;
}

interface ServiceListData {
  services?: ServiceListItem[];
}

interface LegalListItem {
  type?: string;
}

interface LegalListData {
  items?: LegalListItem[];
}

const normalizeBaseUrl = (baseUrl: string) => baseUrl.replace(/\/+$/, "");

const fetchApiData = async <T>(path: string): Promise<T | null> => {
  try {
    const url = `${normalizeBaseUrl(API_BASE_URL)}${path}`;
    console.log(`[StaticParams] Fetching: ${url}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`[StaticParams] API error for ${path}: Status ${response.status}`);
      return null;
    }

    const payload = (await response.json()) as ApiResponse<T>;
    if (payload?.code === 200) {
      console.log(`[StaticParams] Successfully fetched ${path}`);
      return payload.data ?? null;
    } else {
      console.error(`[StaticParams] API code error for ${path}:`, payload?.code);
      return null;
    }
  } catch (error) {
    console.error(`[StaticParams] Failed to fetch ${path}:`, error instanceof Error ? error.message : String(error));
    return null;
  }
};

export const getBlogStaticParams = async (): Promise<Array<{ slug: string }>> => {
  const initialData = await fetchApiData<BlogListData>("/blog/list?limit=1");
  const total = initialData?.meta?.total ?? initialData?.items?.length ?? 0;
  const limit = total > 0 ? total : 100;
  const blogData = await fetchApiData<BlogListData>(`/blog/list?limit=${limit}`);

  return (blogData?.items ?? [])
    .map((item) => item.slug?.trim())
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({ slug }));
};

export const getServiceStaticParams = async (): Promise<Array<{ slug: string }>> => {
  const serviceData = await fetchApiData<ServiceListData>("/service/details");

  return (serviceData?.services ?? [])
    .map((item) => item.slug?.trim())
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({ slug }));
};

export const getLegalStaticParams = async (): Promise<Array<{ type: string }>> => {
  const legalData = await fetchApiData<LegalListData>("/legal/list");

  return (legalData?.items ?? [])
    .map((item) => item.type?.trim())
    .filter((type): type is string => Boolean(type))
    .map((type) => ({ type }));
};
