export const getAuthUrl = (key: string, params: any = {}) => {
  switch (key) {
    case "LOGIN":
      return `/auth/login`;
    default:
      throw new Error(`URL key "${key}" is not defined.`);
  }
};
