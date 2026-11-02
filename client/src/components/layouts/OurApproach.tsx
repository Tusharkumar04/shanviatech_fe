'use client';

interface ApproachProps {
    approach: any;
}
export default function OurApproach({ approach }: ApproachProps) {
    return (
        <>
            <section className="wow animate__fadeIn position-relative m-DevBox md-no-padding-bottom">
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-lg-6 padding-eleven-right lg-padding-ten-right text-center text-lg-start md-padding-15px-right md-margin-50px-bottom sm-margin-40px-bottom wow animate__fadeIn">
                            <h4 className="font-weight-600 alt-font text-extra-dark-gray">{approach?.title}</h4>
                            <p className="text-large alt-font font-weight-300">{approach?.subtitle}</p>
                            <p>{approach?.description} </p>
                            <a href={`/${approach.link}`} className="btn btn-small btn-dark-gray">{approach?.button_title}</a>
                        </div>
                        <div className="right-image">
                            <img src={approach?.image} alt={approach?.title} />
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
