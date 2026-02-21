import React, { useState } from "react";
import { downloadApplicationFormPDF } from "../../utils/pdfGenerator";
import { CreditCard, CheckCircle, Smartphone, User, Home, BookOpen, GraduationCap, Download, Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";

interface ReviewFormProps {
    data: any;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ data }) => {
    const [isDownloading, setIsDownloading] = useState(false);

    // Helper to render letter boxes like the PDF
    // REFINED: Renders exactly as many boxes as there are characters unless fixedCount is provided.
    const LetterBox = ({ text, fixedCount }: { text: string | undefined, fixedCount?: number }) => {
        const val = (text || "").toUpperCase();
        const count = fixedCount !== undefined ? fixedCount : val.length;

        // Don't render any boxes if count is 0 and no fixed requirement
        if (count === 0 && fixedCount === undefined) return null;

        const letters = val.split("");
        return (
            <div className="flex flex-wrap gap-1 mt-1">
                {Array.from({ length: count }).map((_, i) => (
                    <div
                        key={i}
                        className="w-6 h-7 border border-slate-400 bg-white flex items-center justify-center text-[11px] font-bold text-slate-800"
                    >
                        {letters[i] || ""}
                    </div>
                ))}
            </div>
        );
    };

    // Helper for tick boxes
    const TickBox = ({ label, isChecked }: { label: string, isChecked: boolean }) => (
        <div className="flex items-center gap-1">
            <div className={`w-4 h-4 border-2 ${isChecked ? 'border-[#004C91] bg-[#004C91]' : 'border-slate-400'} flex items-center justify-center`}>
                {isChecked && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
            </div>
            <span className="text-[10px] font-bold text-slate-700 uppercase">{label}</span>
        </div>
    );

    const handleDownload = async () => {
        try {
            setIsDownloading(true);
            toast.loading("Generating your official application PDF...", { id: "pdf-gen" });
            await downloadApplicationFormPDF(data);
            toast.success("Application Form downloaded successfully", { id: "pdf-gen" });
        } catch (error) {
            console.error("PDF Generation error:", error);
            toast.error("Failed to generate PDF. Please try again.", { id: "pdf-gen" });
        } finally {
            setIsDownloading(false);
        }
    };

    const isPolytechnic = data.education?.educationType === "polytechnic";

    return (
        <div className="bg-[#fbfcfa] p-4 md:p-8 min-h-screen">
            {/* OFFICIAL FORM WRAPPER */}
            <div className="max-w-4xl mx-auto bg-[#fafdef] border-[3px] border-slate-400 shadow-2xl p-6 md:p-10 relative overflow-hidden">

                {/* PDF HEADER SECTION */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b-2 border-slate-300 pb-8 mb-8">
                    {/* ACCREDITATION LOGOS */}
                    <div className="flex gap-2">
                        <div className="w-14 h-14 border border-slate-300 rounded flex flex-col items-center justify-center bg-white p-1">
                            <span className="text-[8px] font-black text-slate-400">ABET</span>
                        </div>
                        <div className="w-14 h-14 border border-slate-300 rounded flex flex-col items-center justify-center bg-white p-1">
                            <span className="text-[8px] font-black text-slate-400 text-center">NAAC A+</span>
                        </div>
                        <div className="w-14 h-14 border border-slate-300 rounded flex flex-col items-center justify-center bg-white p-1">
                            <span className="text-[8px] font-black text-slate-400">NIRF</span>
                            <span className="text-[10px] font-bold text-[#b91c1c]">72</span>
                        </div>
                    </div>

                    {/* CENTER BRANDING */}
                    <div className="flex-1 text-center px-4">
                        <div className="flex flex-col items-center">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 bg-[#004C91] rounded-full flex items-center justify-center shadow-md">
                                    <GraduationCap className="h-7 w-7 text-white" />
                                </div>
                                <h1 className="text-3xl font-black text-[#b91c1c] tracking-tighter uppercase italic">Vignan's</h1>
                            </div>
                            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest leading-none mb-1">FOUNDATION FOR SCIENCE, TECHNOLOGY & RESEARCH</p>
                            <p className="text-[7px] font-bold text-slate-500 uppercase tracking-tighter">(Deemed to be University) - Estd. u/s 3 of UGC Act 1956</p>
                            <div className="w-full h-1 bg-gradient-to-r from-[#004C91] via-[#8BB723] to-[#004C91] mt-2 shadow-sm" />
                        </div>
                        <h2 className="mt-6 text-2xl font-black text-slate-900 tracking-[0.3em] uppercase underline decoration-4 underline-offset-8 decoration-slate-300">Application Form</h2>
                    </div>

                    {/* APP NUMBER BOX */}
                    <div className="space-y-4">
                        <div className="w-44 border-2 border-slate-800 p-2 text-center bg-white">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 border-b border-slate-100 pb-1">Application Number</p>
                            <span className="text-xl font-black text-[#004C91] tracking-[0.2em]">{data.personal.phone?.slice(-4) || '2026'}V-SAT</span>
                        </div>
                        <div className="w-44 h-44 border-2 border-dashed border-slate-400 flex flex-col items-center justify-center bg-slate-50 relative group">
                            <div className="absolute inset-2 border border-slate-200"></div>
                            <User className="h-12 w-12 text-slate-200 mb-2" />
                            <p className="text-[8px] font-black text-slate-400 uppercase text-center px-4 tracking-tighter italic">Paste your recent passport size photograph here</p>
                        </div>
                    </div>
                </div>

                {/* GREEN INSTRUCTION BANNER */}
                <div className="bg-[#8BB723] text-white p-3 text-center mb-10 shadow-lg -mx-10 relative">
                    <div className="absolute left-0 top-0 w-3 h-full bg-black/10"></div>
                    <div className="absolute right-0 top-0 w-3 h-full bg-black/10"></div>
                    <p className="text-[11px] font-black uppercase tracking-[0.2em]">Read detailed instructions given separately before filling the application form</p>
                </div>

                {/* FORM FIELDS - GRID STYLE */}
                <div className="space-y-10">
                    {/* MOBILE CONTACT SECTION */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="text-[10px] font-black text-[#004C91] uppercase tracking-widest flex items-center gap-2 mb-2">
                                <Smartphone className="h-3 w-3" /> 01. Mobile Number
                            </label>
                            <LetterBox text={(data.personal.phone || "").slice(-10)} fixedCount={10} />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-[#004C91] uppercase tracking-widest flex items-center gap-2 mb-2">
                                <Smartphone className="h-3 w-3" /> 02. Parent Mobile Number
                            </label>
                            <LetterBox text={(data.personal.parentPhone || "").slice(-10)} fixedCount={10} />
                        </div>
                    </div>

                    {/* APPLICANT NAME */}
                    <div>
                        <label className="text-[10px] font-black text-[#004C91] uppercase tracking-widest flex items-center gap-2 mb-2">
                            <User className="h-3 w-3" /> 03. Name of the Applicant <span className="text-[9px] lowercase italic text-slate-400 font-normal tracking-normal">(As it appears in Class X/Equivalent)</span>
                        </label>
                        <LetterBox text={`${data.personal.firstName || ""} ${data.personal.lastName || ""}`.trim()} />
                    </div>

                    {/* PARENT NAME */}
                    <div>
                        <label className="text-[10px] font-black text-[#004C91] uppercase tracking-widest flex items-center gap-2 mb-2">
                            <User className="h-3 w-3" /> 04. Name of the Parent / Guardian
                        </label>
                        <LetterBox text={(data.personal.parentName || data.personal.lastName || "").trim()} />
                    </div>

                    {/* ADDRESS SECTION */}
                    <div>
                        <label className="text-[10px] font-black text-[#004C91] uppercase tracking-widest flex items-center gap-2 mb-2">
                            <Home className="h-3 w-3" /> 05. Address for Correspondence
                        </label>
                        <div className="space-y-4">
                            <LetterBox text={(data.address.street || "").trim()} />
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Town / City</label>
                                    <LetterBox text={(data.address.city || "").trim()} />
                                </div>
                                <div>
                                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">State</label>
                                    <LetterBox text={(data.address.state || "").trim()} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Pincode</label>
                                    <LetterBox text={(data.address.pincode || "").trim()} fixedCount={6} />
                                </div>
                                <div>
                                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Email ID</label>
                                    <div className="mt-1 px-3 py-2 border border-slate-400 bg-white font-bold text-xs text-slate-700 min-h-[30px]">
                                        {data.personal.email || "N/A"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* IDENTITY BITS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 border-t border-slate-200">
                        <div>
                            <label className="text-[10px] font-black text-[#004C91] uppercase tracking-widest mb-2 block">06. Date of Birth</label>
                            <div className="flex gap-2">
                                {data.personal.dob?.split('-').reverse().map((part: string, i: number) => (
                                    <div key={i} className="flex gap-1">
                                        {part.split('').map((char: string, j: number) => (
                                            <div key={j} className="w-6 h-7 border border-slate-400 bg-white flex items-center justify-center text-xs font-bold text-[#004C91]">
                                                {char}
                                            </div>
                                        ))}
                                        {i < 2 && <span className="text-slate-400 font-bold">/</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-[#004C91] uppercase tracking-widest mb-3 block">07. Gender (Tick)</label>
                            <div className="flex gap-4">
                                <TickBox label="M" isChecked={data.personal.gender === "Male" || data.personal.gender === "M"} />
                                <TickBox label="F" isChecked={data.personal.gender === "Female" || data.personal.gender === "F"} />
                                <TickBox label="O" isChecked={data.personal.gender === "Other" || data.personal.gender === "O"} />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-[#004C91] uppercase tracking-widest mb-3 block">08. Category (Tick)</label>
                            <div className="flex flex-wrap gap-x-4 gap-y-2">
                                <TickBox label="BC" isChecked={data.personal.category === "BC"} />
                                <TickBox label="SC" isChecked={data.personal.category === "SC"} />
                                <TickBox label="ST" isChecked={data.personal.category === "ST"} />
                                <TickBox label="OTHERS" isChecked={!["BC", "SC", "ST"].includes(data.personal.category)} />
                            </div>
                        </div>
                    </div>

                    {/* EDUCATION SUMMARY - DYNAMIC BOXED STYLE */}
                    <div className="pt-6 border-t border-slate-200">
                        <label className="text-[10px] font-black text-[#004C91] uppercase tracking-widest flex items-center gap-2 mb-6">
                            <BookOpen className="h-3 w-3" /> 09. Educational Background
                        </label>
                        <div className="space-y-8">
                            {/* Class X Section */}
                            <div>
                                <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 border-l-4 border-slate-300 pl-2">Class X (SSC/Equivalent) Details</h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block mb-1">School Name</label>
                                        <LetterBox text={(data.education.sscName || "").trim()} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Board</label>
                                            <LetterBox text={(data.education.board || "").trim()} />
                                        </div>
                                        <div>
                                            <label className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Year of Passing / Marks</label>
                                            <LetterBox text={`${data.education.xYearOfPassing || ""} / ${data.education.Marks || ""}`.trim()} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Inter/Diploma Section */}
                            <div>
                                <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 border-l-4 border-slate-300 pl-2">
                                    {isPolytechnic ? 'Diploma (Polytechnic)' : 'Intermediate (10+2)'} Details
                                </h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Institution/College Name</label>
                                        <LetterBox text={(data.education.schoolName || data.education.polytechnicCollege || "").trim()} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Stream / Branch</label>
                                            <LetterBox text={(data.education.interStream || data.education.polytechnicBranch || "").trim()} />
                                        </div>
                                        <div>
                                            <label className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Percentage / CGPA</label>
                                            <LetterBox text={`${data.education.percentage || data.education.polytechnicPercentage || "0"}%`.trim()} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* B.Tech Details (Conditional) */}
                            {data.btechEducation?.university && (
                                <div>
                                    <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 border-l-4 border-slate-300 pl-2">Undergraduate (B.Tech) Details</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block mb-1">University Name</label>
                                            <LetterBox text={(data.btechEducation.university || "").trim()} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Degree / College</label>
                                                <LetterBox text={(data.btechEducation.college || "").trim()} />
                                            </div>
                                            <div>
                                                <label className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Year of Passing / CGPA</label>
                                                <LetterBox text={`${data.btechEducation.yearOfPassing || ""} / ${data.btechEducation.cgpa || ""}`.trim()} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* M.Tech Details (Conditional) */}
                            {data.mtechEducation?.university && (
                                <div>
                                    <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 border-l-4 border-slate-300 pl-2">Postgraduate (M.Tech) Details</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block mb-1">University Name</label>
                                            <LetterBox text={(data.mtechEducation.university || "").trim()} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block mb-1">College / Specialization</label>
                                                <LetterBox text={(data.mtechEducation.college || data.mtechEducation.specialization || "").trim()} />
                                            </div>
                                            <div>
                                                <label className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Year of Passing / CGPA</label>
                                                <LetterBox text={`${data.mtechEducation.yearOfPassing || ""} / ${data.mtechEducation.cgpa || ""}`.trim()} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* PAYMENT STATUS SECTION - REQUESTED */}
                    <div className="mt-12 pt-10 border-t-4 border-[#004C91]">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                            <div className="space-y-4 flex-1">
                                <label className="text-[11px] font-black text-[#004C91] uppercase tracking-[0.2em] flex items-center gap-2">
                                    <CreditCard className="h-4 w-4" /> 10. Payment Status & Transaction Details
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-4 border-2 border-slate-200 rounded-xl bg-white">
                                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-1">Transaction ID</p>
                                        <p className="text-sm font-black text-slate-800 font-mono">{data.payment.transactionId || "VSAT-PENDING-XXXX"}</p>
                                    </div>
                                    <div className="p-4 border-2 border-slate-200 rounded-xl bg-white flex items-center justify-between">
                                        <div>
                                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-1">Payment Status</p>
                                            <p className={`text-sm font-black uppercase ${data.payment.paymentStatus === "completed" ? "text-emerald-600" : "text-amber-600"}`}>
                                                {data.payment.paymentStatus || "PENDING"}
                                            </p>
                                        </div>
                                        {data.payment.paymentStatus === "completed" && <CheckCircle className="h-6 w-6 text-emerald-500" />}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-600 italic">
                                    <p>Date: {new Date().toLocaleDateString()}</p>
                                    <p>Amount: ₹{data.payment.amount || '1200.00'}</p>
                                </div>
                            </div>

                            <div className="w-full md:w-64 space-y-2">
                                <div className="h-24 border-2 border-slate-300 rounded flex flex-col items-center justify-center bg-slate-50 relative">
                                    <div className="absolute top-1 left-2 text-[8px] font-black text-slate-300 uppercase">Signature</div>
                                    <p className="text-[10px] font-bold text-slate-300/50 italic select-none">DIGITALLY VERIFIED</p>
                                </div>
                                <p className="text-[9px] font-black text-center text-slate-400 uppercase tracking-widest">Signature of Applicant</p>
                            </div>
                        </div>
                    </div>
                    {/* DOCUMENTS SECTION */}
                    {data.documents?.files && Object.keys(data.documents.files).length > 0 && (
                        <div className="pt-6 border-t border-slate-200">
                            <label className="text-[10px] font-black text-[#004C91] uppercase tracking-widest flex items-center gap-2 mb-6">
                                <UploadCloud className="h-3 w-3" /> 11. Documents Uploaded
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Object.entries(data.documents.files).map(([key, file]: [string, any]) => (
                                    <div key={key} className="p-3 border border-slate-200 rounded-lg bg-white flex items-center gap-3">
                                        <div className="h-8 w-8 rounded bg-emerald-50 flex items-center justify-center shrink-0">
                                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">
                                                {key === 'ssc' ? '10th Class Memo' :
                                                    key === 'inter' ? 'Intermediate Memo' :
                                                        key === 'ug' ? 'UG Degree/B.Tech' :
                                                            key === 'pg' ? 'PG Degree/M.Tech' : 'Additional Document'}
                                            </p>
                                            <p className="text-[10px] font-bold text-slate-700 truncate uppercase mt-0.5">{file.name}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* DECORATIVE ELEMENTS */}
                <div className="absolute left-0 bottom-0 py-8 px-2 flex flex-col items-center justify-center opacity-20 pointer-events-none">
                    <p className="text-[14px] font-black text-slate-400 uppercase tracking-[1em] rotate-180 [writing-mode:vertical-lr]">V-SAT 2026</p>
                </div>
            </div>

            {/* DOWNLOAD TRIGGER */}
            <div className="max-w-4xl mx-auto mt-10 flex flex-col items-center gap-4">
                <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="group relative flex items-center gap-3 px-10 py-4 bg-[#004C91] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-900/20 hover:bg-[#003a6e] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isDownloading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5 group-hover:bounce" />}
                    {isDownloading ? "Generating PDF..." : "Download Official Application Form"}
                    <div className="absolute inset-0 rounded-2xl border-2 border-white/20 scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all"></div>
                </button>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest italic">Professional Multi-Page A4 PDF • Institutional Format</p>
            </div>
        </div>
    );
};

export default ReviewForm;
