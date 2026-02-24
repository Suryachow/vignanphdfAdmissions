import React, { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    User,
    GraduationCap,
    CheckCircle,
    CreditCard,
    Check,
    ArrowLeft,
    ArrowRight,
    Download
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSteps } from "../store/StepContext";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { cn } from "../lib/utils";

// Import Step Components
import ReviewForm from "./steps/ReviewForm";
import PaymentForm from "./steps/PaymentForm";

import UnifiedEducationForm from "./steps/UnifiedEducationForm";
import PersonalInfoForm from "./steps/PersonalInfoForm";
import { ExamScheduleForm } from "./steps/ExamScheduleForm";

// Types
interface CacheStepDataPayload {
    session_id: string;
    user_id: string;
    step: string;
    data: Record<string, any>;
}

import type {
    PaymentStatus,
    CachedApplication
} from "../types/application";
import { apiUrl, API_BASE } from "../lib/api";
import { recordPhase } from "../services/phase";
import { downloadApplicationPdfFile } from "../utils/pdfGenerator";

// Helper: get the slice of formData to store for a given step (so API gets correct data per step)
function getStepDataForCache(
    _stepName: string,
    stepNumber: number,
    steps: { id: number; name: string }[],
    formData: any
): Record<string, any> {
    const name = steps[stepNumber - 1]?.name;
    if (!name) return formData;
    switch (name) {
        case "Payment":
            return formData.payment || {};
        case "Personal Info":
            return { personal: formData.personal || {}, address: formData.address || {} };
        case "Education":
            return {
                education: formData.education || {},
                btechEducation: formData.btechEducation || {},
                mtechEducation: formData.mtechEducation || {},
                documents: formData.documents || {},
            };

        case "Exam Schedule":
            return { examSchedule: formData.examSchedule || {} };
        case "Documents":
            return { documents: formData.documents || {} };
        case "Review":
            return formData;
        default:
            return formData;
    }
}

// Helper: validate required fields for current step; returns error message or null if valid
function validateStepFields(
    stepNumber: number,
    _stepName: string,
    formData: any,
    steps: { id: number; name: string }[],
    program?: string
): string | null {
    const name = steps[stepNumber - 1]?.name;
    if (!name) return null;
    const trim = (v: any) => (typeof v === "string" ? v.trim() : v);
    const filled = (v: any) => v != null && trim(v) !== "";

    switch (name) {
        case "Payment":
            return formData.payment?.paymentStatus === "completed" ? null : "Please complete the payment before proceeding.";
        case "Personal Info": {
            const p = formData.personal || {};
            const phone = String(p.studentPh ?? p.phone ?? p.studentPhone ?? "").replace(/\D/g, "");
            if (!filled(p.firstName)) return "Please enter your full name.";
            if (!filled(p.parentName)) return "Please enter parent/guardian name.";
            if (!filled(p.dob)) return "Please select date of birth.";
            if (!filled(p.gender)) return "Please select gender.";
            if (!filled(p.email)) return "Please enter your email address.";
            if (phone.length !== 10) return "Please enter a valid 10-digit student phone number.";
            if (!filled(p.parentPhone) || String(p.parentPhone).replace(/\D/g, "").length !== 10) return "Please enter a valid 10-digit parent/guardian phone number.";
            if (!filled(p.category)) return "Please select category.";
            const a = formData.address || {};
            if (!filled(a.street)) return "Please enter street address.";
            if (!filled(a.state)) return "Please select state.";
            if (!filled(a.city)) return "Please select city.";
            if (!filled(a.pincode) || String(a.pincode).replace(/\D/g, "").length !== 6) return "Please enter a valid 6-digit pincode.";
            if (!filled(a.country)) return "Please enter country.";
            return null;
        }
        case "Education": {
            const e = formData.education || {};
            if (!filled(e.sscName)) return "Please enter 10th school name.";
            if (!filled(e.Board)) return "Please select 10th board.";
            if (!filled(e.Marks)) return "Please enter 10th CGPA/Percentage.";
            if (!filled(e.xYearOfPassing)) return "Please select 10th year of passing.";
            const isInter = (e.educationType || "intermediate") === "intermediate";
            if (isInter) {
                if (!filled(e.schoolName)) return "Please enter intermediate/12th college name.";
                if (!filled(e.interBoard)) return "Please select intermediate board.";
                if (!filled(e.interStream)) return "Please select stream/group.";
                if (!filled(e.interMarks)) return "Please enter intermediate total marks.";
                if (!filled(e.percentage)) return "Please enter intermediate percentage.";
            } else {
                if (!filled(e.polytechnicCollege)) return "Please enter polytechnic college name.";
                if (!filled(e.polytechnicBoard)) return "Please enter polytechnic board/university.";
                if (!filled(e.polytechnicBranch)) return "Please select polytechnic branch.";
                if (!filled(e.polytechnicYearOfPassing)) return "Please select polytechnic year of passing.";
                if (!filled(e.polytechnicPercentage)) return "Please enter polytechnic percentage/CGPA.";
            }

            const prog = program?.toLowerCase() || "";
            const isPhd = prog.includes("phd") || prog.includes("doct") || prog.includes("research");
            const isPg = prog.includes("master") || prog.includes("post") || prog.includes("m.tech") || prog.includes("mba") || prog.includes("mca") || prog.includes("pg");

            const docs = formData.documents?.files || {};

            // 1. Mandatory for ALL: 10th Class
            if (!docs.ssc) return "Please upload your 10th Class marks memo.";

            // 2. Mandatory for PG & PhD: Intermediate
            if ((isPhd || isPg) && !docs.inter) {
                return "Please upload your Intermediate/12th marks memo.";
            }

            return null;
        }

        case "Exam Schedule": {
            const ex = formData.examSchedule || {};
            if (!filled(ex.date)) return "Please select exam date.";
            if (!filled(ex.time)) return "Please select exam time slot.";
            return null;
        }
        case "Documents": {
            const docs = formData.documents?.files || {};
            if (!docs.ssc) return "Please upload your 10th Class marks memo.";
            if (!docs.ug) return "Please upload your Undergraduate degree/marks memo.";
            if (!docs.pg) return "Please upload your Postgraduate degree/marks memo.";
            return null;
        }
        case "Review":
            return null;
        default:
            return null;
    }
}

