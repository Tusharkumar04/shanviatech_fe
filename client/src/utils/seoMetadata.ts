import { Metadata } from "next";
import { API_BASE_URL } from "@/utils/config";

interface ServiceHighlight {
  _id?: string;
  title?: string;
  description?: string;
  image?: string[];
  order?: number;
}

interface MetaInformationService {
  meta_keywords?: string[];
  meta_title?: string;
  meta_description?: string;
  og_title?: string;
  og_image?: string;
  og_description?: string;
  slug?: string;
  h1?: string;
}

interface ServiceItem {
  _id?: string;
  name?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  order?: number;
  slug?: string;
  show_in_page?: boolean;
  highlights?: ServiceHighlight[];
  tech?: string[] | any;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  h1?: string;
  metaInformation?: MetaInformationService;
}

interface ServiceComponentData {
  services?: ServiceItem[];
}

interface ApiResponse<T> {
  code?: number;
  data?: T;
}

const normalizeBaseUrl = (baseUrl: string) => baseUrl.replace(/\/+$/, "");

/**
 * Fetch service data from API
 */
export const fetchServiceData = async (): Promise<ServiceComponentData | null> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${normalizeBaseUrl(API_BASE_URL)}/service/details`, {
      next: { revalidate: 60 },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as ApiResponse<ServiceComponentData>;
    return payload?.code === 200 ? (payload.data ?? null) : null;
  } catch (error) {
    console.warn(
      "Failed to fetch service data for metadata:",
      error instanceof Error ? error.message : String(error)
    );
    return null;
  }
};

/**
 * Get a specific service by slug
 */
export const getServiceBySlug = async (slug: string): Promise<ServiceItem | null> => {
  const serviceData = await fetchServiceData();
  if (!serviceData?.services) return null;

  return (
    serviceData.services.find((service) => service.slug?.trim().toLowerCase() === slug.toLowerCase()) ||
    null
  );
};

/**
 * Extract text content from HTML string
 */
const stripHtmlTags = (html: string | undefined): string => {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
};

/**
 * Generate keywords from service data
 */
const generateKeywords = (service: ServiceItem): string[] => {
  const keywords: Set<string> = new Set();

  // Add service name/title
  if (service.name) keywords.add(service.name);
  if (service.title) keywords.add(service.title);

  // Add technologies
  if (service.tech && Array.isArray(service.tech)) {
    service.tech.forEach((tech) => {
      if (typeof tech === "string") {
        keywords.add(tech);
      } else if (tech?.name) {
        keywords.add(tech.name);
      }
    });
  }

  // Add from highlights
  if (service.highlights && Array.isArray(service.highlights)) {
    service.highlights.forEach((highlight) => {
      if (highlight.title) keywords.add(highlight.title);
    });
  }

  // Add "services", "Shanvia Tech" context
  keywords.add("Services");
  keywords.add("Shanvia Tech");

  return Array.from(keywords);
};

/**
 * Extract description from service highlights
 */
const extractDescription = (service: ServiceItem): string => {
  // Priority 1: Use metaInformation.meta_description from API
  if (service.metaInformation?.meta_description) {
    return service.metaInformation.meta_description;
  }

  // Priority 2: Use legacy meta_description field
  if (service.meta_description) {
    return service.meta_description;
  }

  // Priority 3: Try to get description from first highlight
  if (service.highlights && service.highlights.length > 0) {
    const cleanText = stripHtmlTags(service.highlights[0].description);
    if (cleanText) {
      // Return first 160 characters for meta description
      return cleanText.substring(0, 160) + (cleanText.length > 160 ? "..." : "");
    }
  }

  // Priority 4: Fallback to subtitle
  if (service.subtitle) {
    return service.subtitle.substring(0, 160);
  }

  return "Shanvia Tech provides modern web development, mobile app development, and digital solutions for businesses.";
};

/**
 * Generate dynamic metadata for service pages from API metaInformation
 */
export const generateServiceMetadata = (service: ServiceItem): Metadata => {
  console.log(service,'serviceserviceserviceservice')
  const metaInfo = service.metaInformation;

  // Priority 1: Use values from metaInformation (API response)
  const title = metaInfo?.meta_title || service.meta_title || service.name || service.title || "Service";
  const description = extractDescription(service);
  const keywords = metaInfo?.meta_keywords || generateKeywords(service);
  const ogTitle = metaInfo?.og_title || title;
  const ogDescription = metaInfo?.og_description || description;
  const ogImage = metaInfo?.og_image || service.image || "/siteLogo.png";
  const canonicalUrl = `https://www.shanviatech.com/service/${service.slug}`;

  return {
    title: `${title} | Shanvia Tech Solutions`,
    description,
    keywords:
      Array.isArray(keywords) && keywords.length > 0
        ? keywords
        : generateKeywords(service),
    metadataBase: new URL("https://www.shanviatech.com"),

    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl,
      type: "website",
      siteName: "Shanvia Tech Solutions",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: ogTitle,
        },
      ],
      locale: "en_US",
    },

    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [ogImage],
    },

    robots: {
      index: true,
      follow: true,
    },

    alternates: {
      canonical: canonicalUrl,
    },
  };
};

/**
 * Get H1 tag content for service page
 */
export const getServiceH1 = (service: ServiceItem): string => {
  return service.h1 || service.name || service.title || "Service";
};

const blogDataCache = new Map<string, BlogItem | null>();

