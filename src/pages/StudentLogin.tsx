import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Phone, Mail, Zap, User, Check, ChevronRight, ShieldCheck } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Card, CardContent } from "../components/ui/Card"
import { useSteps } from "../store/StepContext"
import { useAuth } from "../contexts/AuthContext"
import { toast, Toaster } from "sonner"
import { apiUrl } from "../lib/api"
import { sendOtp, verifyOtp } from "../services/otp"
import { recordPhase } from "../services/phase"
import { cn } from "../lib/utils"

export function StudentLogin() {
    const navigate = useNavigate()
    const { steps, completeLogin, setPaymentStatus, completeApplication, completeRegistration } = useSteps()
    const { login: authLogin } = useAuth()

    // ── View Mode: 'register' (default) or 'login' ──
    const [mode, setMode] = useState<'register' | 'login'>('register')

    // ── Redirect if already logged in ─────────────────────────────────────
    useEffect(() => {
        if (steps.application === "completed") navigate("/dashboard", { replace: true })
        else if (steps.login === "completed") navigate("/application", { replace: true })
    }, [steps, navigate])



    // ── Registration State ──
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        campus: "",
        program: "phd",
        specialization: "",
    })

    const [isEmailOtpVerified, setIsEmailOtpVerified] = useState(false)
    const [showEmailOtpModal, setShowEmailOtpModal] = useState(false)
    const [emailOtpEntry, setEmailOtpEntry] = useState("")
    const [isVerifyingEmail, setIsVerifyingEmail] = useState(false)

    // ── Login State ──
    const [loginEmail, setLoginEmail] = useState("")
    const [loginOtp, setLoginOtp] = useState("")
    const [showLoginOtp, setShowLoginOtp] = useState(false)
    const [sendingLoginOtp, setSendingLoginOtp] = useState(false)
    const [verifyingLogin, setVerifyingLogin] = useState(false)
    const [loginCooldown, setLoginCooldown] = useState(0)

    // ── Common Effect for Cooldowns ──
    useEffect(() => {
        const t = setInterval(() => {
            setLoginCooldown(c => (c <= 1 ? 0 : c - 1))
        }, 1000)
        return () => clearInterval(t)
    }, [])

    // ── Registration Handlers ──
    const handleSendRegOtp = async () => {
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
        toast.success("OTP sent to your email!")
    }

    const verifyRegOtp = async () => {
        const result = await verifyOtp("email", formData.email, emailOtpEntry)
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

    const handleRegister = async () => {
        if (!isEmailOtpVerified) {
            toast.error("Please verify your email first")
            return
        }
        const email = formData.email.trim()
        const doRegister = async () => {
            await recordPhase("registration", email, formData.phone)
            // Simulated backend call logic here
        }

        toast.promise(doRegister(), {
            loading: "Creating your profile...",
            success: () => {
                completeRegistration()
                authLogin({
                    name: formData.fullName,
                    email,
                    phone: formData.phone,
                    status: "registered",
                    program: formData.program,
                })
                navigate("/application")
                return "Registration successful!"
            },
            error: "Registration failed.",
        })
    }

    // ── Login Handlers ──
    const handleSendLoginOtp = async () => {
        const email = loginEmail.trim().toLowerCase()
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error("Enter a valid email address")
            return
        }
        setSendingLoginOtp(true)
        try {
            const res = await sendOtp("email", email)
            if (!res.success) {
                toast.error(res.message || "Failed to send OTP")
                return
            }
            setShowLoginOtp(true)
            setLoginOtp("")
            setLoginCooldown(60)
            toast.success(`OTP sent to ${email}`)
        } finally {
            setSendingLoginOtp(false)
        }
    }

    const handleVerifyLogin = async () => {
        const code = loginOtp.trim()
        if (code.length < 6) { toast.error("Enter 6-digit OTP"); return }
        setVerifyingLogin(true)
        try {
            const email = loginEmail.trim().toLowerCase()
            const res = await verifyOtp("email", email, code)
            if (!res.success) {
                toast.error(res.message || "Invalid OTP")
                return
            }

            const detailsRes = await fetch(apiUrl(`/api/register/details/?email=${encodeURIComponent(email)}`))
            const details = await detailsRes.json().catch(() => ({}))

            if (!detailsRes.ok || !details?.user) {
                toast.error("Registration not found. Please register first.")
                return
            }

            const leadUser = details.user
            await recordPhase("login", leadUser.email, leadUser.phone)

            completeRegistration()
            completeLogin()
            if (leadUser.payment_status === "completed") setPaymentStatus("success")
            if (leadUser.application_status === "completed") completeApplication()

            authLogin({
                name: leadUser.name,
                email: leadUser.email,
                phone: leadUser.phone,
                status: "logged_in",
                program: leadUser.program,
            })

            toast.success("Login successful!")
            navigate("/application")
        } catch {
            toast.error("Verification failed.")
        } finally {
            setVerifyingLogin(false)
        }
    }

    const programOptions = {
        phd: [
            { value: "cse", label: "Computer Science and Engineering" },
            { value: "ai_ml", label: "Artificial Intelligence & Machine Learning" },
            { value: "data_science", label: "Data Science" },
            { value: "cyber_security", label: "Cyber Security" },
            { value: "computer_applications", label: "Computer Applications" },
            { value: "math_stats", label: "Mathematics and Statistics" },
            { value: "pharmaceutical_sciences", label: "Pharmaceutical Sciences" },
            { value: "psychology", label: "Psychology" },
            { value: "law", label: "Law" },
            { value: "agricultural_sciences", label: "Agricultural Sciences" },
            { value: "biotechnology", label: "Biotechnology" },
            { value: "chemistry", label: "Chemistry" },
            { value: "chemical_engineering", label: "Chemical Engineering" },
            { value: "civil_engineering", label: "Civil Engineering" },
            { value: "mechanical_engineering", label: "Mechanical Engineering" },
            { value: "english", label: "English" },
            { value: "ece", label: "Electronics and Communication Engineering" },
            { value: "eee", label: "Electrical and Electronics Engineering" },
            { value: "philosophy", label: "Philosophy" },
            { value: "food_technology", label: "Food Technology" },
            { value: "management", label: "Management" },
            { value: "physics", label: "Physics" },
            { value: "textile_engineering", label: "Textile Engineering" }
        ]
    }

    return (
        <div className="bg-white selection:bg-primary/10 min-h-screen">
            <Toaster position="top-center" richColors />



            {/* Hero Section */}
            <section className="relative overflow-hidden text-left" style={{ minHeight: '100vh' }}>
                {/* Background */}
                <div className="absolute inset-0 z-0">
                    <img src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=2070&q=80" alt="Hero" className="w-full h-full object-cover opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-white via-white/90 to-transparent" />
                </div>

                {/* Content Grid */}
                <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 80px)', paddingTop: '40px', paddingBottom: '100px' }}>
                    <div style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '4rem', alignItems: 'center' }}>
                            {/* Left Side: Content (60%) */}
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                className="space-y-8"
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest">
                                    <Zap className="h-4 w-4 fill-current" /> Ph.D Admissions Open 2026-27
                                </div>
                                <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-[0.95]">
                                    Research <span className="text-primary italic">& Innovation</span> <br /> at Vignan
                                </h1>
                                <p className="text-lg lg:text-xl text-slate-600 font-medium leading-relaxed" style={{ maxWidth: '540px' }}>
                                    Pursue your Ph.D with world-class faculty and state-of-the-art research facilities at Vignan's University.
                                </p>
                            </motion.div>

                            {/* Right Side: Form Card (40%) */}
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                style={{ display: 'flex', justifyContent: 'flex-end' }}
                            >
                                <Card className="border-none shadow-2xl shadow-primary/20 bg-white/95 backdrop-blur-xl relative overflow-hidden" style={{ width: '100%', maxWidth: '440px' }}>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                                    <div className="bg-gradient-to-r from-primary to-blue-600 px-8 py-7 relative z-10">
                                        <div className="flex items-center gap-3 mb-1">
                                            {mode === 'register' ? <Zap className="h-6 w-6 text-blue-100" /> : <ShieldCheck className="h-6 w-6 text-blue-100" />}
                                            <h1 className="text-xl font-black text-white tracking-tight">{mode === 'register' ? 'Apply for Ph.D' : 'Student Login'}</h1>
                                        </div>
                                        <p className="text-blue-100 text-sm font-medium ml-9">
                                            {mode === 'register' ? 'Complete your registration to start.' : 'Verify with email to access portal'}
                                        </p>
                                    </div>

                                    <CardContent className="p-8 space-y-5 relative z-10 text-left">
                                        {mode === 'register' ? (
                                            <>
                                                <div className="space-y-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Full Name</label>
                                                        <div className="relative group">
                                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary" />
                                                            <input value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3 pl-10 pr-4 text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all" placeholder="Enter your name" />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Email (Verification Required)</label>
                                                        <div className="flex gap-2">
                                                            <div className="relative group flex-1">
                                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary" />
                                                                <input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3 pl-10 pr-4 text-sm font-bold focus:border-primary outline-none" placeholder="name@email.com" />
                                                            </div>
                                                            <Button size="sm" onClick={handleSendRegOtp} className="rounded-xl px-4" variant={isEmailOtpVerified ? "success" : "primary"}>
                                                                {isEmailOtpVerified ? <Check className="h-4 w-4" /> : "Verify"}
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Mobile Number</label>
                                                        <div className="relative group">
                                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary" />
                                                            <input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3 pl-10 pr-4 text-sm font-bold focus:border-primary outline-none" placeholder="10-digit number" />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <select value={formData.campus} onChange={e => setFormData({ ...formData, campus: e.target.value })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3 px-4 text-sm font-bold focus:border-primary outline-none appearance-none">
                                                            <option value="">Campus</option>
                                                            <option value="guntur">Guntur</option>
                                                            <option value="hyderabad">Hyderabad</option>
                                                        </select>
                                                        <select value={formData.program} onChange={e => setFormData({ ...formData, program: e.target.value, specialization: "" })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3 px-4 text-sm font-bold focus:border-primary outline-none appearance-none">
                                                            <option value="">Program</option>
                                                            <option value="phd">Ph.D</option>
                                                        </select>
                                                    </div>

                                                    {formData.program && (
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Specialization</label>
                                                            <select value={formData.specialization} onChange={e => setFormData({ ...formData, specialization: e.target.value })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3 px-4 text-sm font-bold focus:border-primary outline-none appearance-none">
                                                                <option value="">Select Specialization</option>
                                                                {programOptions[formData.program as keyof typeof programOptions]?.map(opt => (
                                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    )}
                                                </div>

                                                <Button className="w-full h-14 rounded-2xl text-lg font-black uppercase tracking-widest gap-2 shadow-xl shadow-emerald-500/20 bg-emerald-500 hover:bg-emerald-600 text-white transition-all transform hover:scale-[1.02]" onClick={handleRegister}>
                                                    Register Now <ChevronRight className="h-5 w-5" />
                                                </Button>

                                                <div className="text-center pt-4 border-t border-slate-100">
                                                    <button onClick={() => setMode('login')} className="text-sm text-slate-500 hover:text-primary font-bold transition-colors">
                                                        Already registered? <span className="text-primary font-black uppercase tracking-wider ml-1">Login here →</span>
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="space-y-5">
                                                    <div className="space-y-1.5">
                                                        <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1">Registered Email Address</label>
                                                        <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="your.email@example.com" className="w-full rounded-xl border-2 border-slate-100 py-3 px-4 font-bold text-slate-900 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all" />
                                                    </div>

                                                    {!showLoginOtp ? (
                                                        <Button className="w-full h-14 rounded-2xl font-black text-xs uppercase tracking-widest bg-blue-800 hover:bg-blue-900 text-white shadow-xl shadow-blue-900/20 transition-all hover:scale-[1.02]" onClick={handleSendLoginOtp} disabled={sendingLoginOtp || !loginEmail}>
                                                            {sendingLoginOtp ? "Sending..." : "Send OTP"}
                                                        </Button>
                                                    ) : (
                                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-4">
                                                            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                                                <p className="text-[10px] font-bold text-blue-700 mb-2 ml-1 uppercase">Enter 6-digit OTP</p>
                                                                <input type="text" maxLength={6} value={loginOtp} onChange={e => setLoginOtp(e.target.value.replace(/\D/g, ""))} placeholder="• • • • • •" className="w-full rounded-xl border-2 border-primary/20 bg-white py-3 px-4 text-center font-mono text-2xl font-black text-blue-900 tracking-[0.5em] focus:border-primary outline-none transition-all" />
                                                                <Button className="w-full h-12 mt-4 rounded-xl font-black text-xs uppercase tracking-widest bg-blue-800" onClick={handleVerifyLogin} disabled={verifyingLogin || loginOtp.length < 6}>
                                                                    {verifyingLogin ? "Verifying..." : "Verify & Login"}
                                                                </Button>
                                                            </div>
                                                            <div className="flex justify-between px-1">
                                                                <button onClick={() => setShowLoginOtp(false)} className="text-xs text-slate-500 font-bold hover:text-primary">← Change</button>
                                                                <button disabled={loginCooldown > 0} onClick={handleSendLoginOtp} className="text-xs text-primary font-bold disabled:text-slate-400">
                                                                    {loginCooldown > 0 ? `Resend in ${loginCooldown}s` : "Resend OTP"}
                                                                </button>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </div>

                                                <div className="text-center pt-8 border-t border-slate-100">
                                                    <button onClick={() => setMode('register')} className="text-sm text-slate-500 hover:text-primary font-bold transition-colors">
                                                        New student? <span className="text-primary uppercase tracking-wider ml-1">Register here ←</span>
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Event Ticker */}
                <div className="absolute bottom-0 w-full bg-slate-900 overflow-hidden py-4 border-t border-white/5" style={{ zIndex: 20 }}>
                    <div className="container px-4 mx-auto flex items-center gap-12 whitespace-nowrap overflow-hidden">
                        {[
                            { date: "NOV 13", title: "VSAT ONLINE REGISTRATION OPENS", color: "text-primary" },
                            { date: "APR 15", title: "LAST DATE OF EXAMINATION APPLICATION", color: "text-rose-500" },
                            { date: "MAY 20", title: "RESULT ANNOUNCEMENT & COUNSELING", color: "text-emerald-500" },
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
            <section className="py-20 bg-slate-50 text-center relative z-10">
                <h2 className="text-4xl font-black mb-12">How to Apply</h2>
                <div className="relative max-w-4xl mx-auto px-4">
                    <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-slate-200 -translate-x-1/2 hidden md:block" />

                    {[
                        { step: 1, title: "Register & Verify", desc: "Create your account and verify your email via OTP.", color: "bg-primary" },
                        { step: 2, title: "Application Form", desc: "Pay the scholarship fee and fill in your academic details.", color: "bg-indigo-600" },
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

            {/* About Section */}
            <section className="py-32 overflow-hidden bg-white relative z-10">
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

            {/* Verification Modal for Registration */}
            <AnimatePresence>
                {showEmailOtpModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowEmailOtpModal(false)} />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-3xl p-8 w-full max-w-md relative z-[110] shadow-2xl">
                            <div className="text-center mb-6">
                                <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4">
                                    <Mail className="h-8 w-8" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900">Verify Email</h3>
                                <p className="text-sm text-slate-500 mt-1">Check your inbox for the code sent to {formData.email}</p>
                            </div>
                            <input type="text" maxLength={6} value={emailOtpEntry} onChange={e => setEmailOtpEntry(e.target.value.replace(/\D/g, ""))} placeholder="0 0 0 0 0 0" className="w-full h-16 text-center text-3xl font-black border-2 border-slate-100 rounded-2xl focus:border-primary outline-none tracking-[0.5em] mb-6" />
                            <div className="flex gap-4">
                                <Button variant="ghost" className="flex-1" onClick={() => setShowEmailOtpModal(false)}>Cancel</Button>
                                <Button variant="primary" className="flex-1 h-12 font-black uppercase" onClick={verifyRegOtp} isLoading={isVerifyingEmail}>Verify</Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
