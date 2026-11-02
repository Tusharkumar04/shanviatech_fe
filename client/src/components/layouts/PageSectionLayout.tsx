import React from "react";

type PageSectionLayoutProps = {
  title: string;
  description?: string;
};

const PageSectionLayout = ({ title, description }: PageSectionLayoutProps) => {
  return (
    <section className="wow animate__fadeIn top-space">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 text-center">
            <h1 className="alt-font text-extra-dark-gray font-weight-600">{title}</h1>
            {description ? <p className="text-medium-gray mb-0">{description}</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageSectionLayout;
