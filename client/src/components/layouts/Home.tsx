'use client';

import { getHomeApiCall } from "@/services/api/homeApi";
import { useEffect, useState } from "react";
import Banner from "./Banner";
import Agency from "./Agency";
import HomeService from "./HomeService";
import HomeWeDo from "./HomeWeDo";
import WhyChooseUs from "./WhyChooseUs";
import WhatPeopleSay from "./WhatPeopleSay";
import OurApproach from "./OurApproach";
import Blogs from "./Blogs";

interface HomePayload {
    banners?: unknown[];
    about?: unknown;
    our_approach?: unknown;
    we_do?: unknown;
    why_choose?: unknown;
}

export default function Home() {
    const [homeData, setHomeData] = useState<HomePayload | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getHomeApiCall();
                setHomeData(response);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (!homeData) return null;




    return (

        <>
            <Banner banners={homeData?.banners} />
            <Agency about={homeData.about} />
            <OurApproach approach={homeData.our_approach} />
            <HomeService />
            <HomeWeDo weDo={homeData.we_do} />
            <WhyChooseUs whyChoose={homeData.why_choose} />
            <WhatPeopleSay />
            <Blogs limit={3} />



        </>

    )
}
