export const getLeadershipUrl = (key: string) => {
  switch (key) {
    case "LIST":
      return "/leadership/list";
    default:
      throw new Error(`URL key "${key}" is not defined.`);
  }
};
