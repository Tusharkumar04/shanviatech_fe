export const getProductUrl = (key: string) => {
  switch (key) {
    case "LIST":
      return "/product/list";
    default:
      throw new Error(`URL key "${key}" is not defined.`);
  }
};