export const getWorkUrl = (key: string) => {
  switch (key) {
    case "DETAILS":
      return "/work/details";
    default:
      throw new Error(`URL key "${key}" is not defined.`);
  }
};
