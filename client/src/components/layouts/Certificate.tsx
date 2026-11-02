'use client';

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export default function Certificate() {
    const { siteData } = useSiteSettings();
    const certificates = siteData?.certificates ?? [];

    if (!certificates.length) {
        return null;
    }

    return (
        <>
            <section className="py-3 d-none">
                <div className="container d-none">

                    <Swiper
                        modules={[Pagination, Autoplay]}
                        spaceBetween={30}
                        slidesPerView={4}
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 3000 }}
                        breakpoints={{
                            320: { slidesPerView: 1 },
                            576: { slidesPerView: 2 },
                            768: { slidesPerView: 3 },
                            992: { slidesPerView: 6 },
                            2000: { slidesPerView: 6 }
                        }}
                    >

                        {certificates.map((item: any) => (
                            <SwiperSlide key={item._id}>

                                <div className="footer-slider">

                                    {/* <a href={item.pdf} target="_blank" rel="noopener noreferrer"> */}
                                    <a>

                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            loading="lazy"
                                            decoding="async"
                                            style={{
                                                objectFit: "contain",
                                                margin: "0 auto",
                                                display: "block",
                                            }}
                                        />

                                    </a>

                                </div>

                            </SwiperSlide>
                        ))}

                    </Swiper>

                </div>
            </section>

        </>
    )
}
