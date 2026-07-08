import { useMemo, useState } from "react";
import {
    ArrowLeft,
    Building2,
    Calendar,
    Check,
    CreditCard,
    MapPin,
    Wallet,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { type HistoryCategory, type PaymentMethod } from "../context/HistoryContext";
import { useProfile } from "../context/ProfileContext";

type CheckoutBookingState = {
    category: HistoryCategory;
    date: string;
    timeWindow: string;
};

const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value);

function formatDateLabel(date: string) {
    if (!date) return "Date not selected";

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(`${date}T00:00:00`));
}

function getCategoryLabel(category: HistoryCategory) {
    if (category === "organic") return "Organic";
    if (category === "inorganic") return "Inorganic";
    return "B3";
}

function getPricing(category: HistoryCategory) {
    if (category === "inorganic") {
        return {
            baseFee: 17000,
            estimatedWeightFee: 7000,
            discount: 2500,
            estimatedWeightLabel: "18kg",
        };
    }

    if (category === "hazard") {
        return {
            baseFee: 25000,
            estimatedWeightFee: 9000,
            discount: 0,
            estimatedWeightLabel: "10kg",
        };
    }

    return {
        baseFee: 15000,
        estimatedWeightFee: 5500,
        discount: 2000,
        estimatedWeightLabel: "15kg",
    };
}



