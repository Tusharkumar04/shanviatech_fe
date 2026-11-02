export const getServiceUrl = (key: string) => {
  switch (key) {
    case "DETAILS":
      return "/service/details";
    default:
      throw new Error(`URL key "${key}" is not defined.`);
  }
};
