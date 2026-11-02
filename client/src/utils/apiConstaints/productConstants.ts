export const getProductUrl = (key: string, params: { id?: string } = {}) => {
  switch (key) {
    case "LIST":
      return "/product/list";
    case "DETAILS":
      return `/product/details/${encodeURIComponent(params.id || "")}`;
    default:
      throw new Error(`URL key "${key}" is not defined.`);
  }
};
