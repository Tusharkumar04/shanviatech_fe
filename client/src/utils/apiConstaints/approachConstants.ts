export const getApproachUrl = (key: string) => {
  switch (key) {
    case "DETAILS":
      return "/approach/details";
    default:
      throw new Error(`URL key "${key}" is not defined.`);
  }
};
