export const getCaseStudiesUrl = (key: string) => {
  switch (key) {
    case "LIST":
      return "/case-study/list";
    default:
      throw new Error(`URL key "${key}" is not defined.`);
  }
};
