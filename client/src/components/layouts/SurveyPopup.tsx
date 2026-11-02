"use client";

import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { v4 as uuidv4 } from "uuid";
import {
  getQuries,
  getResponses,
  submitQuestions,
  sendVerificationOtp,
  resendVerificationOtp,
  verifyOtp,
  getVerificationStatus,
  type VerificationChannel,
} from "@/services/api/surveyApi";
import { config } from "@/utils/config";
import Icon from "@/components/ui/Icon";

/* eslint-disable @typescript-eslint/no-explicit-any */

let socket: Socket | undefined;
let guestId: string | undefined;
let currentquestions: any;

const AVATAR = "/favicon.ico";

// Form labels that the backend refuses to store until they're OTP-verified.
// Order decides which one the visitor is asked to verify first.
const VERIFIABLE_FIELDS: Array<{ label: string; channel: VerificationChannel }> = [
  { label: "Email Address", channel: "email" },
  { label: "Phone Number", channel: "phone" },
];

// These must agree with verification.service.js on the backend, or a contact
// verified here won't match the proof recorded there and submit will 403.
const normalizeEmail = (value: string) => String(value || "").trim().toLowerCase();

const normalizePhone = (value: string) => {
  const digits = String(value || "").replace(/\D/g, "");
  return digits.length > 10 ? digits.slice(-10) : digits;
};

const normalizeTarget = (channel: VerificationChannel, value: string) =>
  channel === "email" ? normalizeEmail(value) : normalizePhone(value);

/** Identity of a verified contact, used as the set key. */
const contactKey = (channel: VerificationChannel, value: string) =>
  `${channel}:${normalizeTarget(channel, value)}`;

