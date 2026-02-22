import { useNavigate } from "react-router-dom"
import {
    CheckCircle2,
    Clock,
    FileText,
    CreditCard,
    ChevronRight,
    ShieldCheck,
    Download,
    BookOpen,
    Zap,
    GraduationCap,
    ArrowRight,
    Bell,
    Calendar,
    Target
} from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Badge } from "../components/ui/Badge"
import { useSteps } from "../store/StepContext"
import { useAuth } from "../contexts/AuthContext"
import { PageWrapper } from "../components/PageWrapper"
import { cn } from "../lib/utils"
import { downloadApplicationFormPDF, getStoredFormData } from "../utils/pdfGenerator"

export function Dashboard() {
    const navigate = useNavigate()
    const { steps } = useSteps()
    const { user } = useAuth()

    const timeline = [
        {
            id: 1,
            label: "Account Registration",
            status: steps.registration === 'completed' ? 'completed' : 'current',
            date: "14 Feb 2026",
            desc: "Initial student profile created and verified.",
            icon: CheckCircle2
        },
        {
            id: 2,
            label: "Entrance Exam Fee",
            status: steps.payment === 'success' ? 'completed' : (steps.otpVerified ? 'current' : 'locked'),
            date: steps.payment === 'success' ? "14 Feb 2026" : null,
            desc: "Secure payment of registration fee (₹ 1,770).",
            icon: CreditCard
        },
        {
            id: 3,
            label: "Detailed Application Form",
            status: steps.application === 'completed' ? 'completed' : (steps.payment === 'success' ? 'current' : 'locked'),
            desc: "Submit academic transcripts and personal details.",
            icon: FileText
        },
        {
            id: 4,
            label: "Admission Decision",
            status: 'locked',
            desc: "Evaluation by the University Academic Council.",
            icon: GraduationCap
        },
    ]

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'completed': return "bg-emerald-500 text-white shadow-emerald-200";
            case 'current': return "bg-blue-600 text-white shadow-blue-200 ring-4 ring-blue-50/50 anime-pulse";
            default: return "bg-slate-100 text-slate-400";
        }
    }

    const StatCard = ({ icon: Icon, label, value, color }: { icon: any, label: string, value: string, color: string }) => (
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className={cn("absolute top-0 right-0 w-24 h-24 blur-3xl opacity-10 rounded-full -mr-12 -mt-12", color)} />
            <CardContent className="p-6">
                <div className="flex items-center gap-4">
                    <div className={cn("p-3 rounded-2xl", color.replace('bg-', 'bg-opacity-10 text-').replace('text-', 'text-opacity-100'))}>
                        <Icon className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-1">{label}</p>
                        <h4 className="text-xl font-black text-slate-800 tracking-tight">{value}</h4>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <PageWrapper>
            <div className="max-w-6xl mx-auto space-y-12 pb-20">
                {/* Modern Header Section */}
                <div className="relative rounded-[2.5rem] bg-slate-900 border border-slate-800 p-8 md:p-12 overflow-hidden group shadow-2xl">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -mr-64 -mt-64 transition-transform group-hover:scale-110 duration-1000" />
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px] -ml-32 -mb-32" />

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="text-center md:text-left">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-accent text-xs font-black uppercase tracking-widest mb-6"
                            >
                                <Zap className="h-3 w-3 fill-accent" /> Active Academic Cycle 2026
                            </motion.div>
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">
                                Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">{user?.name?.split(' ')[0] || "Scholar"}</span>
                            </h1>
                            <p className="text-slate-400 font-medium text-lg max-w-lg mb-8">
                                Your journey to excellence is <span className="text-white font-bold">45% complete</span>. Finalize your PhD application to unlock early bird benefits.
                            </p>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                <Button className="bg-primary text-white hover:bg-primary-hover px-8 py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                                    Continue Application <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                                <div className="text-slate-500 font-bold text-sm bg-white/5 px-6 py-4 rounded-2xl border border-white/5">
                                    Application ID: <span className="text-slate-300">#PHD-2026-9812</span>
                                </div>
                            </div>
                        </div>

                        <div className="hidden lg:block relative">
                            <div className="w-56 h-56 rounded-[3rem] border-8 border-white/5 flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 animate-pulse" />
                                <div className="z-10 text-center">
                                    <p className="text-4xl font-black text-white">65<span className="text-lg opacity-50">%</span></p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Profile Strength</p>
                                </div>
                                <svg className="absolute inset-0 w-full h-full -rotate-90">
                                    <circle cx="50%" cy="50%" r="48%" stroke="currentColor" strokeWidth="8" fill="none" className="text-white/5" />
                                    <circle cx="50%" cy="50%" r="48%" stroke="currentColor" strokeWidth="8" fill="none" className="text-emerald-500" strokeDasharray="300" strokeDashoffset="100" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stat Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard icon={Target} label="Application Status" value="In Progress" color="bg-blue-500" />
                    <StatCard icon={Calendar} label="Exam Date" value="Not Scheduled" color="bg-amber-500" />
                    <StatCard icon={ShieldCheck} label="Verification" value="6/8 Verified" color="bg-emerald-500" />
                    <StatCard icon={Bell} label="Notifications" value="2 New Alerts" color="bg-rose-500" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Progress Timeline */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Milestones</h3>
                            <Badge variant="outline" className="text-[10px] font-black tracking-widest px-3 border-slate-200">STEP-BY-STEP GUIDE</Badge>
                        </div>

                        <Card className="border-none shadow-xl border border-slate-100 overflow-hidden rounded-[2.5rem]">
                            <CardContent className="p-10">
                                <div className="space-y-0 relative">
                                    {timeline.map((item, index) => {
                                        const StepIcon = item.icon;
                                        return (
                                            <div key={item.id} className="group relative flex gap-8 pb-12 last:pb-0">
                                                {/* Connecting Line */}
                                                {index !== timeline.length - 1 && (
                                                    <div className="absolute left-[23px] top-[46px] bottom-[-10px] w-0.5 bg-slate-100 group-hover:bg-primary/20 transition-colors" />
                                                )}

                                                <div className={cn(
                                                    "z-10 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 hover:scale-110",
                                                    getStatusStyles(item.status)
                                                )}>
                                                    <StepIcon className="h-5 w-5" />
                                                </div>

                                                <div className="flex-1 pt-1">
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                                        <h4 className={cn(
                                                            "text-lg font-black tracking-tight transition-colors",
                                                            item.status === 'locked' ? "text-slate-400" : "text-slate-800"
                                                        )}>
                                                            {item.label}
                                                        </h4>
                                                        {item.date && (
                                                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-100">
                                                                <Clock className="h-3 w-3 text-slate-400" />
                                                                <span className="text-[10px] font-bold text-slate-500">{item.date}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-md">
                                                        {item.desc}
                                                    </p>

                                                    {item.status === 'current' && (
                                                        <motion.div
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            className="mt-6 flex flex-wrap gap-3"
                                                        >
                                                            <Button
                                                                className="bg-slate-900 text-white hover:bg-slate-800 px-6 h-10 rounded-xl font-bold shadow-lg shadow-slate-200 transition-all text-xs"
                                                                onClick={() => {
                                                                    if (item.id === 2) navigate("/payment")
                                                                    if (item.id === 3) navigate("/application")
                                                                    if (item.id === 1) navigate("/register")
                                                                }}
                                                            >
                                                                Complete Action <ChevronRight className="h-4 w-4 ml-1" />
                                                            </Button>
                                                            <Button variant="ghost" className="h-10 text-slate-500 font-bold text-xs px-6 border border-slate-100 hover:bg-slate-50 rounded-xl">
                                                                View Details
                                                            </Button>
                                                        </motion.div>
                                                    )}

                                                    {item.status === 'locked' && (
                                                        <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                                            <div className="h-px w-8 bg-slate-100" /> Prerequisites Required
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        <div className="px-2">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Financial Summary</h3>
                        </div>

                        <Card className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white border-none shadow-2xl rounded-[2.5rem] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                            <CardContent className="p-8">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10">
                                        <CreditCard className="text-white h-7 w-7" />
                                    </div>
                                    <div>
                                        <p className="text-emerald-100/60 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Total Fee Amount</p>
                                        <h4 className="text-3xl font-black tracking-tighter">₹ 1,770.00</h4>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center bg-black/10 px-6 py-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                                        <span className="text-xs font-bold uppercase tracking-widest opacity-60">Status</span>
                                        <div className="flex items-center gap-2">
                                            <div className={cn("h-2 w-2 rounded-full", steps.payment === 'success' ? "bg-emerald-300 animate-pulse" : "bg-amber-300")} />
                                            <span className="font-black text-xs uppercase tracking-tight">
                                                {steps.payment === 'success' ? 'Settled' : 'Action Required'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Download Application Form - Always visible */}
                                    <Button
                                        onClick={() => {
                                            // Download application form as PDF
                                            const formData = getStoredFormData();
                                            if (formData && formData.personal?.firstName) {
                                                downloadApplicationFormPDF(formData);
                                            } else {
                                                // Navigate to application form if no data
                                                navigate('/application');
                                            }
                                        }}
                                        className="w-full bg-white/90 text-emerald-700 hover:bg-white h-14 rounded-2xl font-black shadow-lg shadow-emerald-900/10 text-xs transition-transform hover:scale-[1.02] active:scale-95 border-2 border-emerald-100 mt-3"
                                    >
                                        <FileText className="h-4 w-4 mr-2" />
                                        {steps.application === 'completed' ? 'Download Application Form' : 'Fill Application Form'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Resources */}
                        <div className="space-y-4">
                            <div className="px-2">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Preparation Resources</h4>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {[
                                    { icon: BookOpen, title: "Exam Prep Kit", desc: "Syllabus & Samples", color: "text-blue-600", bg: "bg-blue-50", onClick: () => { } },
                                    { icon: Download, title: "Admission Guidebook", desc: "Complete PDF Guide", color: "text-purple-600", bg: "bg-purple-50", onClick: () => { } },
                                ].map((tool, i) => (
                                    <button
                                        key={i}
                                        onClick={tool.onClick}
                                        className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl hover:border-primary/30 hover:shadow-xl hover:shadow-slate-100 transition-all text-left group"
                                    >
                                        <div className={cn("p-3 rounded-xl transition-colors group-hover:bg-white", tool.bg, tool.color)}>
                                            <tool.icon className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h5 className="font-bold text-slate-800 text-sm">{tool.title}</h5>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{tool.desc}</p>
                                        </div>
                                        <ChevronRight className="h-3 w-3 text-slate-300 group-hover:text-primary transition-colors" />
                                    </button>
                                ))}

                                {/* Download Application Form - Always visible */}
                                <button
                                    onClick={() => {
                                        const formData = getStoredFormData();
                                        if (formData && formData.personal?.firstName) {
                                            downloadApplicationFormPDF(formData);
                                        } else if (steps.application === 'completed') {
                                            alert('No application data found in storage.');
                                        } else {
                                            navigate('/application');
                                        }
                                    }}
                                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 border-2 border-emerald-200 rounded-2xl hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-100 transition-all text-left group"
                                >
                                    <div className="p-3 rounded-xl bg-white text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <h5 className="font-bold text-emerald-800 text-sm">Application Form</h5>
                                        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">
                                            {steps.application === 'completed' ? 'Download PDF' : 'View Form'}
                                        </p>
                                    </div>
                                    <Download className="h-4 w-4 text-emerald-400 group-hover:text-emerald-600 transition-colors" />
                                </button>
                            </div>
                        </div>

                        {/* Help Banner */}
                        <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 text-center relative overflow-hidden">
                            <div className="relative z-10">
                                <h4 className="text-slate-800 font-black mb-2">Need Assistance?</h4>
                                <p className="text-slate-400 text-xs font-bold leading-relaxed mb-6">Our academic counselors are available 24/7 to help you with your application.</p>
                                <Button className="w-full bg-white text-slate-800 border-2 border-slate-200 hover:border-primary hover:text-primary h-12 rounded-xl font-bold shadow-sm transition-all">
                                    Chat with Support
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper >
    )
}
