'use client';

import { useMemo } from "react";
import { useServicesData } from "@/context/ServiceContext";
import Link from "next/link";

interface ServiceDetailsProps {
  slug: string;
}

export default function ServiceDetails({ slug }: ServiceDetailsProps) {
  const { serviceData, loading, error } = useServicesData();

  const selectedService = useMemo(
    () => serviceData?.services?.find((item) => item?.slug === slug),
    [serviceData, slug],
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!selectedService) return <div>Service not found.</div>;

  const highlights = [...(selectedService.highlights ?? [])].sort(
    (a, b) => (a?.order ?? 0) - (b?.order ?? 0),
  );
  const firstHighlight = highlights[0];
  const secondHighlight = highlights[1];
  const thirdHighlight = highlights[2];

  return (

    <>
      <div>
        <section className="wow animate__fadeIn bg-light-gray padding-35px-tb page-title-small top-space">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-xl-8 col-md-6 text-center text-md-start">
                <h1 className="alt-font text-extra-dark-gray font-weight-600 mb-0 text-uppercase">{selectedService.name || selectedService.title}</h1>
              </div>
              <div className="col-xl-4 col-md-6 breadcrumb justify-content-center justify-content-md-end text-small alt-font sm-margin-10px-top">
                <ul>
                  <li>
                    <Link href="/" className="text-dark-gray">
                      Home
                    </Link>
                  </li>
                  <li><span className="text-dark-gray">{selectedService.name || selectedService.title}</span></li>
                  {/* <li className="text-dark-gray">Design</li> */}
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section className="wow animate__fadeIn">
          <div className="container">
            <div className="row">
              <div className="col-12 col-lg-4 text-center text-lg-start md-margin-30px-bottom md-padding-80px-lr sm-padding-15px-lr wow animate__fadeIn">
                <h5 className="alt-font text-extra-dark-gray font-weight-700 text-uppercase w-80 lg-w-100">{firstHighlight?.title}</h5>
                <div className="separator-line-verticle-extra-small bg-extra-dark-gray w-50 md-w-70 mx-auto ms-lg-0 margin-30px-bottom md-margin-20px-bottom" />
                <div
                  className="w-95 lg-w-100 sDtls"
                  dangerouslySetInnerHTML={{ __html: firstHighlight?.description || "" }}
                />
                {selectedService?.tech?.length > 0 && (
                  <div className="appName">
                    <ul>
                      {selectedService.tech.map((item: string, index: number) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>
              <div className="col-12 col-lg-4 col-md-6 sm-margin-15px-bottom wow animate__fadeIn" data-wow-delay="0.2s">
                <img src={firstHighlight?.image?.[0]} alt={firstHighlight?.title} />
              </div>
              <div className="col-12 col-lg-4 col-md-6 wow animate__fadeIn" data-wow-delay="0.4s">
                <img src={firstHighlight?.image?.[1] || firstHighlight?.image?.[0]} alt={firstHighlight?.title} />
              </div>
            </div>
          </div>
        </section>
        <section className="p-0 wow animate__fadeIn bg-light-gray">
          <div className="container-fluid">
            <div className="row row-cols-1 row-cols-lg-2">
              <div className="col cover-background md-h-500px sm-h-350px wow animate__fadeInLeft" style={{
                backgroundImage: `url(${secondHighlight?.image?.[0] || selectedService?.image || ""})`
              }}><div className="h-sm-400px" /></div>
              <div className="col padding-five-tb padding-five-half-lr lg-padding-50px-tb md-padding-70px-tb md-padding-15px-lr wow animate__fadeInRight">
                <div className="row justify-content-center m-0">
                  <div className="col-12 col-md-12 col-sm-8 margin-four-bottom lg-margin-six-bottom md-margin-40px-bottom sm-margin-30px-bottom sm-no-padding-lr text-center text-md-start">
                    <h5 className="alt-font text-extra-dark-gray text-center text-lg-start text-uppercase font-weight-700 md-w-70 mx-auto mx-lg-0 md-no-margin-bottom sm-w-100">{secondHighlight?.title}</h5>
                  </div>
                </div>
                <div className="row row-cols-lg-1 row-cols-md-2 row-cols-sm-2 justify-content-center m-0">
                  <div className="col last-paragraph-no-margin text-center text-md-start">
                    <div
                      className="sm-w-100"
                      dangerouslySetInnerHTML={{ __html: secondHighlight?.description || "" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="pt-5 pb-0 wow animate__fadeIn">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-12 col-lg-5 order-1 order-lg-2 text-center text-lg-start offset-lg-1 md-padding-50px-all sm-padding-15px-lr">
                <i className="fas fa-quote-left text-deep-pink icon-medium margin-15px-bottom" />
                <h5 className="text-black alt-font text-uppercase font-weight-700">{thirdHighlight?.title}</h5>
                <div
                  className="w-90 md-w-100 sDtls list-style-13"
                  dangerouslySetInnerHTML={{ __html: thirdHighlight?.description || "" }}
                />
              </div>
              <div className="col-12 col-lg-6 order-2 order-lg-1 text-center align-self-end">
                <img src={thirdHighlight?.image?.[0] || selectedService?.image} alt={thirdHighlight?.title || selectedService?.title} />
              </div>
            </div>
          </div>
        </section>



        <section className="wow animate__fadeIn">
          <div className="container">
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-4">
              <div className="col text-center md-margin-30px-bottom xs-margin-15px-bottom wow animate__fadeInUp">
                <div className="counter-feature-box-1 w-100 border-all padding-5px-all">
                  <div className="counter-box bg-white d-flex justify-content-center flex-column h-100">
                    <i className="icon-heart icon-medium text-medium-gray margin-15px-bottom" />
                    <h6 className="d-block font-weight-600 text-extra-dark-gray alt-font mb-0 counter" data-to={4650} data-speed={2000}>4650</h6>
                    <span className="text-extra-dark-gray">Happy Clients</span>
                  </div>
                </div>
              </div>
              <div className="col text-center md-margin-30px-bottom xs-margin-15px-bottom wow animate__fadeInUp" data-wow-delay="0.2s">
                <div className="counter-feature-box-1 w-100 border-all padding-5px-all">
                  <div className="counter-box bg-white d-flex justify-content-center flex-column h-100">
                    <i className="icon-laptop icon-medium text-medium-gray margin-15px-bottom" />
                    <h6 className="d-block font-weight-600 text-extra-dark-gray alt-font mb-0 counter" data-to={3790} data-speed={2000}>3790</h6>
                    <span className="text-extra-dark-gray">Project Completed</span>
                  </div>
                </div>
              </div>
              <div className="col text-center xs-margin-15px-bottom wow animate__fadeInUp" data-wow-delay="0.4s">
                <div className="counter-feature-box-1 w-100 border-all padding-5px-all">
                  <div className="counter-box bg-white d-flex justify-content-center flex-column h-100">
                    <i className="icon-camera icon-medium text-medium-gray margin-15px-bottom" />
                    <h6 className="d-block font-weight-600 text-extra-dark-gray alt-font mb-0 counter" data-to={580} data-speed={2000}>580</h6>
                    <span className="text-extra-dark-gray">Global Customers</span>
                  </div>
                </div>
              </div>
              <div className="col text-center wow animate__fadeInUp" data-wow-delay="0.6s">
                <div className="counter-feature-box-1 w-100 border-all padding-5px-all">
                  <div className="counter-box bg-white d-flex justify-content-center flex-column h-100">
                    <i className="icon-chat icon-medium text-medium-gray margin-15px-bottom" />
                    <h6 className="d-block font-weight-600 text-extra-dark-gray alt-font mb-0 counter" data-to={8580} data-speed={2000}>8580</h6>
                    <span className="text-extra-dark-gray">Telephonic Talk</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

    </>
  );
}

