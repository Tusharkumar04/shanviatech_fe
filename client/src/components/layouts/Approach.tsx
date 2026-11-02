'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getApproachApiCall } from "@/services/api/approachApi";
import { getJobApiCall } from "@/services/api/jobApi";

interface WhyChooseUsHighlight {
    _id?: string;
    logo?: string;
    title?: string;
    description?: string;
}

interface TechnicalCraftHighlight {
    _id?: string;
    logo?: string;
    title?: string;
}

interface ApproachViewData {
    title?: string;
    subtitle?: string;
    images?: string[];
    description?: string;
    our_approach?: string;
    our_mission?: string;
    why_choose_us?: {
        title?: string;
        description?: string;
        highlights?: WhyChooseUsHighlight[];
    };
    technical_craft?: {
        title?: string;
        description?: string;
        highlights?: TechnicalCraftHighlight[];
    };
    hiring_impressive?: {
        title?: string;
        subtitle?: string;
        image?: string;
    };
}

export default function Approach() {

    const [approachData, setApproachData] = useState<ApproachViewData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getApproachApiCall();
                setApproachData(response as ApproachViewData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const [jobData, setJobData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getJobApiCall();
                setJobData(response);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (!approachData) return null;

    return (
        <>

            <div>
                <section className="wow animate__fadeIn bg-light-gray padding-35px-tb page-title-small top-space">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-xl-8 col-md-6 text-center text-md-start">
                                <h1 className="alt-font text-extra-dark-gray font-weight-600 mb-0 text-uppercase">Approach</h1>
                            </div>
                            <div className="col-xl-4 col-md-6 breadcrumb justify-content-center justify-content-md-end text-small alt-font sm-margin-10px-top">
                                <ul>
                                    <li><Link href="/" className="text-dark-gray">Home</Link></li>
                                    <li className="text-dark-gray">Approach</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="wow animate__fadeIn last-paragraph-no-margin">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-12 col-lg-6 col-md-8 col-sm-9 text-center margin-70px-bottom md-margin-40px-bottom sm-margin-30px-bottom">
                                <span className="alt-font text-deep-pink text-medium margin-5px-bottom d-block">{approachData?.title}</span>
                                <h6 className="font-weight-400 text-extra-dark-gray alt-font mb-0">{approachData?.subtitle}</h6>
                            </div>
                        </div>
                        <div className="row margin-eight-bottom md-margin-30px-bottom">
                            <div className="col-12 col-md-8 sm-margin-15px-bottom wow animate__fadeInLeft" data-wow-delay="0.2s">
                                {approachData?.images?.[0] ? (
                                    <Image loader={({ src }) => src} unoptimized src={approachData.images[0]} alt={approachData?.title || "Approach image"} width={900} height={560} className="border-radius-6" style={{ width: "100%", height: "auto" }} />
                                ) : null}
                            </div>
                            <div className="col-12 col-md-4 wow animate__fadeInRight" data-wow-delay="0.4s">
                                {approachData?.images?.[1] ? (
                                    <Image loader={({ src }) => src} unoptimized src={approachData.images[1]} alt="Our Mission" width={520} height={560} className="border-radius-6 sm-w-100" style={{ width: "100%", height: "auto" }} />
                                ) : null}
                            </div>
                        </div>
                        <div className="row row-cols-1 row-cols-md-3 align-items-center">
                            <div className="col sm-margin-15px-bottom">
                                <span className="text-extra-large text-extra-dark-gray alt-font w-90 lg-w-95 md-w-100 d-block">{approachData?.description}</span>
                            </div>
                            <div className="col sm-margin-15px-bottom">
                                <strong className="font-weight-600 text-extra-dark-gray margin-5px-bottom d-block alt-font">Our approach</strong>
                                <p>{approachData?.our_approach}</p>
                            </div>
                            <div className="col">
                                <strong className="font-weight-600 text-extra-dark-gray margin-5px-bottom d-block alt-font">Our Mission</strong>
                                <p>{approachData?.our_mission}</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="services" className="bg-light-gray wow animate__fadeIn">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-12 col-lg-7 col-md-8 col-sm-10 margin-eight-bottom md-margin-40px-bottom sm-margin-30px-bottom text-center last-paragraph-no-margin">
                                <h5 className="alt-font font-weight-700 text-extra-dark-gray text-uppercase margin-15px-bottom">{approachData?.why_choose_us?.title}</h5>
                                <p className="mb-0">{approachData?.why_choose_us?.description}</p>
                            </div>
                        </div>
                        <div className="row row-cols-1 row-cols-lg-4 row-cols-sm-2">
                            {
                                (approachData?.why_choose_us?.highlights ?? []).map((item: WhyChooseUsHighlight) => (
                                    <div className="col md-margin-30px-bottom xs-margin-15px-bottom wow animate__fadeInUp last-paragraph-no-margin" key={item?._id}>
                                        <div className="bg-white box-shadow-light text-center h-100 padding-eighteen-tb feature-box-8 position-relative z-index-5">
                                            <div className="d-inline-block margin-20px-bottom"><i className={`${item?.logo} text-white-2 icon-round-small bg-deep-pink`} /></div>
                                            <div className="alt-font text-extra-dark-gray font-weight-600 margin-10px-bottom">{item?.title}</div>
                                            <p className="w-75 lg-w-90 mx-auto">{item?.description}</p>
                                            <div className="feature-box-overlay bg-deep-pink" />
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </section>
                <section className="wow animate__fadeIn bg-extra-dark-gray">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 col-lg-4 d-flex justify-content-center flex-column text-center text-lg-start md-margin-five-bottom sm-margin-ten-bottom last-paragraph-no-margin">
                                <span className="text-extra-large text-white-2 alt-font margin-15px-bottom d-block w-85 md-w-100">{approachData?.technical_craft?.title}</span>
                                <p className="w-90 md-w-100 text-white">{approachData?.technical_craft?.description}</p>
                            </div>
                            {
                                (approachData?.technical_craft?.highlights ?? []).map((item: TechnicalCraftHighlight) => (
                                    <div className="col-6 col-lg-2 col-sm-6 col-md-3 d-flex justify-content-center align-items-center flex-column border-right border-color-medium-dark-gray text-center sm-margin-40px-bottom wow animate__zoomIn" key={item?._id}>
                                        {item?.logo ? (
                                            <Image loader={({ src }) => src} unoptimized src={item.logo} className="margin-20px-bottom" alt={item?.title || "Technical craft icon"} width={90} height={90} />
                                        ) : null}
                                        <span className="d-block text-medium text-extra-light-gray">{item?.title}</span>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </section>
                <section className="bg-light-gray border-none p-0 wow animate__fadeIn">
                    <div className="container-fluid">
                        <div className="row row-cols-1 row-cols-lg-2">
                            <div className="col padding-seven-lr padding-six-half-tb lg-padding-five-tb lg-padding-six-lr md-padding-six-all sm-padding-50px-tb sm-padding-15px-lr wow animate__fadeInLeft">
                                <h5 className="alt-font text-extra-dark-gray text-center text-lg-start margin-eight-bottom md-margin-40px-bottom sm-margin-30px-bottom font-weight-600"><span className="font-weight-300 d-block sm-margin-15px-bottom">{approachData?.hiring_impressive?.title}</span> {approachData?.hiring_impressive?.subtitle}</h5>
                                <div
                                    className="panel-group accordion-event accordion-style2"
                                    id="accordion-main"
                                    data-active-icon="fa-angle-up"
                                    data-inactive-icon="fa-angle-down"
                                >
                                    {jobData?.items?.map((job: any, index: any) => (
                                        <div className="panel panel-default" key={job._id}>

                                            {/* Heading */}
                                            <div className="panel-heading">
                                                <a
                                                    className="accordion-toggle"
                                                    data-bs-toggle="collapse"
                                                    data-bs-parent="#accordion-main"
                                                    href={`#collapse${job._id}`}
                                                >
                                                    <div className="panel-title">

                                                        {/* Number */}
                                                        <span className="alt-font font-weight-600 text-deep-pink tab-tag">
                                                            {(index + 1).toString().padStart(2, "0")}
                                                        </span>

                                                        {/* Title */}
                                                        <span className="text-extra-dark-gray sm-w-80 d-inline-block">
                                                            {job.title}
                                                        </span>

                                                        <i className="fas fa-angle-down text-extra-dark-gray" />
                                                    </div>
                                                </a>
                                            </div>

                                            {/* Body */}
                                            <div
                                                id={`collapse${job._id}`}
                                                className={`panel-collapse collapse ${index === 0 ? "show" : ""}`}
                                                data-bs-parent="#accordion-main"
                                            >
                                                <div className="panel-body">

                                                    <p>{job.description}</p>

                                                    <p>
                                                        <strong>Location:</strong> {job.location}
                                                    </p>

                                                    <p>
                                                        <strong>Experience:</strong> {job.experience}
                                                    </p>

                                                    <p>
                                                        <strong>Salary:</strong> {job.salary}
                                                    </p>

                                                    <p>
                                                        <strong>Priority:</strong> {job.priority}
                                                    </p>

                                                    {/* Skills */}
                                                    <div>
                                                        <strong className="mb-2 d-block">Skills:</strong>
                                                        <ul className="list-style-12">
                                                            {job.skills?.map((skill: any, i: any) => (
                                                                <li key={i}>{skill}</li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    {/* Soft Skills */}
                                                    <div>
                                                        <strong className="mb-2 d-block">Soft Skills:</strong>
                                                        <ul className="list-style-12">
                                                            {job.soft_skills?.map((skill: any, i: any) => (
                                                                <li key={i}>{skill}</li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    {/* Responsibilities */}
                                                    <div>
                                                        <strong className="mb-2 d-block">Responsibilities:</strong>
                                                        <ul className="list-style-12">
                                                            {job.responsibilities?.map((res: any, i: any) => (
                                                                <li key={i}>{res}</li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    {/* Requirements */}
                                                    <div>
                                                        <strong className="mb-2 d-block">Requirements:</strong>
                                                        <ul className="list-style-12">
                                                            {job.requirements?.map((req: any, i: any) => (
                                                                <li key={i}>{req}</li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    {/* We Offer */}
                                                    <div>
                                                        <strong className="mb-2 d-block">We Offer:</strong>
                                                        <ul className="list-style-12">
                                                            {job.we_offer?.map((offer: any, i: any) => (
                                                                <li key={i}>{offer}</li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                </div>
                                            </div>

                                        </div>
                                    ))}
                                </div>
                                <Link href="/career" className="btn btn-medium btn-dark-gray text-medium border-radius-4 lg-margin-15px-bottom d-table d-lg-inline-block md-margin-lr-auto margin-25px-top  popup-with-form">Apply Now <i className="fab fa-youtube icon-very-small" aria-hidden="true" /></Link>
                            </div>
                            {/*<div className="col cover-background h-650px md-h-500px sm-h-350px wow animate__fadeInRight" style={{
                                backgroundImage: `url(${approachData?.hiring_impressive?.image || ""})`
                            }} />*/}
                            <div className="col cover-background h-650px md-h-500px sm-h-350px wow animate__fadeInRight" style={{
                                backgroundImage: `
                                    linear-gradient(
                                        to bottom,
                                        rgba(247, 247, 247, 0) 60%,
                                        rgba(247, 247, 247, 1) 100%
                                    ),
                                    url(${approachData?.hiring_impressive?.image || ""})
                                `,
                                backgroundSize: "cover",
                                backgroundPosition: "center"
                            }} />
                        </div>
                    </div>
                    <form id="apply-form" action="#" method="post" className="white-popup-block mfp-hide col-11 col-xxl-3 col-xl-4 col-lg-5 col-md-8 col-sm-9 p-0 mx-auto">
                        <div className="padding-fifteen-all bg-white border-radius-6 lg-padding-seven-all">
                            <div className="text-extra-dark-gray alt-font text-large font-weight-600 margin-30px-bottom">Looking for a excellent business idea?</div>
                            <div>
                                <div className="form-results d-none" />
                                <input type="text" name="name" id="name" placeholder="Name*" className="input-bg required" />
                                <input type="email" name="email" id="email" placeholder="E-mail*" className="input-bg required" />
                                <input type="phone" name="phone" id="phone" placeholder="Phone No*" className="input-bg required" />
                                <input type="text" name="apply" id="apply" placeholder="Apply For" className="input-bg" />
                                <p>Click on the &quot;Choose File&quot; button to upload your resume:</p>
                                <input type="file" name="apply" id="myFile" placeholder="Upload Resume" className="input-bg" />
                                <button id="contact-us-button" type="submit" className="btn btn-small border-radius-4 btn-black submit">send message</button>
                            </div>
                        </div>
                    </form>
                </section>
            </div>
        </>
    )
}