export default function CheckoutPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { primaryAddress } = useProfile();
    
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("wallet");

    const bookingState = (location.state ??
        null) as CheckoutBookingState | null;
    const category = bookingState?.category ?? "organic";
    const pricing = getPricing(category);
    const total =
        pricing.baseFee + pricing.estimatedWeightFee - pricing.discount;

    const booking = useMemo(
        () => ({
            title: `${getCategoryLabel(category)} Pickup`,
            subtitle: `Standard Pick-up • ~${pricing.estimatedWeightLabel}`,
            timeWindow: bookingState?.timeWindow || "Time window not selected",
            date: bookingState?.date ?? "",
            dateLabel: formatDateLabel(bookingState?.date ?? ""),
            addressLine1: primaryAddress?.label ?? "Pickup address",
            addressLine2: primaryAddress
                ? `${primaryAddress?.city ?? "No primary address selected"}`
                : "No primary address selected",
        }),
        [
            bookingState?.date,
            bookingState?.timeWindow,
            category,
            pricing.estimatedWeightLabel,
            primaryAddress,
        ],
    );

    function handlePayment() {
        // ponytail: wire to POST /api/checkout when ready
        navigate("/history");
    }

    return (
        <div className="min-h-screen bg-[#F3F4F5]">
            <div className="min-h-screen bg-[#F8F9FA] shadow-[0_20px_40px_rgba(15,82,56,0.1)] relative flex flex-col">
                <header className="flex items-center justify-between px-4 py-4 border-b border-[#E1E3E4]">
                    <button
                        type="button"
                        onClick={() => navigate("/book-pickup")}
                        className="p-2 rounded-full hover:bg-[#F3F4F5]"
                    >
                        <ArrowLeft className="w-4 h-4 text-[#404943]" />
                    </button>
                    <h1 className="text-[#191C1D] text-lg font-bold">
                        Checkout
                    </h1>
                    <div className="w-8" />
                </header>

                <main className="flex-1 overflow-y-auto pb-[150px]">
                    <div className="px-4 py-6 space-y-6">
                        <section className="space-y-2">
                            <h2 className="text-xs font-semibold tracking-[0.05em] text-[#707973]">
                                BOOKING SUMMARY
                            </h2>
                            <div className="bg-white border border-[#E1E3E4] rounded-xl shadow-[0_8px_24px_rgba(15,82,56,0.04)] overflow-hidden">
                                <div className="flex items-center gap-3 p-4 border-b border-[#E1E3E4]">
                                    <div className="w-10 h-10 rounded-full bg-[#CCE6D0] flex items-center justify-center">
                                        <RecycleIcon />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-[#191C1D]">
                                            {booking.title}
                                        </p>
                                        <p className="text-xs text-[#404943]">
                                            {booking.subtitle}
                                        </p>
                                    </div>
                                </div>
                                <div className="p-4 space-y-4 text-sm">
                                    <div className="flex gap-3">
                                        <Calendar className="w-4 h-4 text-[#707973] mt-0.5" />
                                        <div>
                                            <p className="font-medium text-[#191C1D]">
                                                {booking.timeWindow}
                                            </p>
                                            <p className="text-xs text-[#404943]">
                                                {booking.dateLabel}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <MapPin className="w-4 h-4 text-[#707973] mt-0.5" />
                                        <div>
                                            <p className="font-medium text-[#191C1D]">
                                                {booking.addressLine1}
                                            </p>
                                            <p className="text-xs text-[#404943]">
                                                {booking.addressLine2}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-2">
                            <h2 className="text-xs font-semibold tracking-[0.05em] text-[#707973]">
                                ESTIMATION
                            </h2>
                            <div className="relative bg-[#0F5238] rounded-xl p-4 text-white shadow-[0_12px_30px_rgba(15,82,56,0.15)]">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="opacity-90">
                                            Base Service Fee
                                        </span>
                                        <span>
                                            {formatRupiah(pricing.baseFee)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="opacity-90">
                                            Estimated Weight (
                                            {pricing.estimatedWeightLabel})
                                        </span>
                                        <span>
                                            {formatRupiah(
                                                pricing.estimatedWeightFee,
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm text-[#95D4B3]">
                                        <span>Eco-Discount Applied</span>
                                        <span>
                                            -{formatRupiah(pricing.discount)}
                                        </span>
                                    </div>
                                    <div className="border-t border-[#2D6A4F] pt-3 flex justify-between items-center">
                                        <span className="font-medium">
                                            Total Estimated
                                        </span>
                                        <span className="text-3xl font-semibold text-[#B1F0CE]">
                                            {formatRupiah(total)}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-[10px] opacity-70 text-center mt-3">
                                    Final price will be confirmed upon actual
                                    weighing.
                                </p>
                            </div>
                        </section>

                        <section className="space-y-2">
                            <h2 className="text-xs font-semibold tracking-[0.05em] text-[#707973]">
                                PAYMENT METHOD
                            </h2>
                            <div className="space-y-3">
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod("wallet")}
                                    className={`w-full text-left p-4 rounded-xl border transition flex items-center justify-between ${
                                        paymentMethod === "wallet"
                                            ? "border-[#0F5238] bg-[#F3F4F5]"
                                            : "border-[#E1E3E4] bg-white"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-[#E1E3E4] flex items-center justify-center">
                                            <Wallet className="w-5 h-5 text-[#404943]" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-[#191C1D]">
                                                Trash.I Wallet
                                            </p>
                                            <p className="text-xs text-[#404943]">
                                                Balance: Rp 45.000
                                            </p>
                                        </div>
                                    </div>
                                    {paymentMethod === "wallet" ? (
                                        <Check className="w-5 h-5 text-[#0F5238]" />
                                    ) : null}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod("card")}
                                    className={`w-full text-left p-4 rounded-xl border transition flex items-center justify-between ${
                                        paymentMethod === "card"
                                            ? "border-[#0F5238] bg-[#F3F4F5]"
                                            : "border-[#E1E3E4] bg-white"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-[#E7E8E9] flex items-center justify-center">
                                            <CreditCard className="w-5 h-5 text-[#404943]" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-[#191C1D]">
                                                Credit / Debit Card
                                            </p>
                                            <p className="text-xs text-[#404943]">
                                                Link new card
                                            </p>
                                        </div>
                                    </div>
                                    {paymentMethod === "card" ? (
                                        <Check className="w-5 h-5 text-[#0F5238]" />
                                    ) : null}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod("bank")}
                                    className={`w-full text-left p-4 rounded-xl border transition flex items-center justify-between ${
                                        paymentMethod === "bank"
                                            ? "border-[#0F5238] bg-[#F3F4F5]"
                                            : "border-[#E1E3E4] bg-white"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-[#E7E8E9] flex items-center justify-center">
                                            <Building2 className="w-5 h-5 text-[#404943]" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-[#191C1D]">
                                                Bank Transfer
                                            </p>
                                            <p className="text-xs text-[#404943]">
                                                Virtual Account
                                            </p>
                                        </div>
                                    </div>
                                    {paymentMethod === "bank" ? (
                                        <Check className="w-5 h-5 text-[#0F5238]" />
                                    ) : null}
                                </button>
                            </div>
                        </section>
                    </div>
                </main>

                <div className="absolute bottom-0 left-0 right-0 bg-[#F8F9FA] border-t border-[#E1E3E4] shadow-[0_-8px_24px_rgba(15,82,56,0.05)] px-4 pb-8 pt-4">
                    <button
                        type="button"
                        className="w-full bg-[#0F5238] text-white rounded-lg py-4 text-base font-semibold shadow-[0_4px_12px_rgba(15,82,56,0.2)]"
                        onClick={handlePayment}
                    >
                        Pay & Confirm {formatRupiah(total)}
                    </button>
                </div>
            </div>
        </div>
    );
}

function RecycleIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-[#506856]"
        >
            <path d="M7.5 8.5L4 4l4-4" />
            <path d="M4 4h6a4 4 0 0 1 4 4v1" />
            <path d="M16.5 15.5L20 20l-4 4" />
            <path d="M20 20h-6a4 4 0 0 1-4-4v-1" />
            <path d="M20 4h-4a4 4 0 0 0-4 4v1" />
            <path d="M4 20h4a4 4 0 0 0 4-4v-1" />
        </svg>
    );
}
