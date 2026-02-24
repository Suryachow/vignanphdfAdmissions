import React from "react";
import { School, BookOpen, Building2, ChevronDown } from "lucide-react";

interface EducationFormProps {
    data: any;
    onChange: (field: string, value: any) => void;
}

const EducationForm: React.FC<EducationFormProps> = ({ data, onChange }) => {
    const educationType = data.educationType || "intermediate";

    const handleTypeChange = (type: "intermediate" | "polytechnic") => {
        onChange("educationType", type);
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* 10th Grade Details Section */}
            <div className="bg-white border-2 border-slate-100 overflow-hidden rounded-xl shadow-sm">
                <div className="bg-slate-50 px-8 py-4 border-b-2 border-slate-100 flex items-center justify-between">
                    <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                        <School className="h-3.5 w-3.5 text-[#004C91]" />
                        Secondary Education (Class 10)
                    </h3>
                    <div className="hidden sm:block h-1 w-20 bg-[#004C91]/20 rounded-full" />
                </div>

                <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">
                            School Name <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="NAME OF THE INSTITUTION"
                            value={data.sscName || ""}
                            onChange={(e) => onChange("sscName", e.target.value)}
                            className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#004C91] focus:bg-white outline-none transition-all font-bold text-slate-700 tracking-wide uppercase"
                            required
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">
                            Board <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <div className="relative">
                            <select
                                value={data.Board || ""}
                                onChange={(e) => onChange("Board", e.target.value)}
                                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#004C91] focus:bg-white outline-none transition-all font-bold text-slate-700 uppercase appearance-none cursor-pointer"
                                required
                            >
                                <option value="">Select Board</option>
                                <option value="CBSE">CBSE</option>
                                <option value="ICSE">ICSE</option>
                                <option value="State Board">State Board</option>
                                <option value="IB">IB</option>
                                <option value="Cambridge">Cambridge</option>
                                <option value="Other">Other</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">
                            CGPA / Percentage <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="MARKS / CGPA"
                            value={data.Marks || ""}
                            onChange={(e) => onChange("Marks", e.target.value)}
                            className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#004C91] focus:bg-white outline-none transition-all font-bold text-slate-700 tracking-widest"
                            required
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">
                            Year of Passing <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <div className="relative">
                            <select
                                value={data.xYearOfPassing || ""}
                                onChange={(e) => onChange("xYearOfPassing", e.target.value)}
                                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#004C91] focus:bg-white outline-none transition-all font-bold text-slate-700 tracking-widest appearance-none cursor-pointer"
                                required
                            >
                                <option value="">SELECT YEAR</option>
                                {Array.from({ length: 30 }, (_, i) => {
                                    const year = new Date().getFullYear() - i;
                                    return <option key={year} value={year}>{year}</option>;
                                })}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Post-Secondary Details Section (Switcher) */}
            <div className="bg-white border-2 border-slate-100 overflow-hidden rounded-xl shadow-sm">
                <div className="bg-slate-50 border-b-2 border-slate-100 flex p-2 gap-2">
                    <button
                        type="button"
                        onClick={() => handleTypeChange("intermediate")}
                        className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${educationType === "intermediate"
                            ? "bg-white text-[#004C91] shadow-sm border border-slate-200"
                            : "text-slate-400 hover:text-slate-600 hover:bg-slate-100/50"
                            }`}
                    >
                        <BookOpen className="h-3.5 w-3.5" />
                        Intermediate (12th)
                    </button>
                    <button
                        type="button"
                        onClick={() => handleTypeChange("polytechnic")}
                        className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${educationType === "polytechnic"
                            ? "bg-white text-[#004C91] shadow-sm border border-slate-200"
                            : "text-slate-400 hover:text-slate-600 hover:bg-slate-100/50"
                            }`}
                    >
                        <Building2 className="h-3.5 w-3.5" />
                        Polytechnic (Diploma)
                    </button>
                </div>

                <div className="p-8 md:p-10">
                    {educationType === "intermediate" ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 animate-in fade-in slide-in-from-left-4 duration-500">
                            <div className="md:col-span-2 space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">
                                    College Name <span className="text-rose-500 font-bold">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="NAME OF THE JUNIOR COLLEGE"
                                    value={data.schoolName || ""}
                                    onChange={(e) => onChange("schoolName", e.target.value)}
                                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#004C91] focus:bg-white outline-none transition-all font-bold text-slate-700 tracking-wide uppercase"
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">
                                    Board <span className="text-rose-500 font-bold">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        value={data.interBoard || ""}
                                        onChange={(e) => onChange("interBoard", e.target.value)}
                                        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#004C91] focus:bg-white outline-none transition-all font-bold text-slate-700 uppercase appearance-none cursor-pointer"
                                        required
                                    >
                                        <option value="">SELECT BOARD</option>
                                        <option value="State Board">State Board</option>
                                        <option value="CBSE">CBSE</option>
                                        <option value="ICSE">ICSE</option>
                                        <option value="IB">IB</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">
                                    Stream / Group <span className="text-rose-500 font-bold">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        value={data.interStream || ""}
                                        onChange={(e) => onChange("interStream", e.target.value)}
                                        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#004C91] focus:bg-white outline-none transition-all font-bold text-slate-700 uppercase appearance-none cursor-pointer"
                                        required
                                    >
                                        <option value="">SELECT STREAM</option>
                                        <option value="MPC">MPC (Maths, Physics, Chemistry)</option>
                                        <option value="BiPC">BiPC (Biology, Physics, Chemistry)</option>
                                        <option value="CEC">CEC (Civics, Economics, Commerce)</option>
                                        <option value="MEC">MEC (Maths, Economics, Commerce)</option>
                                        <option value="HEC">HEC (History, Economics, Civics)</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">
                                            Total Marks <span className="text-rose-500 font-bold">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="TOTAL"
                                            value={data.interMarks || ""}
                                            onChange={(e) => onChange("interMarks", e.target.value)}
                                            className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#004C91] focus:bg-white outline-none transition-all font-bold text-slate-700 tracking-widest uppercase"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">
                                            % <span className="text-rose-500 font-bold">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="PERCENTAGE"
                                            value={data.percentage || ""}
                                            onChange={(e) => onChange("percentage", e.target.value)}
                                            className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#004C91] focus:bg-white outline-none transition-all font-bold text-slate-700 tracking-widest uppercase"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="md:col-span-2 space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">
                                    Polytechnic College Name <span className="text-rose-500 font-bold">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="NAME OF THE POLYTECHNIC INSTITUTION"
                                    value={data.polytechnicCollege || ""}
                                    onChange={(e) => onChange("polytechnicCollege", e.target.value)}
                                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#004C91] focus:bg-white outline-none transition-all font-bold text-slate-700 tracking-wide uppercase"
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">
                                    Board / University <span className="text-rose-500 font-bold">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="E.G. SBTET"
                                    value={data.polytechnicBoard || ""}
                                    onChange={(e) => onChange("polytechnicBoard", e.target.value)}
                                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#004C91] focus:bg-white outline-none transition-all font-bold text-slate-700 tracking-widest uppercase"
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">
                                    Branch <span className="text-rose-500 font-bold">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        value={data.polytechnicBranch || ""}
                                        onChange={(e) => onChange("polytechnicBranch", e.target.value)}
                                        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#004C91] focus:bg-white outline-none transition-all font-bold text-slate-700 uppercase appearance-none cursor-pointer"
                                        required
                                    >
                                        <option value="">SELECT BRANCH</option>
                                        <option value="Mechanical">Mechanical Engineering</option>
                                        <option value="Civil">Civil Engineering</option>
                                        <option value="ECE">Electronics (ECE)</option>
                                        <option value="EEE">Electrical (EEE)</option>
                                        <option value="CSE">Computer Science (CSE)</option>
                                        <option value="Chemical">Chemical Engineering</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">
                                    Year of Passing <span className="text-rose-500 font-bold">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        value={data.polytechnicYearOfPassing || ""}
                                        onChange={(e) => onChange("polytechnicYearOfPassing", e.target.value)}
                                        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#004C91] focus:bg-white outline-none transition-all font-bold text-slate-700 tracking-widest appearance-none cursor-pointer"
                                        required
                                    >
                                        <option value="">SELECT YEAR</option>
                                        {Array.from({ length: 30 }, (_, i) => {
                                            const year = new Date().getFullYear() - i;
                                            return <option key={year} value={year}>{year}</option>;
                                        })}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">
                                    Percentage / CGPA <span className="text-rose-500 font-bold">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="ENTER VALUE"
                                    value={data.polytechnicPercentage || ""}
                                    onChange={(e) => onChange("polytechnicPercentage", e.target.value)}
                                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#004C91] focus:bg-white outline-none transition-all font-bold text-slate-700 tracking-widest uppercase"
                                    required
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EducationForm;
