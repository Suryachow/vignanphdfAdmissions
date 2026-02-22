import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
    Phone,
    Mail,
    User,
    CheckCircle2,
    ChevronRight,
    Check,
    Zap,
    Star
} from "lucide-react"
import { Button } from "../components/ui/Button"
import { Card, CardContent, CardFooter } from "../components/ui/Card"
import { useSteps } from "../store/StepContext"
import { useAuth } from "../contexts/AuthContext"
import { toast, Toaster } from "sonner"
import { cn } from "../lib/utils"
import { sendOtp, verifyOtp } from "../services/otp"
import { recordPhase } from "../services/phase"

export function Registration() {
    const navigate = useNavigate()
    const { setOtpVerified, completeRegistration } = useSteps()
    const { login } = useAuth()

    // Form State
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        campus: "",
        program: "",
        specialization: "",
        password: "",
        confirm_password: "",
    })

    // Verification: student chooses ONE method (mobile OTP or email OTP)
    const [verificationMethod, setVerificationMethod] = useState<"phone" | "email" | null>(null)
    const [isPhoneOtpVerified, setIsPhoneOtpVerified] = useState(false)
    const [isEmailOtpVerified, setIsEmailOtpVerified] = useState(false)
    const [showPhoneOtpModal, setShowPhoneOtpModal] = useState(false)
    const [showEmailOtpModal, setShowEmailOtpModal] = useState(false)
    const [phoneOtp, setPhoneOtp] = useState("")
    const [emailOtp, setEmailOtp] = useState("")
    const [isVerifyingPhone, setIsVerifyingPhone] = useState(false)
    const [isVerifyingEmail, setIsVerifyingEmail] = useState(false)
    const [resendCooldownPhone, setResendCooldownPhone] = useState(0)
    const [resendCooldownEmail, setResendCooldownEmail] = useState(0)

    // Program Options
    const programOptions = {
        phd: [
            { value: "cse", label: "Computer Science & Engineering" },
            { value: "ece", label: "Electronics & Communication" },
            { value: "mechanical", label: "Mechanical Engineering" },
            { value: "biotech", label: "Biotechnology" },
            { value: "management", label: "Management Studies" },
        ]
    }

    const handleSendPhoneOtp = async () => {
        const phone = formData.phone.replace(/\D/g, "").slice(-10)
        if (phone.length !== 10) {
            toast.error("Please enter a valid 10-digit phone number")
            return
        }
        const result = await sendOtp("phone", phone)
        if (!result.success) {
            toast.error(result.message)
            return
        }
        setShowPhoneOtpModal(true)
        setResendCooldownPhone(60)
        toast.info(result.message || "OTP sent. Check your mobile or email.")
    }

    const handleSendEmailOtp = async () => {
        const email = (formData.email || "").trim()
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error("Please enter a valid email address")
            return
        }
        const result = await sendOtp("email", email)
        if (!result.success) {
            toast.error(result.message)
            return
        }
        setShowEmailOtpModal(true)
        setResendCooldownEmail(60)
        toast.info(result.message || "OTP sent. Check your mobile or email.")
    }

    const verifyPhoneOtp = async () => {
        const result = await verifyOtp("phone", formData.phone, phoneOtp)
        if (!result.success) {
            toast.error(result.message)
            return
        }
        setIsVerifyingPhone(true)
        setTimeout(() => {
            setIsVerifyingPhone(false)
            setIsPhoneOtpVerified(true)
            setShowPhoneOtpModal(false)
            setOtpVerified(true)
            toast.success("Phone verified successfully!")
        }, 500)
    }

    const verifyEmailOtp = async () => {
        const result = await verifyOtp("email", formData.email, emailOtp)
        if (!result.success) {
            toast.error(result.message)
            return
        }
        setIsVerifyingEmail(true)
        setTimeout(() => {
            setIsVerifyingEmail(false)
            setIsEmailOtpVerified(true)
            setShowEmailOtpModal(false)
            toast.success("Email verified successfully!")
        }, 500)
    }

    const [registrationSuccess, setRegistrationSuccess] = useState(false)

    useEffect(() => {
        if (resendCooldownPhone <= 0) return
        const t = setInterval(() => setResendCooldownPhone((c) => (c <= 1 ? 0 : c - 1)), 1000)
        return () => clearInterval(t)
    }, [resendCooldownPhone])
    useEffect(() => {
        if (resendCooldownEmail <= 0) return
        const t = setInterval(() => setResendCooldownEmail((c) => (c <= 1 ? 0 : c - 1)), 1000)
        return () => clearInterval(t)
    }, [resendCooldownEmail])

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        const email = (formData.email || "").trim()
        const phoneNum = formData.phone.replace(/\D/g, "").slice(-10)

        const doRegister = async () => {
            // Simulated registration
            await recordPhase("registration", email, phoneNum)

            // To be replaced with actual API call if needed:
            /*
            const res = await fetch(apiUrl("/api/student/register"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.fullName || "",
                    email,
                    phone: phoneNum,
                    program: formData.program,
                    specialization: formData.specialization,
                    campus: formData.campus,
                }),
            })
            if (!res.ok) throw new Error("Registration failed")
            */
        }

        toast.promise(doRegister(), {
            loading: "Creating your profile...",
            success: () => {
                completeRegistration()
                login({
                    name: formData.fullName,
                    email,
                    phone: formData.phone,
                    status: "registered",
                    program: formData.program,
                })
                setRegistrationSuccess(true)
                return "Thank you for registering!"
            },
            error: "Registration failed.",
        })
    }

    return (
        <div className="bg-white selection:bg-primary/10 min-h-screen">
            <Toaster position="top-center" richColors />

            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=2070&q=80"
                        alt="Hero"
                        className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-white via-white/90 to-transparent" />
                </div>

                <div className="container px-4 mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-8 text-left"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest">
                                <Zap className="h-4 w-4 fill-current" />
                                Admissions Open 2026-27
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9]">
                                Empowering <span className="text-primary italic">Leaders</span> at Vignan's University
                            </h1>
                            <p className="text-lg text-slate-600 font-medium max-w-lg leading-relaxed">
                                Join a legacy of excellence where innovation meets opportunity. Shape your future with world-class programs and a community dedicated to your success.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
                                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                        <CheckCircle2 className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Placement</p>
                                        <p className="text-lg font-black text-slate-800">92% Rate</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
                                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <Star className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Rating</p>
                                        <p className="text-lg font-black text-slate-800">NAAC A+</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <Card className="border-none shadow-2xl shadow-primary/20 bg-white/80 backdrop-blur-xl relative overflow-hidden text-left">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                                {registrationSuccess ? (
                                    <>
                                        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-8 py-7">
                                            <div className="flex items-center gap-3 mb-1">
                                                <CheckCircle2 className="h-6 w-6 text-emerald-100" />
                                                <h2 className="text-xl font-black text-white tracking-tight">Success!</h2>
                                            </div>
                                            <p className="text-emerald-100 text-sm font-medium ml-9">Your profile has been created.</p>
                                        </div>
                                        <div className="p-8">
                                            <Button className="w-full h-14 rounded-2xl text-lg font-black" onClick={() => navigate("/")}>Go to Home</Button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="bg-gradient-to-r from-primary to-blue-600 px-8 py-7">
                                            <div className="flex items-center gap-3 mb-1">
                                                <Zap className="h-6 w-6 text-blue-100" />
                                                <h1 className="text-xl font-black text-white tracking-tight">Apply for Ph.D 2026</h1>
                                            </div>
                                            <p className="text-blue-100 text-sm font-medium ml-9">
                                                Complete your registration to start.
                                            </p>
                                        </div>

                                        <CardContent className="pt-6 space-y-5">
                                            {/* Verification Tabs */}
                                            <div className="flex bg-slate-100 rounded-2xl p-1 mb-2 gap-1">
                                                {([
                                                    { id: "phone" as const, label: "Mobile OTP", icon: Phone },
                                                    { id: "email" as const, label: "Email OTP", icon: Mail },
                                                ]).map(({ id, label, icon: Icon }) => (
                                                    <button
                                                        key={id}
                                                        onClick={() => setVerificationMethod(id)}
                                                        className={cn(
                                                            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-200",
                                                            verificationMethod === id
                                                                ? "bg-white text-primary shadow-sm shadow-slate-200"
                                                                : "text-slate-500 hover:text-slate-700"
                                                        )}
                                                    >
                                                        <Icon className="h-3.5 w-3.5" />
                                                        {label}
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-black uppercase text-slate-500 text-[10px] ml-1">Full Name</label>
                                                    <div className="relative group">
                                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                                        <input
                                                            value={formData.fullName}
                                                            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3 pl-10 pr-4 text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                                            placeholder="Enter your name"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-black uppercase text-slate-500 text-[10px] ml-1">Email</label>
                                                    <div className="flex gap-2">
                                                        <div className="relative group flex-1">
                                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                                            <input
                                                                value={formData.email}
                                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3 pl-10 pr-4 text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                                                placeholder="name@email.com"
                                                            />
                                                        </div>
                                                        <Button size="sm" onClick={handleSendEmailOtp} className="rounded-xl px-4 h-12" variant={isEmailOtpVerified ? "success" : "primary"}>
                                                            {isEmailOtpVerified ? <Check className="h-4 w-4" /> : "Verify"}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-xs font-black uppercase text-slate-500 text-[10px] ml-1">Mobile Number</label>
                                                <div className="flex gap-2">
                                                    <div className="relative group flex-1">
                                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                                        <input
                                                            value={formData.phone}
                                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3 pl-10 pr-4 text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                                            placeholder="10-digit number"
                                                        />
                                                    </div>
                                                    <Button size="sm" onClick={handleSendPhoneOtp} className="rounded-xl px-4 h-12" variant={isPhoneOtpVerified ? "success" : "primary"}>
                                                        {isPhoneOtpVerified ? <Check className="h-4 w-4" /> : "Send OTP"}
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-black uppercase text-slate-500 text-[10px] ml-1">Campus</label>
                                                    <select
                                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3 px-4 text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all appearance-none"
                                                        value={formData.campus}
                                                        onChange={e => setFormData({ ...formData, campus: e.target.value })}
                                                    >
                                                        <option value="">Select Campus</option>
                                                        <option value="guntur">Guntur</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-black uppercase text-slate-500 text-[10px] ml-1">Program</label>
                                                    <select
                                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3 px-4 text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all appearance-none"
                                                        value={formData.program}
                                                        onChange={e => setFormData({ ...formData, program: e.target.value })}
                                                    >
                                                        <option value="phd">Ph.D</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {formData.program && (
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-black uppercase text-slate-500 text-[10px] ml-1">Specialization</label>
                                                    <select
                                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3 px-4 text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all appearance-none"
                                                        value={formData.specialization}
                                                        onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                                                    >
                                                        <option value="">Select Specialization</option>
                                                        {programOptions[formData.program as keyof typeof programOptions]?.map(opt => (
                                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                        </CardContent>
                                        <CardFooter className="pb-8">
                                            <Button
                                                className="w-full h-14 rounded-2xl text-lg font-black uppercase tracking-widest gap-3 shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]"
                                                variant="accent"
                                                onClick={handleRegister}
                                                disabled={!verificationMethod}
                                            >
                                                Register Now <ChevronRight className="h-5 w-5" />
                                            </Button>
                                        </CardFooter>
                                    </>
                                )}
                            </Card>
                        </motion.div>
                    </div>
                </div>
                {/* Event Ticker */}
                <div className="absolute bottom-0 w-full bg-slate-900 overflow-hidden py-4 border-t border-white/5">
                    <div className="container px-4 mx-auto flex items-center gap-12 whitespace-nowrap overflow-hidden">
                        {[
                            { date: "DEC 01", title: "PhD ONLINE REGISTRATION OPENS", color: "text-primary" },
                            { date: "JAN 30", title: "LAST DATE FOR APPLICATION SUBMISSION", color: "text-rose-500" },
                            { date: "FEB 15", title: "ENTRANCE TEST & INTERVIEW", color: "text-emerald-500" },
                        ].map((event, i) => (
                            <div key={i} className="flex items-center gap-4 flex-shrink-0">
                                <span className={cn("text-xs font-black px-2 py-0.5 rounded", event.color, "bg-white/5")}>{event.date}</span>
                                <span className="text-white/80 font-bold text-[10px] tracking-[0.2em] uppercase">{event.title}</span>
                                <div className="h-1 w-1 bg-white/20 rounded-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How to Apply */}
            <section className="py-20 bg-slate-50 text-center">
                <h2 className="text-4xl font-black mb-12">How to Apply</h2>
                <div className="relative max-w-4xl mx-auto">
                    <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-slate-200 -translate-x-1/2 hidden md:block" />

                    {[
                        { step: 1, title: "Register & Verify", desc: "Create your account and verify your mobile number via OTP.", color: "bg-primary" },
                        { step: 2, title: "Application Form", desc: "Pay the admission fee and fill in your academic details.", color: "bg-indigo-600" },
                        { step: 3, title: "Documents", desc: "Upload your academic transcripts and identity proofs.", color: "bg-slate-900" },
                        { step: 4, title: "Slot Booking", desc: "Select your preferred date and time for the examination.", color: "bg-emerald-500" },
                        { step: 5, title: "Success", desc: "Download your hall ticket and you're ready to fly!", icon: Check, color: "bg-emerald-600" }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={cn(
                                "relative flex flex-col md:flex-row items-center gap-8 mb-12",
                                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                            )}
                        >
                            <div className="flex-1 text-center md:text-right md:pr-12">
                                {i % 2 === 0 && (
                                    <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 group hover:border-primary/30 transition-all duration-500">
                                        <h3 className="text-xl font-black text-slate-900 mb-2">{item.title}</h3>
                                        <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                                    </div>
                                )}
                            </div>
                            <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl transform rotate-12 z-10 shrink-0", item.color)}>
                                {item.icon ? <item.icon className="h-6 w-6" /> : item.step}
                            </div>
                            <div className="flex-1 text-center md:text-left md:pl-12">
                                {i % 2 !== 0 && (
                                    <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 group hover:border-primary/30 transition-all duration-500">
                                        <h3 className="text-xl font-black text-slate-900 mb-2">{item.title}</h3>
                                        <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* About / Mission Section */}
            <section className="py-32 overflow-hidden bg-white">
                <div className="container px-4 mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="relative">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="relative z-10 rounded-3xl overflow-hidden shadow-2xl"
                            >
                                <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1000&q=80" alt="About" className="w-full grayscale hover:grayscale-0 transition-all duration-700" />
                            </motion.div>
                            <div className="absolute -bottom-10 -right-10 w-2/3 h-2/3 bg-primary/10 rounded-3xl -z-0" />
                        </div>

                        <div className="space-y-8 text-left">
                            <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight uppercase">
                                Empowering Future Leaders, <span className="text-primary italic">Driving Global Impact</span>
                            </h2>
                            <p className="text-slate-600 font-medium leading-relaxed">
                                At Vignan's University, we empower students to become innovators and leaders in their fields. Our world-class faculty and cutting-edge programs ensure every student is prepared for the challenges of the future.
                            </p>
                            <Button className="h-14 rounded-2xl text-lg font-black uppercase px-12">Learn More</Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Phone OTP Modal */}
            <AnimatePresence>
                {showPhoneOtpModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            onClick={() => setShowPhoneOtpModal(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-3xl p-8 w-full max-w-md relative z-[110] shadow-2xl border border-slate-100"
                        >
                            <div className="text-center mb-8">
                                <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4">
                                    <Phone className="h-8 w-8" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Verify Phone</h3>
                                <p className="text-sm text-slate-500 font-medium mt-1">We've sent a code to +91 {formData.phone}</p>
                            </div>
                            <div className="space-y-6">
                                <input
                                    type="text"
                                    maxLength={6}
                                    placeholder="0 0 0 0 0 0"
                                    className="w-full h-16 text-center text-3xl font-black border-2 border-slate-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none tracking-[0.5em]"
                                    value={phoneOtp}
                                    onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, ""))}
                                />
                                <div className="flex gap-4">
                                    <Button variant="ghost" className="flex-1 rounded-xl" onClick={() => setShowPhoneOtpModal(false)}>Cancel</Button>
                                    <Button variant="primary" className="flex-1 rounded-xl h-12 font-black uppercase shadow-lg shadow-primary/20" onClick={verifyPhoneOtp} isLoading={isVerifyingPhone}>
                                        Verify OTP
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Email OTP Modal */}
            <AnimatePresence>
                {showEmailOtpModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            onClick={() => setShowEmailOtpModal(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-3xl p-8 w-full max-w-md relative z-[110] shadow-2xl border border-slate-100"
                        >
                            <div className="text-center mb-8">
                                <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4">
                                    <Mail className="h-8 w-8" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Verify Email</h3>
                                <p className="text-sm text-slate-500 font-medium mt-1">We've sent a code to {formData.email}</p>
                            </div>
                            <div className="space-y-6">
                                <input
                                    type="text"
                                    maxLength={6}
                                    placeholder="0 0 0 0 0 0"
                                    className="w-full h-16 text-center text-3xl font-black border-2 border-slate-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none tracking-[0.5em]"
                                    value={emailOtp}
                                    onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ""))}
                                />
                                <div className="flex gap-4">
                                    <Button variant="ghost" className="flex-1 rounded-xl" onClick={() => setShowEmailOtpModal(false)}>Cancel</Button>
                                    <Button variant="primary" className="flex-1 rounded-xl h-12 font-black uppercase shadow-lg shadow-primary/20" onClick={verifyEmailOtp} isLoading={isVerifyingEmail}>
                                        Verify OTP
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
