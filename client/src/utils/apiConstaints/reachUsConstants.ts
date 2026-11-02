export const getReachUsUrl = (key: string) => {
  switch (key) {
    case "CREATE":
      return "/reach/";
    case "SEND_OTP":
      return "/reach/send-otp";
    case "VERIFY_OTP":
      return "/reach/verify-otp";
    default:
      throw new Error(`URL key "${key}" is not defined.`);
  }
};

