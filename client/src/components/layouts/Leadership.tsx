'use client';

import { getLeadershipApiCall } from "@/services/api/leadershipApi";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface LeaderMember {
    _id?: string;
    name?: string;
    designation?: string;
    image?: string;
    order?: number;
    qualification?: string;
}

interface LeaderSection {
    _id?: string;
    title?: string;
    subtitle?: string;
    members?: LeaderMember[];
}

interface LeadershipViewData {
    items?: LeaderSection[];
}

export default function Leadership() {
    const [leaderData, setLeaderData] = useState<LeadershipViewData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getLeadershipApiCall();
                const data = response as LeadershipViewData;
                setLeaderData(data);
                const firstTab = data?.items?.[0]?.title;
                if (firstTab) setActiveTab(firstTab);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (!leaderData) return null;

    const activeSection = leaderData?.items?.find(
        (item: LeaderSection) => item?.title === activeTab
    );

    return (
        <>
            <section className="wow animate__fadeIn bg-light-gray padding-35px-tb page-title-small top-space">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-xl-8 col-md-6 text-center text-md-start">
                            <h1 className="alt-font text-extra-dark-gray font-weight-600 mb-0 text-uppercase">Our Leadership</h1>
                        </div>
                        <div className="col-xl-4 col-md-6 breadcrumb justify-content-center justify-content-md-end text-small alt-font sm-margin-10px-top">
                            <ul>
                                <li><Link href="/" className="text-dark-gray">Home</Link></li>
                                <li className="text-dark-gray">Our Leadership</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
            <section className="container">

                {/* Tabs */}
                <div className="text-center mb-5 tabBoxLead d-flex justify-content-center gap-3">
                    {(leaderData?.items ?? []).map((item: LeaderSection, index: number) => (
                        <button
                            type="button"
                            key={item?._id || `${item?.title || "tab"}-${index}`}
                            onClick={() => setActiveTab(item?.title || "")}
                            className={`mx-0 px-4 py-2 ${activeTab === item?.title
                                ? "bg-deep-pink text-white"
                                : "bg-light-gray"
                                }`}
                        >
                            {item.title}
                        </button>
                    ))}
                </div>

                {/* Title & Subtitle */}
                <div className="text-center mb-5">
                    <h5 className="alt-font text-extra-dark-gray font-weight-700 text-uppercase">
                        {activeSection?.title}
                    </h5>
                    <p>{activeSection?.subtitle}</p>
                </div>

                {/* Members */}
                <div className="row row-cols-1 row-cols-lg-4 row-cols-sm-2 justify-content-center">
                    {[...(activeSection?.members ?? [])]
                        .sort((a: LeaderMember, b: LeaderMember) => (a?.order ?? 0) - (b?.order ?? 0))
                        .map((member: LeaderMember, index: number) => (
                            <div
                                key={member?._id || `${member?.name || "member"}-${index}`}
                                className="col mb-4 "
                            >
                                <div className="team-block text-center teamWrap">
                                    <div className="team-image">
                                        {member?.image ? (
                                            <Image
                                                loader={({ src }) => src}
                                                unoptimized
                                                src={member.image}
                                                alt={member?.name || "Leader image"}
                                                width={480}
                                                height={560}
                                                className="img-fluid"
                                                style={{ width: "100%", height: "auto" }}
                                            />
                                        ) : null}
                                        <div className="imgoverlay"></div>
                                    </div>

                                    <div className="mt-3 teamdesignation">
                                        <div className="font-weight-600 text-uppercase">
                                            {member.name}
                                        </div>
                                        <div className="text-small-14 text-medium-gray">
                                            {member.designation}
                                        </div>
                                    </div>
                                    <span className="text-small sub_deg"><p>{member.qualification}</p>
                                    </span>
                                </div>

                            </div>
                        ))}
                </div>
            </section>
        </>
    );
}