const SurveyPopup = () => {
  const [visible, setVisible] = useState(false);
  const [currentQuestion] = useState(0);
  const [currentQuestions, setCurrentQuestions] = useState<any[]>([]);
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  const [currentQuestionInd, setCurrentQuestionInd] = useState(1);
  const [answers] = useState<Record<string, any>>({});
  const [skipped, setSkipped] = useState(false);
  const [connnectedToAdmin, setConnectedToAdmin] = useState(false);
  const [surveyResponses, setSurveyResponses] = useState<any>(null);
  const [currFormData, setCurrFormData] = useState<Record<string, any>>({});
  const [wellcomeText, setWellComeText] = useState("");
  const [isAdminOnline, setIsAdminOnline] = useState(false);
  const [hasText, setHasText] = useState(false);
  // Stack of pre-answer snapshots so the user can go back and re-choose.
  const [history, setHistory] = useState<any[]>([]);
  // Per-field validation errors for the details form.
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // ===== OTP verification =====
  // Contacts proven to belong to this visitor, keyed by contactKey(). Seeded
  // from the server on mount so a refresh doesn't re-ask.
  const [verifiedTargets, setVerifiedTargets] = useState<Set<string>>(new Set());
  // The contact currently being verified — non-null swaps the form for the OTP
  // step. `verified` is worked through one contact at a time, as requested.
  const [verifyStep, setVerifyStep] = useState<{
    label: string;
    channel: VerificationChannel;
    value: string;
  } | null>(null);
  // The form snapshot captured at submit time, replayed once every contact is
  // verified. Held separately so it can't be disturbed mid-verification.
  const [pendingForm, setPendingForm] = useState<any[] | null>(null);
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  // Failure from create-or-update itself (as opposed to a single field).
  const [submitError, setSubmitError] = useState("");
  const [otpNotice, setOtpNotice] = useState("");
  const [otpBusy, setOtpBusy] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  // react-phone-input-2 knows the dial code the visitor picked; the backend
  // needs it to actually dial out, since `target` is national digits only.
  const [phoneDialCode, setPhoneDialCode] = useState("91");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // NOTE: assign to the module-level `guestId` — do NOT shadow it with `let`,
    // or every API/socket call sends uid: undefined.
    guestId = localStorage.getItem("guestId") || undefined;
    if (!guestId) {
      guestId = uuidv4();
      localStorage.setItem("guestId", guestId);
    }

    currentquestions = localStorage.getItem("currentQuestions");
    if (currentquestions) {
      currentquestions = JSON.parse(currentquestions);
    }

    if (!socket) {
      const baseurl = config.socketURL;
      socket = io(baseurl, { transports: ["websocket"] });

      // Re-join the guest's room on every (re)connect. Otherwise, after any
      // socket reconnect (dev HMR, network blip, server restart) the visitor
      // silently leaves room `guestId`, so admin→user messages (which are
      // room-targeted via io.to(uid)) stop arriving — even though user→admin
      // keeps working because it's a broadcast.
      socket.on("connect", () => {
        socket?.emit("joinRoom", { guestId });
      });
      socket.emit("newVisit", { uid: guestId });

      socket.on("message_from_admin", (data: any) => {
        const newmessage = {
          from: "admin",
          text: data?.message,
          createdAt: data.createdAt,
        };
        setSurveyResponses((prev: any) => ({
          ...prev,
          chat: [...(prev?.chat || []), newmessage],
        }));
        // Surface the conversation: open the popup and switch to chat view
        // so the visitor sees the admin's reply right away.
        setVisible(true);
        setSkipped(false);
        setConnectedToAdmin(true);
        socket?.emit("markChatAsSeen", { uid: guestId, seenBy: "user" });
      });

      socket.on("admin_online", (status: boolean) => {
        setIsAdminOnline(status);
      });

      // Admin viewed the conversation -> mark our sent messages as seen (✓✓).
      socket.on("seen_by_admin", (data: any) => {
        if (data?.uid && data.uid !== guestId) return;
        setSurveyResponses((prev: any) => ({
          ...prev,
          chat: (prev?.chat || []).map((m: any) =>
            m.from === "user" ? { ...m, seen: true } : m
          ),
        }));
      });
    }
  }, []);

  useEffect(() => {
    if (
      currentQuestions?.length === 0 ||
      (currentQuestions[currentQuestionInd]?.questions?.length === 0 &&
        currentQuestions[currentQuestionInd]?.categories?.length === 0 &&
        !currentQuestions[currentQuestionInd + 1])
    ) {
      setIsLastQuestion(true);
    }
  }, [currentQuestions]);

  useEffect(() => {
    if (visible && connnectedToAdmin) {
      socket?.emit("markChatAsSeen", { uid: guestId, seenBy: "user" });
    }
  }, [visible, connnectedToAdmin]);

  useEffect(() => {
    scrollToBottom();
  }, [surveyResponses, currentQuestion, connnectedToAdmin, skipped, visible]);

  useEffect(() => {
    const skippedBefore = localStorage.getItem("survey_skipped");
    const isSurveyCompleted = localStorage.getItem("survey_completed");

    if (isSurveyCompleted !== "true") {
      if (!skippedBefore) {
        setTimeout(() => setVisible(true), 1000);
      } else {
        setSkipped(true);
      }
    }
  }, []);

  useEffect(() => {
    if (currentQuestions?.length === 0) {
      (async () => {
        const survey_questions = await getQuries();
        if (survey_questions?.statusCode === 200) {
          const questions = buildCategoryTree(survey_questions?.details as any[]);
          setWellComeText(questions[0]?.question);
          localStorage.setItem("wellcomeText", questions[0]?.question || "");
          setCurrentQuestions(questions);
          localStorage.setItem("currentQuestions", JSON.stringify(questions));
          localStorage.setItem("currentQuestionInd", "1");
        }
      })();
    }

    (async () => {
      const survey_responses = await getResponses({ uid: guestId });
      if (survey_responses?.statusCode === 200) {
        if (survey_responses?.details) {
          const details = survey_responses.details as any;
          const chat = annotateUserSeen(details.chat || [], details.unseenChatByAdmin || 0);
          setSurveyResponses({ ...details, responses: [], chat });
        }
      }
    })();

    // Rehydrate which contacts are already verified, so a visitor who refreshes
    // mid-survey isn't asked to prove the same email/phone twice.
    (async () => {
      const status = await getVerificationStatus({ uid: guestId });
      const verified = status?.details?.verified;
      if (!verified?.length) return;
      setVerifiedTargets(
        new Set(verified.map((v) => contactKey(v.channel, v.target)))
      );
    })();
  }, []);

  // Tick the resend cooldown down to zero.
  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  // Mark each user message seen/unseen from the persisted unseen count: the
  // last `unseenByAdmin` user messages are still unseen (single tick).
  const annotateUserSeen = (chat: any[], unseenByAdmin: number) => {
    const userIdx = chat
      .map((m, i) => (m.from === "user" ? i : -1))
      .filter((i) => i >= 0);
    const unseen = new Set(userIdx.slice(userIdx.length - (unseenByAdmin || 0)));
    return chat.map((m, i) =>
      m.from === "user" ? { ...m, seen: !unseen.has(i) } : m
    );
  };

  const buildCategoryTree = (flatArray: any[]) => {
    const idMap: Record<string, any> = {};
    const tree: any[] = [];

    (flatArray || []).forEach((item) => {
      idMap[item._id] = { ...item, categories: [], questions: [] };
    });
    (flatArray || []).forEach((item) => {
      const node = idMap[item._id];
      if (!item.parent_category_id) {
        tree.push(node);
      } else {
        const parent = idMap[item.parent_category_id];
        if (parent) {
          if (item.name) {
            parent.categories.push(node);
          } else if (item.question) {
            parent.questions.push(node);
          }
        } else {
          tree.push(node);
        }
      }
    });
    return tree;
  };

  const messageToAdmin = async (message: string) => {
    socket?.emit("messageToAdmin", {
      guestId,
      text: message,
      responseId: surveyResponses?._id,
      createdAt: new Date().toISOString(),
    });
  };

  const connectToAdmin = async () => {
    setConnectedToAdmin(true);
    messageToAdmin("");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Reset the chat input box after a message is sent (height + empty state).
  const resetInputBox = () => {
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setHasText(false);
  };

  // Snapshot the current step BEFORE an answer mutates it, so we can go back.
  const pushHistory = () => {
    setHistory((h) => [
      ...h,
      {
        currentQuestions,
        currentQuestionInd,
        responses: [...(surveyResponses?.responses || [])],
        user_data: { ...(surveyResponses?.user_data || {}) },
      },
    ]);
  };

  // Revert to the previous question and drop the last recorded answer.
  const goBack = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory(history.slice(0, -1));
    setConnectedToAdmin(false);
    setIsLastQuestion(false);
    setCurrentQuestions(prev.currentQuestions);
    setCurrentQuestionInd(prev.currentQuestionInd);
    localStorage.setItem("currentQuestions", JSON.stringify(prev.currentQuestions));
    localStorage.setItem("currentQuestionInd", String(prev.currentQuestionInd));
    setSurveyResponses((s: any) => ({
      ...s,
      responses: prev.responses,
      user_data: prev.user_data,
    }));
    setCurrFormData({});
    // Persist the reverted state so the admin view stays in sync.
    submitQuestions({
      responses: prev.responses,
      uid: guestId as string,
      user_data: prev.user_data,
    });
  };

  const handleAnswer = async (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    const input = textareaRef.current?.value.trim();
    if (input === "" || input === undefined) return;

    if (connnectedToAdmin) {
      const message = {
        from: "user",
        text: input,
        createdAt: new Date().toISOString(),
        seen: false,
      };
      setSurveyResponses((prev: any) => ({
        ...prev,
        chat: [...(prev?.chat || []), message],
      }));
      if (textareaRef.current) textareaRef.current.value = "";
      messageToAdmin(input);
      return;
    }

    pushHistory();
    const user_data: Record<string, any> = {};
    if (currentQuestions[currentQuestionInd]?.name) {
      user_data[currentQuestions[currentQuestionInd]?.name] = input;
    }

    submitResponse(input, [], user_data);

    if (currentQuestions[currentQuestionInd + 1]) {
      localStorage.setItem("currentQuestionInd", String(currentQuestionInd + 1));
      setCurrentQuestionInd(currentQuestionInd + 1);
    } else if (currentQuestions[currentQuestionInd]?.questions?.length > 0) {
      setCurrentQuestions(currentQuestions[currentQuestionInd]?.questions);
      setCurrentQuestionInd(0);
      localStorage.setItem("currentQuestionInd", "0");
      localStorage.setItem(
        "currentQuestions",
        JSON.stringify(currentQuestions[currentQuestionInd]?.questions)
      );
    } else {
      localStorage.setItem("currentQuestionInd", String(currentQuestionInd + 1));
      setCurrentQuestionInd(currentQuestionInd + 1);
    }

    if (textareaRef.current) {
      textareaRef.current.value = "";
    }
  };

  const submitResponse = async (
    response: string,
    form: any[] = [],
    user_data: Record<string, any> = surveyResponses?.user_data || {}
  ) => {
    const updatedResponses = [
      ...(surveyResponses?.responses || []),
      {
        question: currentQuestions[currentQuestionInd]?.question,
        answer: response,
        form,
      },
    ];

    setSurveyResponses((prev: any) => ({
      ...prev,
      responses: updatedResponses,
      user_data: { ...prev?.user_data, ...user_data },
    }));

    // Returned so the details-form path can react to a rejection (the backend
    // refuses unverified contacts); the other call sites ignore it as before.
    return await submitQuestions({
      responses: updatedResponses,
      uid: guestId as string,
      user_data,
    });
  };

  const onClickOption = async (option: any) => {
    setConnectedToAdmin(false);
    pushHistory();
    const user_data: Record<string, any> = {};
    if (currentQuestions[currentQuestionInd]?.name) {
      user_data[currentQuestions[currentQuestionInd]?.name] = option?.name;
    }

    submitResponse(option?.name, [], user_data);
    if (option?.question?.replace(/<[^>]*>/g, "").trim()) {
      setCurrentQuestions([option]);
      setCurrentQuestionInd(0);
      localStorage.setItem("currentQuestionInd", "0");
      localStorage.setItem("currentQuestions", JSON.stringify([option]));
    } else if (option?.questions?.length > 0) {
      setCurrentQuestions(option?.questions);
      localStorage.setItem("currentQuestions", JSON.stringify(option?.questions));
      localStorage.setItem("currentQuestionInd", "0");
      setCurrentQuestionInd(0);
    } else if (currentQuestions[currentQuestionInd]?.questions?.length > 0) {
      setCurrentQuestions(currentQuestions[currentQuestionInd]?.questions);
      localStorage.setItem(
        "currentQuestions",
        JSON.stringify(currentQuestions[currentQuestionInd]?.questions)
      );
      localStorage.setItem("currentQuestionInd", "0");
      setCurrentQuestionInd(0);
    } else {
      setCurrentQuestionInd(currentQuestionInd + 1);
      localStorage.setItem("currentQuestionInd", String(currentQuestionInd + 1));
    }
  };

  const clearFieldError = (key: string) =>
    setFormErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });

  const handleChange = (key: string, value: any) => {
    setCurrFormData((prev) => ({ ...prev, [key]: value }));
    setSurveyResponses((prev: any) => ({
      ...prev,
      user_data: { ...prev?.user_data, [key]: value },
    }));
    clearFieldError(key);
  };

  const handleChangePhoneInput = (value: string, data?: any) => {
    // Capture the dial code the visitor picked — `target` sent to the backend is
    // national digits only, so this is what tells the SMS provider where to dial.
    if (data?.dialCode) setPhoneDialCode(data.dialCode);
    setCurrFormData((prev) => ({ ...prev, ["Phone Number"]: "+" + value }));
    setSurveyResponses((prev: any) => ({
      ...prev,
      user_data: { ...prev?.user_data, ["Phone Number"]: "+" + value },
    }));
    clearFieldError("Phone Number");
  };

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());

  const isValidPhone = (value: string) =>
    String(value).replace(/[^\d]/g, "").length >= 10;

  /**
   * Contact fields on this form that are filled in but not yet proven to belong
   * to the visitor. Takes the verified set explicitly because callers often act
   * on a set they've just extended — reading the state var would lag a render.
   */
  const pendingVerifications = (formFields: any[], verified: Set<string>) =>
    VERIFIABLE_FIELDS.filter((vf) =>
      formFields.some((f: any) => f.label === vf.label)
    )
      .map((vf) => ({ ...vf, value: String(currFormData[vf.label] ?? "").trim() }))
      .filter((c) => c.value && !verified.has(contactKey(c.channel, c.value)));

  const describeSentTo = (contact: { channel: VerificationChannel; value: string }) =>
    contact.channel === "email"
      ? `We've emailed a code to ${contact.value}.`
      : `We've texted a code to ${contact.value}.`;

  /** Swap the form for the OTP step and send a code for this contact. */
  const startVerification = async (contact: {
    label: string;
    channel: VerificationChannel;
    value: string;
  }) => {
    setVerifyStep(contact);
    setOtpValue("");
    setOtpError("");
    setOtpNotice("");
    setResendIn(0);
    setOtpBusy(true);

    const result = await sendVerificationOtp({
      uid: guestId as string,
      channel: contact.channel,
      target: contact.value,
      ...(contact.channel === "phone" ? { country_code: phoneDialCode } : {}),
    });
    setOtpBusy(false);

    if (result?.errorCode) {
      setOtpError(result.message || "We couldn't send the code. Please try again.");
      return;
    }
    // Server already holds a proof for this contact (e.g. an earlier session) —
    // no code to enter, just move on.
    if (result?.details?.status === "verified") {
      await onContactVerified(contact);
      return;
    }
    setOtpNotice(describeSentTo(contact));
    setResendIn(result?.details?.resend_available_in_seconds ?? 60);
  };

  /** Persist the details form and advance the survey. */
  const proceedAfterForm = async (currform: any[]) => {
    setOtpBusy(true);
    pushHistory();
    const result = await submitResponse("", currform);
    setOtpBusy(false);

    if (result?.errorCode) {
      // Verification lapsed or the server refused for another reason. Undo the
      // history push and keep the visitor on this step rather than advancing
      // past a submission that never landed.
      setHistory((h) => h.slice(0, -1));
      setVerifyStep(null);
      setSubmitError(
        result.message || "We couldn't submit your details. Please try again."
      );
      return;
    }

    setSubmitError("");
    setVerifyStep(null);
    setPendingForm(null);

    if (currentQuestions[currentQuestionInd + 1]) {
      localStorage.setItem("currentQuestionInd", String(currentQuestionInd + 1));
      setCurrentQuestionInd(currentQuestionInd + 1);
    } else if (currentQuestions[currentQuestionInd]?.questions?.length > 0) {
      setCurrentQuestions(currentQuestions[currentQuestionInd]?.questions);
      localStorage.setItem(
        "currentQuestions",
        JSON.stringify(currentQuestions[currentQuestionInd]?.questions)
      );
      setCurrentQuestionInd(0);
      localStorage.setItem("currentQuestionInd", "0");
    } else {
      localStorage.setItem("currentQuestionInd", String(currentQuestionInd + 1));
      setCurrentQuestionInd(currentQuestionInd + 1);
    }
    setCurrFormData({});
  };

  /**
   * A contact just passed. Verify the next outstanding one, or — once every
   * contact is proven — finally send the details to create-or-update.
   */
  const onContactVerified = async (contact: {
    label: string;
    channel: VerificationChannel;
    value: string;
  }) => {
    const nextVerified = new Set(verifiedTargets);
    nextVerified.add(contactKey(contact.channel, contact.value));
    setVerifiedTargets(nextVerified);

    const formFields = currentQuestions[currentQuestionInd]?.form || [];
    const remaining = pendingVerifications(formFields, nextVerified);

    if (remaining.length > 0) {
      await startVerification(remaining[0]);
      return;
    }

    const form =
      pendingForm ??
      Object.entries(currFormData).map(([label, value]) => ({ label, value }));
    await proceedAfterForm(form);
  };

  const handleVerifyOtp = async () => {
    if (!verifyStep || otpBusy) return;
    const otp = otpValue.trim();
    if (!/^\d{4,8}$/.test(otp)) {
      setOtpError("Please enter the code we sent you.");
      return;
    }

    setOtpBusy(true);
    setOtpError("");
    const result = await verifyOtp({
      uid: guestId as string,
      channel: verifyStep.channel,
      target: verifyStep.value,
      otp,
    });
    setOtpBusy(false);

    if (result?.errorCode) {
      setOtpError(result.message || "That code wasn't right. Please try again.");
      return;
    }
    setOtpNotice("");
    await onContactVerified(verifyStep);
  };

  const handleResendOtp = async () => {
    if (!verifyStep || resendIn > 0 || otpBusy) return;

    setOtpBusy(true);
    setOtpError("");
    setOtpNotice("");
    const result = await resendVerificationOtp({
      uid: guestId as string,
      channel: verifyStep.channel,
      target: verifyStep.value,
      ...(verifyStep.channel === "phone" ? { country_code: phoneDialCode } : {}),
    });
    setOtpBusy(false);

    if (result?.errorCode) {
      setOtpError(result.message || "We couldn't resend the code. Please try again.");
      // Server owns the cooldown; mirror whatever it tells us is left.
      if (result?.details?.retry_after_seconds) {
        setResendIn(result.details.retry_after_seconds);
      }
      return;
    }
    setOtpValue("");
    setOtpNotice(describeSentTo(verifyStep));
    setResendIn(result?.details?.resend_available_in_seconds ?? 60);
  };

  /** Abandon verification and return to the details form to fix a typo. */
  const cancelVerification = () => {
    setVerifyStep(null);
    setPendingForm(null);
    setOtpValue("");
    setOtpError("");
    setOtpNotice("");
    setResendIn(0);
  };

  const handleFormSubmit = async () => {
    setConnectedToAdmin(false);

    const formFields = currentQuestions[currentQuestionInd]?.form || [];
    const errors: Record<string, string> = {};

    formFields.forEach((field: any) => {
      const value = String(currFormData[field.label] ?? "").trim();
      if (field.is_required && !value) {
        errors[field.label] = `${field.label} is required`;
      } else if (field.label === "Email Address" && value && !isValidEmail(value)) {
        errors[field.label] = "Please enter a valid email address";
      } else if (field.label === "Phone Number" && value && !isValidPhone(value)) {
        errors[field.label] = "Please enter a valid phone number";
      }
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setSubmitError("");
    const currform = Object.entries(currFormData).map((field) => ({
      label: field[0],
      value: field[1],
    }));

    // Gate: hold the details back until every contact is verified. The backend
    // rejects unverified contacts anyway, so submitting first would only lose
    // the visitor's answers.
    const pending = pendingVerifications(formFields, verifiedTargets);
    if (pending.length > 0) {
      setPendingForm(currform);
      await startVerification(pending[0]);
      return;
    }

    await proceedAfterForm(currform);
  };

  const handleSkip = () => {
    localStorage.setItem("survey_skipped", "true");
    setVisible(false);
    setSkipped(true);
  };

  const handleReopen = () => {
    setVisible(true);
    setSkipped(false);
  };

  const fullName = surveyResponses?.user_data?.["Full Name"] || "";
  const selectedCountry = surveyResponses?.user_data?.["Study Abroad"] || "";
  const firstName = fullName.split(" ")[0] || "";

  const personalize = (html: string) =>
    (html || "")
      .replace(/\[First Name\]/g, firstName)
      .replace(/\[Selected Country\]/g, selectedCountry);

  const questionHtml = personalize(currentQuestions[currentQuestionInd]?.question);

  return (
    <div className="survey-popup-widget">
      <style>{`
        /* Keep the widget readable regardless of the site's light/dark theme. */
        .survey-popup-widget { color: #343a40; }
        .survey-popup-widget p {
          color: inherit !important;
          opacity: 1 !important;
          margin-bottom: .35rem;
          line-height: 1.45;
        }
        /* Avoid text getting stuck semi-transparent if animate.css isn't loaded. */
        .survey-popup-widget .animate__animated { opacity: 1 !important; }
        .survey-popup-widget textarea,
        .survey-popup-widget input.form-control {
          background: #ffffff !important;
          color: #1f2937 !important;
          border: 1px solid #d1d5db !important;
        }
        .survey-popup-widget .form-control::placeholder { color: #9ca3af !important; }
        /* Dark theme can darken bootstrap's bg-white; keep white surfaces white. */
        .survey-popup-widget .bg-white { background-color: #ffffff !important; }
        /* Thin, subtle scrollbar for the messages area. */
        .survey-popup-widget .overflow-auto {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }
        .survey-popup-widget .overflow-auto::-webkit-scrollbar { width: 6px; }
        .survey-popup-widget .overflow-auto::-webkit-scrollbar-thumb {
          background: #cbd5e1; border-radius: 3px;
        }
        .survey-popup-widget .overflow-auto::-webkit-scrollbar-track { background: transparent; }
        .survey-popup-widget .sp-user-avatar {
          width: 30px; height: 30px; border-radius: 50%;
          background: #2563EB; color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; flex-shrink: 0;
        }
        /* Unified rounded chat input bar (textarea + send button as one pill). */
        .survey-popup-widget .sp-chat-bar {
          display: flex; align-items: flex-end; gap: 6px; width: 100%;
          border: 1px solid #e2e8f0; border-radius: 22px;
          background: #f8fafc; padding: 3px 3px 3px 14px;
          transition: border-color .15s ease, box-shadow .15s ease;
        }
        .survey-popup-widget .sp-chat-bar:focus-within {
          border-color: #2563EB;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
        }
        .survey-popup-widget .sp-chat-input {
          flex: 1; border: none !important; background: transparent !important;
          box-shadow: none !important; outline: none !important; resize: none;
          padding: 8px 0; font-size: 0.9rem; color: #1f2937; line-height: 1.4;
          max-height: 96px;
        }
        .survey-popup-widget .sp-chat-input::placeholder { color: #9ca3af; }
        .survey-popup-widget .sp-chat-input {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }
        .survey-popup-widget .sp-chat-input::-webkit-scrollbar { width: 5px; }
        .survey-popup-widget .sp-chat-input::-webkit-scrollbar-thumb {
          background: #cbd5e1; border-radius: 3px;
        }
        .survey-popup-widget .sp-send-btn {
          width: 38px; height: 38px; border-radius: 50%; background: #2563EB;
          display: flex; align-items: center; justify-content: center;
          border: none; flex-shrink: 0; cursor: pointer;
          transition: background .15s ease, transform .1s ease;
        }
        .survey-popup-widget .sp-send-btn:hover { background: #1d4ed8; }
        .survey-popup-widget .sp-send-btn:active { transform: scale(0.94); }
        .survey-popup-widget .sp-send-btn:disabled {
          background: #cbd5e1; cursor: not-allowed; transform: none;
        }
      `}</style>
      {visible && (
        <div
          className="position-fixed bottom-0 end-0 m-3 shadow bg-white rounded-top border animate__animated animate__fadeInUp"
          style={{
            zIndex: 1050,
            width: "380px",
            maxWidth: "calc(100vw - 24px)",
            height: "510px",
            maxHeight: "calc(100vh - 24px)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            className="d-flex justify-content-between align-items-center p-1 border-bottom text-white rounded-top"
            style={{ background: "linear-gradient(135deg,#1E40AF, #2563EB)" }}
          >
            <div className="d-flex align-items-center">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle shadow-sm ms-1 me-2"
                style={{ background: "#ffffff", width: "36px", height: "36px", flexShrink: 0 }}
              >
                <img
                  src={AVATAR}
                  alt="Shanvia Tech"
                  style={{ width: "24px", height: "24px", objectFit: "contain" }}
                />
              </div>
              <div className="d-flex flex-column mt-2">
                <span className="fw-semibold fs-6" style={{ lineHeight: 1.1 }}>
                  Shanvia Tech
                </span>
                <span
                  className="d-flex align-items-center"
                  style={{ fontSize: "0.7rem", opacity: 0.95 }}
                >
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: isAdminOnline ? "#22c55e" : "#cbd5e1",
                      display: "inline-block",
                      marginRight: "5px",
                    }}
                  ></span>
                  {isAdminOnline ? "Online" : "Offline"}
                </span>
              </div>
            </div>
            <button
              className="sp-btn sp-btn-sm sp-btn-light border-0 bg-transparent text-white fs-5"
              onClick={handleSkip}
            >
              ✕
            </button>
          </div>

          {/* Messages Area */}
          <div
            className="flex-grow-1 p-3 overflow-auto"
            style={{ backgroundColor: "#f8f9fa", color: "#343a40" }}
          >
            <div>
              <div dangerouslySetInnerHTML={{ __html: personalize(wellcomeText) }} />
            </div>

            {surveyResponses?.responses?.length > 0 &&
              surveyResponses?.responses?.map((response: any, idx: number) => (
                <div key={idx}>
                  <div className="mb-1 d-flex gap-2 align-items-start">
                    <div>
                      <img
                        src={AVATAR}
                        alt="Logo"
                        style={{ width: "24px", height: "24px", objectFit: "contain" }}
                      />
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: personalize(response?.question) }} />
                  </div>

                  {response?.answer && (
                    <div className="mb-3 text-end">
                      <span
                        className="d-inline-block text-dark px-3 py-2 rounded"
                        style={{
                          background: "#f0f0f3",
                          boxShadow:
                            "4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)",
                          fontSize: "0.9rem",
                          maxWidth: "80%",
                        }}
                      >
                        {response?.answer}
                      </span>
                    </div>
                  )}
                  {response?.form?.length > 0 && (
                    <div className="mb-3">
                      {response.form.map((field: any, i: number) => (
                        <div
                          key={i}
                          className="mb-2 px-3 py-2 rounded"
                          style={{ background: "#f1f5f9" }}
                        >
                          <div
                            style={{
                              fontSize: "0.7rem",
                              fontWeight: 600,
                              color: "#64748b",
                              textTransform: "uppercase",
                              letterSpacing: "0.03em",
                            }}
                          >
                            {field.label}
                          </div>
                          <div style={{ fontSize: "0.9rem", color: "#1f2937", wordBreak: "break-word" }}>
                            {field.value || "—"}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

            {currentQuestions?.length > 0 &&
            currentQuestions[currentQuestionInd]?.question ? (
              <div>
                <div
                  className={`mb-1 ${isLastQuestion ? "" : "fw-bold"} animate__animated animate__fadeInUp d-flex gap-2 align-items-start`}
                  style={{
                    color: isLastQuestion ? "" : "#064a72",
                    fontSize: isLastQuestion ? "1rem" : "1.1rem",
                  }}
                >
                  <div>
                    <img
                      src={AVATAR}
                      alt="Logo"
                      style={{ width: "24px", height: "24px", objectFit: "contain" }}
                    />
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: questionHtml }} />
                </div>
                <div className="d-flex flex-wrap gap-2 ms-4">
                  {currentQuestions[currentQuestionInd]?.categories?.map(
                    (opt: any, i: number) => (
                      <button
                        key={i}
                        className="px-2 py-1 rounded-pill border bg-light text-dark"
                        style={{ fontSize: "0.8rem", borderColor: "#064a72", cursor: "pointer" }}
                        onClick={() => onClickOption(opt)}
                      >
                        {opt.name}
                      </button>
                    )
                  )}

                  {/* While a contact is being verified the form is replaced by
                      the OTP step, so the visitor has exactly one thing to do. */}
                  {currentQuestions[currentQuestionInd]?.form?.length > 0 &&
                    !verifyStep &&
                    currentQuestions[currentQuestionInd]?.form.map((field: any, i: number) => {
                      let type = "text";
                      if (field.label === "Phone Number") type = "number";
                      if (field.label === "Email Address") type = "email";
                      const verifiable = VERIFIABLE_FIELDS.find((v) => v.label === field.label);
                      const value = String(currFormData[field.label] ?? "").trim();
                      const isVerified =
                        !!verifiable &&
                        !!value &&
                        verifiedTargets.has(contactKey(verifiable.channel, value));
                      return (
                        <div key={i} className="mb-1 w-100">
                          <label className="d-block mb-1 fw-bold">
                            {field.label}{" "}
                            {field.is_required && <span className="text-danger">*</span>}
                            {isVerified && (
                              <span
                                className="sp-badge rounded-pill bg-success ms-1"
                                style={{ fontSize: "0.65rem", fontWeight: 600 }}
                              >
                                ✓ Verified
                              </span>
                            )}
                          </label>

                          {type === "number" ? (
                            <PhoneInput
                              country={"in"}
                              value={currFormData[field.label] || ""}
                              onChange={handleChangePhoneInput}
                              inputProps={{ name: "phone_number", required: true }}
                              containerStyle={{ width: "100%" }}
                              inputStyle={{ width: "100%" }}
                            />
                          ) : (
                            <input
                              type={type}
                              className={`sp-input ${formErrors[field.label] ? "is-invalid" : ""}`}
                              style={{ height: "40px", fontSize: "0.9rem" }}
                              placeholder={`Enter ${field.label}`}
                              required={field.is_required}
                              value={currFormData[field.label] || ""}
                              onChange={(e) => handleChange(field?.label, e.target.value)}
                            />
                          )}
                          {formErrors[field.label] && (
                            <div className="text-danger" style={{ fontSize: "0.75rem", marginTop: "2px" }}>
                              {formErrors[field.label]}
                            </div>
                          )}
                        </div>
                      );
                    })}

                  {currentQuestions[currentQuestionInd]?.form?.length > 0 && !verifyStep && (
                    <>
                      {submitError && (
                        <div
                          className="sp-alert sp-alert-danger w-100 py-2 px-3 mb-0 mt-2"
                          style={{ fontSize: "0.8rem" }}
                          role="alert"
                        >
                          {submitError}
                        </div>
                      )}
                      <button
                        className="sp-btn sp-btn-primary w-100 mt-2"
                        onClick={handleFormSubmit}
                        disabled={otpBusy}
                      >
                        {otpBusy ? "Please wait…" : "Submit"}
                      </button>
                    </>
                  )}

                  {/* ===== OTP step ===== */}
                  {verifyStep && (
                    <div className="w-100">
                      <label className="d-block mb-1 fw-bold">
                        Verify your {verifyStep.channel === "email" ? "email address" : "phone number"}
                      </label>
                      <div
                        className="mb-2"
                        style={{ fontSize: "0.8rem", color: "#64748b", wordBreak: "break-word" }}
                      >
                        {otpNotice || `Sending a code to ${verifyStep.value}…`}
                      </div>

                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        className={`sp-input ${otpError ? "is-invalid" : ""}`}
                        style={{ height: "40px", fontSize: "1rem", letterSpacing: "0.3em" }}
                        placeholder="Enter code"
                        value={otpValue}
                        disabled={otpBusy}
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
                      {otpError && (
                        <div className="text-danger" style={{ fontSize: "0.75rem", marginTop: "2px" }}>
                          {otpError}
                        </div>
                      )}

                      <button
                        className="sp-btn sp-btn-primary w-100 mt-2"
                        onClick={handleVerifyOtp}
                        disabled={otpBusy || !otpValue}
                      >
                        {otpBusy ? "Please wait…" : "Verify"}
                      </button>

                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <button
                          type="button"
                          className="sp-btn sp-btn-link sp-btn-sm text-decoration-none p-0"
                          style={{ fontSize: "0.8rem", color: "#64748b" }}
                          onClick={cancelVerification}
                          disabled={otpBusy}
                        >
                          <span className="me-1">↩</span> Edit details
                        </button>
                        <button
                          type="button"
                          className="sp-btn sp-btn-link sp-btn-sm text-decoration-none p-0"
                          style={{
                            fontSize: "0.8rem",
                            color: resendIn > 0 ? "#94a3b8" : "#2563EB",
                          }}
                          onClick={handleResendOtp}
                          disabled={otpBusy || resendIn > 0}
                        >
                          {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend code"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {history.length > 0 && !connnectedToAdmin && !verifyStep && (
                  <button
                    type="button"
                    className="ms-3 mt-4 sp-btn sp-btn-link sp-btn-sm text-decoration-none p-0 d-inline-flex align-items-center"
                    style={{ fontSize: "0.8rem", color: "#64748b" }}
                    onClick={goBack}
                  >
                    <span className="me-1">↩</span> Go back
                  </button>
                )}
                {connnectedToAdmin && !isLastQuestion && (
                  <button
                    className="ms-2 mt-2 sp-btn sp-btn-link text-decoration-none text-primary d-flex align-items-center"
                    onClick={() => setConnectedToAdmin(false)}
                  >
                    <span className="me-1">✍️</span>
                    <span className="mt-1">Answer the Question</span>
                  </button>
                )}
              </div>
            ) : (
              <div>
                <div className="mb-1 d-flex gap-2 align-items-start">
                  😊 Thank you for completing the survey! We appreciate your time and
                  will use your responses to provide the best possible support.
                </div>
                {history.length > 0 && !connnectedToAdmin && (
                  <button
                    type="button"
                    className="ms-1 mt-2 sp-btn sp-btn-link sp-btn-sm text-decoration-none p-0 d-inline-flex align-items-center"
                    style={{ fontSize: "0.8rem", color: "#64748b" }}
                    onClick={goBack}
                  >
                    <span className="me-1">↩</span> Go back
                  </button>
                )}
              </div>
            )}

            {/* Reminder while the final details form is still unsubmitted. */}
            {!connnectedToAdmin &&
              isLastQuestion &&
              currentQuestions[currentQuestionInd]?.form?.length > 0 && (
                <div
                  className="text-center text-muted my-3"
                  style={{ fontSize: "0.85rem" }}
                >
                  💬 Submit your details above to chat with our consultant.
                </div>
              )}

            {/* Chat option — only after all questions (incl. the form) are submitted. */}
            {!connnectedToAdmin &&
              surveyResponses?.responses?.length > 0 &&
              !currentQuestions[currentQuestionInd]?.question &&
              Object.keys(surveyResponses?.user_data || {}).length > 3 && (
                <div className="sp-card shadow-sm my-4">
                  <div className="sp-card-body text-center">
                    <h5 className="sp-card-title">Need Help?</h5>
                    <p className="sp-card-text text-muted">
                      You can connect with our consultant for further assistance.
                    </p>
                    {isAdminOnline ? (
                      <button className="sp-btn sp-btn-primary" onClick={connectToAdmin}>
                        Chat with our Consultant
                      </button>
                    ) : (
                      <div className="sp-alert sp-alert-warning mt-3" role="alert">
                        All our experts are busy
                        and not available for chat right now. We will be in touch with
                        you at the provided contact information.
                      </div>
                    )}
                  </div>
                </div>
              )}

            {connnectedToAdmin && (
              <div className="mt-5">
                <div className="mt-2">
                  <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-4">
                    <h5 className="fw-bold text-primary mb-0">
                      Chat with Consultant
                    </h5>
                    <span
                      className={`sp-badge rounded-pill ${isAdminOnline ? "bg-success" : "bg-secondary"}`}
                    >
                      {isAdminOnline ? "Online" : "Offline"}
                    </span>
                  </div>

                  <div className="sp-card-body">
                    {surveyResponses?.chat?.length === 0 && (
                      <p className="text-muted text-center">No messages yet. Say hello 👋</p>
                    )}

                    {surveyResponses?.chat?.map((msg: any, idx: number) => {
                      const isUser = msg.from === "user";
                      const date = new Date(msg.createdAt);
                      const formattedTime = date.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                      const formattedDate = date.toLocaleDateString();

                      return (
                        <div key={idx}>
                          {msg.text && (
                            <div className="mb-3">
                              <div
                                className={`d-flex gap-2 align-items-start ${isUser ? "flex-row-reverse" : ""}`}
                              >
                                <div className="mt-1">
                                  {isUser ? (
                                    <span className="sp-user-avatar">
                                      </span>
                                  ) : (
                                    <img
                                      src={AVATAR}
                                      alt="Admin"
                                      style={{
                                        width: "32px",
                                        height: "32px",
                                        objectFit: "contain",
                                        borderRadius: "50%",
                                      }}
                                    />
                                  )}
                                </div>

                                <div
                                  className="p-2 rounded position-relative"
                                  style={{
                                    background: isUser ? "#0d6efd" : "#f0f0f3",
                                    color: isUser ? "white" : "black",
                                    boxShadow: isUser
                                      ? "2px 2px 6px rgba(0,0,0,0.15)"
                                      : "4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)",
                                    maxWidth: "75%",
                                    fontSize: "0.9rem",
                                    wordBreak: "break-word",
                                  }}
                                >
                                  {msg.text}
                                  <div
                                    className={`mt-2 d-flex align-items-center ${
                                      isUser ? "text-white justify-content-end" : ""
                                    }`}
                                    style={{ fontSize: "0.7rem" }}
                                  >
                                    <span>
                                      {formattedTime}, {formattedDate}
                                    </span>
                                    {isUser && (
                                      <span
                                        className="ms-1"
                                        title={msg.seen ? "Seen" : "Sent"}
                                        style={{
                                          color: msg.seen ? "#86efac" : "rgba(255,255,255,0.7)",
                                          fontSize: "0.78rem",
                                          lineHeight: 1,
                                        }}
                                      >
                                        {msg.seen ? "✓✓" : "✓"}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {!isAdminOnline && (
                    <div className="sp-alert sp-alert-warning mt-3 text-center" role="alert">
                      All our experts are busy and
                      not available for chat right now. We will be in touch with you at
                      the provided contact information.
                    </div>
                  )}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {(connnectedToAdmin ||
            (currentQuestions?.length > 0 &&
              currentQuestions[currentQuestionInd]?.question &&
              !isLastQuestion &&
              currentQuestions[currentQuestionInd]?.form?.length === 0 &&
              (currentQuestions[currentQuestionInd]?.categories?.length || 0) === 0)) && (
            <form
              onSubmit={(e) => {
                handleAnswer(e);
                resetInputBox();
              }}
              className="border-top"
              style={{ background: "#ffffff", padding: "10px" }}
            >
              <div className="sp-chat-bar">
                <textarea
                  ref={textareaRef}
                  name="answer"
                  className="sp-chat-input"
                  placeholder={
                    connnectedToAdmin ? "Send your message..." : "Type your answer..."
                  }
                  autoFocus
                  rows={1}
                  onChange={(e) => {
                    const t = e.currentTarget;
                    t.style.height = "auto";
                    t.style.height = Math.min(t.scrollHeight, 96) + "px";
                    setHasText(t.value.trim().length > 0);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAnswer(e);
                      resetInputBox();
                    }
                  }}
                />
                <button
                  type="submit"
                  className="sp-send-btn"
                  aria-label="Send"
                  disabled={!hasText}
                >
                  <Icon name="arrow" />
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {skipped && (
        <button
          className="border-0 text-white rounded-circle shadow-none d-flex align-items-center justify-content-center"
          style={{
            //background: "linear-gradient(135deg, #81889c, #4e5263ff)",
            background: 'transparent',
            zIndex: 9999,
            width: "90px",
            height: "80px",
            fontSize: "25px",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            bottom: "28px",
            right: "11px",
            position: "fixed",
          }}
          onClick={handleReopen}
        >          
          {/**/}
          <img src="/get-quotes-btn.png" alt="Book a Free Course" />
        </button>
      )}
    </div>
  );
};

export default SurveyPopup;
