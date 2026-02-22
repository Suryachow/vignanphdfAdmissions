import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Application Form PDF Generator
 * Generates an official, institutional-style A4 PDF programmatically.
 */

export interface ApplicationFormData {
    personal: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        dob: string;
        gender: string;
        category: string;
        parentPhone: string;
        parentName?: string;
    };
    education: {
        sscName: string;
        board: string;
        Marks: string;
        xYearOfPassing: string;
        schoolName: string;
        interBoard: string;
        interStream: string;
        interHallTicket: string;
        rollNumber: string;
        interMarks: string;
        percentage: string;
        educationType: string;
        polytechnicCollege?: string;
        polytechnicBranch?: string;
        polytechnicPercentage?: string;
    };
    btechEducation?: {
        university: string;
        collegeName: string;
        degreeType: string;
        specialization: string;
        yearOfPassing: string;
        cgpa: string;
    };
    mtechEducation?: {
        university: string;
        collegeName: string;
        degreeType: string;
        specialization: string;
        yearOfPassing: string;
        cgpa: string;
    };
    address: {
        street: string;
        city: string;
        state: string;
        pincode: string;
        country: string;
    };
    payment: {
        amount: number;
        paymentMethod: string;
        transactionId: string;
        paymentStatus: string;
        paymentDate: string;
        paymentAmount: number;
        discountApplied: number;
        couponCode: string;
    };
}

/**
 * Helper to render Letter Boxes for names/numbers
 * REFINED: Renders exactly the number of boxes based on content length or fixed requirement.
 */
const renderLetterBoxes = (text: string, fixedCount?: number) => {
    const val = (text || "").toString().toUpperCase();
    const count = fixedCount !== undefined ? fixedCount : val.length;

    // Do not render anything if empty and not a fixed-length field
    if (count === 0 && fixedCount === undefined) return '';

    const chars = val.split("");
    let html = '<div style="display: flex; gap: 2px; flex-wrap: wrap;">';
    for (let i = 0; i < count; i++) {
        html += `
            <div style="width: 20px; height: 26px; border: 1.2px solid #475569; background: white; display: flex; align-items: center; justify-content: center; font-family: sans-serif; font-weight: 800; font-size: 13px; color: #1e293b; margin-bottom: 2px;">
                ${chars[i] || ""}
            </div>`;
    }
    html += '</div>';
    return html;
};

/**
 * Helper to render Tick Boxes
 */
const renderTickBox = (label: string, isChecked: boolean) => {
    return `
        <div style="display: flex; align-items: center; gap: 6px;">
            <div style="width: 14px; height: 14px; border: 1.5px solid #475569; display: flex; align-items: center; justify-content: center; background: ${isChecked ? '#004C91' : 'white'};">
                ${isChecked ? '<div style="width: 6px; height: 6px; background: white; border-radius: 50%;"></div>' : ''}
            </div>
            <span style="font-size: 10px; font-weight: 900; color: #475569; text-transform: uppercase; font-family: sans-serif;">${label}</span>
        </div>`;
};

/**
 * Generate and download application form as PDF
 */
