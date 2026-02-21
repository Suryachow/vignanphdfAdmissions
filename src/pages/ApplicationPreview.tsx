import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiUrl } from '../lib/api';
// import { format } from 'date-fns'; // Removed dependency

interface ApplicationPreviewProps {
    open: boolean;
    onClose: () => void;
}

const getValue = (value: any, fallback: string = '-') => {
    return value !== undefined && value !== null && value !== '' ? value : fallback;
};

const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).replace(',', '');
    } catch (e) {
        return dateString;
    }
};

/** Normalize API response (lead or payment record) to shape expected by preview UI */
function normalizeApplicationForPreview(raw: any): any {
    const name = raw?.name ?? '';
    const parts = typeof name === 'string' ? name.trim().split(/\s+/) : [];
    const firstName = parts[0] ?? '';
    const lastName = parts.slice(1).join(' ') ?? '';
    return {
        ...raw,
        student_id: raw?.id ?? raw?.student_id,
        personal_info: {
            firstName,
            lastName,
            email: raw?.email,
            phone: raw?.phone,
            ...(raw?.personal_info || {}),
        },
        educational_info: raw?.educational_info ?? {},
        address_info: raw?.address_info ?? { city: raw?.campus },
        application_status: raw?.application_status ?? (raw?.applicationStatus ? { status: raw.applicationStatus } : undefined),
    };
}

const ApplicationPreview: React.FC<ApplicationPreviewProps> = ({ open, onClose }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [applicationData, setApplicationData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open && user?.email) {
            setLoading(true);
            setError(null);
            fetch(apiUrl(`/api/applications/?email=${encodeURIComponent(user.email)}`))
                .then(async (res) => {
                    if (!res.ok) throw new Error('Failed to fetch application data');
                    const data = await res.json();
                    // API returns array of leads or payment records; take first and normalize shape for UI
                    const raw = Array.isArray(data) ? data[0] : data;
                    if (!raw) {
                        setApplicationData(null);
                        return;
                    }
                    setApplicationData(normalizeApplicationForPreview(raw));
                })
                .catch((err) => {
                    setError(err.message || 'Error fetching application data');
                })
                .finally(() => {
                    setLoading(false);
                });
        } else if (!open) {
            setApplicationData(null);
            setError(null);
            setLoading(false);
        }
    }, [open, user?.email]);

    if (!open) return null;

    const hasData = applicationData && !(Array.isArray(applicationData) && applicationData.length === 0);

    const renderOverlay = (content: React.ReactNode) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full text-center">
                <h2 className="text-xl font-bold mb-4">Application Preview</h2>
                {content}
                <button
                    onClick={onClose}
                    className="w-full mt-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Close
                </button>
            </div>
        </div>
    );

    if (loading) return renderOverlay(<p className="text-gray-600">Loading application data...</p>);
    if (error) return renderOverlay(<p className="text-red-600">{error}</p>);
    if (!hasData) return renderOverlay(<p className="text-gray-600">No application data found.</p>);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Application Details</h2>
                    <div className="flex items-center gap-3">

                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                    </div>
                </div>

                {/* Application ID */}
                {getValue(applicationData?.student_id, '') && (
                    <div className="mb-4">
                        <p className="text-sm text-gray-600">
                            Application ID: <span className="font-medium">{applicationData.student_id}</span>
                        </p>
                    </div>
                )}

                {/* Personal Info */}
                <Section title="Personal Information" data={[
                    {
                        label: 'Full Name',
                        value: `${getValue(applicationData?.personal_info?.firstName)} ${getValue(applicationData?.personal_info?.lastName, '')}`
                    },
                    { label: 'Email', value: applicationData?.personal_info?.email },
                    { label: 'Phone', value: applicationData?.personal_info?.phone },
                    { label: 'Date of Birth', value: applicationData?.personal_info?.dob },
                    { label: 'Gender', value: applicationData?.personal_info?.gender },
                    { label: 'Category', value: applicationData?.personal_info?.category },
                ]} />

                {/* Educational Info */}
                <Section title="Educational Information" data={[
                    { label: 'School Name', value: applicationData?.educational_info?.schoolName },
                    { label: 'Board', value: applicationData?.educational_info?.board },
                    { label: 'Percentage', value: applicationData?.educational_info?.percentage },
                    { label: 'Passing Year', value: applicationData?.educational_info?.passingYear },
                    { label: 'Roll Number', value: applicationData?.educational_info?.rollNumber },
                ]} />

                {/* Address Info */}
                <Section title="Address Information" data={[
                    { label: 'Street', value: applicationData?.address_info?.street },
                    { label: 'City', value: applicationData?.address_info?.city },
                    { label: 'State', value: applicationData?.address_info?.state },
                    { label: 'Pincode', value: applicationData?.address_info?.pincode },
                    { label: 'Country', value: applicationData?.address_info?.country },
                ]} />

                {/* Documents */}
                {applicationData?.documents && (
                    <div className="bg-gray-50 p-4 rounded-lg mt-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Submitted Documents</h3>
                        <ul className="space-y-2">
                            {Object.entries(applicationData.documents)
                                .filter(([key]) => key !== 'fileTypes')
                                .map(([docName, status]) => (
                                    <li key={docName} className="flex items-center">
                                        <span className={`w-3 h-3 rounded-full mr-2 ${status === 'uploaded' ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                        <span className="text-sm capitalize">{docName.replace(/_/g, ' ')}</span>
                                        <span className="text-xs text-gray-500 ml-2">
                                            {status === 'uploaded' ? '(Uploaded)' : '(Pending)'}
                                        </span>
                                        {/* @ts-ignore */}
                                        {applicationData.documents?.fileTypes?.[docName] && (
                                            <span className="text-xs text-gray-400 ml-2">[{applicationData.documents.fileTypes[docName]}]</span>
                                        )}
                                    </li>
                                ))}
                        </ul>
                    </div>
                )}

                {/* Application Status */}
                {applicationData?.application_status && (
                    <Section title="Application Status" data={[
                        { label: 'Status', value: applicationData.application_status.status },
                        { label: 'Approved', value: applicationData.application_status.isApproved ? 'Yes' : 'No' },
                        { label: 'Remarks', value: applicationData.application_status.remarks },
                        {
                            label: 'Submission Date',
                            value: formatDate(applicationData.application_status.submission_date)
                        },
                        {
                            label: 'Approval Date',
                            value: formatDate(applicationData.application_status.approval_date)
                        }
                    ]} />
                )}
            </div>
        </div>
    );
};

interface SectionProps {
    title: string;
    data: { label: string; value: any }[];
}

const Section: React.FC<SectionProps> = ({ title, data }) => (
    <div className="bg-gray-50 p-4 rounded-lg mt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.map(({ label, value }) => (
                <div key={label}>
                    <p className="text-sm text-gray-600">{label}</p>
                    <p className="font-medium">{getValue(value)}</p>
                </div>
            ))}
        </div>
    </div>
);

export default ApplicationPreview;
