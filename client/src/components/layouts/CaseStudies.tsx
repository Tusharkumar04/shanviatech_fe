'use client';

import { getCaseStudiesApiCall } from "@/services/api/caseStudiesApi";
import Link from "next/link";
import { useEffect, useState } from "react";

interface CaseStudyItem {
    _id?: string;
    title?: string;
    description?: string;
    image?: string;
    order?: number;
}

interface CaseStudiesPageData {
    items?: CaseStudyItem[];
}

export default function CaseStudies() {

    const [caseStudiesData, setCaseStudiesData] = useState<CaseStudiesPageData | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getCaseStudiesApiCall();
                setCaseStudiesData(response as CaseStudiesPageData);
            } catch (error) {
                console.error(error);
                setError("Unable to load case studies.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!caseStudiesData) return null;


    return (
        <>
            <section className="wow animate__fadeIn bg-light-gray padding-35px-tb page-title-small top-space">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-xl-8 col-md-6 text-center text-md-start">
                            <h1 className="alt-font text-extra-dark-gray font-weight-600 mb-0 text-uppercase">Case Studies</h1>
                        </div>
                        <div className="col-xl-4 col-md-6 breadcrumb justify-content-center justify-content-md-end text-small alt-font sm-margin-10px-top">
                            <ul>
                                <li><Link href="/" className="text-dark-gray">Home</Link></li>
                                <li><span className="text-dark-gray">Case Studies</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="service-section">
                <div className="container">
                    {[...(caseStudiesData?.items ?? [])]
                        .sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0))
                        .map((item: CaseStudyItem, index: number) => (
                            <div key={item?._id || index}>
                                <div className="service-row">
                                    <div className="service-image">
                                        <img src={item?.image} alt={item?.title} />
                                    </div>
                                    <div className="service-content">
                                        <h2 className="text-extra-dark-gray">{item?.title}</h2>
                                        <p>
                                            {item?.description}
                                        </p>
                                    </div>
                                </div>
                                <hr />
                            </div>
                        ))}

                </div>
            </section>

            <style jsx>{`
               

.service-section {
  padding: 60px 20px;
}

.container {
  max-width: 1200px;
  margin: auto;
}

.service-row {
  display: flex;
  align-items: center;
  gap: 50px;
  /*margin-bottom: 60px;*/
}

.service-image {
  flex: 1;
}

.service-image img {
  width: 100%;
  border-radius: 4px;
  object-fit: cover;
}

.service-content {
  flex: 1;
}

.service-content h2 {
  font-size: 28px;
  margin-bottom: 20px;
  font-weight: 600;
  line-height: 1.2;
}

.service-content p {
  font-size: 15px;
  line-height: 1.8;
  color: #555;
}

hr {
  border: none;
  border-top: 1px solid #ddd;
  margin: 40px 0;
}

/* Responsive */
@media (max-width: 992px) {
  .service-row {
    flex-direction: column;
    text-align: center;
  }

  .service-content h2 {
    font-size: 24px;
  }
}
            `}</style>

        </>
    )
}

