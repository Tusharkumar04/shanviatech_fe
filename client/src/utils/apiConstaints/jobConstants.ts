export const getJobApplicationUrl = (key: string) => {
  switch (key) {
    case "CREATE":
      return "/job-application/";
      case "LIST":
      return "/job/list";
    default:
      throw new Error(`URL key "${key}" is not defined.`);
  }
};

