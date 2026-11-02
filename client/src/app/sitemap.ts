import { MetadataRoute } from "next";

// Required for static export when using "output: export" in next.config.ts
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.shanviatech.com";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    //   changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
    //   changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/leadership`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/approach`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/clients-stories`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/approach`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/service/branding`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/service/ui-ux`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/service/web-application`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/service/mobile-application`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/service/software-development`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/service/artificial-intelligence`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/service/machine-learning`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/service/internet-of-things`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/service/data-science-and-blockchain`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/service/ecommerce-development`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/technology`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/enterprise-expertise`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/case-studies`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/career`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/reach-us`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services-simple.html`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blogs/boosting-customer-experience-with-machine-learning-enhancing-engagement-and-loyalty`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs/the-future-of-mobile-app-development-trends-to-watch-in-2025`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs/the-importance-of-email-marketing-a-complete-guide-to-driving-engagement-and-conversions`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/legal/privacy-policy`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/legal/terms-and-conditions`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/clients-stories/services`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/expertise.html`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/case.html`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs/the-future-is-connected-a-comprehensive-guide-to-internet-of-things-iot-and-iot-app-development`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs/10-essential-tools-every-software-developer-should-know-in-2024`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs/common-ui-ux-mistakes-and-how-to-avoid-them`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs/machine-learning-in-web-applications-transforming-the-digital-landscape`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs/what-is-machine-learning-a-complete-guide`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs/the-importance-of-user-centric-design-in-web-and-app-development`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs/the-importance-of-mobile-applications-in-todays-digital-world`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs/the-future-of-web-design-how-ai-is-changing-website-development`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs/the-intersection-of-data-science-and-blockchain-a-comprehensive-overview`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs/user-centered-design-principles-for-better-uiux`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs/comprehensive-guide-to-essential-software-and-digital-services-for-modern-businesses`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs/building-ai-driven-apps-best-practices-and-tips`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs/ai-in-web-apps-the-future-of-user-experience`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs/agile-web-development-and-design-a-complete-guide`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs/how-to-choose-the-right-e-commerce-platform-for-your-business`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs/choosing-the-right-iot-app-development-company-a-step-by-step-guide`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs/a-complete-guide-to-web-applications-everything-you-need-to-know`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs/the-importance-of-ppc-ads-maximizing-roi-and-driving-business-success`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs/the-importance-of-uiux-services-in-todays-digital-landscape`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs/best-practices-for-agile-software-development`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs/how-machine-learning-improves-user-experience-in-mobile-and-web-apps`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs/how-to-integrate-ai-and-machine-learning-into-your-ecommerce-platform`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs/top-5-must-have-features-for-a-successful-ecommerce-website`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs/unlocking-the-power-of-whatsapp-ads-a-complete-guide`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs/understanding-web-applications-the-backbone-of-modern-digital-solutions`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs/the-power-of-mobile-applications-transforming-the-digital-landscape`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs/exploring-the-future-top-5-iot-trends-to-watch-in-2024`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs/the-role-of-data-quality-in-machine-learning-why-it-matters`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs/the-future-of-e-commerce-trends-to-watch`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs/social-media-marketing`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs/the-complete-guide-to-developing-an-e-commerce-website`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs/the-comprehensive-guide-for-search-engine-optimization-seo`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs/the-complete-guide-to-digital-marketing-power`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs/what-is-tensorflow`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs/quantum-computing-is-the-design-of-hardware-and-software`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs/agile-is-an-iterative-approach-to-project-management`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs/the-transformative-power-of-artificial-intelligence-ai`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/reach-us/about`,
      lastModified: new Date(),
      priority: 0.8,
    }
  ];
}