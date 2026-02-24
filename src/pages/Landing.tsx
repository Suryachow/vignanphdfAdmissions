import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import {
    Users,
    Search,
    Menu,
    ChevronRight,
    Linkedin,
    Facebook,
    Instagram,
    Youtube,
    MessageCircle,
    BookOpen,
    Zap,
    User,
    Mail,
    Phone,
    Briefcase,
    Microscope,
    GraduationCap,
    ArrowRight,
    ShieldCheck,
    HeartPulse
} from "lucide-react"

import { Toaster, toast } from "sonner"
import { useSteps } from "../store/StepContext"
import { useAuth } from "../contexts/AuthContext"
import { apiUrl } from "../lib/api"
import { sendOtp, verifyOtp } from "../services/otp"
import { recordPhase } from "../services/phase"

export function Landing() {
    const navigate = useNavigate()
    const { steps, completeLogin, setPaymentStatus, completeApplication, completeRegistration } = useSteps()
    const { login: authLogin } = useAuth()

    const [mode, setMode] = useState<'register' | 'login'>('register')
    const [activeTab, setActiveTab] = useState<'overview' | 'admission' | 'research' | 'campus'>('overview')

    useEffect(() => {
        if (steps.application === "completed") navigate("/dashboard", { replace: true })
        else if (steps.login === "completed") navigate("/application", { replace: true })
    }, [steps, navigate])

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

    const [loginEmail, setLoginEmail] = useState("")
    const [loginOtp, setLoginOtp] = useState("")
    const [showLoginOtp, setShowLoginOtp] = useState(false)
    const [sendingLoginOtp, setSendingLoginOtp] = useState(false)
    const [verifyingLogin, setVerifyingLogin] = useState(false)
    if (verifyingLogin) { /* mock use */ }

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

    const navItems = ["Home", "Academics", "Admission", "Research", "People", "University Life", "About Us"]

    // Consolidated features to avoid duplicate declaration error
    const homepageFeatures = [
        { title: "LEARNING & COUNSELING", icon: <GraduationCap className="w-5 h-5" />, desc: "Virtual Lectures, E-Learning Internet Access, Student Mentor" },
        { title: "PROFESSIONAL EMPOWERMENT", icon: <Users className="w-5 h-5" />, desc: "Personality Development, Psychology, English Language Skills" },
        { title: "RESEARCH", icon: <Microscope className="w-5 h-5" />, desc: "2 CoE's and 18 Advanced Research centers, Labs for Innovation" },
        { title: "OPTIONAL CLUB & SPORTS", icon: <Zap className="w-5 h-5" />, desc: "20+ Optional Clubs, 12+ Recreational & Performing Arts" },
        { title: "LIBRARIES", icon: <BookOpen className="w-5 h-5" />, desc: "Books, Volumes, E-Journals, Explore 1 Cr+ collection" },
        { title: "WORKFORCE PRACTICUM", icon: <Briefcase className="w-5 h-5" />, desc: "International Internship, Placements & Training" },
    ]

    return (
        <div className="bg-white min-h-screen text-slate-800 font-sans selection:bg-vignan-maroon/10">
            <Toaster position="top-center" richColors />

            {/* Header with High-Res Logo */}
            <header className="vignan-header shadow-md">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <img
                            src="https://vignan.ac.in/slambook/logo.png"
                            alt="Vignan University Logo"
                            className="h-10 md:h-16 object-contain"
                            onError={(e) => { e.currentTarget.src = "https://1.bp.blogspot.com/-8Pnflyw0bJM/WgsOqoxxGBI/AAAAAAAAAqQ/HGFq-z4KZEU04WAtPT5bTWlKY98GFEGDgCLcBGAs/s1600/vignan%252Buniversity.png" }}
                        />
                    </div>
                    <nav className="hidden lg:flex items-center gap-1">
                        {navItems.map(item => (
                            <a key={item} href="#" className="vignan-nav-link text-[13px] font-bold tracking-tight uppercase">
                                {item}
                                {["Academics", "Admission", "Research"].includes(item) && <ChevronRight className="w-3 h-3 rotate-90 inline-block ml-1 opacity-50" />}
                            </a>
                        ))}
                    </nav>
                    <div className="flex items-center gap-5">
                        <Search className="w-5 h-5 cursor-pointer text-slate-500 hover:text-vignan-maroon transition-colors" />
                        <button className="lg:hidden p-2 text-slate-700"><Menu className="w-8 h-8" /></button>
                    </div>
                </div>
            </header>

            <main>
                {/* Hero Section with Enhanced High-Quality Background Overlay */}
                <section className="relative min-h-[850px] flex items-center py-24 overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://www.amaravativoice.com/images/articles/vignan-univesity-vadlamudi-23032016.jpg"
                            alt="Vignan Campus Hub"
                            className="w-full h-full object-cover filter brightness-[0.8]"
                            onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=2800&q=100" }}
                        />
                        <div className="absolute inset-0 hero-overlay opacity-95" />
                        {/* Shimmer effect for high-quality feel */}
                        <div className="absolute inset-0 shimmer opacity-15 pointer-events-none" />
                    </div>

                    <div className="container mx-auto px-6 relative z-10">
                        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">

                            {/* Hero Text */}
                            <div className="flex-1 space-y-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8 }}
                                    className="space-y-6"
                                >
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-vignan-gold/20 backdrop-blur-md border border-vignan-gold/30 rounded-full">
                                        <span className="w-2 h-2 bg-vignan-gold rounded-full animate-pulse" />
                                        <span className="text-vignan-gold text-[10px] font-black uppercase tracking-[0.3em]">Ph.D. Intake 2026-27</span>
                                    </div>
                                    <h1 className="vignan-hero-text text-5xl md:text-7xl lg:text-8xl drop-shadow-2xl">
                                        A Meaningful Impact<br />
                                        <span className="text-vignan-gold italic font-serif">For a Better Society</span>
                                    </h1>
                                    <p className="text-white/95 text-lg md:text-2xl font-medium max-w-2xl leading-relaxed italic drop-shadow-xl border-l-4 border-vignan-gold pl-6">
                                        "Have You Always Been Tagged As Below Average? Do Not Worry... You Are At The Right Place!"
                                    </p>
                                </motion.div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                    {homepageFeatures.slice(0, 4).map((item, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.4 + i * 0.1 }}
                                            className="vignan-feature-item bg-white/5 backdrop-blur-md border border-white/10 group cursor-default hover:bg-white/10"
                                        >
                                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-vignan-gold group-hover:scale-110 transition-transform">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <h4 className="text-white text-[11px] font-black tracking-widest">{item.title}</h4>
                                                <p className="text-white/60 text-[10px] mt-0.5 leading-tight">{item.desc}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Crisp White Inquiry Form */}
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="w-full max-w-[460px]"
                            >
                                <div className="vignan-form-card border-t-8 border-vignan-maroon">
                                    <div className="flex p-1.5 bg-slate-50 border border-slate-100 rounded-2xl mb-10">
                                        <button
                                            onClick={() => setMode('register')}
                                            className={`flex-1 py-3.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'register' ? 'bg-white text-vignan-maroon shadow-lg' : 'text-slate-400 hover:text-vignan-maroon'}`}
                                        >
                                            New Scholar
                                        </button>
                                        <button
                                            onClick={() => setMode('login')}
                                            className={`flex-1 py-3.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'login' ? 'bg-white text-vignan-maroon shadow-lg' : 'text-slate-400 hover:text-vignan-maroon'}`}
                                        >
                                            Portal Access
                                        </button>
                                    </div>

                                    <div className="text-center mb-10">
                                        <h3 className="text-3xl font-serif font-black text-vignan-maroon italic">Choose Vignan</h3>
                                        <div className="h-1.5 w-12 bg-vignan-gold mx-auto mt-4 rounded-full" />
                                    </div>

                                    <div className="space-y-6">
                                        {mode === 'register' ? (
                                            <>
                                                <div className="relative group">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-vignan-maroon transition-colors" />
                                                    <input value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} className="vignan-input pl-12" placeholder="Full Name as per Records" />
                                                </div>

                                                <div className="flex gap-3">
                                                    <div className="relative flex-1 group">
                                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-vignan-maroon transition-colors" />
                                                        <input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="vignan-input pl-12" placeholder="Official Email Address" />
                                                    </div>
                                                    <button
                                                        onClick={handleSendRegOtp}
                                                        className={`px-5 rounded-xl text-[10px] font-black uppercase transition-all shadow-sm ${isEmailOtpVerified ? 'bg-emerald-500 text-white' : 'bg-vignan-maroon/5 text-vignan-maroon border border-vignan-maroon/10 hover:bg-vignan-maroon hover:text-white'}`}
                                                    >
                                                        {isEmailOtpVerified ? "VERIFIED" : "VERIFY"}
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="relative group">
                                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-vignan-maroon transition-colors" />
                                                        <input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="vignan-input pl-12" placeholder="Primary Contact" />
                                                    </div>
                                                    <select value={formData.campus} onChange={e => setFormData({ ...formData, campus: e.target.value })} className="vignan-input bg-slate-50 cursor-pointer">
                                                        <option value="">Select Campus</option>
                                                        <option value="guntur">Guntur Campus</option>
                                                        <option value="hyderabad">Hyderabad Campus</option>
                                                    </select>
                                                </div>

                                                <select value={formData.specialization} onChange={e => setFormData({ ...formData, specialization: e.target.value })} className="vignan-input bg-slate-50 cursor-pointer">
                                                    <option value="">Research Specialization</option>
                                                    {programOptions.phd.map(opt => (
                                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                    ))}
                                                </select>

                                                <button className="vignan-btn w-full py-5 mt-4 group shadow-xl" onClick={handleRegister}>
                                                    <span className="text-[12px]">START MY RESEARCH JOURNEY</span>
                                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <div className="relative group">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-vignan-maroon transition-colors" />
                                                    <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="scholar@vignan.ac.in" className="vignan-input pl-12" />
                                                </div>

                                                {!showLoginOtp ? (
                                                    <button className="vignan-btn w-full py-5 shadow-lg group" onClick={handleSendLoginOtp} disabled={sendingLoginOtp || !loginEmail}>
                                                        <span>{sendingLoginOtp ? "PLEASE WAIT..." : "SEND ACCESS TOKEN"}</span>
                                                        {!sendingLoginOtp && <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
                                                    </button>
                                                ) : (
                                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pt-4 border-t border-slate-100">
                                                        <p className="text-[11px] text-center font-black text-slate-400 uppercase tracking-[0.2em]">6-Digit Token Dispatched</p>
                                                        <input type="text" maxLength={6} value={loginOtp} onChange={e => setLoginOtp(e.target.value.replace(/\D/g, ""))} placeholder="• • • • • •" className="w-full border-2 border-slate-100 rounded-2xl py-5 text-center font-mono text-4xl font-black text-vignan-maroon tracking-[0.4em] focus:border-vignan-maroon outline-none transition-all shadow-inner bg-slate-50" />
                                                        <button className="vignan-btn w-full py-5" onClick={handleVerifyLogin}>LOGIN TO SCHOLAR PORTAL</button>
                                                    </motion.div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                    <p className="text-[11px] text-center text-slate-400 mt-10 leading-relaxed italic border-t border-slate-50 pt-6">
                                        "Four decades of academic excellence. UGC & AICTE Recognized Research Institution."
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Content Sections with High-Res Visuals */}
                <section className="bg-white py-32">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col lg:flex-row gap-24 items-center">
                            <div className="flex-1 space-y-8">
                                <motion.div
                                    whileInView={{ opacity: 1, x: 0 }}
                                    initial={{ opacity: 0, x: -30 }}
                                    viewport={{ once: true }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-5xl md:text-6xl font-serif font-black text-vignan-blue leading-tight italic">
                                        Cutting-Edge <span className="text-vignan-maroon">Research</span> Ecosystem
                                    </h2>
                                    <p className="text-slate-600 leading-relaxed text-xl font-medium">
                                        Our university provides a transformative environment for Ph.D. scholars, boasting state-of-the-art infrastructure and a culture of relentless inquiry.
                                    </p>
                                    <div className="grid grid-cols-2 gap-8 pt-6">
                                        <div className="space-y-3">
                                            <div className="w-12 h-12 bg-vignan-maroon/5 text-vignan-maroon rounded-2xl flex items-center justify-center">
                                                <Microscope className="w-6 h-6" />
                                            </div>
                                            <h4 className="font-black text-vignan-blue uppercase tracking-widest text-sm">Laboratories</h4>
                                            <p className="text-xs text-slate-500">18 Advanced Research Centers with modern equipment.</p>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="w-12 h-12 bg-vignan-maroon/5 text-vignan-maroon rounded-2xl flex items-center justify-center">
                                                <BookOpen className="w-6 h-6" />
                                            </div>
                                            <h4 className="font-black text-vignan-blue uppercase tracking-widest text-sm">Library</h4>
                                            <p className="text-xs text-slate-500">Access to over 1 Crore digital volumes & journals.</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                            <div className="flex-1 relative">
                                <motion.div
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    viewport={{ once: true }}
                                    className="relative rounded-[3rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.15)] group"
                                >
                                    <img
                                        src="https://www.vignan.ac.in/admissions-vsat-2021/images/about-us.jpg"
                                        alt="Vignan Research"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-vignan-maroon/80 via-transparent to-transparent" />
                                    <div className="absolute bottom-10 left-10 text-white">
                                        <h3 className="text-3xl font-serif font-black italic">India's Emerging Hub</h3>
                                        <p className="text-sm font-bold uppercase tracking-widest text-white/70">Innovation & Discovery</p>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Campus Life & Facilities */}
                <section className="bg-slate-50 py-32 overflow-hidden">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col-reverse lg:flex-row gap-24 items-center">
                            <div className="flex-1">
                                <div className="grid grid-cols-2 gap-6 h-[500px]">
                                    <div className="space-y-6">
                                        <img src="https://tse3.mm.bing.net/th/id/OIP.x4GeWdkI8dL45u6jBjb0pQHaE8?rs=1&pid=ImgDetMain&o=7&rm=3" alt="Infrastructure" className="w-full h-[300px] object-cover rounded-[2.5rem] shadow-2xl" />
                                        <div className="h-[174px] bg-vignan-maroon rounded-[2.5rem] flex flex-col items-center justify-center text-white p-6 text-center transform hover:rotate-2 transition-transform">
                                            <Users className="w-8 h-8 mb-3 opacity-50" />
                                            <div className="text-3xl font-black">20,000+</div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-white/60">Global Alumni Network</div>
                                        </div>
                                    </div>
                                    <div className="pt-12 space-y-6">
                                        <div className="h-[174px] bg-vignan-blue rounded-[2.5rem] flex flex-col items-center justify-center text-white p-6 text-center transform hover:-rotate-2 transition-transform">
                                            <GraduationCap className="w-8 h-8 mb-3 opacity-50" />
                                            <div className="text-3xl font-black">500+</div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-white/60">Ph.D. Faculty Mentors</div>
                                        </div>
                                        <img src="https://mir-s3-cdn-cf.behance.net/projects/404/842d88165745217.Y3JvcCwxMDgwLDg0NCwwLDExNw.jpg" alt="Excellence" className="w-full h-[300px] object-cover rounded-[2.5rem] shadow-2xl" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 space-y-8">
                                <motion.div
                                    whileInView={{ opacity: 1, x: 0 }}
                                    initial={{ opacity: 0, x: 30 }}
                                    viewport={{ once: true }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-5xl md:text-6xl font-serif font-black text-vignan-blue leading-tight italic">
                                        Holistic <span className="text-vignan-maroon">Mentorship</span>
                                    </h2>
                                    <p className="text-slate-600 leading-relaxed text-xl font-medium">
                                        We believe in nurturing the whole scholar. From professional empowerment workshops to vibrant campus life, our environment is designed for success.
                                    </p>
                                    <div className="flex flex-wrap gap-4 pt-4">
                                        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-md border border-slate-100 group hover:border-vignan-gold transition-colors">
                                            <ShieldCheck className="w-5 h-5 text-vignan-maroon group-hover:scale-120 transition-transform" />
                                            <span className="text-sm font-bold uppercase tracking-wider text-slate-700">UGC Recognized</span>
                                        </div>
                                        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-md border border-slate-100 group hover:border-vignan-gold transition-colors">
                                            <HeartPulse className="w-5 h-5 text-vignan-maroon group-hover:scale-120 transition-transform" />
                                            <span className="text-sm font-bold uppercase tracking-wider text-slate-700">100% Scholastic</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Admissions Information Section */}
                <section className="bg-white py-24 border-t border-slate-100 relative" id="admissions-info">
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

                    
                    
                    <div className="container mx-auto px-6 max-w-6xl relative z-10">
                        <div className="text-center mb-16 space-y-4">
                            <h2 className="text-4xl md:text-5xl font-serif font-black text-vignan-blue italic drop-shadow-sm">
                                Ph.D. <span className="text-vignan-maroon">Admissions Info</span>
                            </h2>
                            <p className="text-slate-500 max-w-4xl mx-auto text-lg font-medium leading-relaxed">
                                Vignan’s Foundation for Science, Technology & Research (VFSTR) offers broad-based Ph.D. programs in Engineering, Sciences, Management and English streams with NAAC A+ grade & ABET accreditations.
                            </p>
                        </div>

                        {/* Custom High-End Tabs */}
                        <div className="flex flex-wrap justify-center gap-4 mb-12">
                            {[
                                { id: 'overview', label: 'Overview & Specializations' },
                                { id: 'admission', label: 'Admission & Fees' },
                                { id: 'research', label: 'Research & Coursework' },
                                { id: 'campus', label: 'Campus & Support' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`px-8 py-4 rounded-2xl font-black text-[10px] md:text-xs tracking-widest uppercase transition-all duration-300 border ${activeTab === tab.id
                                        ? 'bg-vignan-maroon text-white shadow-xl shadow-vignan-maroon/30 scale-105 border-vignan-maroon'
                                        : 'bg-white text-slate-400 hover:text-vignan-maroon hover:border-vignan-maroon/30 hover:bg-slate-50 border-slate-100'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-slate-100/50 min-h-[400px]">
                            <AnimatePresence mode="wait">
                                
                                {
    activeTab === 'overview' && (
        <motion.div key="overview" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="w-10 h-10 rounded-xl bg-vignan-maroon/5 flex items-center justify-center text-vignan-maroon"><Zap className="w-5 h-5" /></div>
                        Eligibility & Entry Requirements
                    </h3>
                    <ul className="space-y-4 text-slate-600 font-medium text-sm">
                        <li className="flex gap-3"><ChevronRight className="w-4 h-4 text-vignan-gold shrink-0 mt-0.5" /><span><strong className="text-slate-800">Minimum Marks:</strong> Minimum 55% in postgraduate degree (50% for SC/ST/OBC); many departments seek ~60% or "First Class".</span></li>
                        <li className="flex gap-3"><ChevronRight className="w-4 h-4 text-vignan-gold shrink-0 mt-0.5" /><span><strong className="text-slate-800">Master's Degree:</strong> Required relevant Master’s (e.g., M.Tech/M.E. for engineering, M.Sc./M.A. for sciences/humanities, MBA/M.Com for management).</span></li>
                        <li className="flex gap-3"><ChevronRight className="w-4 h-4 text-vignan-gold shrink-0 mt-0.5" /><span><strong className="text-slate-800">Exemptions:</strong> Candidates with GATE, CSIR/UGC-NET, CAT are exempted from the written test but must attend the interview.</span></li>
                        <li className="flex gap-3"><ChevronRight className="w-4 h-4 text-vignan-gold shrink-0 mt-0.5" /><span><strong className="text-slate-800">Part-Time (External):</strong> Enrollements permitted under UGC norms, usually requiring the candidate’s employer consent.</span></li>
                    </ul>
                </div>
                <div className="space-y-6">
                    <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="w-10 h-10 rounded-xl bg-vignan-blue/5 flex items-center justify-center text-vignan-blue"><BookOpen className="w-5 h-5" /></div>
                        Specializations Offered
                    </h3>
                    <ul className="space-y-4 text-slate-600 font-medium text-sm">
                        <li className="flex gap-3"><ChevronRight className="w-4 h-4 text-vignan-maroon shrink-0 mt-0.5" /><span><strong className="text-slate-800">Engineering:</strong> CSE, AI/ML, Cyber Security, Data Science, ECE, EEE, Mechanical, Civil, Chemical, Robotics, Textile, Agricultural Engg.</span></li>
                        <li className="flex gap-3"><ChevronRight className="w-4 h-4 text-vignan-gold shrink-0 mt-0.5" /><span><strong className="text-slate-800">Sciences & Tech:</strong> Biotechnology, Chemistry, Physics, Math, Statistics, Food Tech, Pharmaceutical Sciences (GPAT preferred).</span></li>
                        <li className="flex gap-3"><ChevronRight className="w-4 h-4 text-green-600 shrink-0 mt-0.5" /><span><strong className="text-slate-800">Agri. Sciences:</strong> Agronomy, Horticulture, Soil Science, Plant Pathology, Genetics & Plant Breeding.</span></li>
                        <li className="flex gap-3"><ChevronRight className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" /><span><strong className="text-slate-800">Management & Humanities:</strong> Business Administration, Commerce, Psychology, English, Law.</span></li>
                    </ul>
                </div>
            </div>
        </motion.div>
    )
}

{
    activeTab === 'admission' && (
        <motion.div key="admission" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }} className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8 items-start">
                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-inner">
                    <h4 className="font-black text-xl text-vignan-maroon mb-6 flex items-center gap-3"><Briefcase className="w-6 h-6" /> Fees & Funding</h4>
                    <div className="space-y-4 text-sm text-slate-600 font-medium">
                        <div className="flex justify-between items-center border-b border-slate-200 pb-2"><span>Admission Fee (Non-refundable)</span><span className="font-bold text-slate-800">₹10,000/-</span></div>
                        <div className="flex justify-between items-center border-b border-slate-200 pb-2"><span>Internal (Full time) Annual Tuition</span><span className="font-bold text-slate-800">₹40,000/-</span></div>
                        <div className="flex justify-between items-center border-b border-slate-200 pb-2"><span>External (Part time) Annual Tuition</span><span className="font-bold text-slate-800">₹70,000/-</span></div>
                    </div>
                    <p className="mt-4 text-xs text-slate-500">* Students often support themselves through national research fellowships (UGC/CSIR JRF, GATE fellowships, etc.). VFSTR also grants internal Seed Grants.</p>
                </div>
                <div className="space-y-6 text-slate-600 font-medium text-sm pt-4">
                    <h4 className="font-black text-xl text-slate-800 flex items-center gap-3"><ShieldCheck className="w-5 h-5 text-vignan-gold" /> Process & Timeline</h4>
                    <ul className="space-y-4">
                        <li className="flex gap-4 items-start"><span className="w-8 h-8 rounded-full bg-vignan-maroon/10 text-vignan-maroon flex items-center justify-center font-bold shrink-0">1</span><p><strong className="text-slate-800">Exams Twice a Year:</strong> Applications are accepted year-round but formal entrance exams and interviews are held in Dec/Jan and July/Aug.</p></li>
                        <li className="flex gap-4 items-start"><span className="w-8 h-8 rounded-full bg-vignan-maroon/10 text-vignan-maroon flex items-center justify-center font-bold shrink-0">2</span><p><strong className="text-slate-800">Duration:</strong> Minimum period is 5 semesters (2.5 years) and maximum allowed is 12 semesters (6 years).</p></li>
                        <li className="flex gap-4 items-start"><span className="w-8 h-8 rounded-full bg-vignan-maroon/10 text-vignan-maroon flex items-center justify-center font-bold shrink-0">3</span><p><strong className="text-slate-800">Evaluation:</strong> Based on academic record, test and interview scores, research experience, and publications.</p></li>
                    </ul>
                </div>
            </div>
        </motion.div>
    )
}

{
    activeTab === 'research' && (
        <motion.div key="research" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="w-10 h-10 rounded-xl bg-vignan-maroon/5 flex items-center justify-center text-vignan-maroon"><GraduationCap className="w-5 h-5" /></div>
                        Coursework & Research
                    </h3>
                    <ul className="space-y-4 text-slate-600 font-medium text-sm">
                        <li className="flex gap-3"><ChevronRight className="w-4 h-4 text-vignan-gold shrink-0 mt-0.5" /><span><strong className="text-slate-800">Coursework:</strong> About 30 credits required (Research methodology, breadth/depth courses). Tailored to the student's background.</span></li>
                        <li className="flex gap-3"><ChevronRight className="w-4 h-4 text-vignan-gold shrink-0 mt-0.5" /><span><strong className="text-slate-800">Publications:</strong> Must earn at least 12 "research points" (e.g. one SCI/SCIE journal = 5 points) before final synopsis approval.</span></li>
                        <li className="flex gap-3"><ChevronRight className="w-4 h-4 text-vignan-gold shrink-0 mt-0.5" /><span><strong className="text-slate-800">Thesis Defense:</strong> External review (Indian and foreign examiner) followed by an Open Defense (public viva voce).</span></li>
                    </ul>
                </div>
                <div className="space-y-6">
                    <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="w-10 h-10 rounded-xl bg-vignan-blue/5 flex items-center justify-center text-vignan-blue"><Users className="w-5 h-5" /></div>
                        Faculty & Supervision
                    </h3>
                    <ul className="space-y-4 text-slate-600 font-medium text-sm">
                        <li className="flex gap-3"><ChevronRight className="w-4 h-4 text-vignan-gold shrink-0 mt-0.5" /><span><strong className="text-slate-800">Excellence:</strong> Over 4,000+ publications and 28 international patents. Mentorship by active researchers.</span></li>
                        <li className="flex gap-3"><ChevronRight className="w-4 h-4 text-vignan-gold shrink-0 mt-0.5" /><span><strong className="text-slate-800">Supervision:</strong> A Professor guides up to 6–8 Ph.D. students. Interdisciplinary co-supervisors can be appointed.</span></li>
                        <li className="flex gap-3"><ChevronRight className="w-4 h-4 text-vignan-gold shrink-0 mt-0.5" /><span><strong className="text-slate-800">Progress Monitoring:</strong> Bi-annual review via a Doctoral Committee. Initial "Zero-th Progress" meeting finalizes coursework.</span></li>
                    </ul>
                </div>
            </div>
        </motion.div>
    )
}

{
    activeTab === 'campus' && (
        <motion.div key="campus" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="w-10 h-10 rounded-xl bg-vignan-maroon/5 flex items-center justify-center text-vignan-maroon"><Microscope className="w-5 h-5" /></div>
                        Infrastructure & Support
                    </h3>
                    <ul className="space-y-4 text-slate-600 font-medium text-sm">
                        <li className="flex gap-3"><ChevronRight className="w-4 h-4 text-vignan-gold shrink-0 mt-0.5" /><span><strong className="text-slate-800">Research Ecosystem:</strong> 15 Advanced Research Centres & 4 Centres of Excellence (≈₹30cr investment structure).</span></li>
                        <li className="flex gap-3"><ChevronRight className="w-4 h-4 text-vignan-gold shrink-0 mt-0.5" /><span><strong className="text-slate-800">Facilities:</strong> Includes a ₹12-crore Keysight CoE for RF/Microwave, AI/ML labs, and 32+ acres of agri-plots.</span></li>
                        <li className="flex gap-3"><ChevronRight className="w-4 h-4 text-vignan-gold shrink-0 mt-0.5" /><span><strong className="text-slate-800">NTR Vignan Library:</strong> 5,900 sq.m. AC facility, 116,000 volumes, robust e-journal access (IEEE, Springer, JSTOR).</span></li>
                    </ul>
                </div>
                <div className="space-y-6">
                    <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="w-10 h-10 rounded-xl bg-vignan-blue/5 flex items-center justify-center text-vignan-blue"><ShieldCheck className="w-5 h-5" /></div>
                        Partnerships & Contact
                    </h3>
                    <ul className="space-y-4 text-slate-600 font-medium text-sm">
                        <li className="flex gap-3"><ChevronRight className="w-4 h-4 text-vignan-gold shrink-0 mt-0.5" /><span><strong className="text-slate-800">Global Reach:</strong> MOUs with Univ. of Colorado, Ecole Centrale de Nantes, Soongsil Univ., and ICRISAT.</span></li>
                        <li className="flex gap-3"><ChevronRight className="w-4 h-4 text-vignan-gold shrink-0 mt-0.5" /><span><strong className="text-slate-800">Career Trajectory:</strong> Alumni placed in top academia, R&D corp labs, Govt roles, or robust incubation centers.</span></li>
                        <li className="flex gap-3"><ChevronRight className="w-4 h-4 text-vignan-gold shrink-0 mt-0.5" /><span><strong className="text-slate-800">Reach Us:</strong> Vadlamudi, Guntur – 522213, AP. Email: info@vignan.ac.in | Phone: 0863-2344700/701.</span></li>
                    </ul>
                </div>
            </div>
        </motion.div>
    )
}

                            
                            </AnimatePresence>
                        </div>
                    </div>

                </section>

                {/* Statistics Footer Bar */}
                <section className="bg-white py-20">
                    <div className="container mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12">
                        {[
                            { label: "Research Centers", value: "18+" },
                            { label: "Ph.D Specializations", value: "22" },
                            { label: "Faculty Mentors", value: "500+" },
                            { label: "Trust Since", value: "1977" },
                        ].map((stat, idx) => (
                            <div key={idx} className="text-center group border-r border-slate-100 last:border-0">
                                <div className="text-5xl font-serif font-black text-vignan-maroon mb-2 group-hover:scale-110 transition-transform">
                                    {stat.value}
                                </div>
                                <div className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Social & Support Sidebar */}
            <div className="fixed right-6 bottom-32 z-50 flex flex-col gap-4">
                <div className="bg-white p-4 rounded-[1.5rem] shadow-2xl border border-slate-100 flex flex-col gap-5">
                    {[Linkedin, Facebook, Instagram, Youtube].map((Icon, idx) => (
                        <a key={idx} href="#" className="text-slate-400 hover:text-vignan-maroon transition-all hover:scale-110"><Icon className="w-5 h-5" /></a>
                    ))}
                </div>
            </div>

            <div className="fixed bottom-8 right-8 z-50">
                <button className="bg-[#25D366] text-white px-8 py-4 rounded-full shadow-[0_20px_50px_rgba(37,211,102,0.4)] flex items-center gap-4 font-black text-sm uppercase tracking-widest hover:scale-105 transition-all active:scale-95 group">
                    <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    <span>WhatsApp Helpdesk</span>
                </button>
            </div>

            {/* Premium OTP Overlay Modal */}
            <AnimatePresence>
                {showEmailOtpModal && mode === 'register' && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setShowEmailOtpModal(false)} />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            className="bg-white rounded-[3rem] p-12 w-full max-w-md relative z-[210] shadow-[0_50px_100px_rgba(0,0,0,0.3)] text-center overflow-hidden"
                        >
                            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-vignan-maroon to-vignan-gold" />
                            <div className="w-24 h-24 bg-red-50 rounded-[2rem] flex items-center justify-center text-vignan-maroon mx-auto mb-8 shadow-inner">
                                <Mail className="w-12 h-12" />
                            </div>
                            <h3 className="text-3xl font-serif font-black text-slate-900 mb-2 italic">Access Security</h3>
                            <p className="text-base text-slate-500 mb-10 leading-relaxed px-6">We've sent a 6-digit secure token to:<br /><span className="font-black text-vignan-maroon">{formData.email}</span></p>
                            <input type="text" maxLength={6} value={emailOtpEntry} onChange={e => setEmailOtpEntry(e.target.value.replace(/\D/g, ""))} placeholder="0 0 0 0 0 0" className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl py-6 text-center font-mono text-5xl font-black text-vignan-maroon tracking-[0.3em] focus:border-vignan-maroon outline-none transition-all mb-10 shadow-inner" />
                            <div className="flex gap-4">
                                <button className="flex-1 py-4 bg-slate-100 text-slate-500 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-slate-200 transition-colors" onClick={() => setShowEmailOtpModal(false)}>Refuse</button>
                                <button className="vignan-btn flex-1 py-4" onClick={verifyRegOtp} disabled={isVerifyingEmail}>
                                    {isVerifyingEmail ? "CHECKING..." : "GRANT ACCESS"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
