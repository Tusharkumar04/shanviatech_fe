"use client";

import React, { useMemo, useState } from "react";

interface JobItem {
  _id?: string;
  id?: string;
  title?: string;
  description?: string;
  location?: string;
  experience?: string;
  salary?: string;
  priority?: string;
  skills?: string[];
  soft_skills?: string[];
  responsibilities?: string[];
  requirements?: string[];
  we_offer?: string[];
}

interface Props {
  jobData: {
    items?: JobItem[];
  } | null;
}

const CareerAccordion: React.FC<Props> = ({ jobData }) => {
  const jobs = useMemo(() => jobData?.items ?? [], [jobData]);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const getPanelId = (job: JobItem, index: number) => {
    const rawId = String(job?._id ?? job?.id ?? `job-${index}`);
    const safeId = rawId.replace(/[^a-zA-Z0-9\-_:.]/g, "");
    return `collapse-${safeId || index}`;
  };

  const handleToggle = (index: number) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <div className="col-12">
      <div className="panel-group accordion-event accordion-style2" id="accordion-main">
        {jobs.map((job: JobItem, index: number) => {
          const panelId = getPanelId(job, index);
          const isOpen = activeIndex === index;

          return (
            <div className="panel panel-default" key={job?._id ?? job?.id ?? `job-${index}`}>
              <div className="panel-heading">
                <button
                  type="button"
                  className="accordion-toggle w-100 text-start border-0 bg-transparent"
                  onClick={() => handleToggle(index)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                >
                  <div className="panel-title d-flex justify-content-between align-items-center">
                    <span className="alt-font font-weight-600 text-deep-pink tab-tag">
                      {(index + 1).toString().padStart(2, "0")}
                    </span>

                    <span className="text-extra-dark-gray sm-w-80 d-inline-block me-auto">
                      {job?.title}
                    </span>

                    <i className={`fas text-extra-dark-gray ${isOpen ? "fa-angle-up" : "fa-angle-down"}`} />
                  </div>
                </button>
              </div>

              <div id={panelId} className={`panel-collapse collapse ${isOpen ? "show" : ""}`}>
                <div className="panel-body">
                  <p>{job?.description}</p>

                  <p><strong>Location:</strong> {job?.location}</p>
                  <p><strong>Experience:</strong> {job?.experience}</p>
                  <p><strong>Salary:</strong> {job?.salary}</p>
                  <p><strong>Priority:</strong> {job?.priority}</p>

                  <div>
                    <strong className="mb-2 d-block">Skills:</strong>
                    <ul className="list-style-12">
                      {job?.skills?.map((skill: string, i: number) => (
                        <li key={i}>{skill}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <strong className="mb-2 d-block">Soft Skills:</strong>
                    <ul className="list-style-12">
                      {job?.soft_skills?.map((skill: string, i: number) => (
                        <li key={i}>{skill}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <strong className="mb-2 d-block">Responsibilities:</strong>
                    <ul className="list-style-12">
                      {job?.responsibilities?.map((res: string, i: number) => (
                        <li key={i}>{res}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <strong className="mb-2 d-block">Requirements:</strong>
                    <ul className="list-style-12">
                      {job?.requirements?.map((req: string, i: number) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <strong className="mb-2 d-block">We Offer:</strong>
                    <ul className="list-style-12">
                      {job?.we_offer?.map((offer: string, i: number) => (
                        <li key={i}>{offer}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CareerAccordion;
