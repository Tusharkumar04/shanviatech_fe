'use client';

interface AgencyProps {
    about: any;
}
export default function Agency({ about }: AgencyProps) {
    return (
        <>
            <section className="wow animate__fadeIn bg-light-gray">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-xl-10 col-lg-10 col-md-11 text-center wow animate__fadeInUp margin-eight-bottom">
                            <div className="alt-font text-extra-medium-gray text-small-14 margin-5px-bottom text-uppercase">{about?.title}</div>
                            <h6 className="font-weight-300 text-extra-dark-gray mb-0">{about?.description}</h6>
                            {/* <h6 className="font-weight-300 text-extra-dark-gray mb-0">We house a team of experts <strong className="font-weight-400">(proficient in custom Web Application Development, Mobile Apps Development, AI Development, Software Development, and Ecommerce Development, IoT and Data Science).</strong> we have two decades of <strong className="font-weight-400"> digital solutions experiences </strong> for companies from all over the world.</h6> */}
                        </div>
                    </div>
                    <div className="row justify-content-center align-items-center">
                        {/* {
                            about?.highlights?.map((item: any) => (
                                <div className="col-12 col-lg-4 col-md-6 col-sm-8 md-margin-30px-bottom wow animate__fadeInUp" key={item._id}>
                                    <div className="bg-white text-center">
                                        <a href="services-simple.html"><img src={item?.image} alt={item?.title} /></a>
                                        <div className="padding-40px-all md-padding-20px-all">
                                            <span className="text-extra-dark-gray text-large font-weight-500 d-block alt-font margin-10px-bottom">{item?.title}</span>
                                            <p>{item?.description}</p>
                                            <a href={`/${item.link}`} className="btn btn-small btn-rounded btn-transparent-dark-gray">{item?.button_title} <i className="ti-arrow-right"></i></a>
                                        </div>
                                    </div>
                                </div>
                            ))
                        } */}
                        {
                            about?.highlights?.map((item: any) => {
                                const isExternal = item?.link?.startsWith("http");

                                return (
                                    <div
                                        className="col-12 col-lg-4 col-md-6 col-sm-8 md-margin-30px-bottom wow animate__fadeInUp"
                                        key={item._id}
                                    >
                                        <div className="bg-white text-center">
                                            <a
                                                href={isExternal ? item.link : `/${item.link}`}
                                                target={isExternal ? "_blank" : "_self"}
                                                rel={isExternal ? "noopener noreferrer" : undefined}
                                            >
                                                <img src={item?.image} alt={item?.title} />
                                            </a>

                                            <div className="padding-45px-all md-padding-30px-all">
                                                <span className="text-extra-dark-gray font-weight-600 d-block alt-font margin-10px-bottom">
                                                    {item?.title}
                                                </span>

                                                <p>{item?.description}</p>

                                                <a
                                                    href={isExternal ? item.link : `/${item.link}`}
                                                    target={isExternal ? "_blank" : "_self"}
                                                    rel={isExternal ? "noopener noreferrer" : undefined}
                                                    className="btn btn-small btn-rounded btn-transparent-dark-gray"
                                                >
                                                    {item?.button_title} <i className="ti-arrow-right"></i>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            </section>


        </>
    )
}
