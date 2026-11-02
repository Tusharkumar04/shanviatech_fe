'use client';

import { getExpertiseApiCall } from "@/services/api/expertiseApi";
import { useEffect, useState } from "react";
import Link from "next/link";

import ai from "../../../public/images/ai.png"

interface ExpertiseItem {
    _id?: string;
    title?: string;
    link?: string;
    description?: string;
    image?: string;
    order?: number;
    tech?: string[] | any;
}

interface ExpertiseData {
    items?: ExpertiseItem[];
}

export default function Technology() {

    const [expertiseData, setExpertiseData] = useState<ExpertiseData | null>(null);
    console.log(expertiseData, 'expertiseData')
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getExpertiseApiCall();
                setExpertiseData(response);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (!expertiseData) return null;
    return (
        <>
            <div className="pt-0 pb-0">

                <section className="wow animate__fadeIn bg-light-gray padding-35px-tb page-title-small top-space">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-xl-8 col-md-6 text-center text-md-start">

                                <h1 className="alt-font text-extra-dark-gray font-weight-600 mb-0 text-uppercase">Technology</h1>

                            </div>
                            <div className="col-xl-4 col-md-6 breadcrumb justify-content-center justify-content-md-end text-small alt-font sm-margin-10px-top">

                                <ul>
                                    <li><Link href="/" className="text-dark-gray">Home</Link></li>
                                    <li><span className="text-dark-gray">Technology</span></li>
                                </ul>

                            </div>
                        </div>
                    </div>
                </section>

                {[...(expertiseData?.items ?? [])]
                    .sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0))
                    .map((item: ExpertiseItem, index: number) => (
                        <section className="wow animate__fadeIn pt-0 pb-0 my-6" key={item?._id || index}>
                            <div className="container">
                                <div className="row align-items-center">
                                    <div className={`col-12 col-lg-5 ${index % 2 !== 0 ? "order-2 order-lg-2" : "order-1 order-lg-1"}`}>
                                        <h5 className="alt-font text-black font-weight-600">{item?.title}</h5>
                                        <p className="listInBx" dangerouslySetInnerHTML={{ __html: item?.description || "" }}></p>
                                        <a href={`/${item.link}`} className="btn btn-light-gray btn-small text-extra-small border-radius-4 margin-10px-top"><i className="fas fa-play-circle icon-very-small margin-5px-right no-margin-left" aria-hidden="true" /> ALL advantages</a>
                                        {item?.tech?.length > 0 && (
                                            <div className="technologyName mt-4">
                                                <ul>
                                                    {item.tech.map((item: string, index: number) => (
                                                        <li key={index}>{item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {/* <div className="technologyName mt-4">
                                            <ul>
                                                <li><img src="/images/ai.png" alt="Shanvia Tech" /> Ai</li>
                                                <li><img src="/images/machine-learning.png" alt="Shanvia Tech" /> Machine Learning</li>
                                                <li><img src="/images/blockchain.png" alt="Shanvia Tech" /> Blockchain</li>
                                            </ul>
                                        </div> */}
                                    </div>
                                    <div className={`col-12 col-lg-7 text-center ${index % 2 !== 0 ? "order-1 order-lg-1 mb-3" : "order-22 order-lg-2 mb-3"}`}>
                                        <img src={item?.image} alt={item?.title} className="w-100" />
                                    </div>
                                </div>
                            </div>
                        </section>
                    ))}
            </div>

        </>
    )
}

