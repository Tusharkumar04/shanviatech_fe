export const getExpertiseUrl = (key: string) => {
  switch (key) {
    case "LIST":
      return "/technology/list";
    default:
      throw new Error(`URL key "${key}" is not defined.`);
  }
};
