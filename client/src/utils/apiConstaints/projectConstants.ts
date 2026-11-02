export const getProjectUrl = (key: string) => {
  switch (key) {
    case "LIST":
      return "/project/list";
    default:
      throw new Error(`URL key "${key}" is not defined.`);
  }
};
