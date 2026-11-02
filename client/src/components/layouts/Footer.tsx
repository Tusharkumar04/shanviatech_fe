"use client"
import Link from 'next/link';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { SiteAddress } from '@/context/SiteSettingsContextType';
import { useServicesData } from "@/context/ServiceContext";
import { useEffect, useState } from 'react';
import { LegalItem, getLegalApiCall } from '@/services/api/LegalApi';
import wave from "../../../public/images/wave_2.png";
import Image from 'next/image';

const Footer = () => {
    const { siteData } = useSiteSettings();
    const { serviceData } = useServicesData();
    // console.log(siteData, 'siteData')
    const lightLogo = "/images/logo.png";
    const darkLogo = "/images/logo-white.png";

    const [legalData, setLegalData] = useState<{ items?: LegalItem[] } | null>(null);
    // console.log(legalData, 'legalData')
    const legalItems = legalData?.items ?? [];
    const services = (serviceData?.services ?? [])
        .filter((item) => item?.show_in_page && item?.slug)
        .sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0));
    // console.log(legalItems, 'legalItems')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getLegalApiCall();
                setLegalData(response);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    const certificates = siteData?.certificates ?? [];
    const primaryAddress = siteData?.addresses ? siteData?.addresses.find((item: any) => item?.is_primary) : null;

    const midpoint = Math.ceil((siteData?.intresting?.length || 0) / 2);

    const leftColumn = siteData?.intresting?.slice(0, midpoint) || [];
    const rightColumn = siteData?.intresting?.slice(midpoint) || [];

    // if (!certificates.length) {
    //     return null;
    // }

    return (
        <>
            {/* <footer className="asd  footerTop  padding-40px-tb lg-padding-70px-tb md-padding-50px-tb sm-padding-40px-tb">
            
                <div className="container pos">
                    <div className="row align-items-center">
                        <div className="col-lg-8 col-md-7 col-12 text-center text-md-start sm-margin-30px-bottom">
                            <h5 className="text-white margin-5px-bottom">Let&apos;s make something great together</h5>
                            <span className="text-medium-gray">Get in touch with us and send some basic info for a quick quote</span>
                        </div>
                        <div className="col-lg-4 col-md-5 col-12 text-center text-md-end">
                            <span className="text-extra-large text-extra-dark-gray text-light-gray d-inline-block sm-d-block">
                                <Link
                                    href="/reach-us"
                                    className="btn btn-large btn-transparent-white d-table d-lg-inline-block md-margin-lr-auto wow animate__fadeInDown"
                                >
                                    Start a project
                                </Link>
                            </span>
                        </div>
                    </div>

                    <div className="border-top border-color-medium-dark-gray padding-40px-top margin-40px-top lg-padding-60px-top lg-margin-60px-top md-padding-50px-top md-margin-50px-top sm-padding-40px-top sm-margin-40px-top ">
                        <div className='row'>
                            <div className='col-md-3'>
                                <h5 className='text-white margin-5px-bottom fs-5 text-uppercase font-weight-500'>Services</h5>
                                <ul className='footerLink'>
                                    {services.map((service: any, index: number) => (
                                        <li key={service?.slug + index}>
                                            <Link href={`/service/${service.slug}`}>{service.name}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className='col-md-3'>
                                <h5 className='text-white margin-5px-bottom fs-5 text-uppercase font-weight-500'>Useful links</h5>
                                <ul className='footerLink'>
                                    <li><Link href="/about">About Us</Link></li>
                                    <li><Link href="/leadership">Our Leadership</Link></li>
                                    <li><Link href="/approach">Approach</Link> </li>
                                    <li><Link href="/clients-stories">Our Clients and Stories</Link></li>
                                </ul>
                            </div>
                            <div className='col-md-3'>
                                <h5 className='text-white margin-5px-bottom fs-5 text-uppercase font-weight-500'>Research</h5>
                                <ul className='footerLink'>
                                    <li><Link href='/technology'>Technology</Link></li>
                                    <li><Link href='/domain-expertise'>Domain Experties</Link></li>
                                    <li><Link href='/case-studies'>Case Studies</Link></li>
                                </ul>
                            </div>
                            <div className='col-md-3'>
                                <h5 className='text-white margin-5px-bottom fs-5 text-uppercase font-weight-500'>Contact Us</h5>
                                <p className='text-white mb-2'>
                                    {primaryAddress?.locality}, {primaryAddress?.city}, {primaryAddress?.state}, {primaryAddress?.country}
                                </p>
                                <p className='mb-1'><a href={`mailto:${siteData?.email}`} className="text-link-white-2 line-height-normal">{siteData?.email}</a></p>
                                <p className='mb-3'><a href={`tel:+91${siteData?.mobile}`} className="text-link-white-2 line-height-normal">+91-{siteData?.mobile}</a></p>
                                <div className="social-icon-style-8 d-inline-block align-middle">
                                    <ul className="small-icon mb-0">
                                        {siteData?.social_links?.facebook && (
                                            <li>
                                                <a href={siteData?.social_links?.facebook} title="Facebook" target="_blank" rel="noopener noreferrer" className="facebook text-white-2"><i className="fab fa-facebook-f" aria-hidden="true" /></a>
                                            </li>
                                        )}
                                        {siteData?.social_links?.twitter && (
                                            <li>
                                                <a href={siteData?.social_links?.twitter} title="Twitter" target="_blank" rel="noopener noreferrer" className="twitter text-white-2"><i className="ri-twitter-x-line"></i></a>
                                            </li>
                                        )}
                                        {siteData?.social_links?.linkedin && (
                                            <li>
                                                <a href={siteData?.social_links?.linkedin} title="Linked In" target="_blank" rel="noopener noreferrer" className="linkedin text-white-2"><i className="fab fa-linkedin-in" /></a>
                                            </li>
                                        )}
                                        {siteData?.social_links?.instagram && (
                                            <li>
                                                <a href={siteData?.social_links?.instagram} title="Instagram" target="_blank" rel="noopener noreferrer" className="instagram text-white-2"><i className="fab fa-instagram" /></a>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                                <div className='text-medium-gray'>
                                    <Link href="/"><img className="footer-logo" src="/images/logo-white.png" alt="Shanvia Tech" /></Link><br />
                                    CIN: {siteData?.cin_no}
                                </div>
                            </div>

                        </div>

                    </div>
                </div>



            </footer> */}

            <div className='newFooterBx'>
                <div className="footer-container">
                    <div className="footer-max-width">

                        <div className="footer-top-grid">

                            <div className="brand-sidebar">
                                <div className="logo-area">
                                    {/* <img src="codeclouds-logo.png" alt="CodeClouds Logo" className="footer-logo"/> */}
                                    <Link href="/">
                                        {/* <img className="footer-logo" src="/images/logo-white.png" alt="Shanvia Tech" /> */}
                                        {
                                            siteData?.logo?.includes("logo-white.png") ? (

                                                <img src={darkLogo} data-at2x="images/logo-white.png" alt="Pofo" className="footer-logo" />
                                            ) : (

                                                <img src={lightLogo} data-at2x="images/logo.png" className="footer-logo" alt="Pofo" />
                                            )
                                        }
                                        {/* <img className="footer-logo" src={siteData?.logo} alt="Shanvia Tech" /> */}
                                    </Link>
                                    <span className='CinBx'> CIN: {siteData?.cin_no}</span>

                                    {
                                        siteData?.description ? (
                                            <p className="tagline">
                                                {siteData?.description}
                                            </p>
                                        ) : (
                                            <p className="tagline">
                                                We house a team of experts with proficiency in custom Web Application Development, Mobile Apps Development, AI Development, Software Development, Ecommerce
                                            </p>
                                        )
                                    }
                                </div>

                                <div className="social-icons">
                                    <ul className="small-icon mb-0">
                                        {siteData?.social_links?.facebook && (
                                            <li>
                                                <a href={siteData?.social_links?.facebook} title="Facebook" target="_blank" rel="noopener noreferrer" className="facebook text-white-2"><i className="fab fa-facebook-f" aria-hidden="true" /></a>
                                            </li>
                                        )}
                                        {siteData?.social_links?.twitter && (
                                            <li>
                                                <a href={siteData?.social_links?.twitter} title="Twitter" target="_blank" rel="noopener noreferrer" className="twitter text-white-2"><i className="ri-twitter-x-line"></i></a>
                                            </li>
                                        )}
                                        {siteData?.social_links?.linkedin && (
                                            <li>
                                                <a href={siteData?.social_links?.linkedin} title="Linked In" target="_blank" rel="noopener noreferrer" className="linkedin text-white-2"><i className="fab fa-linkedin-in" /></a>
                                            </li>
                                        )}
                                        {siteData?.social_links?.instagram && (
                                            <li>
                                                <a href={siteData?.social_links?.instagram} title="Instagram" target="_blank" rel="noopener noreferrer" className="instagram text-white-2"><i className="fab fa-instagram" /></a>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                                {/* <div className="social-icon-style-8 d-inline-block align-middle">
                                    <ul className="small-icon mb-0">
                                        {siteData?.social_links?.facebook && (
                                            <li>
                                                <a href={siteData?.social_links?.facebook} title="Facebook" target="_blank" rel="noopener noreferrer" className="facebook text-white-2"><i className="fab fa-facebook-f" aria-hidden="true" /></a>
                                            </li>
                                        )}
                                        {siteData?.social_links?.twitter && (
                                            <li>
                                                <a href={siteData?.social_links?.twitter} title="Twitter" target="_blank" rel="noopener noreferrer" className="twitter text-white-2"><i className="ri-twitter-x-line"></i></a>
                                            </li>
                                        )}
                                        {siteData?.social_links?.linkedin && (
                                            <li>
                                                <a href={siteData?.social_links?.linkedin} title="Linked In" target="_blank" rel="noopener noreferrer" className="linkedin text-white-2"><i className="fab fa-linkedin-in" /></a>
                                            </li>
                                        )}
                                        {siteData?.social_links?.instagram && (
                                            <li>
                                                <a href={siteData?.social_links?.instagram} title="Instagram" target="_blank" rel="noopener noreferrer" className="instagram text-white-2"><i className="fab fa-instagram" /></a>
                                            </li>
                                        )}
                                    </ul>
                                </div> */}

                                <div className="certifications">
                                    {/* <span className="cert-badge iso">ISO</span>
            <span className="cert-badge nasscom">NASSCOM</span>
            <span className="cert-badge cii">CII</span> */}
                                    <div className="footer-slider">
                                        {certificates.map((item: any) => (
                                            <div className="mb-2" key={item?._id}>
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


                                        ))}

                                    </div>
                                </div>

                                {/* <div className="contact-info">
                                    <div className="contact-block">
                                        <h4>Marketing & Management</h4>
                                        <p className="phone-link">+91- 9062453343</p>
                                        <div className="avatar-group">
                                            <div className="avatar" >
                                                <img src="/images/03.jpeg" alt="" />
                                            </div>
                                            <div className="avatar">
                                                <img src="/images/02.jpeg" alt="" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="contact-block">
                                        <h4>Customer Support</h4>
                                        <a href="mailto:support@codeclouds.com" className="email-link">info@shanviatech.com</a>
                                        <div className="avatar-group">
                                            <div className="avatar">
                                                <img src="/images/01.jpeg" alt="" />
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                                <div className="contact-info">
                                    {siteData?.peoples?.map((person: any, index: number) => (
                                        <div className="contact-block" key={index}>
                                            <h4>{person.title}</h4>

                                            {person.phone && (
                                                <p className="phone-link">{person.phone}</p>
                                            )}

                                            {person.email && (
                                                <a href={`mailto:${person.email}`} className="email-link">
                                                    {person.email}
                                                </a>
                                            )}

                                            {person.images?.length > 0 && (
                                                <div className="avatar-group">
                                                    {person.images.map((image: string, imgIndex: number) => (
                                                        <div className="avatar" key={imgIndex}>
                                                            <img src={image} alt={person.title} />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="nav-links-grid">
                                    <div className="link-column">
                                        <h3>Services</h3>
                                        <ul>
                                            {services.map((service: any, index: number) => (
                                                <li key={service?.slug + index}>
                                                    <Link href={`/service/${service.slug}`}>{service.name}</Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="link-column">
                                        <h3>Useful links</h3>
                                        <ul>
                                            <li><Link href="/about">About Us</Link></li>
                                            <li><Link href="/leadership">Our Leadership</Link></li>
                                            <li><Link href="/approach">Approach</Link> </li>
                                            <li><Link href="/clients-stories">Our Clients and Stories</Link></li>
                                        </ul>
                                    </div>

                                    <div className="link-column">
                                        <h3>Resources</h3>
                                        <ul>
                                            <li><Link href='/technology'>Technologies</Link></li>
                                            <li><Link href='/enterprise-expertise'>Enterprise Experties</Link></li>
                                            {/* <li><Link href='/domain-expertise'>Enterprise Experties</Link></li> */}
                                            <li><Link href='/case-studies'>Case Studies</Link></li>

                                        </ul>
                                    </div>

                                    {/* <div className="link-column tall-column">
                                        <h3>Contact Us</h3>
                                        <ul>
                                            <li>{primaryAddress?.locality}, {primaryAddress?.city}, {primaryAddress?.state}, {primaryAddress?.country}</li>

                                        </ul>
                                    </div> */}


                                </div>

                                {/* <div className="interesting-reads-section">
                                    <h3>Interesting Reads</h3>
                                    <div className="reads-grid">
                                        <div className="reads-column">
                                            <ul>
                                                <li><a href="#">The Advantages and Disadvantages of Using GitHub</a></li>
                                                <li><a href="#">Docker, Kubernetes, and Helm: How To Up Your Containerization Game</a></li>
                                                <li><a href="#">What Will JavaScript Frameworks Look Like in the Next 10 Years?</a></li>
                                                <li><a href="#">The Differences Between MongoDB and SQLite</a></li>
                                                <li><a href="#">How to Insert Custom PHP to a WordPress Post</a></li>
                                            </ul>
                                        </div>
                                        <div className="reads-column">
                                            <ul>
                                                <li><a href="#">Why You Should Consider a Dedicated Offshore Development Team</a></li>
                                                <li><a href="#">Top 10 Website Designing Tips!</a></li>
                                                <li><a href="#">Seven steps to building the ultimate remote development team</a></li>
                                                <li><a href="#">Magento, Shopify, and BigCommerce: Which eCommerce Platform is Right for You?</a></li>
                                                <li><a href="#">How to Create a Better Subscription Business with an Alternative to Shopify Subscription Apps!</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div> */}
                                {
                                    siteData?.intresting && (
                                        <>
                                            <hr />
                                            <div className="interesting-reads-section">
                                                <h3>Interesting Reads</h3>

                                                <div className="reads-grid">
                                                    <div className="reads-column">
                                                        <ul>
                                                            {leftColumn.map((read: any, index: number) => (
                                                                <li key={read._id || index}>
                                                                    <a href={read.url || "#"}>
                                                                        {read.title}
                                                                    </a>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    <div className="reads-column">
                                                        <ul>
                                                            {rightColumn.map((read: any, index: number) => (
                                                                <li key={read._id || index}>
                                                                    <a href={read.url || "#"}>
                                                                        {read.title}
                                                                    </a>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )
                                }
                                <hr />


                                {/* <div className="locations-section">
                                    <h3>Locations</h3>
                                    <div className="locations-wrapper">
                                        <div className="locations-grid">
                                            <div className="location-card">
                                                <div className="location-title">
                                                    <span className="flag-icon">
                                                        <img src="/images/indiaLgo.png" alt="" />
                                                    </span> <strong>Kolkata </strong>
                                                </div>
                                                <p><strong>Globsyn Crystals</strong>
                                                    1177, Madurdaha, Hussainpur, Kolkata, West Bengal India
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                                <div className="locations-section">
                                    <h3>Locations</h3>

                                    <div className="locations-wrapper">
                                        <div className="locations-grid">
                                            {siteData?.addresses?.map((address: any, index: number) => (
                                                <div className="location-card" key={address._id || index}>
                                                    <div className="location-title">
                                                        <span className="flag-icon">
                                                            <img
                                                                src={address.image}
                                                                alt={address.country || address.city}
                                                            />
                                                        </span>
                                                        <strong>
                                                            {address.city
                                                                ? `${address.city}${address.state ? `, ${address.state}` : ""
                                                                }`
                                                                : address.country}
                                                        </strong>
                                                    </div>
                                                    {/* <p>
                                                        {address.locality}
                                                        {address.city && `, ${address.city}`}
                                                        {address.state && `, ${address.state}`}
                                                        {address.country && `, ${address.country}`}
                                                        {address.pin_code && ` - ${address.pin_code}`}
                                                    </p> */}
                                                    <p>
                                                        <span className="location-add">
                                                            {address.locality}
                                                            {address.city && `, ${address.city}`}
                                                            {address.state && `, ${address.state}`}
                                                        </span>
                                                        <br />
                                                        <span>
                                                            {address.country}
                                                            {address.pin_code && ` - ${address.pin_code}`}
                                                        </span>
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>




                    </div>
                </div>

            </div>


            <footer className="footer-bottom   padding-20px-tb lg-padding-70px-tb md-padding-50px-tb sm-padding-40px-tb">
                {/* <div className="footer-slider">
                    {certificates.map((item: any) => (
                        <div className="mb-2">
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


                    ))}

                </div> */}
                <div className="container">
                    <div className="footer-bottom border-top border-color-medium-dark-gray padding-10px-top sm-padding-10px-top">
                        <div className="row align-items-center text-medium-gray">
                            <div className="col-md-6 text-md-start text-center text-small">Copright&copy; {(new Date()).getFullYear()} Shanvia Tech Solutions Private Limited</div>
                            {/* <div className="col-md-6 text-md-end text-center text-small"><Link href='/'>Privacy Policy</Link> | <Link href='/'>Terms & Conditions</Link> </div> */}
                            <div className="col-md-6 text-md-end text-center text-small">
                                {legalItems.map((item: LegalItem, index: number) => (
                                    <span key={item?._id || index}>
                                        <Link href={item?.type ? `/legal/${item.type}` : (item?.slug || "/")}>
                                            {item?.title}
                                        </Link>
                                        {index !== legalItems.length - 1 && " | "}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer
