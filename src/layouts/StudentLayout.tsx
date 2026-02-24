import { Outlet, useNavigate, useLocation } from "react-router-dom"
import {
    LogOut,
    ShieldCheck,
    Bell,
    LayoutDashboard,
    User,
    FileText,
    MessageSquare,
} from "lucide-react"
import { useSteps } from "../store/StepContext"
import { useAuth } from "../contexts/AuthContext"
import { cn } from "../lib/utils"

const WORKFLOW_NAV = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/profile", label: "My Profile", icon: User },
    { path: "/application", label: "Application", icon: FileText },
    { path: "/messages", label: "Messages", icon: MessageSquare },
]

export function StudentLayout() {
    const navigate = useNavigate()
    const location = useLocation()
    const { logout: logoutSteps, canAccess } = useSteps()
    const { user, logout: logoutAuth } = useAuth()


    const handleLogout = () => {
        logoutAuth(); // Logout from AuthContext
        logoutSteps(); // Reset steps found in StepContext
        navigate("/");
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200">
                <div className="max-w-[1200px] px-8 flex h-16 items-center justify-between mx-auto">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/dashboard")}>
                            <div className="h-9 w-9 rounded-lg bg-slate-900 flex items-center justify-center transition-all group-hover:scale-105">
                                <ShieldCheck className="text-white h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">Vignan</span>
                                <span className="text-[8px] uppercase tracking-[0.3em] font-bold text-slate-400 mt-1">PhD Admissions Portal</span>
                            </div>
                        </div>
                        <nav className="hidden md:flex items-center gap-1 border-l border-slate-200 pl-6">
                            {WORKFLOW_NAV.map((item) => {
                                const isActive = location.pathname === item.path || (item.path !== "/dashboard" && location.pathname.startsWith(item.path))
                                const enabled = canAccess(item.path)
                                return (
                                    <button
                                        key={item.path}
                                        onClick={() => enabled && navigate(item.path)}
                                        disabled={!enabled}
                                        className={cn(
                                            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                            isActive ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50",
                                            !enabled && "opacity-50 cursor-not-allowed hover:bg-transparent"
                                        )}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        {item.label}
                                    </button>
                                )
                            })}
                        </nav>
                    </div>

                    <div className="flex items-center gap-1">
                        <button className="h-9 w-9 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-colors relative">
                            <Bell className="h-4 w-4" />
                            <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 bg-rose-500 rounded-full border border-white" />
                        </button>

                        <div className="h-6 w-px bg-slate-200 mx-2" />

                        <div className="flex items-center gap-3 pr-2">
                            <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-[#1E3A8A] text-xs font-bold">
                                {user?.name ? user.name.charAt(0).toUpperCase() + (user.name.split(' ')[1]?.charAt(0).toUpperCase() || '') : 'ST'}
                            </div>
                            <div className="hidden lg:block">
                                <p className="text-sm font-semibold text-slate-900 leading-tight">{user?.name || "Student"}</p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="h-9 w-9 rounded-lg hover:bg-rose-50 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all"
                        >
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-[1200px] px-8 py-8 mx-auto w-full">
                <Outlet />
            </main>

            <footer className="bg-white border-t border-slate-100 py-12 mt-20">
                <div className="container px-4 mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-3 grayscale opacity-50">
                            <ShieldCheck className="h-6 w-6 text-slate-900" />
                            <span className="font-bold tracking-tighter text-slate-900">Vignan PhD Portal</span>
                        </div>
                        <div className="flex gap-8 text-sm font-bold text-slate-400 uppercase tracking-widest text-[10px]">
                            <a href="#" className="hover:text-primary transition-colors">Privacy Charter</a>
                            <a href="#" className="hover:text-primary transition-colors">Candidate Terms</a>
                            <a href="#" className="hover:text-primary transition-colors">Grievance Cell</a>
                        </div>
                        <p className="text-xs font-medium text-slate-400">
                            © 2026 Vignan Institutes of Technology.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
