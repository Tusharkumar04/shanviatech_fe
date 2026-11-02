"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { createCarrerApiCall, getJobApiCall } from "@/services/api/jobApi";
import { useApi } from "@/hooks/useApi";
import Opener from "@/components/ui/Opener";
import Icon from "@/components/ui/Icon";
import SplitHeading from "@/components/ui/SplitHeading";
import Magnetic from "@/components/ui/Magnetic";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/StatePanels";
import CareerAccordion, { type JobItem } from "./CareerAccordion";

interface CareerFormData {
  name: string;
  email: string;
  job_id: string;
  mobile: string;
  gender: string;
  cv: File | null;
  message: string;
}

type CareerFormErrors = Partial<Record<keyof CareerFormData, string>>;

const EMPTY_FORM: CareerFormData = { name: "", email: "", job_id: "", mobile: "", gender: "", cv: null, message: "" };
const MAX_CV_BYTES = 5 * 1024 * 1024;

const convertFileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read selected file"));
    reader.readAsDataURL(file);
  });

/**
 * Careers: open roles on the left, the application on the right. The form
 * validates inline, reads the CV as base64 and posts the same payload as before.
 */
export default function Carrer() {
  const [formData, setFormData] = useState<CareerFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<CareerFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const jobs = useApi<{ items?: JobItem[] }>(() => getJobApiCall() as Promise<{ items?: JobItem[] }>, [], "Unable to load open positions.");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      if (!isPdf) {
        setErrors((prev) => ({ ...prev, cv: "Only PDF files are allowed" }));
        return;
      }
      if (file.size > MAX_CV_BYTES) {
        setErrors((prev) => ({ ...prev, cv: "Max file size 5MB" }));
        return;
      }
    }
    setFormData((prev) => ({ ...prev, cv: file }));
    setErrors((prev) => ({ ...prev, cv: "" }));
  };

  const validate = () => {
    const next: CareerFormErrors = {};
    if (!formData.name.trim()) next.name = "Full name is required";
    if (!formData.email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) next.email = "Invalid email format";
    if (!formData.job_id) next.job_id = "Please select a post";
    if (!formData.mobile.trim()) next.mobile = "Mobile number is required";
    else if (!/^[0-9]{10}$/.test(formData.mobile)) next.mobile = "Mobile must be 10 digits";
    if (!formData.gender) next.gender = "Select gender";
    if (!formData.cv) next.cv = "Upload your CV";
    return next;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitMessage("");
    setSubmitError("");
    const found = validate();
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    try {
      setSubmitting(true);
      if (!formData.cv) {
        setErrors((prev) => ({ ...prev, cv: "Upload your CV" }));
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
        cv: { file: cvBase64, filename: formData.cv.name },
      });
      setSubmitMessage("Application submitted successfully!");
      setFormData(EMPTY_FORM);
    } catch (err) {
      console.error(err);
      setSubmitError("Unable to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldError = (name: keyof CareerFormData) =>
    errors[name] ? (
      <span id={`${name}-error`} className="field__error" role="alert">
        {errors[name]}
      </span>
    ) : null;
  const invalid = (name: keyof CareerFormData) => (errors[name] ? true : undefined);
  const describedBy = (name: keyof CareerFormData) => (errors[name] ? `${name}-error` : undefined);

  return (
    <>
      <Opener crumbs={[{ label: "Careers" }]} title="Careers" lede="Explore your fit with Shanvia Tech Solutions Pvt Ltd." />

      <section className="section section--bone" aria-label="Open positions and application">
        <div className="wrap split">
          <div>
            <p className="eyebrow">
              <span className="eyebrow__index">01</span>
              Open roles
            </p>
            <SplitHeading as="h2" className="h2" options={{ type: "lines", when: "scroll" }}>
              <span>Our jobs</span>
            </SplitHeading>
            {jobs.loading ? <LoadingState label="Loading open positions" /> : null}
            {!jobs.loading && jobs.error ? <ErrorState message={jobs.error} onRetry={jobs.reload} /> : null}
            {!jobs.loading && !jobs.error && !(jobs.data?.items?.length) ? (
              <EmptyState title="No open positions right now." text="Send us your CV below and we will keep it on file." />
            ) : null}
            {!jobs.loading && !jobs.error ? <CareerAccordion jobData={jobs.data} /> : null}
          </div>

          <div>
            <p className="eyebrow">
              <span className="eyebrow__index">02</span>
              Apply
            </p>
            <h2 className="h2" style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)" }}>Career with us</h2>
            <p className="muted">Tell us about yourself and attach your CV (PDF, up to 5MB).</p>

            <form onSubmit={handleSubmit} className="form" noValidate aria-describedby={submitError ? "career-form-error" : undefined}>
              {submitMessage ? (
                <div className="status status--success" role="status">
                  <p className="status__text">{submitMessage}</p>
                </div>
              ) : null}
              {submitError ? (
                <div className="status" role="alert" id="career-form-error">
                  <p className="status__text">{submitError}</p>
                </div>
              ) : null}

              <div className="field">
                <label htmlFor="career-name">Full name</label>
                <input id="career-name" type="text" name="name" autoComplete="name" value={formData.name} onChange={handleChange} aria-invalid={invalid("name")} aria-describedby={describedBy("name")} />
                {fieldError("name")}
              </div>
              <div className="field">
                <label htmlFor="career-email">Email address</label>
                <input id="career-email" type="email" name="email" autoComplete="email" value={formData.email} onChange={handleChange} aria-invalid={invalid("email")} aria-describedby={describedBy("email")} />
                {fieldError("email")}
              </div>
              <div className="field">
                <label htmlFor="career-job">Position</label>
                <select id="career-job" name="job_id" value={formData.job_id} onChange={handleChange} aria-invalid={invalid("job_id")} aria-describedby={describedBy("job_id")}>
                  <option value="">Select a position</option>
                  {jobs.data?.items?.map((item) => (
                    <option key={item?._id} value={item?._id}>{item?.title}</option>
                  ))}
                </select>
                {fieldError("job_id")}
              </div>
              <div className="field">
                <label htmlFor="career-mobile">Mobile number</label>
                <input id="career-mobile" type="tel" name="mobile" inputMode="numeric" autoComplete="tel-national" value={formData.mobile} onChange={handleChange} aria-invalid={invalid("mobile")} aria-describedby={describedBy("mobile")} />
                {fieldError("mobile")}
              </div>
              <fieldset className="field" aria-describedby={describedBy("gender")}>
                <legend>Gender</legend>
                <div className="choices">
                  <label><input type="radio" name="gender" value="male" checked={formData.gender === "male"} onChange={handleChange} /> Male</label>
                  <label><input type="radio" name="gender" value="female" checked={formData.gender === "female"} onChange={handleChange} /> Female</label>
                </div>
                {fieldError("gender")}
              </fieldset>
              <div className="field">
                <label htmlFor="career-cv">CV (PDF, max 5MB)</label>
                <input id="career-cv" type="file" accept="application/pdf" onChange={handleFileChange} aria-invalid={invalid("cv")} aria-describedby={describedBy("cv")} />
                {formData.cv ? <small className="muted">Selected: {formData.cv.name}</small> : null}
                {fieldError("cv")}
              </div>
              <div className="field">
                <label htmlFor="career-message">Message (optional)</label>
                <textarea id="career-message" name="message" rows={4} value={formData.message} onChange={handleChange} />
              </div>

              <Magnetic>
                <button type="submit" className="btn btn--signal" disabled={submitting} aria-busy={submitting}>
                  {submitting ? "Submitting..." : "Submit application"} <Icon name="arrow" className="btn__arrow" />
                </button>
              </Magnetic>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
