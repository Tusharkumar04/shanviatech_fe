'use client';

interface WhyWeChooseProps {
    whyChoose: any;
}
export default function WhyChooseUs({ whyChoose }: WhyWeChooseProps) {
    return (
        <>
            <section className="wow animate__fadeIn pb-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-xl-9 col-md-6 margin-five-bottom md-margin-40px-bottom sm-margin-30px-bottom text-center">
                            <div className="alt-font text-dark-gray text-small-14 margin-5px-bottom text-uppercase">{whyChoose?.title}</div>
                            <h5 className="alt-font text-dark font-weight-600">{whyChoose?.subtitle}</h5>
                            <p className="mb-0">{whyChoose?.description}</p>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-8 col-lg-6 text-center"><img src={whyChoose?.image} alt="" /></div>
                    </div>
                </div>
            </section>
        </>
    )
}
