export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
}

export interface SiteAddress {
  _id?: string;
  is_primary?: boolean;
  email?: string;
  locality?: string;
  city?: string;
  state?: string;
  country?: string;
  pin_code?: number;
  latitude?: number;
  longitude?: number;
}

export interface SiteCertificate {
  _id?: string;
  name?: string;
  image?: string;
  pdf?: string;
}

export interface SiteSettingsData {
  logo?: string | any;
  email?: string;
  mobile?: string;
  description?: string;
  social_links?: SocialLinks;
  cin_no?: string;
  addresses?: SiteAddress[];
  certificates?: SiteCertificate[];
  peoples?: string[] | any;
  intresting?: string[] | any;
}

export interface SiteSettingsContextType {
  siteData: SiteSettingsData | null;
  loading: boolean;
}
