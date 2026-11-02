"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { v4 as uuidv4 } from "uuid";
import { createReachUsApiCall, sendReachOtpApiCall, verifyReachOtpApiCall } from "@/services/api/reachUsApi";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { getCmsApiCall } from "@/services/api/cmsApi";
import { useApi } from "@/hooks/useApi";
import Opener from "@/components/ui/Opener";
import FrameImage from "@/components/ui/FrameImage";
import Icon from "@/components/ui/Icon";
import Magnetic from "@/components/ui/Magnetic";
import RevealGroup from "@/components/ui/RevealGroup";
import SplitHeading from "@/components/ui/SplitHeading";
import { ErrorState, LoadingState } from "@/components/ui/StatePanels";
import { hrefFor, externalProps } from "@/utils/href";

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

interface Address {
  _id?: string;
  locality?: string;
  city?: string;
  state?: string;
  country?: string;
  email?: string;
}

const EMPTY: FormData = { name: "", email: "", mobile: "", subject: "", message: "" };

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

/**
 * Reach us: contact details beside a form. Submitting sends an email code
 * first (dialog), then creates the enquiry. A verified email skips the code.
 */
export default function ReachUs() {
  const { siteData } = useSiteSettings();
  const cms = useApi<{ reach_us?: ReachSectionData }>(() => getCmsApiCall() as Promise<{ reach_us?: ReachSectionData }>, [], "Unable to load this section.");
  const cmsData = cms.data?.reach_us ?? null;

  const [formData, setFormData] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  // OTP verification
  const [otpOpen, setOtpOpen] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpNotice, setOtpNotice] = useState("");
  const [otpBusy, setOtpBusy] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  // Set once the OTP for the current email is verified, so a resubmit skips the code.
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const otpInput = useRef<HTMLInputElement>(null);
  const otpDialog = useRef<HTMLDivElement>(null);

  // Resend cooldown
  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  // Dialog: focus the code field on open, close on Escape.
  useEffect(() => {
    if (!otpOpen) return;
    otpInput.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") cancelOtp();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // cancelOtp reads only stable setters and the busy flag
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpOpen, otpBusy]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const next: Partial<FormData> = {};
    if (!formData.name.trim()) next.name = "Name is required";
    else if (formData.name.trim().length < 2) next.name = "Name must be at least 2 characters";
    else if (!/^[a-zA-Z\s.'-]+$/.test(formData.name.trim())) next.name = "Name contains invalid characters";

    if (!formData.email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) next.email = "Invalid email format";

    const digits = formData.mobile.replace(/\D/g, "");
    if (!digits) next.mobile = "Mobile is required";
    else if (!/^[0-9]{10}$/.test(digits)) next.mobile = "Mobile number must be 10 digits";

    if (!formData.subject.trim()) next.subject = "Subject is required";
    else if (formData.subject.trim().length < 3) next.subject = "Subject must be at least 3 characters";

    if (!formData.message.trim()) next.message = "Message is required";
    else if (formData.message.trim().length < 10) next.message = "Message must be at least 10 characters";
    return next;
  };

  const normalizedEmail = () => formData.email.trim().toLowerCase();

  /** Create the enquiry once the email is verified. */
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
      setFormData(EMPTY);
    } catch (error) {
      console.error(error);
      setSubmitError(error instanceof Error && error.message ? error.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
    if (verifiedEmail && verifiedEmail === normalizedEmail()) {
      await submitReach();
      return;
    }
    try {
      setSubmitting(true);
      const result = await sendReachOtpApiCall({ uid: getUid(), channel: "email", target: normalizedEmail() });
      if (result?.errorCode) {
        setSubmitError(result.message || "We couldn't send the verification code. Please try again.");
        return;
      }
      // A prior session already proved this email: go straight to submit.
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
    const result = await verifyReachOtpApiCall({ uid: getUid(), channel: "email", target: normalizedEmail(), otp });
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
    const result = await sendReachOtpApiCall({ uid: getUid(), channel: "email", target: normalizedEmail() });
    setOtpBusy(false);
    if (result?.errorCode) {
      setOtpError(result.message || "We couldn't resend the code. Please try again.");
      if (result?.details?.retry_after_seconds) setResendIn(result.details.retry_after_seconds);
      return;
    }
    setOtpValue("");
    setOtpNotice(`We've emailed a new verification code to ${normalizedEmail()}.`);
    setResendIn(result?.details?.resend_available_in_seconds ?? 60);
  };

  /** Abandon verification and return to the form to fix a typo. */
  function cancelOtp() {
    if (otpBusy) return;
    setOtpOpen(false);
    setOtpValue("");
    setOtpError("");
    setOtpNotice("");
    setResendIn(0);
  }

  const addresses = ((siteData?.addresses ?? []) as Address[]).filter(Boolean);
  const invalid = (name: keyof FormData) => (errors[name] ? true : undefined);
  const describedBy = (name: keyof FormData) => (errors[name] ? `reach-${name}-error` : undefined);
  const fieldError = (name: keyof FormData) =>
    errors[name] ? (
      <span id={`reach-${name}-error`} className="field__error" role="alert">
        {errors[name]}
      </span>
    ) : null;

  const cmsHref = hrefFor(cmsData?.link);

  return (
    <>
      <Opener crumbs={[{ label: "Reach us" }]} title="Reach us" lede={cmsData?.description} />

      <section className="section section--bone" aria-label="Contact">
        <div className="wrap split split--wide-left">
          <div>
            {cms.loading ? <LoadingState label="Loading" /> : null}
            {!cms.loading && cms.error ? <ErrorState message={cms.error} onRetry={cms.reload} /> : null}
            {cmsData?.image ? <FrameImage src={cmsData.image} alt="" aspect="tall" direction="left" /> : null}
            {cmsData?.title ? (
              <>
                <p className="eyebrow" style={{ marginTop: "2rem" }}>
                  <span className="eyebrow__index">01</span>
                  Get in touch
                </p>
                <SplitHeading as="h2" className="h2" options={{ type: "lines", when: "scroll" }}>
                  <span>{cmsData.title}</span>
                </SplitHeading>
              </>
            ) : null}

            {addresses.length ? (
              <RevealGroup className="addresses" >
                {addresses.map((item, i) => (
                  <address key={item._id || i} className="address card" data-reveal-item style={{ fontStyle: "normal" }}>
                    <span className="note">Office {item.city}</span>
                    <p style={{ margin: "0.75rem 0 0.5rem" }}>
                      {[item.locality, item.city, item.state, item.country].filter(Boolean).join(", ")}
                    </p>
                    {item.email ? (
                      <a className="text-link" href={`mailto:${item.email}`}>
                        {item.email}
                      </a>
                    ) : null}
                  </address>
                ))}
              </RevealGroup>
            ) : null}

            {cmsData?.button_title && cmsData.link ? (
              <div style={{ marginTop: "2rem" }}>
                <Link href={cmsHref} className="btn" {...externalProps(cmsHref)}>
                  {cmsData.button_title} <Icon name="arrow" className="btn__arrow" />
                </Link>
              </div>
            ) : null}
          </div>

          <div>
            <p className="eyebrow">
              <span className="eyebrow__index">02</span>
              Send a message
            </p>
            <form onSubmit={handleSubmit} className="form" noValidate aria-describedby={submitError ? "reach-form-error" : undefined}>
              {submitMessage ? (
                <div className="status status--success" role="status">
                  <p className="status__text">{submitMessage}</p>
                </div>
              ) : null}
              {submitError ? (
                <div className="status" role="alert" id="reach-form-error">
                  <p className="status__text">{submitError}</p>
                </div>
              ) : null}

              <div className="field">
                <label htmlFor="reach-name">Name</label>
                <input id="reach-name" name="name" autoComplete="name" value={formData.name} onChange={handleInputChange} aria-invalid={invalid("name")} aria-describedby={describedBy("name")} />
                {fieldError("name")}
              </div>
              <div className="field">
                <label htmlFor="reach-email">Email</label>
                <input id="reach-email" name="email" type="email" autoComplete="email" value={formData.email} onChange={handleInputChange} aria-invalid={invalid("email")} aria-describedby={describedBy("email")} />
                {fieldError("email")}
              </div>
              <div className="field">
                <label htmlFor="reach-mobile">Mobile</label>
                <input id="reach-mobile" name="mobile" type="tel" inputMode="numeric" autoComplete="tel-national" value={formData.mobile} onChange={handleInputChange} aria-invalid={invalid("mobile")} aria-describedby={describedBy("mobile")} />
                {fieldError("mobile")}
              </div>
              <div className="field">
                <label htmlFor="reach-subject">Subject</label>
                <input id="reach-subject" name="subject" value={formData.subject} onChange={handleInputChange} aria-invalid={invalid("subject")} aria-describedby={describedBy("subject")} />
                {fieldError("subject")}
              </div>
              <div className="field">
                <label htmlFor="reach-message">Message</label>
                <textarea id="reach-message" name="message" rows={5} value={formData.message} onChange={handleInputChange} aria-invalid={invalid("message")} aria-describedby={describedBy("message")} />
                {fieldError("message")}
              </div>

              <Magnetic>
                <button type="submit" className="btn btn--signal" disabled={submitting} aria-busy={submitting}>
                  {submitting ? "Sending..." : "Send message"} <Icon name="arrow" className="btn__arrow" />
                </button>
              </Magnetic>
            </form>
          </div>
        </div>
      </section>

      {otpOpen ? (
        <div className="dialog-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) cancelOtp(); }}>
          <div ref={otpDialog} role="dialog" aria-modal="true" aria-labelledby="otp-title" aria-describedby="otp-notice" className="dialog">
            <p className="eyebrow" style={{ margin: 0 }}>
              <span className="eyebrow__index">03</span>
              Verify email
            </p>
            <h2 id="otp-title" className="h3">Enter your code</h2>
            <p id="otp-notice" className="muted">{otpNotice}</p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleVerifyOtp();
              }}
              noValidate
            >
              <div className="field">
                <label htmlFor="otp-code">Verification code</label>
                <input
                  ref={otpInput}
                  id="otp-code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, "").slice(0, 8))}
                  aria-invalid={otpError ? true : undefined}
                  aria-describedby={otpError ? "otp-error" : undefined}
                />
                {otpError ? <span id="otp-error" className="field__error" role="alert">{otpError}</span> : null}
              </div>
              <div className="dialog__actions">
                <button type="submit" className="btn btn--signal" disabled={otpBusy} aria-busy={otpBusy}>
                  {otpBusy ? "Verifying..." : "Verify and send"}
                </button>
                <button type="button" className="text-link" onClick={handleResendOtp} disabled={otpBusy || resendIn > 0}>
                  {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend code"}
                </button>
                <button type="button" className="text-link" onClick={cancelOtp} disabled={otpBusy}>
                  Edit details
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
