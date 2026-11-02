'use client';

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, Keyboard } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface BannerProps {
    banners: any;
}

export default function Banner({ banners }: BannerProps) {
    return (
        <section className="wow animate__fadeIn p-0 main-slider mobile-height top-space">
            <Swiper
                modules={[Autoplay, Navigation, Pagination, Keyboard]}
                loop={true}
                slidesPerView={1}
                allowTouchMove={true}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                keyboard={{
                    enabled: true,
                    onlyInViewport: true,
                }}
                navigation={{
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                }}
                pagination={{
                    el: ".swiper-pagination",
                    clickable: true,
                }}
                className="swiper-full-screen swiper-container w-100 white-move"
            >
                {banners?.map((item: any) => (
                    <SwiperSlide
                        key={item._id}
                        className="swiper-slide cover-background"
                        style={{
                            backgroundImage: `url(${item.image})`,
                        }}
                    >
                        <div className="opacity-extra-medium bg-extra-dark-gray"></div>

                        <div className="container position-relative one-fourth-screen sm-h-400px">
                            <div className="row h-100">
                                <div className="col-12 d-flex flex-column justify-content-center text-center">
                                    <span className="text-large text-very-light-gray font-weight-300 w-95 mx-auto margin-25px-bottom d-block sm-margin-15px-bottom">
                                        {item.subtitle}
                                    </span>

                                    <h1 className="alt-font text-uppercase text-white-2 font-weight-700 w-75 sm-w-95 mx-auto margin-35px-bottom sm-margin-15px-bottom">
                                        {item.title}
                                    </h1>

                                    <div className="btn-dual">
                                        <a
                                            href={`/${item.link}`}
                                            className="btn btn-white btn-rounded btn-medium sm-margin-two-all"
                                        >
                                            {item.button_title}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}

                {/* Pagination */}
                <div className="swiper-pagination swiper-pagination-white"></div>

                {/* Optional Navigation Buttons (if needed) */}
                <div className="swiper-button-next"></div>
                <div className="swiper-button-prev"></div>
            </Swiper>
        </section>
    );
}








