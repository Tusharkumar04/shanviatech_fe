interface LegalUrlParams {
  type?: string;
}

export const getLegalUrl = (key: string, params: LegalUrlParams = {}) => {
  switch (key) {
    case "LIST":
      return "/legal/list";
    case "DETAILS":
      return `/legal/details/${encodeURIComponent(params.type || "")}`;
    default:
      throw new Error(`URL key "${key}" is not defined.`);
  }
};