interface BlogItem {
  _id?: string;
  id?: string;
  slug?: string;
  title?: string;
  description?: string;
  short_description?: string;
  image?: string;
  updatedAt?: string;
  author?: {
    name?: string;
    [key: string]: unknown;
  };
  metaInformation?: MetaInformationService;
  [key: string]: unknown;
}

export const fetchBlogData = async (slug: string): Promise<BlogItem | null> => {
  const normalizedSlug = slug.trim().toLowerCase();
  if (blogDataCache.has(normalizedSlug)) {
    return blogDataCache.get(normalizedSlug) ?? null;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(
      `${normalizeBaseUrl(API_BASE_URL)}/blog/details/${encodeURIComponent(slug)}`,
      {
        next: { revalidate: 60 },
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as ApiResponse<BlogItem>;
    const blog = payload?.code === 200 ? payload.data ?? null : null;
    blogDataCache.set(normalizedSlug, blog);
    return blog;
  } catch (error) {
    console.warn(
      "Failed to fetch blog data for metadata:",
      error instanceof Error ? error.message : String(error)
    );
    blogDataCache.set(normalizedSlug, null);
    return null;
  }
};

const extractBlogDescription = (blog: BlogItem): string => {
  if (blog.metaInformation?.meta_description) {
    return blog.metaInformation.meta_description;
  }

  if (blog.short_description) {
    return blog.short_description;
  }

  if (blog.description) {
    const stripped = stripHtmlTags(blog.description);
    return stripped.substring(0, 160) + (stripped.length > 160 ? "..." : "");
  }

  return "Shanvia Tech provides modern web development, mobile app development, and digital solutions for businesses.";
};

export const generateBlogMetadata = (blog: BlogItem): Metadata => {
  const metaInfo = blog.metaInformation;
  const title = metaInfo?.meta_title || blog.title || "Blog";
  const description = extractBlogDescription(blog);
  const keywords =
    metaInfo?.meta_keywords && metaInfo.meta_keywords.length > 0
      ? metaInfo.meta_keywords
      : ["Shanvia Tech", blog.title || "Blog", "Web Development", "Digital Solutions"];
  const ogTitle = metaInfo?.og_title || title;
  const ogDescription = metaInfo?.og_description || description;
  const ogImage = metaInfo?.og_image || blog.image || "/siteLogo.png";
  const canonicalUrl = `https://www.shanviatech.com/blogs/${blog.slug}`;

  return {
    title: `${title} | Shanvia Tech`,
    description,
    keywords:
      Array.isArray(keywords) && keywords.length > 0
        ? keywords
        : ["Shanvia Tech", blog.title || "Blog", "Web Development", "Digital Solutions"],
    metadataBase: new URL("https://www.shanviatech.com"),

    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl,
      type: "website",
      siteName: "Shanvia Tech",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: ogTitle,
        },
      ],
      locale: "en_US",
    },

    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [ogImage],
    },

    robots: {
      index: true,
      follow: true,
    },

    alternates: {
      canonical: canonicalUrl,
    },
  };
};

// ============================================================================
// HOME PAGE METADATA
// ============================================================================

interface MetaInformation {
  meta_keywords?: string[];
  meta_title?: string;
  meta_description?: string;
  slug?: string;
  og_title?: string;
  og_image?: string;
  og_description?: string;
}

interface HomeComponentData {
  metaInformation?: MetaInformation;
  [key: string]: unknown;
}


//   Fetch home page data from API
 
export const fetchHomeData = async (): Promise<HomeComponentData | null> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${normalizeBaseUrl(API_BASE_URL)}/home/details`, {
      next: { revalidate: 60 },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as ApiResponse<HomeComponentData>;
    return payload?.code === 200 ? (payload.data ?? null) : null;
  } catch (error) {
    console.warn(
      "Failed to fetch home data for metadata:",
      error instanceof Error ? error.message : String(error)
    );
    return null;
  }
};


// Generate dynamic metadata for home page
 
export const generateHomeMetadata = (homeData: HomeComponentData): Metadata => {
  const metaInfo = homeData?.metaInformation;

  const title = metaInfo?.meta_title || "Shanvia Tech";
  const description =
    metaInfo?.meta_description ||
    "Shanvia Tech provides modern web development, mobile app development, digital solutions, and business automation services.";
  const keywords = metaInfo?.meta_keywords?.length
    ? metaInfo.meta_keywords
    : [
        "Shanvia Tech",
        "Web Development",
        "Mobile App Development",
        "Software Development",
        "Digital Solutions",
      ];
  const ogTitle = metaInfo?.og_title || title;
  const ogDescription = metaInfo?.og_description || description;
  const ogImage = metaInfo?.og_image || "/siteLogo.png";
  const canonicalUrl = "https://www.shanviatech.com";

  return {
    title: {
      default: title,
      template: "%s | Shanvia Tech",
    },
    description,
    keywords:
      Array.isArray(keywords) && keywords.length > 0
        ? keywords
        : [
            "Shanvia Tech",
            "Web Development",
            "Mobile App Development",
            "Software Development",
            "Digital Solutions",
          ],
    metadataBase: new URL("https://www.shanviatech.com"),

    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl,
      siteName: "Shanvia Tech",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: ogTitle,
        },
      ],
      locale: "en_US",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [ogImage],
    },

    robots: {
      index: true,
      follow: true,
    },

    alternates: {
      canonical: canonicalUrl,
    },
  };
};
