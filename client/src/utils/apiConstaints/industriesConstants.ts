export const getIndustryUrl = (key: string) => {
  switch (key) {
    case "LIST":
      return "/domain-expertise/list";
    default:
      throw new Error(`URL key "${key}" is not defined.`);
  }
};
