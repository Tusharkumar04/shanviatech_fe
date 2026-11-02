"use client";

import { getHomeApiCall } from "@/services/api/homeApi";
import { useApi } from "@/hooks/useApi";
import { useServicesData } from "@/context/ServiceContext";
import Banner, { type BannerItem } from "./Banner";
import Agency from "./Agency";
import HomeService from "./HomeService";
import HomeWeDo from "./HomeWeDo";
import WhyChooseUs from "./WhyChooseUs";
import WhatPeopleSay from "./WhatPeopleSay";
import OurApproach from "./OurApproach";
import Blogs from "./Blogs";
import Marquee from "@/components/ui/Marquee";

interface HomePayload {
  banners?: BannerItem[];
  about?: Parameters<typeof Agency>[0]["about"];
  our_approach?: Parameters<typeof OurApproach>[0]["approach"];
  we_do?: Parameters<typeof HomeWeDo>[0]["weDo"];
  why_choose?: Parameters<typeof WhyChooseUs>[0]["whyChoose"];
}

/**
 * Home is a sequence of scenes: a cinematic hero, a word-by-word statement,
 * a sticky approach, a pinned service rail, a dark showreel, a quieter
 * "why us", testimonials, and insight. Each scene owns its own motion.
 */
export default function Home() {
  const home = useApi<HomePayload>(() => getHomeApiCall() as Promise<HomePayload>, [], "Unable to load the home content.");
  const { serviceData } = useServicesData();

  const serviceNames = (serviceData?.services ?? [])
    .filter((item) => item?.show_in_page)
    .sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0))
    .map((item) => item?.name || item?.title || "")
    .filter(Boolean);

  const data = home.data;

  return (
    <>
      <Banner banners={data?.banners} loading={home.loading} error={home.error} onRetry={home.reload} />
      {serviceNames.length ? <Marquee items={serviceNames} label="Services" /> : null}
      {data?.about ? <Agency about={data.about} /> : null}
      {data?.our_approach ? <OurApproach approach={data.our_approach} /> : null}
      <HomeService />
      {data?.we_do ? <HomeWeDo weDo={data.we_do} /> : null}
      {data?.why_choose ? <WhyChooseUs whyChoose={data.why_choose} /> : null}
      <WhatPeopleSay />
      <Blogs limit={3} />
    </>
  );
}
