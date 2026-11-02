export const getSiteSettingUrl = (key: string) => {
  switch (key) {
    case "DETAILS":
      return "/site-setting/details";
    default:
      throw new Error(`URL key "${key}" is not defined.`);
  }
};
