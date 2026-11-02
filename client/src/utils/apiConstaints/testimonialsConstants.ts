export const getTestimonialsUrl = (key: string) => {
  switch (key) {
    case "LIST":
      return "/testimonial/list";
    default:
      throw new Error(`URL key "${key}" is not defined.`);
  }
};
