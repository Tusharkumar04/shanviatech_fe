'use client';

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Keyboard } from "swiper/modules";
import Image from "next/image";

import "swiper/css";
import "swiper/css/pagination";
import { useEffect, useState } from "react";
import {
    getTestimonialsApiCall,
    TestimonialItem,
    TestimonialsData,
} from "@/services/api/testimonialsApi";

export default function WhatPeopleSay() {
    const [testimonialsData, setTestimonialsData] = useState<TestimonialsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getTestimonialsApiCall();
                setTestimonialsData(response);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (!testimonialsData) return null;
    return (
        <>
            <section className="wow animate__fadeIn pt-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-xl-5 col-md-6 col-sm-8 margin-four-bottom md-margin-40px-bottom sm-margin-30px-bottom text-center">
                            <div className="alt-font text-dark-gray text-small-14 margin-5px-bottom text-uppercase">
                                What people say
                            </div>
                            <h5 className="alt-font text-black font-weight-600 mb-0">
                                We have received tons of awesome testimonials
                            </h5>
                        </div>
                    </div>

                    <div className="row position-relative justify-content-center">
                        <div className="col-12 col-md-12 col-sm-9">
                            <Swiper
                                modules={[Pagination, Autoplay, Keyboard]}
                                slidesPerView={1}
                                spaceBetween={30}
                                loop={false}
                                allowTouchMove={true}
                                autoplay={{
                                    delay: 3000,
                                    disableOnInteraction: false,
                                }}
                                keyboard={{
                                    enabled: true,
                                    onlyInViewport: true,
                                }}
                                breakpoints={{
                                    768: {
                                        slidesPerView: 2,
                                    },
                                    992: {
                                        slidesPerView: 3,
                                    },
                                }}
                                pagination={{
                                    el: ".swiper-pagination",
                                    clickable: true,
                                }}
                                className="swiper-container swiper-pagination-bottom black-move blog-slider"
                            >
                                {
                                    (testimonialsData?.items ?? []).map((item: TestimonialItem, index: number) => (
                                        <SwiperSlide className="swiper-slide" key={item?._id || `${item?.author_name || "testimonial"}-${index}`}>
                                            <div className="margin-half-all bg-white box-shadow-light text-center padding-fourteen-all h-100 sm-padding-30px-all">
                                                {item?.author_image ? (
                                                    <Image
                                                        loader={({ src }) => src}
                                                        unoptimized
                                                        src={item.author_image}
                                                        className="rounded-circle w-100px h-100px margin-25px-bottom md-margin-15px-bottom"
                                                        alt={item?.author_name || "Author"}
                                                        width={100}
                                                        height={100}
                                                    />
                                                ) : null}
                                                <p className="md-margin-15px-bottom sm-margin-20px-bottom">
                                                    {item?.description
                                                        ? `${item.description.slice(0, 150)}...`
                                                        : ""}
                                                </p>
                                                <span className="text-extra-dark-gray text-small text-uppercase d-block line-height-10 alt-font font-weight-600">
                                                    {item?.author_name}
                                                </span>
                                                <span className="text-light-gray2 text-extra-small text-uppercase text-medium-gray">
                                                    {item?.author_location}
                                                </span>
                                            </div>
                                        </SwiperSlide>
                                    ))
                                }


                                {/* Pagination */}
                                <div className="swiper-pagination"></div>
                            </Swiper>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
