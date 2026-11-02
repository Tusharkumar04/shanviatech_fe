interface BlogUrlParams {
  slug?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export const getBlogUrl = (key: string, params: BlogUrlParams = {}) => {
  switch (key) {
    case "LIST": {
      const searchParams = new URLSearchParams();

      if (typeof params.page === "number") {
        searchParams.set("page", String(params.page));
      }

      if (typeof params.limit === "number") {
        searchParams.set("limit", String(params.limit));
      }

      if (params.sort) {
        searchParams.set("sort", params.sort);
      }

      const query = searchParams.toString();
      return query ? `/blog/list?${query}` : "/blog/list";
    }
    case "DETAILS":
      return `/blog/details/${encodeURIComponent(params.slug || "")}`;
    default:
      throw new Error(`URL key "${key}" is not defined.`);
  }
};
