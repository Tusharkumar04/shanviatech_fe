"use client"
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { useServicesData } from "@/context/ServiceContext";
import Link from "next/link";

const Header = () => {

    const { siteData } = useSiteSettings();
    const { serviceData } = useServicesData();
    const lightLogo = siteData?.logo || "/images/logo-white.png";
    const darkLogo = "/images/logo.png";

    const headerServices = (serviceData?.services ?? [])
        .filter((item) => item?.show_in_page && item?.slug)
        .sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0));

    return (
        <header className="header-with-topbar">
            <div className="top-header-area bg-black padding-5px-tb">
                <div className="container-lg">
                    <div className="row align-items-center m-0">
                        <div className="col-md-6 ps-lg-0 text-uppercase alt-font d-flex align-items-center justify-content-center justify-content-md-start gap-2">
                            {/* <div className="separator-line-verticle-extra-small bg-dark-gray d-inline-block margin-two-half-lr position-relative align-middle">
                            </div> */}
                            <a href={`mailto:${siteData?.email}`} className="text-link-white-2 line-height-normal">{siteData?.email}</a> |
                            <a href={`tel:+91${siteData?.mobile}`} className="text-link-white-2 line-height-normal"> +91-{siteData?.mobile}</a>
                        </div>
                        <div className="col-md-6 pe-lg-0 d-none d-md-flex align-items-center justify-content-end">
                            <div className="icon-social-very-small d-inline-block line-height-normal">
                                {siteData?.social_links?.facebook && (
                                    <a href={siteData?.social_links?.facebook} title="Facebook" target="_blank" rel="noopener noreferrer" className="text-link-white-2"><i className="fab fa-facebook-f" aria-hidden="true" /></a>
                                )}
                                {siteData?.social_links?.twitter && (
                                    <a href={siteData?.social_links?.twitter} title="Twitter" target="_blank" rel="noopener noreferrer" className="text-link-white-2"><i className="ri-twitter-x-line"></i></a>
                                )}
                                {siteData?.social_links?.linkedin && (
                                    <a href={siteData?.social_links?.linkedin} title="Linked In" target="_blank" rel="noopener noreferrer" className="text-link-white-2"><i className="fab fa-linkedin-in" /></a>
                                )}
                                {siteData?.social_links?.instagram && (
                                    <a href={siteData?.social_links?.instagram} title="Instagram" target="_blank" rel="noopener noreferrer" className="text-link-white-2"><i className="fab fa-instagram" /></a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <nav className="navbar navbar-default bootsnav navbar-top header-light-transparent background-transparent navbar-expand-lg">
                    <div className="container-lg nav-header-container">
                        <div className="col-auto ps-0">
                            <Link href="/" title="Pofo" className="logo">
                                {/* <img src={lightLogo} data-at2x="images/logo.png" className="logo-dark default" alt="Pofo" />
                                <img src={darkLogo} data-at2x="images/logo-white.png" alt="Pofo" className="logo-light" /> */}
                                {
                                    siteData?.logo?.includes("logo-white.png") ? (

                                        <img src={darkLogo} data-at2x="images/logo-white.png" alt="Pofo" className="main-logo" />
                                    ) : (

                                        <img src={lightLogo} data-at2x="images/logo.png" className="main-logo" alt="Pofo" />
                                    )
                                }
                            </Link>
                        </div>
                        <div className="col accordion-menu pe-0 pe-md-3">
                            <button type="button" className="navbar-toggler collapsed" data-bs-toggle="collapse" data-bs-target="#navbar-collapse-toggle-1">
                                <span className="sr-only">toggle navigation</span>
                                <span className="icon-bar" />
                                <span className="icon-bar" />
                                <span className="icon-bar" />
                            </button>
                            <div className="navbar-collapse collapse justify-content-end" id="navbar-collapse-toggle-1">
                                <ul id="accordion" className="nav navbar-nav navbar-left no-margin alt-font text-normal" data-in="animate__fadeIn" data-out="animate__fadeOut">
                                    <li className="dropdown simple-dropdown"><Link href="#"> Company </Link><i className="fas fa-angle-down dropdown-toggle" data-bs-toggle="dropdown" aria-hidden="true" />
                                        <ul className="dropdown-menu" role="menu">
                                            <li><Link href="/about">About Us</Link></li>
                                            <li><Link href="/leadership">Our Leadership</Link></li>
                                            <li><Link href="/approach">Approach</Link> </li>
                                            <li><Link href="/clients-stories">Our Clients and Stories</Link></li>
                                        </ul>
                                    </li>
                                    <li className="dropdown simple-dropdown d-block d-md-none"><Link href="/services">Services</Link><i className="fas fa-angle-down dropdown-toggle" data-bs-toggle="dropdown" aria-hidden="true" />
                                        <ul className="dropdown-menu" role="menu">
                                            {headerServices.map((service) => (
                                                <li key={service._id || service.slug}>
                                                    <Link href={`/service/${service.slug}`}>{service.name}</Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                    <li className="dropdown simple-dropdown serviceDropdown d-none d-md-block"><Link href="/services">Services</Link><i className="fas fa-angle-down dropdown-toggle" data-bs-toggle="dropdown" aria-hidden="true" />
                                        <div className="dropdown-menu serviceDropdownList" role="menu">
                                            <div className="row">
                                                <div className="d-none d-md-block col-md-6">
                                                    <h5 className="p-5 d-flex justify-content-between">Our Service  <i className="ri-arrow-right-line"></i></h5>

                                                </div>
                                                <div className="col-md-6">
                                                    <ul className="dropdown-menu">
                                                        {headerServices.map((service) => (
                                                            <li key={service._id || service.slug}>
                                                                <Link href={`/service/${service.slug}`}>{service.name}</Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>

                                        </div>
                                    </li>
                                    {/* <li className="disabled"><Link href="/legacy" onClick={(e) => e.preventDefault()}
                                        style={{ pointerEvents: "none", opacity: 0.5, cursor: "not-allowed" }}
                                    >Leagacy</Link> </li> */}
                                    <li className="dropdown simple-dropdown"><Link href="#"> Research </Link><i className="fas fa-angle-down dropdown-toggle" data-bs-toggle="dropdown" aria-hidden="true" />
                                        <ul className="dropdown-menu" role="menu">
                                            {/* Expertise */}
                                            <li><Link href="/technology">Technologies</Link> </li>
                                            {/* Industries */}
                                            <li><Link href="/enterprise-expertise">Enterprise Experties</Link> </li>
                                            {/* <li><Link href="/domain-expertise">Enterprise Experties</Link> </li> */}

                                            <li><Link href="/case-studies">Case Studies</Link> </li>
                                        </ul>
                                    </li>
                                    <li><Link href="/products">Our Products</Link></li>
                                    <li><Link href="/career">Career</Link></li>
                                    <li><Link href="/blogs">Insight </Link> </li>
                                </ul>
                                <div className="ms-3 my-2">
                                    <Link href="/reach-us" className="btn btn-small btn-rounded btn-transparent-black">Reach us</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        </header>

    );
};

export default Header;
