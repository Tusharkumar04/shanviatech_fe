'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import {
    createReachUsApiCall,
    sendReachOtpApiCall,
    verifyReachOtpApiCall,
} from "@/services/api/reachUsApi";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { getCmsApiCall } from "@/services/api/cmsApi";

interface FormData {
    name: string;
    email: string;
    mobile: string;
    subject: string;
    message: string;
}

interface ReachSectionData {
    image?: string;
    title?: string;
    description?: string;
    link?: string;
    button_title?: string;
}

// Stable identity for OTP proofs; survives a page refresh like the survey's guestId.
const getUid = () => {
    if (typeof window === "undefined") return "";
    let id = localStorage.getItem("reachUid");
    if (!id) {
        id = uuidv4();
        localStorage.setItem("reachUid", id);
    }
    return id;
};

export default function ReachUs() {
    const { siteData } = useSiteSettings();
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        mobile: "",
        subject: "",
        message: "",
    });

    const [errors, setErrors] = useState<Partial<FormData>>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState("");
    const [submitError, setSubmitError] = useState("");

    // ===== OTP verification =====
    const [otpOpen, setOtpOpen] = useState(false);
    const [otpValue, setOtpValue] = useState("");
    const [otpError, setOtpError] = useState("");
    const [otpNotice, setOtpNotice] = useState("");
    const [otpBusy, setOtpBusy] = useState(false);
    const [resendIn, setResendIn] = useState(0);
    // Set once the OTP for the current email is verified, so a resubmit of the
    // same form skips straight to the create call.
    const [verifiedEmail, setVerifiedEmail] = useState("");

    const [cmsData, setCmsData] = useState<ReachSectionData | null>(null);
    const [loading, setLoading] = useState(true);

    // Tick the resend cooldown down to zero.
    useEffect(() => {
        if (resendIn <= 0) return;
        const timer = setTimeout(() => setResendIn((s) => s - 1), 1000);
        return () => clearTimeout(timer);
    }, [resendIn]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getCmsApiCall();
                setCmsData(response?.reach_us as ReachSectionData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));


        setErrors((prev) => ({
            ...prev,
            [e.target.name]: "",
        }));
    };

    const validate = () => {
        const newErrors: Partial<FormData> = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters";
        } else if (!/^[a-zA-Z\s.'-]+$/.test(formData.name.trim())) {
            newErrors.name = "Name contains invalid characters";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            newErrors.email = "Invalid email format";
        }

        const mobileDigits = formData.mobile.replace(/\D/g, "");
        if (!mobileDigits) {
            newErrors.mobile = "Mobile is required";
        } else if (!/^[0-9]{10}$/.test(mobileDigits)) {
            newErrors.mobile = "Mobile number must be 10 digits";
        }

        if (!formData.subject.trim()) {
            newErrors.subject = "Subject is required";
        } else if (formData.subject.trim().length < 3) {
            newErrors.subject = "Subject must be at least 3 characters";
        }

        if (!formData.message.trim()) {
            newErrors.message = "Message is required";
        } else if (formData.message.trim().length < 10) {
            newErrors.message = "Message must be at least 10 characters";
        }

        return newErrors;
    };

    const normalizedEmail = () => formData.email.trim().toLowerCase();

    /** Send the create call once the email is verified. */
    const submitReach = async () => {
        try {
            setSubmitting(true);
            setSubmitError("");

            await createReachUsApiCall({
                name: formData.name.trim(),
                email: formData.email.trim(),
                mobile: formData.mobile.replace(/\D/g, ""),
                subject: formData.subject.trim(),
                message: formData.message.trim(),
                uid: getUid(),
            });

            setSubmitMessage("Message sent successfully!");
            setOtpOpen(false);
            setOtpValue("");
            setOtpNotice("");
            setOtpError("");
            setVerifiedEmail("");
            setFormData({
                name: "",
                email: "",
                mobile: "",
                subject: "",
                message: "",
            });
        } catch (error) {
            console.error(error);
            const message =
                error instanceof Error && error.message
                    ? error.message
                    : "Something went wrong. Please try again.";
            setSubmitError(message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setSubmitMessage("");
        setSubmitError("");

        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Already verified in this session (e.g. after editing an unrelated
        // field) — no need to send another OTP.
        if (verifiedEmail && verifiedEmail === normalizedEmail()) {
            await submitReach();
            return;
        }

        try {
            setSubmitting(true);

            const result = await sendReachOtpApiCall({
                uid: getUid(),
                channel: "email",
                target: normalizedEmail(),
            });

            if (result?.errorCode) {
                setSubmitError(
                    result.message || "We couldn't send the verification code. Please try again."
                );
                return;
            }

            // A prior session already proved this email — go straight to submit.
            if (result?.details?.status === "verified") {
                setVerifiedEmail(normalizedEmail());
                await submitReach();
                return;
            }

            setOtpValue("");
            setOtpError("");
            setOtpNotice(`We've emailed a verification code to ${normalizedEmail()}.`);
            setResendIn(result?.details?.resend_available_in_seconds ?? 60);
            setOtpOpen(true);
        } catch (error) {
            console.error(error);
            setSubmitError("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (otpBusy) return;

        const otp = otpValue.trim();
        if (!/^[0-9]{4,8}$/.test(otp)) {
            setOtpError("Please enter the code we sent you.");
            return;
        }

        setOtpBusy(true);
        setOtpError("");

        const result = await verifyReachOtpApiCall({
            uid: getUid(),
            channel: "email",
            target: normalizedEmail(),
            otp,
        });

        setOtpBusy(false);

        if (result?.errorCode) {
            setOtpError(result.message || "That code wasn't right. Please try again.");
            return;
        }

        setVerifiedEmail(normalizedEmail());
        await submitReach();
    };

    const handleResendOtp = async () => {
        if (resendIn > 0 || otpBusy) return;

        setOtpBusy(true);
        setOtpError("");
        setOtpNotice("");

        const result = await sendReachOtpApiCall({
            uid: getUid(),
            channel: "email",
            target: normalizedEmail(),
        });

        setOtpBusy(false);

        if (result?.errorCode) {
            setOtpError(result.message || "We couldn't resend the code. Please try again.");
            if (result?.details?.retry_after_seconds) {
                setResendIn(result.details.retry_after_seconds);
            }
            return;
        }

        setOtpValue("");
        setOtpNotice(`We've emailed a new verification code to ${normalizedEmail()}.`);
        setResendIn(result?.details?.resend_available_in_seconds ?? 60);
    };

    /** Abandon verification and return to the form to fix a typo. */
    const cancelOtp = () => {
        if (otpBusy) return;
        setOtpOpen(false);
        setOtpValue("");
        setOtpError("");
        setOtpNotice("");
        setResendIn(0);
    };

    return (
        <>

            <section className="wow animate__fadeIn bg-light-gray padding-35px-tb page-title-small top-space">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-xl-8 col-md-6 text-center text-md-start">

                            <h1 className="alt-font text-extra-dark-gray font-weight-600 mb-0 text-uppercase">Reach us</h1>

                        </div>
                        <div className="col-xl-4 col-md-6 breadcrumb justify-content-center justify-content-md-end text-small alt-font sm-margin-10px-top">

                            <ul>
                                <li><Link href="/" className="text-dark-gray">Home</Link></li>
                                <li className="text-dark-gray">Reach us</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="wow animate__fadeIn py-5" id="section-down">
                <div className="container">
                    <div className="row row-cols-1 row-cols-lg-2">
                        <div className="col sm-margin-30px-bottom wow animate__fadeInLeft">
                            <div className="reach-usForm padding-ten-all bg-light-gray border-radius-6 lg-padding-seven-all md-padding-eight-all sm-padding-30px-all h-100">
                                <span className="text-extra-dark-gray alt-font text-large font-weight-600 margin-25px-bottom d-block">Ready to get started?</span>
                                <form onSubmit={handleSubmit} noValidate suppressHydrationWarning>
                                    {submitMessage && (
                                        <div className="alert alert-success">{submitMessage}</div>
                                    )}

                                    {submitError && (
                                        <div className="alert alert-danger">{submitError}</div>
                                    )}

                                    <div className="field-box">
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Name*"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                        />
                                        {errors.name && <span className="text-danger">{errors.name}</span>}
                                    </div>

                                    <div className="field-box">
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Email*"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                        />
                                        {errors.email && <span className="text-danger">{errors.email}</span>}
                                    </div>

                                    <div className="field-box">
                                        <input
                                            type="tel"
                                            name="mobile"
                                            placeholder="Mobile*"
                                            value={formData.mobile}
                                            onChange={handleInputChange}
                                        />
                                        {errors.mobile && <span className="text-danger">{errors.mobile}</span>}
                                    </div>

                                    <div className="field-box">
                                        <input
                                            type="text"
                                            name="subject"
                                            placeholder="Subject*"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                        />
                                        {errors.subject && <span className="text-danger">{errors.subject}</span>}
                                    </div>

                                    <div className="field-box">
                                        <textarea
                                            name="message"
                                            placeholder="Your Message*"
                                            rows={5}
                                            value={formData.message}
                                            onChange={handleInputChange}
                                        />
                                        {errors.message && <span className="text-danger">{errors.message}</span>}
                                    </div>                                     

                                    <button type="submit" disabled={submitting} className="btn btn-dark-gray btn-small text-extra-small border-radius-4">
                                        {submitting ? "Sending..." : "Send Message"}
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div className="col last-paragraph-no-margin wow animate__fadeInRight">
                            <div className="padding-ten-all bg-light-gray border-radius-6 lg-padding-seven-all md-padding-eight-all sm-padding-30px-all h-100 text-center text-md-start">
                                {/* <Image src="/images/contact.jpg" alt="Contact" className="border-radius-6 margin-35px-bottom sm-margin-30px-bottom" width={960} height={640} /> */}
                                <img src={cmsData?.image} alt={cmsData?.title} className="border-radius-6 margin-35px-bottom sm-margin-30px-bottom" />

                                <span className="text-large font-weight-600 alt-font text-extra-dark-gray margin-5px-bottom d-block">{cmsData?.title}</span>
                                <p>{cmsData?.description}</p>
                                <Link href={cmsData?.link || "#"} className="btn btn-dark-gray btn-small text-extra-small border-radius-4 margin-25px-top">{cmsData?.button_title}</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="pt-0 wow animate__fadeIn">
                <div className="container-fluid p-0">
                    <div className="row row-cols-1 row-cols-lg-4 justify-content-center g-0">



                        {
                            siteData?.addresses?.map((item: any) => (
                                <div className="col image-hover-style-3 last-paragraph-no-margin bg-light-gray" key={item?._id}>
                                    <div className="feature-box-wrap">

                                        <div className="w-100 small-screen lg-h-350px sm-h-300px d-table arrow-top">
                                            <div className="d-table-cell align-middle padding-eighteen-lr lg-padding-twelve-lr text-center md-padding-ten-lr sm-padding-seven-all">
                                                <i className="icon-map text-deep-pink icon-medium margin-25px-bottom" />
                                                <div className="text-extra-dark-gray text-uppercase alt-font font-weight-600 margin-5px-bottom">Contact Address {item?.city}</div>

                                                <p className="w-55 mx-auto text-medium xl-w-75 lg-w-100">{item?.locality}, {item?.city}, {item?.state} {item?.country} </p>
                                                {/* <p className="mx-auto text-medium mb-0">Phone: +1 (973) 919-1048</p> */}
                                                <p className="mx-auto text-medium mb-0">Email: {item?.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </section>

            {otpOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Verify your email"
                    onClick={cancelOtp}
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 1080,
                        background: "rgba(15, 23, 42, 0.55)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "16px",
                    }}
                >
                    <div
                        className="bg-white border-radius-6"
                        onClick={(e) => e.stopPropagation()}
                        style={{ width: "100%", maxWidth: "400px", padding: "28px" }}
                    >
                        <h5 className="alt-font text-extra-dark-gray font-weight-600 margin-10px-bottom">
                            Verify your email
                        </h5>
                        <p className="text-medium margin-15px-bottom" style={{ color: "#64748b", wordBreak: "break-word" }}>
                            {otpNotice || `Sending a code to ${normalizedEmail()}…`}
                        </p>

                        <div className="field-box">
                            <input
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                placeholder="Enter code"
                                value={otpValue}
                                disabled={otpBusy}
                                maxLength={8}
                                onChange={(e) => {
                                    setOtpValue(e.target.value.replace(/\D/g, "").slice(0, 8));
                                    setOtpError("");
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleVerifyOtp();
                                    }
                                }}
                            />
                            {otpError && <span className="text-danger">{otpError}</span>}
                        </div>

                        <button
                            type="button"
                            onClick={handleVerifyOtp}
                            disabled={otpBusy || !otpValue}
                            className="btn btn-dark-gray btn-small text-extra-small border-radius-4"
                        >
                            {otpBusy ? "Verifying..." : "Verify & Send"}
                        </button>

                        <div className="d-flex justify-content-between align-items-center margin-15px-top">
                            <button
                                type="button"
                                onClick={cancelOtp}
                                disabled={otpBusy}
                                className="btn btn-link btn-sm text-decoration-none p-0"
                                style={{ fontSize: "0.8rem", color: "#64748b" }}
                            >
                                Edit details
                            </button>
                            <button
                                type="button"
                                onClick={handleResendOtp}
                                disabled={otpBusy || resendIn > 0}
                                className="btn btn-link btn-sm text-decoration-none p-0"
                                style={{ fontSize: "0.8rem", color: resendIn > 0 ? "#94a3b8" : "#2563EB" }}
                            >
                                {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend code"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
