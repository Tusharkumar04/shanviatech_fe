import type { Metadata } from "next";
import "@/app/globals.css";

import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import Script from "next/script";
import { SiteSettingsProvider } from "@/context/SiteSettingsContext";
import { ServiceProvider } from "@/context/ServiceContext";
import Certificate from "@/components/layouts/Certificate";
import SurveyPopup from "@/components/layouts/SurveyPopup";
import GoogleAnalytics from "@/components/GoogleAnalytics";


export const revalidate = 60;


export const metadata: Metadata = {
  metadataBase: new URL("https://www.shanviatech.com"),

  title: {
    default:
      "Best AI Development & Software Company in Kolkata, India | Shanvia Tech Solutions",
    template: "%s | Shanvia Tech Solutions",
  },

  description:
    "Shanvia Tech Solutions offers AI development, mobile apps, web development, ecommerce, IoT, blockchain & digital marketing services.",

  keywords: [
    "Branding and Digital Marketing Agency in Kolkata",
    "Affordable UI UX Design Services India",
    "Web Application Development Company in Kolkata",
    "Mobile App Development Company in Kolkata",
    "AI Development Company Kolkata",
    "Ecommerce Development Company in Kolkata",
    "Blockchain Development Company India",
    "Machine Learning Development Company India",
    "Software Development Company Kolkata",
    "Digital Marketing Company Kolkata",
    "Web Development Company India",
    "Shanvia Tech Solutions",
  ],

  authors: [
    {
      name: "Shanvia Tech Solutions",
    },
  ],

  creator: "Shanvia Tech Solutions",
  publisher: "Shanvia Tech Solutions",

  openGraph: {
    title:
      "Best AI Development & Software Company in Kolkata, India | Shanvia Tech Solutions",
    description:
      "Shanvia Tech Solutions offers AI development, mobile apps, web development, ecommerce, IoT, blockchain & digital marketing services.",
    url: "https://www.shanviatech.com",
    siteName: "Shanvia Tech Solutions",
    images: [
      {
        url: "/siteLogo.png", // Recommended: 1200x630 image
        width: 1200,
        height: 630,
        alt: "Shanvia Tech Solutions",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Best AI Development & Software Company in Kolkata, India | Shanvia Tech Solutions",
    description:
      "Shanvia Tech Solutions offers AI development, mobile apps, web development, ecommerce, IoT, blockchain & digital marketing services.",
    images: ["/siteLogo.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: "https://www.shanviatech.com",
  },

  category: "Technology",

  // icons: {
  //   icon: "/favicon.ico",
  //   shortcut: "/favicon.ico",
  //   apple: "/apple-touch-icon.png",
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="aFkLJ7pA9pwiu-bbg34iE71g6Bg8i7LQSOz4P9HUK5Y"
        />
        {/* <Script
          id="facebook-pixel"
          strategy="afterInteractive"
        >
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}
            (window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');

            fbq('init', '3569115919913260');
            fbq('track', 'PageView');
          `}
        </Script> */}
      </head>
      <body suppressHydrationWarning>
        {/* Google Analytics */}
        <GoogleAnalytics />
        <Script
          id="facebook-pixel"
          strategy="afterInteractive"
        >
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}
            (window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');

            fbq('init', '3569115919913260');
            fbq('track', 'PageView');
          `}
        </Script>

        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=3569115919913260&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <Script
          id="system-theme"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                var root = document.documentElement;
                var media = window.matchMedia('(prefers-color-scheme: dark)');
                var applyTheme = function (isDark) {
                  root.classList.remove('theme-light', 'theme-dark');
                  root.classList.add(isDark ? 'theme-dark' : 'theme-light');
                };
                applyTheme(media.matches);
                if (typeof media.addEventListener === 'function') {
                  media.addEventListener('change', function (event) {
                    applyTheme(event.matches);
                  });
                } else if (typeof media.addListener === 'function') {
                  media.addListener(function (event) {
                    applyTheme(event.matches);
                  });
                }
              })();
            `,
          }}
        />
        <SiteSettingsProvider>
          <ServiceProvider>
            <Header />
            {children}

            <Certificate />
            <Footer />
            <SurveyPopup />
          </ServiceProvider>
        </SiteSettingsProvider>
        <Script type="text/javascript" src="/js/jquery.min.js" />
        <Script type="text/javascript" src="/js/bootsnav.js" />
        <Script type="text/javascript" src="/js/jquery.nav.js" />
        <Script type="text/javascript" src="/js/hamburger-menu.js" />
        <Script type="text/javascript" src="/js/theme-vendors.min.js" />
        <Script type="text/javascript" src="/js/main.js" />
      </body>
    </html>
  );
}
