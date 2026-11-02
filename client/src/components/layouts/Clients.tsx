'use client';

import { useEffect, useState } from "react";
import WhatPeopleSay from "./WhatPeopleSay";
import Link from "next/link";
import { getCmsApiCall } from "@/services/api/cmsApi";

interface ClientSectionData {
    image?: string;
    title?: string;
    description?: string;
    key_points?: string[];
    link?: string;
    button_title?: string;
}


export default function Clients() {

    const [cmdData, setCmsData] = useState<ClientSectionData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getCmsApiCall();
                setCmsData(response?.client as ClientSectionData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    return (
        <>
            <section className="wow animate__fadeIn bg-light-gray padding-35px-tb page-title-small top-space">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-xl-8 col-md-6 text-center text-md-start">
                            <h1 className="alt-font text-extra-dark-gray font-weight-600 mb-0 text-uppercase">Clients</h1>
                        </div>
                        <div className="col-xl-4 col-md-6 breadcrumb justify-content-center justify-content-md-end text-small alt-font sm-margin-10px-top">
                            <ul>
                                <li><Link href="/" className="text-dark-gray">Home</Link></li>
                                <li><span className="text-dark-gray">Our Clients</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <WhatPeopleSay />

            <section className="bg-light-gray p-0 wow animate__fadeIn">
                <div className="container-fluid">
                    <div className="row">
                        {loading ? (
                            <div className="col-12 col-xl-5 col-lg-6 padding-eight-half-all xl-padding-seven-all">
                                <p>Loading...</p>
                            </div>
                        ) : (
                            <>
                                <div className="col-12 col-xl-7 col-lg-6 cover-background md-h-500px sm-h-400px overflow-visible wow animate__fadeInLeft" style={{ backgroundImage: cmdData?.image ? `url(${cmdData.image})` : "none" }}>
                                </div>
                                <div className="col-12 col-xl-5 col-lg-6 padding-eight-half-all xl-padding-seven-all wow animate__fadeInRight">
                                    <h4 className="alt-font text-black font-weight-600 margin-45px-bottom md-margin-25px-bottom sm-margin-20px-bottom">{cmdData?.title}</h4>
                                    <p className="margin-35px-bottom w-95 md-margin-25px-bottom sm-w-100">{cmdData?.description}</p>
                                    <ul className="list-style-12 margin-35px-top">
                                        {(cmdData?.key_points ?? []).map((item: string, index: number) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                    {cmdData?.link && (
                                        <Link
                                            href={cmdData.link}
                                            className="btn btn-small btn-rounded btn-dark-gray margin-40px-top sm-margin-25px-top"
                                        >
                                            {cmdData?.button_title}
                                        </Link>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

        </>
    )
}

