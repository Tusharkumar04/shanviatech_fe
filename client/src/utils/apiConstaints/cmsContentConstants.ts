export const getCmsContentUrl = (key: string) => {
  switch (key) {
    case "DETAILS":
      return "/cms-content/details";
    default:
      throw new Error(`URL key "${key}" is not defined.`);
  }
};
