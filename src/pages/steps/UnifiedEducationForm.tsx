import React, { useState } from "react";
import EducationForm from "./EducationForm";
import BtechEducationForm from "./EducationBtech";
import MtechEducationForm from "./EducationMtech";
import DocumentsForm from "./DocumentsForm";
import { Plus, Trash2 } from "lucide-react";

interface UnifiedEducationFormProps {
    educationData: any;
    btechData: any;
    mtechData: any;
    documentsData: any;
    program?: string;
    onChange: (section: string, field: string, value: any) => void;
}

const UnifiedEducationForm: React.FC<UnifiedEducationFormProps> = ({
    educationData,
    btechData,
    mtechData,
    documentsData,
    program,
    onChange,
}) => {
    // We'll manage visibility of extra forms with local state
    // But persistence depends on the data being present in the props
    // We can infer visibility based on if data exists or if user explicitly added it.
    // For simplicity, let's track which "Optional" sections are active.

    const [showBtech, setShowBtech] = useState(
        !!(btechData.university || btechData.college || btechData.cgpa)
    );
    const [showMtech, setShowMtech] = useState(
        !!(mtechData.university || mtechData.college || mtechData.cgpa)
    );

    const handleAddQualification = () => {
        if (!showBtech) {
            setShowBtech(true);
        } else if (!showMtech) {
            setShowMtech(true);
        }
    };

    const handleRemoveBtech = () => {
        setShowBtech(false);
        // Optionally clear data?
        // onChange("btechEducation", "university", ""); 
        // ... clear others if needed, but keeping data hidden is also safe for now
    };

    const handleRemoveMtech = () => {
        setShowMtech(false);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700 pb-12">
            {/* Base Education (10th/12th) */}
            <div className="relative">
                <EducationForm
                    data={educationData}
                    onChange={(field, value) => onChange("education", field, value)}
                />
            </div>

            {/* B.Tech Section */}
            {showBtech && (
                <div className="relative group">
                    <button
                        onClick={handleRemoveBtech}
                        className="absolute -top-3 -right-3 z-10 bg-white text-rose-500 hover:bg-rose-500 hover:text-white p-2.5 rounded-full border-2 border-slate-100 shadow-md transition-all duration-300 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
                        title="Remove B.Tech Details"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                    <BtechEducationForm
                        data={btechData}
                        onChange={(field, value) => onChange("btechEducation", field, value)}
                    />
                </div>
            )}

            {/* M.Tech Section */}
            {showMtech && (
                <div className="relative group">
                    <button
                        onClick={handleRemoveMtech}
                        className="absolute -top-3 -right-3 z-10 bg-white text-rose-500 hover:bg-rose-500 hover:text-white p-2.5 rounded-full border-2 border-slate-100 shadow-md transition-all duration-300 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
                        title="Remove M.Tech Details"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                    <MtechEducationForm
                        data={mtechData}
                        onChange={(field, value) => onChange("mtechEducation", field, value)}
                    />
                </div>
            )}

            {/* Add Button */}
            {(!showBtech || !showMtech) && (
                <div className="flex justify-center pt-4">
                    <button
                        onClick={handleAddQualification}
                        className="group relative flex items-center gap-3 px-8 py-5 bg-white border-2 border-[#8BB723]/30 text-[#8BB723] rounded-2xl hover:bg-[#8BB723] hover:text-white hover:border-[#8BB723] transition-all duration-500 shadow-sm hover:shadow-[0px_10px_20px_-5px_rgba(139,183,35,0.3)]"
                    >
                        <div className="p-1.5 bg-[#8BB723]/10 text-[#8BB723] rounded-lg group-hover:bg-white/20 group-hover:text-white transition-colors">
                            <Plus className="h-5 w-5" />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                            Add Qualification ({!showBtech ? "B.Tech/Graduation" : "M.Tech/Post-Graduation"})
                        </span>
                    </button>
                </div>
            )}

            {/* Documents Section (Integrated into Education Step) */}
            <div className="pt-6 border-t border-slate-100">
                <DocumentsForm
                    data={documentsData}
                    program={program}
                    onChange={onChange}
                />
            </div>
        </div>
    );
};

export default UnifiedEducationForm;
