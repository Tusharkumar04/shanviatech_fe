'use client';

import { getSiteSettingApiCall } from "@/services/api/siteSettingApi";
import { createContext, useContext, useEffect, useState } from "react";
import { SiteSettingsContextType, SiteSettingsData } from "./SiteSettingsContextType";

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  siteData: null,
  loading: true,
});

export const SiteSettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [siteData, setSiteData] = useState<SiteSettingsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const response = await getSiteSettingApiCall();
        setSiteData(response);
      } catch (error) {
        console.error("Site settings error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSiteSettings();
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ siteData, loading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => useContext(SiteSettingsContext);
