'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAboutApiCall } from "@/services/api/aboutApi";

interface AboutJourneyItem {
    _id?: string;
    year?: string | number;
    subtitle?: string;
    title?: string;
    description?: string;
}

interface AboutViewData {
    title?: string;
    subtitle?: string;
    description?: string;
    our_journey?: AboutJourneyItem[];
}

export default function About() {
    const [aboutData, setAboutData] = useState<AboutViewData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAboutApiCall();
                setAboutData(response as AboutViewData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (!aboutData) return null;
    return (
        <>

            <section className="wow animate__fadeIn bg-light-gray padding-35px-tb page-title-small top-space">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-xl-8 col-md-6 text-center text-md-start">
                            <h1 className="alt-font text-extra-dark-gray font-weight-600 mb-0 text-uppercase">About Company</h1>
                        </div>
                        <div className="col-xl-4 col-md-6 breadcrumb justify-content-center justify-content-md-end text-small alt-font sm-margin-10px-top">
                            <ul>
                                <li><Link href="/" className="text-dark-gray">Home</Link></li>
                                <li><span className="text-dark-gray">About Company</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pb-0 pt-5 wow animate__fadeIn" id="section-down">
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-xl-12 col-lg-12 col-md-12 margin-six-bottom last-paragraph-no-margin">
                            <div className="alt-font text-deep-pink margin-10px-bottom text-uppercase text-small">{aboutData?.title}</div>
                            <h5 className="alt-font text-black font-weight-600">{aboutData?.subtitle}</h5>
                            <p className="mx-auto text-white d-inline-block sm-w-100 sDtls" style={{ textAlign: "justify" }} dangerouslySetInnerHTML={{ __html: aboutData?.description || "" }}></p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="bg-light-gray">
            {
                (aboutData?.our_journey ?? []).map((item: AboutJourneyItem) => (
                    <section className="small-section bg-light-gray" key={item?._id}>
                        <div className="container">
                            <div className="row">
                                <div className="col-12 col-xl-2 col-lg-3 md-margin-5px-bottom wow animate__fadeInLeft">
                                    <div className="separator-line-horrizontal-full bg-deep-pink margin-20px-bottom d-none d-lg-block" />
                                    <h5 className="text-uppercase alt-font text-medium-gray letter-spacing-1 font-weight-600 ">{item?.year}</h5>
                                    <span className="text-uppercase alt-font text-medium-gray letter-spacing-1 font-weight-600 ">{item?.subtitle}</span>
                                </div>
                                <div className="col-12 col-xl-8 col-lg-7 offset-lg-2 last-paragraph-no-margin">
                                    <h5 className="alt-font text-extra-dark-gray font-weight-600 margin-30px-bottom">{item?.title}</h5>
                                    <p className="text-medium line-height-30" dangerouslySetInnerHTML={{ __html: item?.description || "" }}></p>
                                </div>
                            </div>
                        </div>
                    </section>
                ))
            }
            </section>


        </>
    )
}

