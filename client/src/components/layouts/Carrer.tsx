'use client';

import { createCarrerApiCall, getJobApiCall } from "@/services/api/jobApi";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import CareerAccordion from "./CareerAccordion";

interface CareerFormData {
    name: string;
    email: string;
    job_id: string;
    mobile: string;
    gender: string;
    cv: File | null;
    message: string;
}

interface CareerFormErrors {
    name?: string;
    email?: string;
    job_id?: string;
    mobile?: string;
    gender?: string;
    cv?: string;
    message?: string;
}

const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("Failed to read selected file"));
        reader.readAsDataURL(file);
    });
};

export default function Carrer() {
    const [formData, setFormData] = useState<CareerFormData>({
        name: "",
        email: "",
        job_id: "",
        mobile: "",
        gender: "",
        cv: null,
        message: "",
    });

    const [errors, setErrors] = useState<CareerFormErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState("");
    const [submitError, setSubmitError] = useState("");

    const [jobData, setJobData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getJobApiCall();
                setJobData(response);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;

        if (file) {
            const isPdf =
                file.type === "application/pdf" ||
                file.name.toLowerCase().endsWith(".pdf");

            if (!isPdf) {
                setErrors((prev) => ({
                    ...prev,
                    cv: "Only PDF files are allowed",
                }));
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setErrors((prev) => ({
                    ...prev,
                    cv: "Max file size 5MB",
                }));
                return;
            }
        }

        setFormData((prev) => ({
            ...prev,
            cv: file,
        }));

        setErrors((prev) => ({
            ...prev,
            cv: "",
        }));
    };

    const validate = () => {
        const newErrors: CareerFormErrors = {};

        if (!formData.name.trim()) newErrors.name = "Full Name is required";

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }

        if (!formData.job_id) newErrors.job_id = "Please select a post";

        if (!formData.mobile.trim()) {
            newErrors.mobile = "Mobile number is required";
        } else if (!/^[0-9]{10}$/.test(formData.mobile)) {
            newErrors.mobile = "Mobile must be 10 digits";
        }

        if (!formData.gender) newErrors.gender = "Select gender";

        if (!formData.cv) newErrors.cv = "Upload your cv";

        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitMessage("");
        setSubmitError("");

        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setSubmitting(true);

            if (!formData.cv) {
                setErrors((prev) => ({ ...prev, cv: "Upload your cv" }));
                return;
            }

            const cvBase64 = await convertFileToBase64(formData.cv);

            await createCarrerApiCall({
                name: formData.name.trim(),
                email: formData.email.trim(),
                job_id: formData.job_id,
                mobile: formData.mobile.trim(),
                gender: formData.gender as "male" | "female",
                message: formData.message.trim(),
                cv: {
                    file: cvBase64,
                    filename: formData.cv.name,
                },
            });

            setSubmitMessage("Application submitted successfully!");

            setFormData({
                name: "",
                email: "",
                job_id: "",
                mobile: "",
                gender: "",
                cv: null,
                message: "",
            });
        } catch (error) {
            console.error(error);
            setSubmitError("Unable to submit application. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>

            <section className="wow animate__fadeIn bg-light-gray padding-35px-tb page-title-small top-space">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-xl-8 col-md-6 text-center text-md-start">
                            <h1 className="alt-font text-extra-dark-gray font-weight-600 mb-0 text-uppercase">Career</h1>
                        </div>
                        <div className="col-xl-4 col-md-6 breadcrumb justify-content-center justify-content-md-end text-small alt-font sm-margin-10px-top">
                            <ul>
                                <li><Link href="/" className="text-dark-gray">Home</Link></li>
                                <li><span className="text-dark-gray">Career</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pt-5" id="career">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 mb-4 mb-lg-0">
                            <h5 className="alt-font text-black font-weight-600">
                                Our Jobs
                            </h5>
                            <p>Explore Your Fit is designed to help you evaluate and explore opportunities within Shanvia Tech Solutions Pvt Ltd</p>

                            <CareerAccordion jobData={jobData} />
                        </div>
                        <div className="col-lg-6">
                            <div className="career_form">
                                <h5 className="alt-font text-black font-weight-600">
                                    Career With Us
                                </h5>
                                <p className="mb-0">Assistance for applicants with a need for accommodations</p>
                                <form onSubmit={handleSubmit} className="career_form  px-0">
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
                                            placeholder="Full Name"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                        {errors.name && <span className="text-danger">{errors.name}</span>}</div>                                    

                                    <div className="field-box">
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Email Address"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                        {errors.email && <span className="text-danger">{errors.email}</span>}
                                    </div>

                                    <div className="field-box">
                                        <select name="job_id" value={formData.job_id} onChange={handleChange}>
                                            <option value="">Select Post</option>
                                            {
                                                jobData?.items?.map((item: any) => (
                                                    <option key={item?._id} value={item?._id}>{item?.title}</option>
                                                ))
                                            }
                                        </select>
                                        {errors.job_id && <span className="text-danger">{errors.job_id}</span>}
                                    </div>

                                    <div className="field-box">
                                        <input
                                            type="tel"
                                            name="mobile"
                                            placeholder="Mobile Number"
                                            value={formData.mobile}
                                            onChange={handleChange}
                                        />
                                        {errors.mobile && <span className="text-danger">{errors.mobile}</span>}
                                    </div> 

                                    <div className="field-box">
                                        <div className="gender-Box">
                                            Gender:
                                            <label>
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    value="male"
                                                    checked={formData.gender === "male"}
                                                    onChange={handleChange}
                                                />
                                                Male
                                            </label>

                                            <label>
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    value="female"
                                                    checked={formData.gender === "female"}
                                                    onChange={handleChange}
                                                />
                                                Female
                                            </label>
                                        </div>
                                        {errors.gender && <span className="text-danger">{errors.gender}</span>}
                                    </div>

                                    <div className="field-box">
                                        <input
                                            type="file"
                                            accept="application/pdf"
                                            onChange={handleFileChange}
                                        />
                                        <small>(Max size 5MB, PDF only)</small>
                                        {errors.cv && <span className="text-danger">{errors.cv}</span>}
                                    </div>

                                    <div className="field-box">
                                        <textarea
                                            name="message"
                                            placeholder="Your Message"
                                            rows={4}
                                            value={formData.message}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    


                                    <button type="submit" className="btn btn-large btn-dark-gray d-table d-lg-inline-block md-margin-lr-auto wow animate__fadeInDown popup-with-form" disabled={submitting}>
                                        {submitting ? "Submitting..." : "SUBMIT"}
                                    </button>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

        </>
    )
}

