export const getSurveyUrl = (key: string) => {
  switch (key) {
    case "QUERIES_CMS_LIST":
      return "/survey-query/cms-list";
    case "RESPONSE_GET":
      return "/survey-response/get-responses";
    case "RESPONSE_CREATE_OR_UPDATE":
      return "/survey-response/create-or-update";
    case "VERIFICATION_SEND":
      return "/verification/send";
    case "VERIFICATION_RESEND":
      return "/verification/resend";
    case "VERIFICATION_VERIFY":
      return "/verification/verify";
    case "VERIFICATION_STATUS":
      return "/verification/status";
    default:
      throw new Error(`URL key "${key}" is not defined.`);
  }
};
