import React from "react";
import { GraduationCap, ChevronDown } from "lucide-react";

interface BtechEducationFormProps {
    data: any;
    onChange: (field: string, value: any) => void;
}

const BtechEducationForm: React.FC<BtechEducationFormProps> = ({
    data,
    onChange,
}) => (
    <div className="space-y-10 animate-in fade-in duration-700">
        <div className="bg-white border-2 border-slate-100 overflow-hidden rounded-xl shadow-sm">
            <div className="bg-slate-50 px-8 py-4 border-b-2 border-slate-100 flex items-center justify-between">
                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                    <GraduationCap className="h-3.5 w-3.5 text-[#004C91]" />
                    B.Tech Education Details
                </h3>
                <div className="hidden sm:block h-1 w-20 bg-[#004C91]/20 rounded-full" />
            </div>

            <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                {/* University Name & College Name */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">
                        University Name <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="NAME OF THE UNIVERSITY"
                        value={data.university}
                        onChange={(e) => onChange("university", e.target.value)}
                        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#004C91] focus:bg-white outline-none transition-all font-bold text-slate-700 tracking-wide uppercase"
                        required
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">
                        College Name <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="NAME OF THE COLLEGE"
                        value={data.college}
                        onChange={(e) => onChange("college", e.target.value)}
                        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#004C91] focus:bg-white outline-none transition-all font-bold text-slate-700 tracking-wide uppercase"
                        required
                    />
                </div>

                {/* Degree & Branch */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">
                        Degree <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <div className="relative">
                        <select
                            value={data.degreeType}
                            onChange={(e) => onChange("degreeType", e.target.value)}
                            className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#004C91] focus:bg-white outline-none transition-all font-bold text-slate-700 uppercase appearance-none cursor-pointer"
                            required
                        >
                            <option value="">SELECT DEGREE</option>
                            <option value="B.Tech">B.TECH</option>
                            <option value="B.E">B.E</option>
                            <option value="Other">OTHER</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">
                        Branch / Specialization <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <div className="relative">
                        <select
                            value={data.specialization}
                            onChange={(e) => onChange("specialization", e.target.value)}
                            className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#004C91] focus:bg-white outline-none transition-all font-bold text-slate-700 uppercase appearance-none cursor-pointer"
                            required
                        >
                            <option value="">SELECT BRANCH</option>
                            <option value="cse">CSE (COMPUTER SCIENCE AND ENGINEERING)</option>
                            <option value="cse_aiml">CSE (AI & ML / CYBER SECURITY / DATA SCIENCE / IOT)</option>
                            <option value="ece">ECE</option>
                            <option value="eee">EEE</option>
                            <option value="mech">MECHANICAL</option>
                            <option value="civil">CIVIL</option>
                            <option value="other">OTHER</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                {/* Year of Passing & CGPA */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">
                        Year of Passing <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <div className="relative">
                        <select
                            value={data.yearOfPassing}
                            onChange={(e) => onChange("yearOfPassing", e.target.value)}
                            className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#004C91] focus:bg-white outline-none transition-all font-bold text-slate-700 appearance-none cursor-pointer"
                            required
                        >
                            <option value="">SELECT YEAR</option>
                            {Array.from({ length: 50 }, (_, i) => {
                                const year = new Date().getFullYear() - i;
                                return <option key={year} value={year.toString()}>{year}</option>;
                            })}
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
                        placeholder="ENTER CGPA / PERCENTAGE"
                        value={data.cgpa}
                        onChange={(e) => onChange("cgpa", e.target.value)}
                        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#004C91] focus:bg-white outline-none transition-all font-bold text-slate-700 tracking-widest uppercase"
                        required
                    />
                </div>
            </div>
        </div>
    </div>
);

export default BtechEducationForm;
