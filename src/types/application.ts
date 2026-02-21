export type PaymentStatus = "pending" | "completed" | "failed";

export interface CachedApplication {
    steps?: Record<string, any>;
    personal?: Record<string, any>;
    address?: Record<string, any>;
    education?: Record<string, any>;
    payment?: Record<string, any>;
    documents?: Record<string, any>;
    course?: { program?: string };
    program?: string;
    user?: { program?: string };
    [key: string]: any;
}

export interface Personal {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dob: string;
    gender: string;
    category: string;
    parentPhone: string;
}

export interface Education {
    sscName: string;
    board?: string;
    Board?: string;
    Marks?: string | number;
    xYearOfPassing?: string | number;
    schoolName?: string;
    interBoard?: string;
    interStream?: string;
    interHallTicket?: string;
    rollNumber?: string;
    interMarks?: string | number;
    percentage?: string | number;
    // New fields for toggling
    educationType?: "intermediate" | "polytechnic";
    polytechnicCollege?: string;
    polytechnicBoard?: string;
    polytechnicBranch?: string;
    polytechnicYearOfPassing?: string | number;
    polytechnicPercentage?: string | number;
}

export interface Address {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
}



export interface BtechEducation {
    university: string;
    college: string;
    cgpa: string;
    specialization: string;
    yearOfPassing: string;
    degreeType: string;
}

export interface MtechEducation {
    university: string;
    college: string;
    cgpa: string;
    specialization: string;
    yearOfPassing: string;
    degreeType: string;
}

export interface Payment {
    amount: number;
    paymentMethod: string;
    transactionId: string;
    paymentStatus: PaymentStatus;
    paymentDate: string;
    paymentAmount: number;
    discountApplied: number;
    couponCode: string;
    applicationStatus: string;
}

export interface ExamSchedule {
    date: string;
    time: string;
}

export interface FormDataType {
    personal: Personal;
    education: Education;
    btechEducation?: BtechEducation;
    mtechEducation?: MtechEducation;
    address: Address;

    payment: Payment;
    examSchedule: ExamSchedule;
}
