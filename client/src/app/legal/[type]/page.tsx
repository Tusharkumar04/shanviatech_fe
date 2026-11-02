import LegalDetails from "@/components/layouts/LegalDetails";
import { getLegalStaticParams } from "@/utils/staticParams";

interface LegalDetailsPageProps {
  params: Promise<{ type: string }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  return getLegalStaticParams();
}

export default async function LegalDetailsPage({ params }: LegalDetailsPageProps) {
  const { type } = await params;

  return <LegalDetails type={type} />;
}
