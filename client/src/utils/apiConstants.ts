import { getAboutUrl } from "./apiConstaints/aboutConstants";
import { getApproachUrl } from "./apiConstaints/approachConstants";
import { getAuthUrl } from "./apiConstaints/authConstants";
import { getBlogUrl } from "./apiConstaints/blogConstants";
import { getCaseStudiesUrl } from "./apiConstaints/caseStudiesConstants";
import { getCmsContentUrl } from "./apiConstaints/cmsContentConstants";
import { getExpertiseUrl } from "./apiConstaints/expertiseConstants";
import { getHomeUrl } from "./apiConstaints/homeConstants";
import { getIndustryUrl } from "./apiConstaints/industriesConstants";
import { getJobApplicationUrl } from "./apiConstaints/jobConstants";
import { getProductUrl } from "./apiConstaints/productConstants";
import { getLeadershipUrl } from "./apiConstaints/leadershipConstants";
import { getLegalUrl } from "./apiConstaints/legalConstants";
import { getReachUsUrl } from "./apiConstaints/reachUsConstants";
import { getServiceUrl } from "./apiConstaints/serviceConstant";
import { getSiteSettingUrl } from "./apiConstaints/siteSettingConstant";
import { getSurveyUrl } from "./apiConstaints/surveyConstants";
import { getTestimonialsUrl } from "./apiConstaints/testimonialsConstants";

export const getApiHeaders = () => {
  const token = localStorage.getItem("accessToken") || null;

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

export const getURL = (key: string, params = {}) => {
  const [moduleName, apiName] = key.split(".");
  switch (moduleName) {
    case "AUTH":
      return getAuthUrl(apiName, params);
    case "HOME":
      return getHomeUrl(apiName);
    case "SITESETTING":
      return getSiteSettingUrl(apiName);
    case "SERVICE":
      return getServiceUrl(apiName);
    case "EXPERTISE":
      return getExpertiseUrl(apiName);
    case "INDUSTRY":
      return getIndustryUrl(apiName);
    case "CASESTUDIES":
      return getCaseStudiesUrl(apiName);
    case "ABOUT":
      return getAboutUrl(apiName);
    case "BLOG":
      return getBlogUrl(apiName, params);
    case "APPROACH":
      return getApproachUrl(apiName);
    case "LEADERSHIP":
      return getLeadershipUrl(apiName);
    case "TESTIMONIALS":
      return getTestimonialsUrl(apiName);
    case "REACHUS":
      return getReachUsUrl(apiName);
    case "JOBAPPLICATION":
      return getJobApplicationUrl(apiName);
    case "CMSCONTENT":
      return getCmsContentUrl(apiName);
    case "LEGAL":
      return getLegalUrl(apiName, params);
    case "SURVEY":
      return getSurveyUrl(apiName);
    case "PRODUCT":
      return getProductUrl(apiName);
    default:
      throw new Error(`URL key "${key}" is not defined.`);
  }
};
