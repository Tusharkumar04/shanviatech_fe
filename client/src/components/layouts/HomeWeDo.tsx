'use client';
interface HomeWeDoProps {
    weDo: any;
}
export default function HomeWeDo({ weDo }: HomeWeDoProps) {
    return (
        <>
            <section className="wow animate__fadeIn bg-extra-dark-gray">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-12 col-lg-6 position-relative text-center md-margin-50px-bottom sm-margin-30px-bottom">
                            <a className="popup-youtube" href="https://www.youtube.com/watch?v=sU3FkzUKHXU">
                                <img src={weDo?.image} alt={weDo?.title} className="w-100" />
                                <div className="icon-play">
                                    <div className="absolute-middle-center">
                                        <img src="/images/icon-play.png" alt="" />
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div className="col-12 col-lg-6 last-paragraph-no-margin">
                            <div className="padding-twelve-left text-center text-lg-start md-no-padding-lr">
                                <h5 className="alt-font text-white-2">{weDo?.title}</h5>
                                <p className="text-extra-large w-90 font-weight-300 text-extra-light-gray lg-w-100">{weDo?.subtitle}</p>
                                <p className="w-90 lg-w-100 text-extra-light-gray">{weDo?.description}</p>
                                <a href={`/${weDo.link}`} className="btn btn-small btn-rounded btn-transparent-white margin-30px-top">{weDo?.button_title}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
