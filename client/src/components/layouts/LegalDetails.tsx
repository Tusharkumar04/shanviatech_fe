'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { LegalItem, getLegalByTypeApiCall } from "@/services/api/LegalApi";

interface LegalDetailsProps {
  type: string;
}

export default function LegalDetails({ type }: LegalDetailsProps) {
  const [legal, setLegal] = useState<LegalItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLegal = async () => {
      try {
        const response = await getLegalByTypeApiCall(type);
        setLegal(response);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to load legal details";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchLegal();
  }, [type]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!legal) return <div>Legal content not found.</div>;

  const description = (legal?.description || legal?.content || "") as string;

  return (
    <>
      <section className="wow animate__fadeIn bg-light-gray padding-35px-tb page-title-small top-space">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-8 col-md-6 text-center text-md-start">
              <h1 className="alt-font text-extra-dark-gray font-weight-600 mb-0 text-uppercase">
                {legal?.title || "Legal"}
              </h1>
            </div>
            <div className="col-xl-4 col-md-6 breadcrumb justify-content-center justify-content-md-end text-small alt-font sm-margin-10px-top">
              <ul>
                <li>
                  <Link href="/" className="text-dark-gray">
                    Home
                  </Link>
                </li>
                <li>
                  <span className="text-dark-gray">Legal</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="wow animate__fadeIn">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10">
              <h5 className="alt-font text-black font-weight-600 mb-4">{legal?.title}</h5>
              <div className="detailsBlg" dangerouslySetInnerHTML={{ __html: description }} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
