import React from "react";
import { User, MapPin, ShieldCheck } from "lucide-react";

interface PersonalInfoFormProps {
    data: any;
    addressData: any;
    onChange: (section: string, field: string, value: any) => void;
    /** When set, name (firstName), email, and phone are prefilled and read-only (from registration). */
    readOnlyFromRegistration?: { name: string; email: string; phone: string };
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ data, addressData, onChange, readOnlyFromRegistration }) => {
    const ro = readOnlyFromRegistration;

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700 pb-12">
            {/* APPLICANT IDENTITY SECTION */}
            <div className="bg-white border-2 border-slate-100 overflow-hidden rounded-xl shadow-sm">
                <div className="bg-slate-50 px-8 py-4 border-b-2 border-slate-100 flex items-center justify-between">
                    <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-[#004C91]" />
                        Applicant Identity & Personal Details
                    </h3>
                    <div className="hidden sm:block h-1 w-20 bg-[#004C91]/20 rounded-full" />
                </div>

                <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {/* Full Name */}
                    <div className="md:col-span-2 space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">
                            Name of the Applicant <span className="text-rose-500 font-bold">*</span>
                            <span className="text-[9px] font-bold text-slate-400 normal-case italic ml-2">(As it appears in Class X or equivalent marks card)</span>
                        </label>
                        <input
                            type="text"
                            placeholder="FULL NAME"
                            value={ro ? ro.name : (data.firstName || "")}
                            onChange={(e) => onChange("personal", "firstName", e.target.value)}
                            readOnly={!!ro}
                            className={`w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#004C91] focus:bg-white outline-none transition-all font-bold text-slate-700 tracking-wide uppercase ${ro ? 'cursor-not-allowed opacity-75' : ''}`}
                            required
                        />
                    </div>

                    {/* Parent Name */}
                    <div className="md:col-span-2 space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">
                            Parent / Guardian Name <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="PARENT / GUARDIAN NAME"
                            value={data.parentName || ""}
                            onChange={(e) => onChange("personal", "parentName", e.target.value)}
                            className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#004C91] focus:bg-white outline-none transition-all font-bold text-slate-700 tracking-wide uppercase"
                            required
                        />
                    </div>

                    {/* Phone Numbers */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">
                            Mobile Number <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <input
                            type="tel"
                            placeholder="10-DIGIT NUMBER"
                            maxLength={10}
                            value={ro ? ro.phone : (data.studentPh ?? data.phone ?? data.studentPhone ?? "")}
                            onChange={(e) => onChange("personal", "phone", e.target.value)}
                            readOnly={!!ro}
                            className={`w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#004C91] focus:bg-white outline-none transition-all font-bold text-slate-700 tracking-widest ${ro ? 'cursor-not-allowed opacity-75' : ''}`}
                            required
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">
                            Parent / Guardian Mobile <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <input
                            type="tel"
                            placeholder="10-DIGIT NUMBER"
                            maxLength={10}
                            value={data.parentPhone}
                            onChange={(e) => onChange("personal", "parentPhone", e.target.value)}
                            className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#004C91] focus:bg-white outline-none transition-all font-bold text-slate-700 tracking-widest"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="md:col-span-2 space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">
                            Email ID <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <input
                            type="email"
                            placeholder="OFFICIAL EMAIL ADDRESS"
                            value={ro ? ro.email : (data.email || "")}
                            onChange={(e) => onChange("personal", "email", e.target.value)}
                            readOnly={!!ro}
                            className={`w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#004C91] focus:bg-white outline-none transition-all font-bold text-slate-700 tracking-widest uppercase ${ro ? 'cursor-not-allowed opacity-75' : ''}`}
                            required
                        />
                    </div>

                    {/* DOB & Gender */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">
                            Date of Birth <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <input
                            type="date"
                            value={data.dob}
                            onChange={(e) => onChange("personal", "dob", e.target.value)}
                            className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#004C91] focus:bg-white outline-none transition-all font-bold text-slate-700 uppercase cursor-pointer"
                            required
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">
                            Gender (TICK) <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { label: 'M', value: 'Male' },
                                { label: 'F', value: 'Female' },
                                { label: 'O', value: 'Other' }
                            ].map((g) => (
                                <button
                                    key={g.value}
                                    type="button"
                                    onClick={() => onChange("personal", "gender", g.value)}
                                    className={`py-4 border-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${data.gender === g.value ? 'bg-[#004C91] text-white border-[#004C91]' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-300'}`}
                                >
                                    {g.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Category */}
                    <div className="md:col-span-2 space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">
                            Category Selection (TICK) <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <div className="grid grid-cols-5 gap-3">
                            {[
                                { label: 'BC', value: 'General' },
                                { label: 'SC', value: 'SC' },
                                { label: 'ST', value: 'ST' },
                                { label: 'PWD', value: 'EWS' },
                                { label: 'OTHERS', value: 'Other' }
                            ].map((cat) => (
                                <button
                                    key={cat.value}
                                    type="button"
                                    onClick={() => onChange("personal", "category", cat.value)}
                                    className={`py-3 border-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${data.category === cat.value ? 'bg-[#004C91] text-white border-[#004C91]' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-300'}`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ADDRESS FOR CORRESPONDENCE */}
            <div className="bg-white border-2 border-slate-100 overflow-hidden rounded-xl shadow-sm">
                <div className="bg-slate-50 px-8 py-4 border-b-2 border-slate-100 flex items-center justify-between">
                    <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-[#8BB723]" />
                        Address for Correspondence
                    </h3>
                    <div className="hidden sm:block h-1 w-20 bg-[#8BB723]/20 rounded-full" />
                </div>

                <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="md:col-span-2 lg:col-span-3 space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">
                            Door / House No. & Street Name <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="HOUSE NO, STREET, MANDAL"
                            value={addressData.street}
                            onChange={(e) => onChange("address", "street", e.target.value)}
                            className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#8BB723] focus:bg-white outline-none transition-all font-bold text-slate-700 tracking-widest uppercase"
                            required
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">
                            Town / City <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="CITY"
                            value={addressData.city}
                            onChange={(e) => onChange("address", "city", e.target.value)}
                            className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#8BB723] focus:bg-white outline-none transition-all font-bold text-slate-700 tracking-widest uppercase"
                            required
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">
                            State <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="STATE"
                            value={addressData.state}
                            onChange={(e) => onChange("address", "state", e.target.value)}
                            className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#8BB723] focus:bg-white outline-none transition-all font-bold text-slate-700 tracking-widest uppercase"
                            required
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">
                            Pincode <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="6-DIGIT PIN"
                            maxLength={6}
                            value={addressData.pincode}
                            onChange={(e) => onChange("address", "pincode", e.target.value)}
                            className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#8BB723] focus:bg-white outline-none transition-all font-bold text-slate-700 tracking-[0.3em]"
                            required
                        />
                    </div>

                    <div className="md:col-span-2 lg:col-span-3">
                        <div className="mt-8 flex items-start gap-4 p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl">
                            <ShieldCheck className="h-6 w-6 text-[#004C91] shrink-0" />
                            <div>
                                <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-wider mb-1">Declaration</h4>
                                <p className="text-[9px] font-bold text-slate-500 leading-relaxed uppercase tracking-widest">
                                    I hereby declare that all the information given by me is true and correct to the best of my knowledge and belief.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalInfoForm;
