export const getHomeUrl = (key: string) => {
  switch (key) {
    case "DETAILS":
      return "/home/details";
    default:
      throw new Error(`URL key "${key}" is not defined.`);
  }
};
