'use client';

import Link from "next/link";
import { ServiceItem } from "@/context/ServiceContext";

interface ServiceCardProps {
    item: ServiceItem;
}

export default function ServiceCard({ item }: ServiceCardProps) {
    const serviceHref = item?.slug ? `/service/${item.slug}` : "#";

    return (
        <li className="grid-item wow technology-box animate__fadeInUp last-paragraph-no-margin">
            <figure>
                <div className="portfolio-img bg-deep-pink position-relative text-center overflow-hidden">
                    <img src={item?.image} alt={item?.title} />
                    <div className="portfolio-icon">
                        <Link href={serviceHref}>
                            <i className="fas fa-link text-extra-dark-gray" aria-hidden="true" />
                        </Link>
                    </div>
                </div>
                <figcaption className="bg-white">
                    <div className="portfolio-hover-main text-center">
                        <div className="portfolio-hover-box align-middle">
                            <div className="portfolio-hover-content position-relative">
                                <Link href={serviceHref}>
                                    <span className="line-height-normal font-weight-600 text-small alt-font margin-5px-bottom text-extra-dark-gray text-uppercase d-block">
                                        {item?.subtitle}
                                    </span>
                                </Link>
                                <p className="text-medium-gray text-small text-uppercase">{item?.title}</p>
                            </div>
                        </div>
                    </div>
                </figcaption>
            </figure>
        </li>
    );
}

