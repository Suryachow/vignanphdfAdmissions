import React, { useState, useEffect } from "react";
import {
    CheckCircle, CreditCard, ShieldCheck, Lock,
    ArrowRight, Wallet, Landmark, Info, XCircle, AlertCircle
} from "lucide-react";
import confetti from "canvas-confetti";
import { apiUrl } from "../../lib/api";
import { useAuth } from "../../contexts/AuthContext";
import { useSteps } from "../../store/StepContext";
import { recordPhase } from "../../services/phase";
import { toast } from "sonner";

interface PaymentFormProps {
    data: any; // formData.payment
    userData?: any; // currentUserDetails
    onChange: (section: string, field: string, value: any) => void;
    educationData?: any;
    onPaymentSuccess?: (field: string, value: any) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ data, onChange }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [coupon, setCoupon] = useState(data.couponCode || "");
    const [couponApplied, setCouponApplied] = useState(!!data.couponCode);
    const [discount, setDiscount] = useState(data.discountApplied || 0);
    const [couponError, setCouponError] = useState("");
    const [baseAmount] = useState(1200);
    const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);

    const { user } = useAuth();
    const { setPaymentStatus } = useSteps();

    // Legacy coupon codes
    const LEGACY_COUPONS: Record<string, number> = {
        "SAVE7X3": 150,
        "SPRING50": 50,
        "FLARE2025": 200,
        "LUCKY8K": 800,
        "NEO500": 500,
        "FLASH120": 120,
        "VORTEX999": 999,
        "EARLYBIRD250": 250,
        "WELCOME100": 100,
        "BONUS25": 25,
        "MEGA750": 750,
        "VIG90": 1190,
        "VIG100": 1999,
        "NEURO100": 1223.6,
        "CHARI6268": 1199,
        "SSVU26F": 600,
        "SSVU26M": 600
    };

    useEffect(() => {
        sessionStorage.removeItem('paymentIntent');
        // If we have a transaction ID but not marked completed, check its status
        if (data.transactionId && data.paymentStatus !== "completed") {
            fetchPaymentDetails(data.transactionId);
        }
    }, []);

    const fetchPaymentDetails = async (transactionId: string) => {
        setIsUpdatingPayment(true);
        try {
            const res = await fetch(apiUrl(`/api/payments/?transactionId=${transactionId}`));
            if (res.ok) {
                const result = await res.json();
                if (result && result.records && result.records.length > 0) {
                    const payment = result.records[0];
                    const pData = payment.payment_data || {};
                    const status = (payment.status || "").toLowerCase();

                    if (status === "success" || status === "completed") {
                        onChange("payment", "paymentStatus", "completed");
                        onChange("payment", "transactionId", pData.transactionId || transactionId);
                        onChange("payment", "paymentAmount", pData.paymentAmount);
                        onChange("payment", "paymentMethod", pData.paymentMethod || "PayU");

                        setPaymentStatus('success');
                        recordPhase("payment", user?.email, user?.phone);

                        confetti({
                            particleCount: 150,
                            spread: 70,
                            origin: { y: 0.6 },
                            colors: ['#1e3a8a', '#10b981', '#ffffff']
                        });
                    } else if (status === "failure" || status === "failed") {
                        onChange("payment", "paymentStatus", "failed");
                        onChange("payment", "errorMessage", pData.errorMessage || "Transaction failed");
                        setPaymentStatus('failed');
                    }
                }
            }
        } catch (err) {
            console.error("Fetch error", err);
        } finally {
            setIsUpdatingPayment(false);
        }
    };

    const handleApplyCoupon = async () => {
        const code = coupon.trim().toUpperCase();
        if (!code) {
            setCouponError("Enter a coupon code");
            return;
        }
        setCouponError("");
        try {
            const res = await fetch(apiUrl("/api/student/coupon/validate"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    code,
                    email: user?.email || undefined,
                    phone: user?.phone ? String(user.phone).replace(/\D/g, "").slice(-10) : undefined,
                }),
            });
            const resData = await res.json().catch(() => ({}));
            if (resData?.valid && resData?.discount != null) {
                const disc = Number(resData.discount);
                setDiscount(disc);
                setCouponApplied(true);
                onChange("payment", "couponCode", code);
                onChange("payment", "discountApplied", disc);
                onChange("payment", "amount", Math.max(0, baseAmount - disc));
                toast.success("Coupon applied successfully!");
            } else if (LEGACY_COUPONS[code] != null) {
                const disc = LEGACY_COUPONS[code];
                setDiscount(disc);
                setCouponApplied(true);
                onChange("payment", "couponCode", code);
                onChange("payment", "discountApplied", disc);
                onChange("payment", "amount", Math.max(0, baseAmount - disc));
                toast.success("Coupon applied successfully!");
            } else {
                setCouponError(resData?.message || "Invalid or expired coupon code");
                setCouponApplied(false);
                setDiscount(0);
                onChange("payment", "amount", baseAmount);
            }
        } catch (e) {
            setCouponError("Could not validate coupon.");
            setCouponApplied(false);
            setDiscount(0);
            onChange("payment", "amount", baseAmount);
        }
    };

    const handleRemoveCoupon = () => {
        setCoupon("");
        setCouponApplied(false);
        setDiscount(0);
        setCouponError("");
        onChange("payment", "couponCode", "");
        onChange("payment", "discountApplied", 0);
        onChange("payment", "amount", baseAmount);
    };


    const initiatePayUPayment = async (_methodName: string) => {
        setIsProcessing(true);
        try {
            const finalAmount = Math.max(0, baseAmount - discount);
            const res = await fetch(apiUrl("/api/payu/init"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: finalAmount,
                    firstname: user?.name || "Student",
                    email: user?.email || "student@example.com",
                    phone: user?.phone ? String(user.phone).replace(/\D/g, "").slice(-10) : "9999999999",
                    productinfo: "PhD Admission Fee",
                }),
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err?.detail || "Failed to initiate payment");
            }
            const resData = await res.json();

            sessionStorage.setItem(
                "paymentIntent",
                JSON.stringify({
                    txnid: resData.txnid,
                    amount: resData.amount,
                    method: "PayU",
                    firstName: resData.firstname,
                    email: resData.email,
                    phone: resData.phone,
                })
            );

            const form = document.createElement("form");
            form.method = "POST";
            form.action = resData.payment_url;
            const amountStr = typeof resData.amount === "number" ? resData.amount.toFixed(2) : String(resData.amount);
            const fields: Record<string, string> = {
                key: resData.key,
                txnid: resData.txnid,
                amount: amountStr,
                productinfo: resData.productinfo,
                firstname: resData.firstname,
                email: resData.email,
                phone: resData.phone,
                surl: resData.surl,
                furl: resData.furl,
                hash: resData.hash,
            };
            Object.entries(fields).forEach(([name, value]) => {
                const input = document.createElement("input");
                input.type = "hidden";
                input.name = name;
                input.value = value ?? "";
                form.appendChild(input);
            });
            document.body.appendChild(form);
            form.submit();
        } catch (e) {
            setIsProcessing(false);
            if (e instanceof Error) toast.error(e.message);
        }
    };

    const paymentMethods = [
        { id: "card", name: "Credit Card", icon: CreditCard, description: "Visa, Mastercard supported" },
        { id: "upi", name: "UPI Payment", icon: Wallet, description: "Google Pay, PhonePe, Paytm" },
        { id: "net", name: "Net Banking", icon: Landmark, description: "All major Indian banks" },
        { id: "debit", name: "Debit Card", icon: CreditCard, description: "Visa, Mastercard, RuPay supported" }
    ];

    if (data.paymentStatus === "failed") {
        return (
            <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in duration-700">
                <div className="bg-white border border-rose-200 rounded-3xl p-12 text-center shadow-lg shadow-rose-100">
                    <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XCircle className="h-10 w-10" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Payment Failed</h2>
                    <p className="text-slate-500 mb-10 max-w-md mx-auto">
                        Unfortunately, your transaction could not be processed. {data.errorMessage || "The payment was rejected by your bank or the gateway. Please try again or use a different payment method."}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => {
                                onChange("payment", "paymentStatus", "pending");
                                setPaymentStatus('pending');
                            }}
                            className="bg-slate-900 text-white font-black py-4 px-10 rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs shadow-xl shadow-slate-200"
                        >
                            <ArrowRight className="h-4 w-4 rotate-180" />
                            Retry Payment
                        </button>
                        <div className="flex items-center gap-2 text-slate-400 px-6 py-4 justify-center">
                            <AlertCircle className="h-4 w-4 text-rose-400" />
                            <span className="text-[10px] uppercase font-bold tracking-widest leading-none">ID: {data.transactionId || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (data.paymentStatus === "completed") {
        return (
            <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in duration-700">
                <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-10 w-10" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Payment Successful</h2>
                    <p className="text-slate-500 mb-10 max-w-sm mx-auto">
                        Your admission application fee has been processed securely{data.paymentMethod === 'PayU' ? ' via PayU' : data.paymentMethod ? ` via ${data.paymentMethod}` : ''}. We've sent a receipt to your email.
                    </p>

                    <div className="grid grid-cols-2 gap-8 text-left border-t border-slate-100 pt-10">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Transaction ID</p>
                            <p className="font-bold text-slate-900 font-mono text-sm">{data.transactionId}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Amount Paid</p>
                            <p className="font-bold text-slate-900 text-sm">₹{data.paymentAmount || data.amount}.00</p>
                        </div>
                    </div>

                    {data.paymentMethod === 'PayU' && (
                        <div className="mt-8 flex items-center justify-center gap-2 opacity-30 grayscale grayscale-100">
                            <img src="https://www.payu.in/wp-content/uploads/2023/11/payu_logo.png" alt="PayU" className="h-3" />
                            <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Verified Secure</span>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full mx-auto py-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8 border-b border-slate-100 pb-10">
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-slate-200">
                        <ShieldCheck className="h-3 w-3 fill-emerald-400 text-emerald-400" /> Secure Checkout 2026
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">Complete your payment</h1>
                    <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-lg">Initiate your PhD admission registration via our enterprise-grade secure payment gateway.</p>
                </div>
                {isUpdatingPayment && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-wider animate-pulse">
                        <Info className="h-3 w-3 animate-spin" />
                        Verifying Status
                    </div>
                )}
            </div>



            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Left Column: Order Summary */}
                <div className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-8 order-2 lg:order-1">
                    <div className="bg-white border border-slate-100 rounded-[2rem] shadow-xl shadow-slate-200/40 overflow-hidden transition-all duration-500">
                        <div className="p-6 border-b border-slate-50 bg-slate-50/30">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Order Summary</h3>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex justify-between items-start gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-slate-900 leading-tight">Admission Fee 2026</p>
                                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Registration</p>
                                </div>
                                <p className="text-sm font-bold text-slate-900 whitespace-nowrap">₹1200.00</p>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-slate-50">
                                <div className="flex justify-between text-xs text-slate-500 font-medium uppercase tracking-wider">
                                    <span>Subtotal</span>
                                    <span className="text-slate-900 font-bold">₹1200.00</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-[10px] text-emerald-600 font-bold bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/50">
                                        <span className="uppercase tracking-widest">Discount</span>
                                        <span>-₹{discount.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>

                            <div className="pt-6 border-t border-slate-100">
                                <div className="flex flex-col gap-1 mb-2">
                                    <p className="font-bold text-slate-400 text-[9px] uppercase tracking-[0.2em] leading-none">Net Payable</p>
                                    <div className="flex items-baseline justify-between gap-2">
                                        <p className="text-3xl font-black text-slate-950 tracking-tighter">₹{(baseAmount - discount).toFixed(2)}</p>
                                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Inc. Tax</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-50">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Promotional Code</h4>
                                {!couponApplied ? (
                                    <div className="space-y-2">
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                value={coupon}
                                                onChange={e => setCoupon(e.target.value)}
                                                placeholder="ENTER CODE"
                                                className="w-full px-4 py-4 bg-slate-50 border border-slate-100 focus:border-slate-200 rounded-xl text-xs font-bold tracking-[0.1em] outline-none transition-all placeholder:text-slate-300 focus:bg-white text-slate-900 uppercase"
                                            />
                                            <button
                                                onClick={handleApplyCoupon}
                                                disabled={!coupon || isProcessing}
                                                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-slate-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-30 active:scale-95"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between bg-emerald-50/50 border border-emerald-100/50 p-3.5 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 bg-emerald-500 text-white rounded-lg">
                                                <CheckCircle className="h-3 w-3" />
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-bold text-emerald-600 uppercase tracking-[0.15em]">Verified</p>
                                                <p className="text-xs font-bold text-slate-900 tracking-wider">{coupon.toUpperCase()}</p>
                                            </div>
                                        </div>
                                        <button onClick={handleRemoveCoupon} className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-500 transition-all">
                                            <ArrowRight className="h-3 w-3 rotate-180" />
                                        </button>
                                    </div>
                                )}
                                {couponError && <p className="text-rose-500 text-[9px] font-bold mt-2 ml-1 uppercase tracking-wider">
                                    {couponError}
                                </p>}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 px-4">
                        <div className="flex items-center gap-3 text-slate-400 transition-colors hover:text-slate-600">
                            <Lock className="h-3.5 w-3.5" />
                            <span className="text-[9px] font-bold uppercase tracking-widest text-inherit">Secure 256-bit SSL</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-400 transition-colors hover:text-slate-600">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            <span className="text-[9px] font-bold uppercase tracking-widest text-inherit">PCI DSS Compliant</span>
                        </div>
                        <div className="mt-2 pt-4 border-t border-slate-50">
                            <p className="text-[9px] text-slate-400 leading-relaxed font-medium uppercase tracking-wider">
                                Secure processing provided by <span className="text-slate-600 font-bold">Enterprise PayU</span>. <a href="#" className="underline hover:text-primary decoration-slate-200">Refund Policy</a> applies.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Payment Method Selection */}
                <div className="lg:col-span-7 xl:col-span-8 order-1 lg:order-2">
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/30 overflow-hidden p-8 md:p-12 transition-all duration-500">
                        <div className="mb-12">
                            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Select Payment Method</h2>
                            <p className="text-slate-500 font-medium">Safe redirection to secure PayU gateway. All transactions are end-to-end encrypted.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {paymentMethods.map((method) => (
                                <button
                                    key={method.id}
                                    onClick={() => initiatePayUPayment(method.name)}
                                    disabled={isProcessing}
                                    className="group relative flex items-center gap-5 p-6 rounded-3xl border border-slate-100 hover:border-slate-900 hover:bg-slate-50/30 transition-all duration-300 text-left bg-white active:scale-[0.98] disabled:opacity-50"
                                >
                                    <div className="w-14 h-14 bg-slate-50 group-hover:bg-slate-900 group-hover:text-white rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm">
                                        <method.icon className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 group-hover:text-primary transition-colors">
                                            {method.id === 'card' ? 'Universal' : method.id === 'upi' ? 'Fast' : method.id === 'net' ? 'Classic' : 'Secure'}
                                        </p>
                                        <p className="text-base font-bold text-slate-900 truncate">
                                            {method.name}
                                        </p>
                                        <p className="text-xs text-slate-500 font-medium truncate">{method.description}</p>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="h-7 w-7 rounded-full bg-slate-900 text-white flex items-center justify-center">
                                            <ArrowRight className="h-3.5 w-3.5" />
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>



                        <div className="mt-12 flex items-center justify-center gap-8 opacity-40 grayscale">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo.png/1200px-UPI-Logo.png" alt="UPI" className="h-4" />
                            <img src="https://www.payu.in/wp-content/uploads/2023/11/payu_logo.png" alt="PayU" className="h-4" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentForm;
