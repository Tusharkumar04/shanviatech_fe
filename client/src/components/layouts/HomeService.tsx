'use client';

import { ServiceItem, useServicesData } from "@/context/ServiceContext";
import ServiceCard from "./ServiceCard";

export default function HomeService() {
    const { serviceData, loading, error } = useServicesData();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <>
            <section className="bg-light-gray wow animate__fadeIn">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-lg-8 col-md-8 col-sm-8 margin-eight-bottom md-margin-40px-bottom sm-margin-30px-bottom text-center">
                            <div className="alt-font text-dark-gray text-small-14 margin-5px-bottom text-uppercase">Our Services</div>
                            <h5 className="alt-font text-extra-dark-gray font-weight-600 mb-0">As a leading provider of business and technology services</h5>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 filter-content overflow-hidden">
                            <ul className="hover-option6 lightbox-portfolio portfolio-wrapper grid grid-3col xl-grid-3col lg-grid-3col md-grid-2col sm-grid-2col xs-grid-1col gutter-large">
                                <li className="grid-sizer"></li>
                                {serviceData?.services
                                    ?.filter((item: ServiceItem) => item?.show_in_page)
                                    ?.slice(0, 6)
                                    ?.map((item: ServiceItem, index: number) => (
                                        <ServiceCard key={item?._id || item?.slug || index} item={item} />
                                    ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
