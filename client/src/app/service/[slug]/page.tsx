import { Metadata } from "next";
import ServiceDetails from "@/components/layouts/ServiceDetails";
import { getServiceStaticParams } from "@/utils/staticParams";
import { getServiceBySlug, generateServiceMetadata } from "@/utils/seoMetadata";

interface ServiceDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  return getServiceStaticParams();
}

export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  console.log(slug,'slug')

  try {
    const service = await getServiceBySlug(slug);
    console.log(service,'OqdEtoXT5Fnwov3xOqdEtoXT5Fnwov3xOqdEtoXT5Fnwov3x')

    if (!service) {
      return {
        title: "Service Not Found | Shanvia Tech",
        description: "The service you are looking for could not be found.",
      };
    }

    return generateServiceMetadata(service);
  } catch (error) {
    console.error(`Error generating metadata for service ${slug}:`, error);
    return {
      title: "Service | Shanvia Tech",
      description: "Shanvia Tech provides modern web development, mobile app development, and digital solutions.",
    };
  }
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params;

  return <ServiceDetails slug={slug} />;
}
