'use client';

import { getServiceApiCall } from "@/services/api/serviceApi";
import { createContext, useContext, useEffect, useState } from "react";

export interface ServiceHighlight {
  _id?: string;
  title?: string;
  description?: string;
  image?: string[];
  order?: number;
}

export interface MetaInformationService {
  meta_keywords?: string[];
  meta_title?: string;
  meta_description?: string;
  og_title?: string;
  og_image?: string;
  og_description?: string;
  slug?: string;
  h1?: string;
}

export interface ServiceSolutionHighlight {
  _id?: string;
  title?: string;
  description?: string;
  description2?: string;
  image?: string;
  link?: string;
}

export interface ServiceItem {
  _id?: string;
  name?: string;
  title?: string;
  subtitle?: string;
  image?: string;
  order?: number;
  slug?: string;
  show_in_page?: boolean;
  highlights?: ServiceHighlight[];
  tech?: string[] | any;
  metaInformation?: MetaInformationService;
}

export interface DigitalSolution {
  title?: string;
  subtitle?: string;
  highlights?: ServiceSolutionHighlight[];
}

export interface ServiceComponentData {
  services?: ServiceItem[];
  digital_experiences?: {
    title?: string;
    subtitle?: string;
    description?: string;
    button_title?: string;
  };
  agile_project?: {
    title?: string;
    subtitle?: string;
    description?: string;
    button_title?: string;
    image?: string;
  };
  digital_solutions?: DigitalSolution[];
  quality_assurance?: {
    image?: string;
    title?: string;
    subtitle?: string;
    description?: string;
  };
}

interface ServiceContextType {
  serviceData: ServiceComponentData | null;
  loading: boolean;
  error: string;
}

const ServiceContext = createContext<ServiceContextType>({
  serviceData: null,
  loading: true,
  error: "",
});

export const ServiceProvider = ({ children }: { children: React.ReactNode }) => {
  const [serviceData, setServiceData] = useState<ServiceComponentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = (await getServiceApiCall()) as ServiceComponentData;
        setServiceData(response);
      } catch (err) {
        console.error("Service API error:", err);
        setError("Unable to load services.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <ServiceContext.Provider value={{ serviceData, loading, error }}>
      {children}
    </ServiceContext.Provider>
  );
};

export const useServicesData = () => useContext(ServiceContext);
