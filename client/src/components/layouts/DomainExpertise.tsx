'use client';

import { getIndustriesApiCall } from "@/services/api/industriesApi";
import Link from "next/link";
import { useEffect, useState } from "react";

interface IndustryItem {
    _id?: string;
    title?: string;
    description?: string;
    image?: string;
    order?: number;
}

interface IndustryData {
    items?: IndustryItem[];
}

export default function DomainExpertise() {

    const [industryData, setIndustryData] = useState<IndustryData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getIndustriesApiCall();
                setIndustryData(response);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (!industryData) return null;


    return (
        <>
            <section className="wow animate__fadeIn bg-light-gray padding-35px-tb page-title-small top-space">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-xl-8 col-md-6 text-center text-md-start">
                            <h1 className="alt-font text-extra-dark-gray font-weight-600 mb-0 text-uppercase">Enterprise-Expertise</h1>
                        </div>
                        <div className="col-xl-4 col-md-6 breadcrumb justify-content-center justify-content-md-end text-small alt-font sm-margin-10px-top">
                            <ul>
                                <li><Link href="/" className="text-dark-gray">Home</Link></li>
                                <li><span className="text-dark-gray">Enterprise-Expertise</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="no-padding-top wow animate__fadeIn margin-100px-top">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12 blog-content">
                            <div className="row g-4">
                                {[...(industryData?.items ?? [])]
                                    .sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0))
                                    .map((item: IndustryItem, index: number) => (
                                        <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={item?._id || index}>
                                            <article className="industry-card wow animate__fadeInUp">
                                                <img src={item?.image} alt={item?.title} className="industry-image w-100" />
                                                <div className="industry-overlay">
                                                    <h6 className="alt-font d-block text-white font-weight-600 mb-0">{item?.title}</h6>
                                                    <div
                                                        className="industry-description margin-10px-top"
                                                        dangerouslySetInnerHTML={{ __html: item?.description || "" }}
                                                    />
                                                </div>
                                            </article>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <style jsx>{`
                .industry-card {
                    position: relative;
                    overflow: hidden;
                }

                .industry-image {
                    display: block;
                    height: 320px;
                    object-fit: cover;
                }

                .industry-overlay {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                    padding: 24px;
                    background: linear-gradient(180deg, rgba(0, 0, 0, 0.05) 20%, rgba(0, 0, 0, 0.85) 100%);
                }

                .industry-description {
                    // color: #d6d6d6;
                     color: #fff;
                    opacity: 0;
                    max-height: 0;
                    overflow: hidden;
                    transition: opacity 0.25s ease, max-height 0.25s ease;
                }
                    .industry-description :global(*) {
                        color: #fff !important;
                        }

                .industry-card:hover .industry-description {
                    opacity: 1;
                    max-height: 240px;
                }
            `}</style>




        </>
    )
}