export const downloadApplicationFormPDF = async (formData: any) => {
    const appNumber = `PHD-2026-${formData.personal.phone?.slice(-4) || '0242'}`;
    const fileName = `Application_Form_${appNumber}.pdf`;
    const generationDate = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    // Create a temporary container for rendering
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '210mm';
    document.body.appendChild(container);

    const pdf = new jsPDF('p', 'mm', 'a4');

    // Common styles
    const styles = `
        <style>
            .page-container {
                width: 210mm;
                min-height: 297mm;
                padding: 15mm;
                background: #fafdef;
                border: 4px solid #475569;
                box-sizing: border-box;
                font-family: 'Inter', sans-serif, Arial;
                position: relative;
            }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #cbd5e1; padding-bottom: 20px; margin-bottom: 20px; }
            .branding h1 { color: #b91c1c; font-size: 32px; font-weight: 900; text-transform: uppercase; font-style: italic; margin: 0; text-align: center; }
            .branding p { font-size: 8px; font-weight: 700; color: #475569; text-transform: uppercase; margin: 2px 0; text-align: center; }
            .section-title { font-size: 11px; font-weight: 900; color: #004C91; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px; }
            .edu-header { font-size: 9px; font-weight: 900; color: #94a3b8; text-transform: uppercase; margin-bottom: 10px; border-left: 4px solid #cbd5e1; padding-left: 8px; }
            .field-label { font-size: 9px; font-weight: 900; color: #004C91; text-transform: uppercase; margin-bottom: 6px; }
            .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .instruction-banner { background: #8BB723; color: white; padding: 10px; text-align: center; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 25px; }
            .signature-box { width: 180px; height: 70px; border: 1.5px solid #e2e8f0; background: #f8fafc; display: flex; align-items: center; justify-content: center; font-size: 9px; color: #cbd5e1; font-weight: 700; }
        </style>
    `;

    // PAGE 1 CONTENT
    const page1 = document.createElement('div');
    page1.innerHTML = `
        ${styles}
        <div class="page-container">
            <div style="position: absolute; left: 10px; bottom: 40px; transform: rotate(-90deg); transform-origin: left bottom; font-size: 14px; font-weight: 900; color: #cbd5e1; letter-spacing: 15px; opacity: 0.3;">PHD-ADMISSION 2026</div>
            
            <div class="header">
                <div style="display: flex; gap: 6px;">
                    <div style="width: 50px; height: 50px; border: 1px solid #cbd5e1; display: flex; align-items: center; justify-content: center; background: white; font-size: 8px; font-weight: 900; color: #94a3b8;">ABET</div>
                    <div style="width: 50px; height: 50px; border: 1px solid #cbd5e1; display: flex; align-items: center; justify-content: center; background: white; font-size: 8px; font-weight: 900; color: #94a3b8;">NAAC A+</div>
                    <div style="width: 50px; height: 50px; border: 1px solid #cbd5e1; display: flex; align-items: center; justify-content: center; background: white; font-size: 8px; font-weight: 900; color: #94a3b8;">NIRF 72</div>
                </div>
                <div class="branding">
                    <h1>VIGNAN'S</h1>
                    <p>FOUNDATION FOR SCIENCE, TECHNOLOGY & RESEARCH</p>
                    <p style="font-size: 6px;">(Deemed to be University) - Estd. u/s 3 of UGC Act 1956</p>
                    <div style="height: 3px; background: linear-gradient(90deg, #004C91, #8BB723, #004C91); margin-top: 8px;"></div>
                    <h2 style="font-size: 20px; font-weight: 900; letter-spacing: 4px; margin-top: 15px; text-decoration: underline; text-decoration-thickness: 3px; text-underline-offset: 6px;">APPLICATION FORM</h2>
                </div>
                <div style="display: flex; flex-direction: column; align-items: flex-end;">
                    <div style="border: 2px solid #1e293b; padding: 6px; width: 130px; background: white; text-align: center; margin-bottom: 10px;">
                        <p style="font-size: 7px; font-weight: 900; color: #64748b; margin: 0;">APPLICATION NUMBER</p>
                        <span style="font-size: 14px; font-weight: 900; color: #004C91;">${appNumber}</span>
                    </div>
                    <div style="width: 140px; height: 140px; border: 2px dashed #94a3b8; background: #f8fafc; display: flex; align-items: center; justify-content: center; text-align: center; padding: 10px;">
                        <p style="font-size: 8px; font-weight: 900; color: #94a3b8; font-style: italic;">PASTE RECENT PASSPORT SIZE PHOTOGRAPH HERE</p>
                    </div>
                </div>
            </div>

            <div class="instruction-banner">READ DETAILED INSTRUCTIONS GIVEN SEPARATELY BEFORE FILLING THE APPLICATION FORM</div>

            <div class="grid-2">
                <div>
                    <div class="field-label">01. Mobile Number</div>
                    ${renderLetterBoxes((formData.personal?.phone || "").slice(-10), 10)}
                </div>
                <div>
                    <div class="field-label">02. Parent Mobile Number</div>
                    ${renderLetterBoxes((formData.personal?.parentPhone || "").slice(-10), 10)}
                </div>
            </div>

            <div style="margin-top: 25px;">
                <div class="field-label">03. Name of the Applicant (As in Class X)</div>
                ${renderLetterBoxes(`${formData.personal?.firstName || ""} ${formData.personal?.lastName || ""}`.trim())}
            </div>

            <div style="margin-top: 25px;">
                <div class="field-label">04. Name of the Parent / Guardian</div>
                ${renderLetterBoxes((formData.personal?.parentName || formData.personal?.lastName || "").trim())}
            </div>

            <div style="margin-top: 25px;">
                <div class="field-label">05. Address for Correspondence</div>
                ${renderLetterBoxes((formData.address?.street || "").trim())}
                <div class="grid-2" style="margin-top: 15px;">
                    <div>
                        <div class="field-label" style="font-size: 8px;">Town / City</div>
                        ${renderLetterBoxes((formData.address?.city || "").trim())}
                    </div>
                    <div>
                        <div class="field-label" style="font-size: 8px;">State</div>
                        ${renderLetterBoxes((formData.address?.state || "").trim())}
                    </div>
                </div>
                <div class="grid-2" style="margin-top: 15px;">
                    <div>
                        <div class="field-label" style="font-size: 8px;">Pincode</div>
                        ${renderLetterBoxes((formData.address?.pincode || "").trim(), 6)}
                    </div>
                    <div>
                        <div class="field-label" style="font-size: 8px;">Email ID</div>
                        <div style="padding: 5px 10px; border: 1.2px solid #94a3b8; background: white; font-weight: 700; font-size: 11px; height: 26px; display: flex; align-items: center;">
                            ${formData.personal?.email || "N/A"}
                        </div>
                    </div>
                </div>
            </div>

            <div style="display: flex; gap: 30px; margin-top: 25px; padding-top: 20px; border-top: 1px solid #cbd5e1;">
                <div>
                    <div class="field-label">06. Date of Birth</div>
                    <div style="display: flex; gap: 1px; align-items: center;">
                        ${(formData.personal?.dob || "").split("-").reverse().map((part: string) => `
                            <div style="display: flex; gap: 1px;">
                                ${part.split('').map(char => `<div style="width: 18px; height: 22px; border: 1.2px solid #475569; background: white; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800;">${char}</div>`).join('')}
                            </div>
                        `).join('<span style="font-weight: 900; color: #475569; margin: 0 4px;">/</span>')}
                    </div>
                </div>
                <div>
                    <div class="field-label">07. Gender</div>
                    <div style="display: flex; gap: 15px; margin-top: 4px;">
                        ${renderTickBox("M", ["Male", "M"].includes(formData.personal?.gender || ""))}
                        ${renderTickBox("F", ["Female", "F"].includes(formData.personal?.gender || ""))}
                        ${renderTickBox("O", ["Other", "O"].includes(formData.personal?.gender || ""))}
                    </div>
                </div>
                <div>
                    <div class="field-label">08. Category</div>
                    <div style="display: flex; gap: 10px; margin-top: 4px; flex-wrap: wrap;">
                        ${renderTickBox("BC", formData.personal?.category === "BC")}
                        ${renderTickBox("SC", formData.personal?.category === "SC")}
                        ${renderTickBox("ST", formData.personal?.category === "ST")}
                        ${renderTickBox("GEN", !["BC", "SC", "ST"].includes(formData.personal?.category || ""))}
                    </div>
                </div>
            </div>

            <div style="margin-top: auto; padding-top: 20px; text-align: right; font-size: 8px; font-weight: 700; color: #94a3b8;">PAGE 1 / 2</div>
        </div>
    `;
    container.appendChild(page1);

    const canvas1 = await html2canvas(page1, { scale: 2, useCORS: true, logging: false });
    const imgData1 = canvas1.toDataURL('image/png');
    pdf.addImage(imgData1, 'PNG', 0, 0, 210, 297);

    container.removeChild(page1);

    const isPolytechnic = formData.education?.educationType === "polytechnic";

    // PAGE 2 CONTENT
    const page2 = document.createElement('div');
    page2.innerHTML = `
        ${styles}
        <div class="page-container">
            <div style="position: absolute; left: 10px; bottom: 40px; transform: rotate(-90deg); transform-origin: left bottom; font-size: 14px; font-weight: 900; color: #cbd5e1; letter-spacing: 15px; opacity: 0.3;">PHD-ADMISSION 2026</div>

            <div class="section-title">09. Educational Background</div>
            
            <div style="margin-bottom: 25px;">
                <div class="edu-header">Class X (SSC/Equivalent) Details</div>
                <div class="field-group" style="margin-bottom: 12px;">
                    <div class="field-label" style="font-size: 8px;">School Name</div>
                    ${renderLetterBoxes((formData.education?.sscName || "").trim())}
                </div>
                <div class="grid-2">
                    <div>
                        <div class="field-label" style="font-size: 8px;">Board</div>
                        ${renderLetterBoxes((formData.education?.board || "STATE BOARD").trim())}
                    </div>
                    <div>
                        <div class="field-label" style="font-size: 8px;">Year / Marks</div>
                        ${renderLetterBoxes(`${formData.education?.xYearOfPassing || ""} / ${formData.education?.Marks || ""}`.trim())}
                    </div>
                </div>
            </div>

            <div style="margin-bottom: 25px;">
                <div class="edu-header">${isPolytechnic ? 'Diploma (Polytechnic)' : 'Intermediate (10+2)'} Details</div>
                <div class="field-group" style="margin-bottom: 12px;">
                    <div class="field-label" style="font-size: 8px;">Institution / College Name</div>
                    ${renderLetterBoxes((formData.education?.schoolName || formData.education?.polytechnicCollege || "").trim())}
                </div>
                <div class="grid-2">
                    <div>
                        <div class="field-label" style="font-size: 8px;">Stream / Branch</div>
                        ${renderLetterBoxes((formData.education?.interStream || formData.education?.polytechnicBranch || "").trim())}
                    </div>
                    <div>
                        <div class="field-label" style="font-size: 8px;">Percentage / CGPA</div>
                        ${renderLetterBoxes(`${formData.education?.percentage || formData.education?.polytechnicPercentage || "0"}%`.trim())}
                    </div>
                </div>
            </div>

            ${formData.btechEducation?.university ? `
            <div style="margin-bottom: 25px;">
                <div class="edu-header">Undergraduate (B.Tech) Details</div>
                <div class="field-group" style="margin-bottom: 12px;">
                    <div class="field-label" style="font-size: 8px;">University Name</div>
                    ${renderLetterBoxes((formData.btechEducation.university || "").trim())}
                </div>
                <div class="grid-2">
                    <div>
                        <div class="field-label" style="font-size: 8px;">College / Degree</div>
                        ${renderLetterBoxes((formData.btechEducation.collegeName || "").trim())}
                    </div>
                    <div>
                        <div class="field-label" style="font-size: 8px;">Year / CGPA</div>
                        ${renderLetterBoxes(`${formData.btechEducation.yearOfPassing || ""} / ${formData.btechEducation.cgpa || ""}`.trim())}
                    </div>
                </div>
            </div>
            ` : ''}

            ${formData.mtechEducation?.university ? `
            <div style="margin-bottom: 25px;">
                <div class="edu-header">Postgraduate (M.Tech) Details</div>
                <div class="field-group" style="margin-bottom: 12px;">
                    <div class="field-label" style="font-size: 8px;">University Name</div>
                    ${renderLetterBoxes((formData.mtechEducation.university || "").trim())}
                </div>
                <div class="grid-2">
                    <div>
                        <div class="field-label" style="font-size: 8px;">Specialization</div>
                        ${renderLetterBoxes((formData.mtechEducation.specialization || "").trim())}
                    </div>
                    <div>
                        <div class="field-label" style="font-size: 8px;">Year / CGPA</div>
                        ${renderLetterBoxes(`${formData.mtechEducation.yearOfPassing || ""} / ${formData.mtechEducation.cgpa || ""}`.trim())}
                    </div>
                </div>
            </div>
            ` : ''}

            <div style="margin-top: 40px; padding-top: 30px; border-top: 4px solid #004C91;">
                <div class="section-title">10. Payment Status & Transaction Details</div>
                <div style="display: flex; gap: 40px; align-items: flex-end;">
                    <div style="flex: 1;">
                        <div class="grid-2">
                            <div style="border: 1.5px solid #e2e8f0; padding: 12px; background: white; border-radius: 10px;">
                                <p style="font-size: 8px; font-weight: 900; color: #94a3b8; text-transform: uppercase;">Transaction ID</p>
                                <p style="font-size: 14px; font-weight: 900; font-family: monospace; color: #1e293b;">${formData.payment?.transactionId || "PN-XXXX-XXXX"}</p>
                            </div>
                            <div style="border: 1.5px solid #e2e8f0; padding: 12px; background: white; border-radius: 10px; display: flex; justify-content: space-between;">
                                <div>
                                    <p style="font-size: 8px; font-weight: 900; color: #94a3b8; text-transform: uppercase;">Payment Status</p>
                                    <p style="font-size: 14px; font-weight: 900; color: #059669;">COMPLETED</p>
                                </div>
                                <div style="text-align: right; font-size: 8px; font-weight: 900; color: #64748b;">
                                    Date: ${generationDate}<br>
                                    Amount: ₹${formData.payment?.amount || "1200"}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="signature-box">DIGITALLY VERIFIED</div>
                        <p style="text-align: center; font-size: 8px; font-weight: 900; color: #94a3b8; text-transform: uppercase; margin-top: 8px;">Signature of Applicant</p>
                    </div>
                </div>
            </div>

            <div style="margin-top: 60px; text-align: center; font-size: 9px; font-weight: 700; color: #94a3b8; letter-spacing: 2px;">
                PHD ADMISSION 2026 • VIGNAN DEEMED TO BE UNIVERSITY • ADMISSIONS OFFICE
            </div>
            
            <div style="margin-top: auto; padding-top: 20px; text-align: right; font-size: 8px; font-weight: 700; color: #94a3b8;">PAGE 2 / 2</div>
        </div>
    `;
    container.appendChild(page2);

    const canvas2 = await html2canvas(page2, { scale: 2, useCORS: true, logging: false });
    const imgData2 = canvas2.toDataURL('image/png');
    pdf.addPage();
    pdf.addImage(imgData2, 'PNG', 0, 0, 210, 297);

    // Cleanup
    document.body.removeChild(container);

    // Direct Download
    pdf.save(fileName);
};

/**
 * Legacy support
 */
export const downloadApplicationPdfFile = async (formData: any): Promise<void> => {
    await downloadApplicationFormPDF(formData);
}

/**
 * Get form data from localStorage
 */
export const getStoredFormData = (): ApplicationFormData | null => {
    try {
        const userDetails = localStorage.getItem("user");
        let userPhone = "";

        if (userDetails) {
            const parsedUser = JSON.parse(userDetails);
            userPhone = parsedUser?.user?.phone || "";
        }

        const phoneKey = `studentApplicationForm_${userPhone}`;
        const cached = localStorage.getItem(phoneKey);

        if (cached) {
            return JSON.parse(cached);
        }
    } catch (error) {
        console.error("Error retrieving form data:", error);
    }

    return null;
};