async function cacheStepData(
    stepName: string,
    data: Record<string, any>
): Promise<void> {
    try {
        let userPhone = "";
        let sessionId = "";
        const userDetails = localStorage.getItem("user");
        if (userDetails) {
            try {
                const parsedUser = JSON.parse(userDetails);
                const u = parsedUser?.user ?? parsedUser;
                const rawPhone = u?.phone ?? "";
                // Use a clean phone for session_id consistency
                userPhone = rawPhone.replace(/\D/g, "").slice(-10) || rawPhone;
                sessionId = `pending-${userPhone || "guest"}`;
            } catch { }
        }
        const payload: CacheStepDataPayload = {
            session_id: sessionId || "dummy-session-id",
            user_id: userPhone || "",
            step: stepName,
            data: data || {},
        };
        const res = await fetch(apiUrl(`/api/step/${stepName}/`), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            const msg = err?.detail || `Failed to save step (${res.status})`;
            throw new Error(typeof msg === "string" ? msg : "Failed to save step");
        }
    } catch (e) {
        console.warn("Failed to cache step data (Backend may be offline):", e);
        // Non-blocking in frontend to allow testing/usage even if backend is down
    }
}

interface fetchUserRegistrationDetailsResponse {
    user?: {
        name?: string;
        email?: string;
        phone?: string;
        campus?: string;
        program?: string;
        specialization?: string;
        role?: string;
        [key: string]: any;
    };
    status?: string;
    message?: string;
    [key: string]: any;
}

const getUserPhone = (): string => {
    try {
        const userDetails = localStorage.getItem("user");
        if (userDetails) {
            const parsedUser = JSON.parse(userDetails);
            const u = parsedUser?.user ?? parsedUser;
            return u?.phone ?? "";
        }
    } catch {
        return "";
    }
    return "";
};

const getUserEmail = (): string => {
    try {
        const userDetails = localStorage.getItem("user");
        if (userDetails) {
            const parsedUser = JSON.parse(userDetails);
            const u = parsedUser?.user ?? parsedUser;
            return u?.email ?? "";
        }
    } catch {
        return "";
    }
    return "";
};

const fetchUserRegistrationDetails = async (phone: string) => {
    try {
        const response = await fetch(apiUrl(`/api/register/details/?phone=${phone}`));
        if (!response.ok) {
            throw new Error("Failed to fetch user details");
        }
        const data = await response.json();
        return data;
    } catch {
        return null;
    }
};



