import React, { useState } from "react";
import { UploadCloud, FileText, CheckCircle, X, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { apiUrl } from "../../lib/api";

interface DocumentsFormProps {
    data: any;
    program?: string;
    onChange: (section: string, field: string, value: any) => void;
}

const DocumentsForm: React.FC<DocumentsFormProps> = ({ data, program, onChange }) => {
    const [uploading, setUploading] = useState<string | null>(null);

    const prog = program?.toLowerCase() || "";
    // Robust detection for PhD/PG/UG
    const isPhd = prog.includes("phd") || prog.includes("doct") || prog.includes("research");
    const isPg = prog.includes("master") || prog.includes("post") || prog.includes("m.tech") || prog.includes("mba") || prog.includes("mca") || prog.includes("pg");

    const baseDocs = [
        {
            key: "ssc",
            label: "10th Class Marks Memo",
            accept: ".pdf,image/jpeg,image/png",
            icon: FileText,
            required: true,
            show: true
        },
        {
            key: "inter",
            label: "Intermediate/12th Marks Memo",
            accept: ".pdf,image/jpeg,image/png",
            icon: FileText,
            required: isPhd || isPg,
            show: true
        },
        {
            key: "ug",
            label: isPhd ? "B.Tech/UG Degree" : "UG Degree/Provisional",
            accept: ".pdf,image/jpeg,image/png",
            icon: FileText,
            required: false,
            show: isPhd || isPg
        },
        {
            key: "pg",
            label: isPhd ? "M.Tech/PG Degree" : "PG Degree/Provisional",
            accept: ".pdf,image/jpeg,image/png",
            icon: FileText,
            required: false,
            show: isPhd
        },
    ].filter(doc => doc.show);

    const handleUpload = async (key: string, file: File) => {
        setUploading(key);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch(apiUrl(`/api/upload_single_document?file_key=${key}`), {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");

            const result = await res.json();
            const fileId = result.id;

            const currentDocs = { ...(data?.files || {}) };
            currentDocs[key] = {
                id: fileId,
                name: file.name,
                uploadedAt: new Date().toISOString(),
            };
            onChange("documents", "files", currentDocs);
            toast.success(`${file.name} uploaded successfully`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload document");
        } finally {
            setUploading(null);
        }
    };

    const removeFile = (key: string) => {
        const currentDocs = { ...(data?.files || {}) };
        delete currentDocs[key];
        onChange("documents", "files", currentDocs);
    };

    const filesMap = data?.files || {};
    const baseKeys = baseDocs.map(d => d.key);
    const extraDocsKeys = Object.keys(filesMap).filter(k => !baseKeys.includes(k));

    return (
        <div className="animate-in fade-in duration-700 pb-12">
            <div className="bg-white border-2 border-slate-100 overflow-hidden rounded-[2rem] shadow-sm">
                <div className="bg-slate-50/50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-xl">
                            <UploadCloud className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                                Document Upload Center
                            </h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                Category: {isPhd ? "PhD Requirements" : isPg ? "PG Requirements" : "UG Requirements"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-8 md:p-10 space-y-10">
                    <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl flex items-start gap-4">
                        <div className="p-2 bg-emerald-600 rounded-lg shrink-0">
                            <FileText className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black text-emerald-900 uppercase tracking-wider mb-1">Upload Guidelines</h4>
                            <p className="text-[10px] font-bold text-emerald-800/70 uppercase tracking-tight leading-relaxed">
                                {isPhd || isPg ? "10th and Intermediate are mandatory." : "10th Class is mandatory."} Allowed files: PDF, JPEG, PNG (Max 5MB).
                            </p>
                        </div>
                    </div>



                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {baseDocs.map((doc) => (
                            <DocCard
                                key={doc.key}
                                doc={doc}
                                uploadedFile={filesMap[doc.key]}
                                isBeingUploaded={uploading === doc.key}
                                onUpload={(file: File) => handleUpload(doc.key, file)}
                                onRemove={() => removeFile(doc.key)}
                            />
                        ))}
                    </div>

                    <div className="pt-8 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Additional Documents</h4>
                            <button
                                type="button"
                                onClick={() => {
                                    const input = document.createElement('input');
                                    input.type = 'file';
                                    input.onchange = (e: any) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const key = `extra_${Date.now()}`;
                                            handleUpload(key, file);
                                        }
                                    };
                                    input.click();
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-[#8BB723] hover:bg-[#7aa11f] text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-[#8BB723]/20"
                            >
                                <Plus className="h-3.5 w-3.5" />
                                Add More
                            </button>
                        </div>

                        {extraDocsKeys.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {extraDocsKeys.map((key) => (
                                    <DocCard
                                        key={key}
                                        doc={{ key, label: filesMap[key].name, icon: FileText }}
                                        uploadedFile={filesMap[key]}
                                        isBeingUploaded={uploading === key}
                                        onUpload={(file: File) => handleUpload(key, file)}
                                        onRemove={() => removeFile(key)}
                                        isExtra
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-3xl">
                                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">No additional documents added</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const DocCard = ({ doc, uploadedFile, isBeingUploaded, onUpload, onRemove, isExtra }: any) => {
    return (
        <div className={`group relative p-6 border-2 rounded-2xl transition-all ${uploadedFile ? 'bg-emerald-50/30 border-emerald-100 shadow-sm' : 'bg-slate-50 border-slate-100 hover:border-slate-200'}`}>
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl shadow-sm ${uploadedFile ? 'bg-white text-emerald-600' : 'bg-white text-slate-400'}`}>
                    {doc.icon ? <doc.icon className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                </div>
                {uploadedFile && (
                    <button
                        onClick={onRemove}
                        className="p-1.5 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-100 transition-colors"
                        title="Remove file"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                )}
            </div>

            <div className="min-h-[60px]">
                <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest leading-tight">
                    {isExtra ? 'Additional Doc' : doc.label} {doc.required && <span className="text-rose-500">*</span>}
                </h4>

                {uploadedFile ? (
                    <div className="flex items-center gap-2 text-emerald-600 mt-2">
                        <CheckCircle className="h-3 w-3" />
                        <span className="text-[9px] font-black truncate max-w-full uppercase tracking-tighter">
                            {uploadedFile.name}
                        </span>
                    </div>
                ) : (
                    <div className="mt-4">
                        <label className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-[9px] font-black text-slate-600 uppercase tracking-widest hover:border-slate-300 hover:shadow-md transition-all ${isBeingUploaded ? 'opacity-50 pointer-events-none' : ''}`}>
                            {isBeingUploaded ? (
                                <>
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <UploadCloud className="h-3 w-3" />
                                    Choose File
                                </>
                            )}
                            <input
                                type="file"
                                className="hidden"
                                accept={doc.accept}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) onUpload(file);
                                }}
                            />
                        </label>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocumentsForm;
