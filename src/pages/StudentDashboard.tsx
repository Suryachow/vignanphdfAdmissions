import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApplicationPreview from './ApplicationPreview';
import {
    FileText,
    Award,
    Users,
    MapPin,
    BookOpen,
    CheckCircle,
    Clock,
    AlertCircle,
    ArrowRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

export const StudentDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [showPreview, setShowPreview] = useState(false);
    const { user } = useAuth();

    // Mock step - usually this comes from backend
    const currentStep = 1;

    const steps = [
        { name: 'Application', icon: FileText },
        { name: 'Approval', icon: CheckCircle },
        { name: 'Result', icon: Award },
        { name: 'Counseling', icon: Users },
        { name: 'Fee', icon: FileText },
        { name: 'Seat', icon: MapPin },
        { name: 'Enrollment', icon: BookOpen }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="border-b border-slate-200 pb-8 mt-2">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">
                    Welcome, {user?.name?.split(' ')[0] || 'Student'}
                </h1>
                <p className="text-slate-500 text-sm font-medium">
                    Track your admission progress and manage your application from a single workspace.
                </p>
            </div>

            {/* Application Progress Section */}
            <section className="space-y-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Application Progress</h2>
                <div className="bg-white border border-slate-200 rounded-xl p-10 relative overflow-hidden shadow-sm">
                    <div className="relative flex justify-between items-center max-w-5xl mx-auto">
                        {/* Connecting Line */}
                        <div className="absolute top-[20px] left-0 right-0 h-[2px] bg-slate-100 -z-0" />

                        {steps.map((s, idx) => {
                            const isCompleted = idx < currentStep;
                            const isActive = idx === currentStep - 1;

                            return (
                                <div key={idx} className="flex flex-col items-center gap-4 relative z-10 bg-white px-2">
                                    <div className={cn(
                                        "h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 border",
                                        isActive ? "bg-[#2563EB] text-white border-[#2563EB] shadow-lg shadow-blue-500/20 scale-110" :
                                            isCompleted ? "bg-slate-900 text-white border-slate-900" :
                                                "bg-white border-slate-200 text-slate-400"
                                    )}>
                                        {isCompleted ? <CheckCircle className="h-5 w-5" /> : <s.icon className="h-4 w-4" />}
                                    </div>
                                    <span className={cn(
                                        "text-[10px] font-bold uppercase tracking-wider transition-colors",
                                        isActive ? "text-[#2563EB]" :
                                            isCompleted ? "text-slate-900" : "text-slate-400"
                                    )}>
                                        {s.name}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Action Cards Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ActionCard
                    title="Application Form"
                    description="Update your personal details, academic records, and program preferences."
                    icon={FileText}
                    btnText="Go to Form"
                    onClick={() => navigate('/application')}
                    variant="primary"
                />
                <ActionCard
                    title="Application Preview"
                    description="Review your submitted application summary and verify information."
                    icon={BookOpen}
                    btnText="View Details"
                    onClick={() => setShowPreview(true)}
                    variant="secondary"
                />
            </section>

            {/* Notifications */}
            <section className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <AlertCircle className="h-5 w-5 text-[#2563EB]" />
                    <h2 className="text-lg font-bold text-slate-900">Important Updates</h2>
                </div>
                <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-slate-50/50 rounded-lg border border-slate-100 group hover:border-slate-200 transition-all">
                        <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                            <Clock className="h-4 w-4 text-slate-400" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-900 mb-1">Exam Guidelines Updated</h4>
                            <p className="text-sm text-slate-500 leading-relaxed">Please review the updated exam guidelines and technical requirements before your scheduled date.</p>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3 block">Post 2 hours ago</span>
                        </div>
                    </div>
                </div>
            </section>

            <ApplicationPreview
                open={showPreview}
                onClose={() => setShowPreview(false)}
            />
        </div>
    );
};

interface ActionCardProps {
    title: string;
    description: string;
    icon: any;
    btnText: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    disabled?: boolean;
}

const ActionCard: React.FC<ActionCardProps> = ({ title, description, icon: Icon, btnText, onClick, variant = 'outline', disabled }) => {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-8 flex flex-col h-full hover:bg-slate-50 transition-all group">
            <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-white transition-colors">
                <Icon className="h-5 w-5 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-8 flex-1">
                {description}
            </p>
            <button
                disabled={disabled}
                onClick={onClick}
                className={cn(
                    "w-full py-3.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                    disabled ? "bg-slate-100 text-slate-400 cursor-not-allowed" :
                        variant === 'primary' ? "bg-[#2563EB] text-white hover:bg-blue-700 shadow-md shadow-blue-500/10" :
                            "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-white"
                )}
            >
                {btnText}
                {!disabled && <ArrowRight className="h-3 w-3" />}
            </button>
        </div>
    );
};

export default StudentDashboard;