const isExamStepDisabled = (program: string): boolean => {
    return ["phd"].includes(program.toLowerCase());
};

const generateSteps = (program: string) => {
    const baseSteps = [
        { id: 1, name: "Payment", icon: CreditCard },
        { id: 2, name: "Personal Info", icon: User },
        { id: 3, name: "Education", icon: GraduationCap },
    ];

    let currentId = 4;
    const finalSteps = [...baseSteps];

    // Documents are now integrated into the Education step for PhD

    if (!isExamStepDisabled(program)) {
        finalSteps.push({ id: currentId++, name: "Exam Schedule", icon: CheckCircle });
    }

    finalSteps.push({ id: currentId++, name: "Review", icon: CheckCircle });

    return finalSteps;
};

interface ApplicationFormProps {
    onSubmit: (formData: any) => void;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ onSubmit }) => {
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [userProgram, setUserProgram] = useState<string>(user?.program || "");
    const [currentUserDetails, setCurrentUserDetails] = useState<fetchUserRegistrationDetailsResponse | null>(null);
    const { steps: stepContext, setPaymentStatus, completeApplication } = useSteps();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [showCompletePaymentModal, setShowCompletePaymentModal] = useState(false);
    const [isRedirectingToPay, setIsRedirectingToPay] = useState(false);
    const [justSubmitted, setJustSubmitted] = useState(false);

    // Sync URL payment status with global state
    React.useEffect(() => {
        const urlStatus = searchParams.get("payment");
        if (urlStatus === "success") {
            setPaymentStatus("success");
            setFormData((prev: any) => ({
                ...prev,
                payment: { ...prev.payment, paymentStatus: "completed" }
            }));
            toast.success("Payment completed successfully!");
            searchParams.delete("payment");
            setSearchParams(searchParams, { replace: true });
        } else if (urlStatus === "failed") {
            setPaymentStatus("failed");
            setFormData((prev: any) => ({
                ...prev,
                payment: { ...prev.payment, paymentStatus: "failed" }
            }));
            toast.error("Payment was unsuccessful. Please check your bank and try again.");
            searchParams.delete("payment");
            setSearchParams(searchParams, { replace: true });
        }
    }, [searchParams, setSearchParams, setPaymentStatus]);

    const paymentFailed = stepContext.payment === "failed";

    // Generate steps based on user program
    const steps = useMemo(() => generateSteps(userProgram), [userProgram]);

    // Clear return-from-payment flag when landing on application (so state is clean)
    React.useEffect(() => {
        if (sessionStorage.getItem("payment_return_to_application")) {
            sessionStorage.removeItem("payment_return_to_application");
            if (stepContext.payment === "success") {
                toast.success("Payment successful. You can now submit your application.");
            }
        }
    }, [stepContext.payment]);

    // Unified check for payment and cache data
    const initialFetchDone = React.useRef(false);

    React.useEffect(() => {
        if (initialFetchDone.current) return;
        initialFetchDone.current = true;

        const fetchData = async () => {
            try {
                const email = getUserEmail().trim();
                const decoded = getUserPhone();
                const phone = decoded.replace(/\D/g, "").slice(-10);

                if (!email && phone.length !== 10) return;

                // 1. Check Payment Status
                const params = new URLSearchParams();
                if (email) params.set("email", email);
                if (phone.length === 10) params.set("phone", phone);

                const statusRes = await fetch(apiUrl(`/api/student/payment-status/?${params}`));
                let paymentStatusFromBackend: "completed" | "pending" = "pending";
                let transactionIdFromBackend: string | undefined;

                if (statusRes.ok) {
                    const statusData = await statusRes.json();
                    if (statusData?.hasCompletedPayment && statusData?.transactionId) {
                        paymentStatusFromBackend = "completed";
                        transactionIdFromBackend = statusData.transactionId;

                        // Only update global state if it's not already success
                        if (stepContext.payment !== 'success') {
                            setPaymentStatus("success");
                        }
                    }
                }

                // 2. Fetch Cached Application Data
                const res = await fetch(apiUrl("/api/step/cache/"));
                if (res.ok) {
                    const data = await res.json();
                    const allApplications = data?.cached_applications || [];
                    const sessionId = `pending-${phone || decoded || "guest"}`;
                    const app: CachedApplication | null = allApplications.find(
                        (application: any) => application.session_id === sessionId
                    ) || null;

                    if (app) {
                        const stepsObj = app.steps || {};
                        const personal = stepsObj?.personal_info?.personal || app.personal || {};
                        const address = stepsObj?.personal_info?.address || app.address || {};
                        const education = stepsObj?.education?.education ?? stepsObj?.personal_info?.education ?? app.education ?? {};
                        const btechEducation = stepsObj?.education?.btechEducation ?? app.btechEducation ?? {};
                        const mtechEducation = stepsObj?.education?.mtechEducation ?? app.mtechEducation ?? {};
                        const examSchedule = stepsObj?.exam_schedule?.examSchedule ?? stepsObj?.examSchedule ?? app.examSchedule ?? {};
                        const rawPaymentFromCache = stepsObj?.payment || stepsObj?.personal_info?.payment || app.payment || {};
                        // Safely unwrap if nested due to previous bugs
                        const paymentFromCache = (rawPaymentFromCache.payment && typeof rawPaymentFromCache.payment === 'object' && !Array.isArray(rawPaymentFromCache.payment))
                            ? rawPaymentFromCache.payment
                            : rawPaymentFromCache;

                        const payment = paymentStatusFromBackend === "completed"
                            ? { ...paymentFromCache, paymentStatus: "completed" as const, transactionId: transactionIdFromBackend }
                            : { ...paymentFromCache, paymentStatus: "pending" as const };

                        setFormData((prev: any) => ({
                            ...prev,
                            personal: { ...prev.personal, ...personal },
                            address: { ...prev.address, ...address },
                            education: { ...prev.education, ...education },
                            btechEducation: { ...prev.btechEducation, ...btechEducation },
                            mtechEducation: { ...prev.mtechEducation, ...mtechEducation },
                            payment: { ...prev.payment, ...payment },
                            examSchedule: { ...prev.examSchedule, ...examSchedule },
                            documents: { ...prev.documents, ...(stepsObj?.documents || app.documents || {}) },
                        }));

                        const appWithPayment = paymentStatusFromBackend === "completed"
                            ? { ...app, payment: { ...paymentFromCache, paymentStatus: "completed" } }
                            : null;
                        const last = appWithPayment ? getLastCompletedStep(appWithPayment) : 1;
                        setCurrentStep(last > 1 ? last : 1);
                    }
                }

                // 3. Fetch Submitted Application Data (Priority if submitted)
                const appRes = await fetch(apiUrl(`/api/applications/?phone=${phone}`));
                if (appRes.ok) {
                    const appData = await appRes.json();
                    if (appData && appData.status) {
                        setFormData((prev: any) => ({
                            ...prev,
                            personal: { ...prev.personal, ...(appData.personal || {}) },
                            address: { ...prev.address, ...(appData.address || {}) },
                            education: { ...prev.education, ...(appData.education || {}) },
                            btechEducation: { ...prev.btechEducation, ...(appData.btechEducation || {}) },
                            mtechEducation: { ...prev.mtechEducation, ...(appData.mtechEducation || {}) },
                            documents: { ...prev.documents, ...(appData.documents || {}) },
                            examSchedule: { ...prev.examSchedule, ...(appData.examSchedule || {}) },
                        }));

                        // If fully submitted, we might want to stay on the final step or review
                        if (appData.status === "SUBMITTED" || appData.status === "completed") {
                            setCurrentStep(steps.length);
                        }
                    }
                }
            } catch (e) {
                console.error("Failed to fetch initial application data", e);
            }
        };

        fetchData();
    }, [steps]); // Add steps to dependency to ensure correct step indexing

    // Fetch user details locally
    React.useEffect(() => {
        const fetchUserDetails = async () => {
            const phone = getUserPhone();
            if (phone) {
                const userDetails = await fetchUserRegistrationDetails(phone);
                if (userDetails && userDetails.user && userDetails.user.program) {
                    setCurrentUserDetails(userDetails);
                    setUserProgram(userDetails.user.program);
                } else if (user?.program) {
                    setUserProgram(user.program);
                }
            } else if (user?.program) {
                setUserProgram(user.program);
            }
        };
        fetchUserDetails();
    }, [user]);

    // Auto-fill personal details from logged-in user
    React.useEffect(() => {
        if (user || currentUserDetails?.user) {
            setFormData((prev: any) => {
                const u = currentUserDetails?.user || user;
                // Only update if current form data is empty to avoid overwriting user edits
                const newPersonal = { ...prev.personal };
                let changed = false;

                if (!newPersonal.firstName && u?.name) {
                    newPersonal.firstName = u.name;
                    changed = true;
                }
                if (!newPersonal.email && u?.email) {
                    newPersonal.email = u.email;
                    changed = true;
                }
                if (!newPersonal.phone && u?.phone) {
                    newPersonal.phone = String(u.phone).replace(/\D/g, "").slice(-10);
                    changed = true;
                }

                return changed ? { ...prev, personal: newPersonal } : prev;
            });
        }
    }, [user, currentUserDetails]);

    // Restore documents uploaded in a previous session (from /api/register/details/ via login)
    React.useEffect(() => {
        const saved = localStorage.getItem("vignan_restored_documents");
        if (!saved) return;
        try {
            const parsed = JSON.parse(saved);
            if (parsed?.files && Object.keys(parsed.files).length > 0) {
                setFormData((prev: any) => {
                    // Only merge if current documents are empty
                    const currFiles = prev.documents?.files || {};
                    if (Object.keys(currFiles).length > 0) return prev;
                    return { ...prev, documents: { ...prev.documents, files: { ...parsed.files } } };
                });
            }
        } catch { }
        // Clear after restoring so it doesn't re-apply on every render
        localStorage.removeItem("vignan_restored_documents");
    }, []); // run once on mount

    const getInitialFormData = () => {
        const userDetails = localStorage.getItem("user");
        let userPhone = "";
        if (userDetails) {
            try {
                const parsedUser = JSON.parse(userDetails);
                const u = parsedUser?.user ?? parsedUser;
                userPhone = u?.phone ?? "";
            } catch {
                userPhone = "";
            }
        }
        const phoneKey = `studentApplicationForm_${userPhone}`;
        const cached = localStorage.getItem(phoneKey);
        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                return parsed;
            } catch { }
        }
        return {
            personal: {
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                dob: "",
                gender: "",
                category: "",
                parentPhone: "",
                parentName: "",
            },
            education: {
                sscName: "",
                board: "",
                Marks: "",
                xYearOfPassing: "",
                schoolName: "",
                interBoard: "",
                interStream: "",
                interHallTicket: "",
                rollNumber: "",
                interMarks: "",
                percentage: "",
                educationType: "intermediate",
                polytechnicCollege: "",
                polytechnicBoard: "",
                polytechnicBranch: "",
                polytechnicYearOfPassing: "",
                polytechnicPercentage: "",
            },
            address: {
                street: "",
                city: "",
                state: "",
                pincode: "",
                country: "Indian",
            },

            payment: {
                amount: 1200,
                paymentMethod: "",
                transactionId: "",
                paymentStatus: "pending" as PaymentStatus,
                paymentDate: "",
                paymentAmount: 0,
                discountApplied: 0,
                couponCode: "",
                applicationStatus: "",
            },
            examSchedule: {
                date: "",
                time: "",
            },
            btechEducation: {
                university: "",
                college: "",
                cgpa: "",
                specialization: "",
                yearOfPassing: "",
                degreeType: "",
            },
            mtechEducation: {
                university: "",
                college: "",
                cgpa: "",
                specialization: "",
                yearOfPassing: "",
                degreeType: "",
            },
            documents: {
                files: {},
            },
        };
    };

    const [formData, setFormData] = useState(getInitialFormData());

    // Save form data to localStorage
    React.useEffect(() => {
        const userPhone = getUserPhone();
        const cacheData = {
            ...formData,
        };
        const phoneKey = userPhone
            ? `studentApplicationForm_${userPhone}`
            : "studentApplicationForm";
        localStorage.setItem(phoneKey, JSON.stringify(cacheData));
    }, [formData]);

    const saveFormToStorage = React.useCallback((data: any) => {
        const userPhone = getUserPhone();
        const phoneKey = userPhone ? `studentApplicationForm_${userPhone}` : "studentApplicationForm";
        const cacheData = {
            ...data,
        };
        localStorage.setItem(phoneKey, JSON.stringify(cacheData));
    }, []);

    const getLastCompletedStep = (formData: any) => {
        if (formData.payment?.paymentStatus !== "completed") return 1;
        // Simple checks for now, can be expanded
        if (!formData.personal?.firstName) return 2;
        if (!formData.education?.sscName) return 3;
        if (formData.btechEducation && !formData.btechEducation.university) return 4;
        // ...
        return steps.length; // Default to last if everything seems filled? 
        // Actually better to rely on what the user last visited or just start from 1 if payment logic is complex.
        // The original code had detailed checks. For brevity, assuming user starts where they left off if we fetched from backend.
    };


    const handleChange = async (section: string, field: string, value: any) => {
        setFormData((prev: any) => {
            const updated = section === "examSchedule"
                ? { ...prev, examSchedule: value }
                : {
                    ...prev,
                    [section]: {
                        ...prev[section],
                        [field]: value,
                    },
                };

            // Save full current step data to backend (so we don't overwrite other sections)
            const uiStepName = steps[currentStep - 1]?.name?.replace(/\s+/g, "_").toLowerCase() || `step${currentStep}`;
            const dataToSave = getStepDataForCache(uiStepName, currentStep, steps, updated);
            cacheStepData(uiStepName, dataToSave).catch((e) => {
                toast.error(e instanceof Error ? e.message : "Failed to save progress");
            });

            return updated;
        });
    };

    const validateStep = (step: number): boolean => {
        const stepName = steps.find((s) => s.id === step)?.name;
        const uiStepName = stepName?.replace(/\s+/g, "_").toLowerCase() || `step${step}`;
        const err = validateStepFields(step, uiStepName, formData, steps, userProgram);
        if (err) {
            toast.error(err);
            return false;
        }
        return true;
    };

    const handleNext = async () => {
        if (!validateStep(currentStep)) return;

        const stepName = steps[currentStep - 1]?.name?.replace(/\s+/g, "_").toLowerCase() || `step${currentStep}`;
        const dataToSave = getStepDataForCache(stepName, currentStep, steps, formData);
        // Progress saving is now non-blocking and silent on failure (internal log only)
        cacheStepData(stepName, dataToSave);

        const nextStep = currentStep + 1;
        setCurrentStep(Math.min(nextStep, steps.length));
    };

    const handleBack = () => {
        const prevStep = currentStep - 1;
        setCurrentStep(Math.max(prevStep, 1));
    };

    const openPaymentGatewayToSubmit = React.useCallback(async () => {
        saveFormToStorage(formData);
        sessionStorage.setItem("payment_return_to_application", "1");
        setShowCompletePaymentModal(false);
        setIsRedirectingToPay(true);
        try {
            const amount = Number(formData.payment?.amount) || 1200;
            const userFromStorage = user || (() => {
                try {
                    const raw = localStorage.getItem("user");
                    const u = raw ? JSON.parse(raw) : null;
                    return u?.user ?? u;
                } catch { return null; }
            })();
            // Get PayU params from backend; then browser POSTs form to PayU (frontend -> backend -> browser -> PayU).
            const res = await fetch(apiUrl("/api/payu/init"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount,
                    firstname: userFromStorage?.name || "Student",
                    email: userFromStorage?.email || "",
                    phone: userFromStorage?.phone || "9999999999",
                    productinfo: "PhD Application Fee",
                }),
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err?.detail || "Failed to initiate payment");
            }
            const data = await res.json();
            sessionStorage.setItem(
                "paymentIntent",
                JSON.stringify({
                    txnid: data.txnid,
                    amount: data.amount,
                    method: "PayU",
                    firstName: data.firstname,
                    email: data.email,
                    phone: data.phone,
                })
            );
            // Browser submits form to PayU (request to PayU is from frontend by design).
            const form = document.createElement("form");
            form.method = "POST";
            form.action = data.payment_url;
            const fields: Record<string, string> = {
                key: data.key,
                txnid: data.txnid,
                amount: String(data.amount),
                productinfo: data.productinfo,
                firstname: data.firstname,
                email: data.email,
                phone: data.phone,
                surl: data.surl,
                furl: data.furl,
                hash: data.hash,
            };
            Object.entries(fields).forEach(([name, value]) => {
                const input = document.createElement("input");
                input.type = "hidden";
                input.name = name;
                input.value = value;
                form.appendChild(input);
            });
            document.body.appendChild(form);
            form.submit();
        } catch (e) {
            setIsRedirectingToPay(false);
            toast.error(e instanceof Error ? e.message : "Failed to open payment gateway.");
        }
    }, [formData, user, saveFormToStorage]);

    const handleSubmit = async () => {
        if (stepContext.payment !== "success" || formData.payment.paymentStatus !== "completed") {
            if (paymentFailed) {
                setShowCompletePaymentModal(true);
                return;
            }
            toast.error("Please complete payment before submitting.");
            return;
        }

        const u = currentUserDetails?.user;
        let email = u?.email ?? "";
        let phone = u?.phone ?? "";
        try {
            const stored = localStorage.getItem("user");
            if (stored) {
                const p = JSON.parse(stored);
                const usr = p?.user ?? p;
                email = email || (usr?.email ?? "");
                phone = phone || (usr?.phone ?? "");
            }
        } catch {
            /* ignore */
        }
        const phoneStr = String(phone).replace(/\D/g, "").slice(-10);

        // Use registration name/email/phone when logged in (avoid duplicates / inconsistent data)
        const personal = { ...formData.personal }
        if (user?.name) personal.firstName = user.name
        if (user?.email) personal.email = user.email
        if (user?.phone) personal.phone = String(user.phone).replace(/\D/g, "").slice(-10)

        // Persist full application to database (lead + personal, address, education, exam)
        try {
            const res = await fetch(apiUrl("/api/application/submit"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email.trim(),
                    phone: phoneStr,
                    personal,
                    address: formData.address,
                    education: formData.education,
                    ugEducation: formData.btechEducation,
                    pgEducation: formData.mtechEducation,
                    documents: formData.documents,
                    examSchedule: formData.examSchedule,
                }),
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                const msg = err?.detail || (typeof err?.message === "string" ? err.message : "Failed to save application");
                throw new Error(Array.isArray(msg) ? msg[0]?.msg || "Failed to save application" : msg);
            }
        } catch (e) {
            const isNetworkError =
                e instanceof TypeError && (e.message === "Failed to fetch" || e.message === "Load failed");
            const message = isNetworkError
                ? `Could not reach the server. Ensure the backend is running at ${API_BASE}.`
                : (e instanceof Error ? e.message : "Failed to save application. Please try again.");
            toast.error(message);
            return;
        }

        // Mark as completed in global context
        completeApplication();
        recordPhase("application", email, phoneStr);

        if (onSubmit) onSubmit(formData);

        setJustSubmitted(true);
        toast.success("Application submitted successfully! You can download your application as PDF below.");
    };

    const renderStep = () => {
        const currentStepName = steps.find((step) => step.id === currentStep)?.name;

        switch (currentStepName) {
            case "Payment":
                return (
                    <PaymentForm
                        data={formData.payment}
                        userData={currentUserDetails}
                        onChange={handleChange}
                        onPaymentSuccess={() => {
                            setPaymentStatus('success');
                        }}
                    />
                );
            case "Personal Info":
                return (
                    <PersonalInfoForm
                        data={formData.personal}
                        addressData={formData.address}
                        onChange={handleChange}
                        readOnlyFromRegistration={user?.name && user?.email ? { name: user.name, email: user.email, phone: (user.phone && String(user.phone).replace(/\D/g, "").slice(-10)) || "" } : undefined}
                    />
                );
            case "Education":
                return (
                    <UnifiedEducationForm
                        educationData={formData.education}
                        btechData={formData.btechEducation}
                        mtechData={formData.mtechEducation}
                        documentsData={formData.documents}
                        program={userProgram}
                        onChange={handleChange}
                    />
                );
            // case "Btech Education":
            //     return <BtechEducationForm data={formData.btechEducation} onChange={(f, v) => handleChange("btechEducation", f, v)} />;
            // case "Mtech Education":
            //     return <MtechEducationForm data={formData.mtechEducation} onChange={(f, v) => handleChange("mtechEducation", f, v)} />;
            // case "Address":
            //     return <AddressForm data={formData.address} onChange={(f, v) => handleChange("address", f, v)} />;

            case "Exam Schedule":
                return <ExamScheduleForm value={formData.examSchedule} onChange={(f, v) => handleChange("examSchedule", f, v)} />;
            case "Review":
                return <ReviewForm data={formData} />;
            default:
                return null;
        }
    };

    return (
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 py-12">
            {paymentFailed && (
                <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium">
                    Your payment failed. You can fill the application below; when ready, click <strong>Submit Final Application</strong> to complete payment (your details are saved and will be here when you return).
                </div>
            )}

            {/* Complete payment modal: open gateway so student can pay and return without re-filling */}
            {showCompletePaymentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Complete payment to submit</h3>
                        <p className="text-slate-600 text-sm mb-6">
                            Your application details are saved. You will be redirected to the payment gateway. After you complete payment, you will return here and can submit your application without filling the form again.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                type="button"
                                onClick={() => setShowCompletePaymentModal(false)}
                                className="px-4 py-2.5 rounded-xl font-bold border border-slate-200 text-slate-600 hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={openPaymentGatewayToSubmit}
                                className="px-6 py-2.5 rounded-xl font-bold bg-primary text-white hover:bg-primary-hover"
                            >
                                Proceed to payment gateway
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success view after submit: Download PDF + Go to dashboard */}
            {justSubmitted && (
                <div className="max-w-lg mx-auto mt-12 p-8 rounded-2xl border border-slate-200 bg-white shadow-xl text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-10 w-10 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Application submitted successfully</h2>
                    <p className="text-slate-600 mb-8">You can download your application as PDF or go to your dashboard.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            type="button"
                            onClick={() => downloadApplicationPdfFile(formData)}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold bg-primary text-white hover:opacity-90"
                        >
                            <Download className="h-5 w-5" />
                            Download application (PDF)
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/dashboard")}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold border border-slate-200 text-slate-700 hover:bg-slate-50"
                        >
                            Go to dashboard
                        </button>
                    </div>
                </div>
            )}

            {!justSubmitted && (
                <>
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Application Portal</h1>
                        <p className="text-slate-500 text-lg">Complete your application process in simple steps.</p>
                    </div>

                    {/* Stepper */}
                    <div className="mb-12">
                        <div className="flex items-center justify-between max-w-4xl mx-auto px-4 overflow-x-auto gap-4 custom-scrollbar pb-2">
                            {steps.map((step, index) => {
                                const isCompleted = currentStep > index + 1;
                                const isActive = currentStep === index + 1;
                                return (
                                    <React.Fragment key={step.id}>
                                        <div className="flex flex-col items-center group relative min-w-[100px]">
                                            <div
                                                className={cn(
                                                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm",
                                                    isCompleted ? "bg-primary text-white scale-90" :
                                                        isActive ? "bg-white text-primary border-2 border-primary ring-4 ring-primary/10 shadow-lg" :
                                                            "bg-slate-100 text-slate-400 border border-slate-200"
                                                )}
                                            >
                                                {isCompleted ? <Check className="h-6 w-6" /> : <step.icon className="h-5 w-5" />}
                                            </div>
                                            <span className={cn(
                                                "text-[10px] font-bold mt-3 uppercase tracking-widest transition-colors duration-300",
                                                isActive ? "text-primary" : "text-slate-400"
                                            )}>
                                                {step.name}
                                            </span>
                                        </div>
                                        {index < steps.length - 1 && (
                                            <div className="flex-1 h-[2px] min-w-[15px] max-w-[40px] mt-6 bg-slate-100 overflow-hidden">
                                                <div
                                                    className="h-full bg-primary transition-all duration-700 ease-out"
                                                    style={{ width: isCompleted ? "100%" : "0%" }}
                                                />
                                            </div>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>

                    <div className="glass rounded-[2rem] border border-white/40 shadow-2xl shadow-slate-200/50 overflow-hidden relative">
                        {/* Decorative element */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-1" />

                        <div className="p-8 md:p-12">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                >
                                    {renderStep()}
                                </motion.div>
                            </AnimatePresence>

                            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-16 pt-10 border-t border-slate-100">
                                {currentStep > 1 ? (
                                    <button
                                        onClick={handleBack}
                                        className="group flex items-center gap-3 px-8 py-4 bg-slate-50 text-slate-600 rounded-[1.25rem] border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all font-bold text-sm tracking-tight"
                                    >
                                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                                        Previous Step
                                    </button>
                                ) : <div />}

                                {currentStep < steps.length ? (
                                    <button
                                        onClick={handleNext}
                                        className="group min-w-[200px] flex items-center justify-center gap-3 px-10 py-4.5 bg-slate-900 text-white rounded-[1.25rem] hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all font-bold text-sm tracking-wide hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        Next Step
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isRedirectingToPay}
                                        title={paymentFailed ? "Click to complete payment then submit" : undefined}
                                        className="group min-w-[240px] flex items-center justify-center gap-3 px-12 py-4.5 bg-emerald-600 text-white rounded-[1.25rem] hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all font-bold text-sm tracking-wide hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isRedirectingToPay ? "Redirecting to payment..." : "Submit Final Application"}
                                        <CheckCircle className="h-5 w-5 ml-1" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ApplicationForm;
