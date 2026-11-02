'use client';

import Link from "next/link";
import { useState } from "react";
import { ServiceItem, useServicesData } from "@/context/ServiceContext";
import ServiceCard from "./ServiceCard";
import Blogs from "./Blogs";

export default function Services() {
    const { serviceData, loading, error } = useServicesData();
    const [activeType, setActiveType] = useState("");

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const handleClick = (type: string) => {
        setActiveType(type)
    };

    const primarySolution = serviceData?.digital_solutions?.[0];
    const highlights = primarySolution?.highlights ?? [];
    const currentActiveType = activeType || highlights[0]?.title || "";

    return (
        <>
            <div>
                <section className="wow animate__fadeIn bg-light-gray padding-35px-tb page-title-small top-space">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-xl-8 col-md-6 text-center text-md-start">
                                <h1 className="alt-font text-extra-dark-gray font-weight-600 mb-0 text-uppercase">Our Services</h1>
                            </div>
                            <div className="col-xl-4 col-md-6 breadcrumb justify-content-center justify-content-md-end text-small alt-font sm-margin-10px-top">
                                <ul>
                                    <li>
                                        <Link href="/" className="text-dark-gray">
                                            Home
                                        </Link>
                                    </li>
                                    <li><span className="text-dark-gray">Services</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                <section className=" wow animate__fadeIn">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-12 col-lg-8 col-md-8 col-sm-8 margin-eight-bottom md-margin-40px-bottom sm-margin-30px-bottom text-center">
                                <div className="alt-font text-dark-gray text-small-14 margin-5px-bottom text-uppercase">Our Services</div>
                                <h5 className="alt-font text-black font-weight-600 mb-0">As a leading provider of business and technology services</h5>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 filter-content overflow-hidden">
                                <ul className="hover-option6 lightbox-portfolio portfolio-wrapper grid grid-3col xl-grid-3col lg-grid-3col md-grid-2col sm-grid-2col xs-grid-1col gutter-large">
                                    <li className="grid-sizer" />
                                    {
                                        serviceData?.services
                                            ?.filter((item: ServiceItem) => item?.show_in_page)
                                            ?.map((item: ServiceItem, index: number) => (
                                                <ServiceCard key={item?._id || item?.slug || index} item={item} />
                                            ))
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="p-0 wow animate__fadeIn">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12 col-lg-4 col-md-6 d-flex align-items-center bg-black feature-box-1 sm-no-padding-lr text-center text-md-start">
                                <div className="padding-eighteen-all xl-padding-fifteen-all lg-padding-ten-all sm-padding-30px-tb sm-padding-20px-lr w-100">
                                    <span className="alt-font text-medium-gray margin-10px-bottom d-block">{serviceData?.digital_experiences?.title}</span>
                                    <h6 className="text-light-gray alt-font">{serviceData?.digital_experiences?.subtitle}</h6>
                                    <p className="text-white">{serviceData?.digital_experiences?.description}</p>
                                    <a className="btn btn-transparent-light-gray btn-small border-radius-4" href="expertise.html"><i className="fas fa-play-circle icon-very-small margin-5px-right ms-0" aria-hidden="true" />{serviceData?.digital_experiences?.button_title}</a>
                                </div>
                            </div>
                            <div className="col-12 col-lg-4 col-md-6 d-flex align-items-center bg-extra-dark-gray feature-box-1 sm-no-padding-lr text-center text-md-start">
                                <div className="padding-eighteen-all xl-padding-fifteen-all lg-padding-ten-all sm-padding-30px-tb sm-padding-20px-lr w-100">
                                    <span className="alt-font text-medium-gray margin-10px-bottom d-block">{serviceData?.agile_project?.title}</span>
                                    <h6 className="text-light-gray alt-font">{serviceData?.agile_project?.subtitle}</h6>
                                    <p>{serviceData?.agile_project?.description}</p>
                                    <a className="btn btn-transparent-light-gray btn-small border-radius-4" href="case.html"><i className="fas fa-play-circle icon-very-small margin-5px-right ms-0" aria-hidden="true" />{serviceData?.agile_project?.button_title}</a>
                                </div>
                            </div>
                            <div className="col-12 col-lg-4 d-flex cover-background feature-box-1 md-h-450px sm-h-350px" style={{ background: `url(${serviceData?.agile_project?.image || "images/services-img3.jpg"})` }} />
                        </div>
                    </div>
                </section>

                <section className="wow animate__fadeIn">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-12 col-xl-7 col-lg-7 col-sm-9 margin-eight-bottom md-margin-40px-bottom sm-margin-30px-bottom text-center">
                                <div className="alt-font text-medium-gray margin-10px-bottom text-uppercase text-small">{primarySolution?.title}</div>
                                <h5 className="alt-font text-black font-weight-600 mb-0">{primarySolution?.subtitle}</h5>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 justify-content-center text-center p-0 tab-style1" id="animated-tab">
                                <ul className="nav nav-tabs margin-50px-bottom sm-no-margin-bottom">
                                    {
                                        highlights.map((item, index) => (
                                            <li onClick={() => handleClick(item?.title || "")} className="nav-item" key={item?._id || `${item?.title}-${index}`}><a data-bs-toggle="tab" className={`nav-link ${currentActiveType === item?.title ? "active" : ""}`}><span><i className="icon-chat icon-medium text-medium-gray margin-10px-bottom d-block" /></span><span className="alt-font text-medium-gray text-uppercase text-small">0{index + 1}. {item?.title}</span></a></li>
                                        ))
                                    }
                                </ul>

                                <div className="tab-content">
                                    {highlights.map(
                                        (item, index: number) =>
                                            currentActiveType === item?.title && (
                                                <div
                                                    key={item._id || index}
                                                    className="tab-pane fade show active"
                                                >
                                                    <div className="row m-0">
                                                        <div className="col-12 col-lg-4 text-start md-margin-30px-bottom">
                                                            <img src={item?.image} alt={item?.title} />
                                                        </div>

                                                        <div className="col-12 col-lg-4 col-md-6 text-start sm-margin-30px-bottom">
                                                            <div className="d-flex flex-column justify-content-center padding-40px-all lg-padding-35px-all md-padding-30px-all h-100 w-100 border-all border-width-2 border-color-extra-light-gray">
                                                                <span className="text-medium font-weight-600 alt-font text-uppercase d-block text-extra-dark-gray">
                                                                    0{index + 1}. {item?.title}
                                                                </span>

                                                                <span className="alt-font text-medium-gray text-medium">
                                                                    {item?.description}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="col-12 col-lg-4 col-md-6 text-start">
                                                            <div className="d-flex flex-column justify-content-center align-items-start padding-40px-all lg-padding-35px-all md-padding-30px-all h-100 w-100 bg-light-gray">
                                                                <span className="text-extra-dark-gray alt-font margin-10px-bottom d-inline-block text-medium">
                                                                    {item?.title}
                                                                </span>

                                                                <p className="w-100">{item?.description2}</p>

                                                                <a
                                                                    href={`/${item?.link}`}
                                                                    className="btn btn-dark-gray btn-very-small text-extra-small"
                                                                >
                                                                    About Company
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* end tabs section */}
                {/* start information section */}
                <section className="bg-light-gray">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-12 col-lg-5 md-margin-30px-bottom wow animate__fadeInLeft">
                                <img src={serviceData?.quality_assurance?.image} className="w-100" alt="" />
                            </div>
                            <div className="col-12 col-lg-6 offset-lg-1 wow animate__fadeInRight">
                                <span className="text-medium text-deep-pink alt-font margin-10px-bottom d-inline-block">{serviceData?.quality_assurance?.title} </span>
                                <h5 className="alt-font text-extra-dark-gray font-weight-600">{serviceData?.quality_assurance?.subtitle}</h5>
                                <p style={{ textAlign: 'justify' }}>{serviceData?.quality_assurance?.description}</p>
                                {/* <p style={{ textAlign: 'justify' }}>We believe in complete satisfaction of our clients and therefore we choose to be highly meticulous in selecting the best of the breed QA testing technologies from the marketplace. Apart from roping in the best QA testing modes, methods as well as software we ensure that we hire top notch consultants and quality testing pros that will implement their practiced proficiency levels and ascertain optimal quality in the end product.</p> */}
                            </div>
                        </div>
                    </div>
                </section>
                {/* end information box section  */}
                {/* start pricing box section  */}
               
                            <Blogs limit={3} />
            </div>

        </>
    )
}

