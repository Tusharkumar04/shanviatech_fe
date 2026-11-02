import { Metadata } from "next";
import Home from "@/components/layouts/Home";
import { fetchHomeData, generateHomeMetadata } from "@/utils/seoMetadata";


export async function generateMetadata(): Promise<Metadata> {
  try {
    const homeData = await fetchHomeData();

    if (!homeData) {
      return {
        title: {
          default: "Shanvia Tech",
          template: "%s | Shanvia Tech",
        },
        description:
          "Shanvia Tech provides modern web development, mobile app development, digital solutions, and business automation services.",
      };
    }

    return generateHomeMetadata(homeData);
  } catch (error) {
    console.error("Error generating home page metadata:", error);
    return {
      title: {
        default: "Shanvia Tech",
        template: "%s | Shanvia Tech",
      },
      description:
        "Shanvia Tech provides modern web development, mobile app development, digital solutions, and business automation services.",
    };
  }
}

const HomePage = () => {
  return <Home />;
};

export default HomePage;