export const getAboutUrl = (key: string) => {
  switch (key) {
    case "DETAILS":
      return "/about/details";
    default:
      throw new Error(`URL key "${key}" is not defined.`);
  }
};
