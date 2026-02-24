import React, { useState, useEffect } from "react"
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
    const { completeRegistration } = useSteps()
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

    // Verification: Email OTP only
    const [isEmailOtpVerified, setIsEmailOtpVerified] = useState(false)
    const [showEmailOtpModal, setShowEmailOtpModal] = useState(false)
    const [emailOtp, setEmailOtp] = useState("")
    const [isVerifyingEmail, setIsVerifyingEmail] = useState(false)
    const [resendCooldownEmail, setResendCooldownEmail] = useState(0)

    // Program Options
    const programOptions = {
        phd: [
            { value: "cse", label: "Computer Science & Engineering" },
            { value: "ece", label: "Electronics & Communication Engineering" },
            { value: "mech", label: "Mechanical Engineering" },
            { value: "biotech", label: "Biotechnology" },
            { value: "management", label: "Management Studies" },
            { value: "civil", label: "Civil Engineering" },
            { value: "chemical", label: "Chemical Engineering" },
            { value: "eee", label: "Electrical & Electronics Engineering" },
            { value: "environmental", label: "Environmental Science" },
            { value: "physics", label: "Physics" },
            { value: "chemistry", label: "Chemistry" },
            { value: "mathematics", label: "Mathematics" },
            { value: "commerce", label: "Commerce" },
            { value: "english", label: "English" },
            { value: "business", label: "Business Administration" },
        ]
    }

    const handleSendEmailOtp = async () => {
        const email = (formData.email || "").trim()
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error("Please enter a valid email address")
            return
        }
        const phoneNum = formData.phone ? formData.phone.replace(/\D/g, "").slice(-10) : ""
        const result = await sendOtp("email", email, phoneNum, "Registration Verification")
        if (!result.success) {
            toast.error(result.message)
            return
        }
        setShowEmailOtpModal(true)
        setResendCooldownEmail(60)
        toast.info(result.message || "OTP sent to your email.")
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

    useEffect(() => {
        if (resendCooldownEmail <= 0) return
        const t = setInterval(() => setResendCooldownEmail((c) => (c <= 1 ? 0 : c - 1)), 1000)
        return () => clearInterval(t)
    }, [resendCooldownEmail])

    const handleRegister = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (!isEmailOtpVerified) {
            toast.error("Please verify your email via OTP first")
            return
        }
        const email = (formData.email || "").trim()
        const phoneNum = formData.phone.replace(/\D/g, "").slice(-10)

        const doRegister = async () => {
            await recordPhase("registration", email, phoneNum)
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
                // registration success handled by toast + redirect flow
                return "Thank you for registering!"
            },
            error: "Registration failed.",
        })
    }

    return (
        <div className="bg-white selection:bg-primary/10 min-h-screen">
            <Toaster position="top-center" richColors />

            {/* Hero Section */}
            <section className="relative min-h-[92vh] flex items-center pt-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {/* High-end campus hero image (curated Unsplash) */}
                    <img
                        src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=2070&q=80"
                        alt="Vignan campus"
                        className="w-full h-full object-cover opacity-12"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-white via-white/95 to-transparent" />
                    {/* Decorative radial gradient */}
                    <div className="absolute -left-32 -top-24 w-96 h-96 rounded-full bg-gradient-to-tr from-primary/20 to-transparent blur-3xl opacity-90" />
                    <div className="absolute -right-24 bottom-0 w-80 h-80 rounded-full bg-gradient-to-br from-emerald-200/20 to-transparent blur-3xl" />
                </div>

                <div className="container px-6 mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.9 }}
                            className="space-y-8 text-left"
                        >
                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest shadow-sm">
                                <Zap className="h-4 w-4 fill-current" />
                                Admissions Open 2026-27
                            </div>

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[0.98]">
                                Research <span className="text-primary italic">& Innovation</span>
                                <br /> at Vignan
                            </h1>

                            <p className="text-base md:text-lg text-slate-600 font-medium max-w-2xl leading-relaxed">
                                Pursue your Ph.D with world-class faculty and state-of-the-art research facilities at Vignan's University.
                            </p>

                            <div className="flex flex-wrap gap-6 mt-6">
                                <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-3xl shadow-2xl border border-slate-100 transform transition-transform hover:-translate-y-1">
                                    <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                        <CheckCircle2 className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Placement</p>
                                        <p className="text-lg font-extrabold text-slate-900">92% Rate</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-3xl shadow-2xl border border-slate-100 transform transition-transform hover:-translate-y-1">
                                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <Star className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Rating</p>
                                        <p className="text-lg font-extrabold text-slate-900">NAAC A+</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-3xl shadow-2xl border border-slate-100 transform transition-transform hover:-translate-y-1">
                                    <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black">R</div>
                                    <div>
                                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Research</p>
                                        <p className="text-lg font-extrabold text-slate-900">500+ Papers</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 0.12 }}
                        >
                            <Card className="relative overflow-hidden text-left max-w-[460px] mx-auto lg:ml-auto rounded-3xl border border-white/10 bg-white/60 backdrop-blur-md shadow-[0_30px_80px_rgba(11,37,64,0.12)]">
                                <div className="absolute -top-20 -right-16 w-40 h-40 bg-primary/6 rounded-full blur-3xl" />

                                <div className="bg-gradient-to-br from-primary to-indigo-600 px-8 py-6 rounded-t-3xl border-b border-white/10">
                                    <div className="flex items-center gap-3 mb-0.5">
                                        <Zap className="h-5 w-5 text-yellow-300 fill-yellow-300" />
                                        <h1 className="text-lg font-extrabold text-white tracking-tight uppercase">Apply for Ph.D 2026</h1>
                                    </div>
                                    <p className="text-blue-100/90 text-[11px] font-semibold uppercase tracking-widest ml-7">
                                        Research Admissions Portal
                                    </p>
                                </div>

                                <CardContent className="pt-6 px-6 pb-4 space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase text-slate-400 ml-1 tracking-wider">Full Name</label>
                                            <div className="relative group">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-white/90 transition-colors" />
                                                <input
                                                    value={formData.fullName}
                                                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                                    className="w-full bg-white/40 border-2 border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm font-semibold focus:border-white/30 focus:bg-white/70 transition-all outline-none"
                                                    placeholder="Your full name"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase text-slate-400 ml-1 tracking-wider">Email Address</label>
                                            <div className="flex gap-3">
                                                <div className="relative group flex-1">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-white/90 transition-colors" />
                                                    <input
                                                        value={formData.email}
                                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                        className="w-full bg-white/40 border-2 border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm font-semibold focus:border-white/30 focus:bg-white/70 transition-all outline-none"
                                                        placeholder="name@email.com"
                                                    />
                                                </div>

                                                <Button size="sm" onClick={handleSendEmailOtp} className="rounded-xl px-4 h-[44px] font-black uppercase text-[11px] shadow-lg" variant={isEmailOtpVerified ? "success" : "primary"}>
                                                    {isEmailOtpVerified ? <Check className="h-4 w-4" /> : "Verify"}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase text-slate-400 ml-1 tracking-wider">Mobile Number</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-white/90 transition-colors" />
                                            <input
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full bg-white/40 border-2 border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm font-semibold focus:border-white/30 focus:bg-white/70 transition-all outline-none"
                                                placeholder="10-digit mobile number"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold uppercase text-slate-500 text-[10px] ml-1">Campus</label>
                                            <select
                                                className="w-full bg-white/40 border-2 border-white/10 rounded-xl py-3 px-4 text-sm font-semibold focus:border-white/30 focus:ring-4 focus:ring-white/10 outline-none transition-all appearance-none"
                                                value={formData.campus}
                                                onChange={e => setFormData({ ...formData, campus: e.target.value })}
                                            >
                                                <option value="">Select Campus</option>
                                                <option value="guntur">Guntur</option>
                                                <option value="hyderabad">Hyderabad</option>
                                            </select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold uppercase text-slate-500 text-[10px] ml-1">Program</label>
                                            <select
                                                className="w-full bg-white/40 border-2 border-white/10 rounded-xl py-3 px-4 text-sm font-semibold focus:border-white/30 focus:ring-4 focus:ring-white/10 outline-none transition-all appearance-none"
                                                value={formData.program}
                                                onChange={e => setFormData({ ...formData, program: e.target.value })}
                                            >
                                                <option value="phd">Ph.D</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Always show specialization list for Ph.D (populated from programOptions.phd) */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase text-slate-500 text-[10px] ml-1">Specialization</label>
                                        <select
                                            className="w-full bg-white/40 border-2 border-white/10 rounded-xl py-3 px-4 text-sm font-semibold focus:border-white/30 focus:ring-4 focus:ring-white/10 outline-none transition-all appearance-none"
                                            value={formData.specialization}
                                            onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                                        >
                                            <option value="">Select Specialization</option>
                                            {programOptions.phd.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </CardContent>

                                <CardFooter className="pb-8 px-6">
                                    <Button
                                        className="w-full h-14 rounded-2xl text-sm font-extrabold uppercase tracking-widest gap-2 shadow-2xl bg-emerald-500 hover:bg-emerald-600 text-white transition-all transform hover:-translate-y-0.5"
                                        onClick={() => handleRegister()}
                                        disabled={!isEmailOtpVerified}
                                    >
                                        Register Now <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    </div>
                </div>

                <div className="absolute bottom-0 w-full bg-slate-900 overflow-hidden py-4 border-t border-white/5">
                    <div className="container px-4 mx-auto flex items-center gap-12 whitespace-nowrap overflow-hidden">
                        {/*
                            { date: "DEC 01", title: "PhD ONLINE REGISTRATION OPENS", color: "text-primary" },
                            { date: "JAN 30", title: "LAST DATE FOR APPLICATION SUBMISSION", color: "text-rose-500" },
                            { date: "FEB 15", title: "ENTRANCE TEST & INTERVIEW", color: "text-emerald-500" },
                        */}
                        {[]}
                    </div>
                </div>
            </section>

            {/* How to Apply */}
            <section className="py-20 bg-slate-50 text-center">
                <h2 className="text-4xl font-black mb-12">How to Apply</h2>
                <div className="relative max-w-4xl mx-auto">
                    <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-slate-200 -translate-x-1/2 hidden md:block" />

                    {[
                        { step: 1, title: "Register & Verify", desc: "Create your account and verify your email via OTP.", color: "bg-primary" },
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
                                {/* High-quality research / campus image */}
                                <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80" alt="Vignan research" className="w-full grayscale hover:grayscale-0 transition-all duration-700" />
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
