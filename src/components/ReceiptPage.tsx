import {
    AlertCircle,
    ArrowLeft,
    Calendar,
    Check,
    Clock,
    Download,
    MapPin,
    ReceiptText,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useHistory, type TransactionDetail } from "../context/HistoryContext";

const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value);

function formatDate(iso: string | null): string {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export default function ReceiptPage() {
    const navigate = useNavigate();
    const { historyId } = useParams();
    const { getDetail } = useHistory();

    const [item, setItem] = useState<TransactionDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!historyId) return;
        setLoading(true);
        getDetail(Number(historyId))
            .then(setItem)
            .catch(() => setError("Failed to load receipt"))
            .finally(() => setLoading(false));
    }, [historyId, getDetail]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#E1E3E4] p-4">
                <div className="min-h-screen bg-[#F8F9FA] rounded-[24px] p-6 flex flex-col items-center justify-center gap-4 animate-pulse">
                    <div className="w-16 h-16 rounded-full bg-[#EDEEEF]" />
                    <div className="h-6 w-48 bg-[#EDEEEF] rounded" />
                </div>
            </div>
        );
    }

    if (error || !item) {
        return (
            <div className="min-h-screen bg-[#E1E3E4] p-4">
                <div className="min-h-screen bg-[#F8F9FA] rounded-[24px] p-6 flex flex-col items-center justify-center gap-4 text-center shadow-[0_20px_40px_rgba(15,82,56,0.1)]">
                    <ReceiptText className="w-10 h-10 text-[#0F5238]" />
                    <div>
                        <h1 className="text-xl font-semibold text-[#191C1D]">
                            Receipt not found
                        </h1>
                        <p className="mt-1 text-sm text-[#404943]">
                            Could not load this receipt.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => navigate("/history")}
                        className="rounded-lg bg-[#0F5238] px-4 py-3 text-white font-semibold"
                    >
                        Back to History
                    </button>
                </div>
            </div>
        );
    }

    const catName =
        item.transaction_details[0]?.waste_category?.name_category ?? "Organik";
    const isCompleted =
        item.payment_status === "paid" || item.payment_status === "confirmed";

    return (
        <div className="min-h-screen bg-[#E1E3E4]">
            <div className="min-h-screen bg-[#F8F9FA] relative shadow-[0_20px_40px_rgba(15,82,56,0.1)]">
                <header className="flex items-center justify-between px-4 h-16 border-b border-[#BFC9C1] bg-[#F8F9FA]">
                    <button
                        type="button"
                        onClick={() => navigate("/history")}
                        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#EDEEEF]"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="w-4 h-4 text-[#0F5238]" />
                    </button>
                    <h1 className="text-[#0F5238] text-[20px] font-semibold tracking-[-0.025em]">
                        Receipt
                    </h1>
                    <div className="w-10" />
                </header>

                <main className="h-[calc(100vh-64px)] overflow-y-auto pb-8">
                    <section className="bg-[#2D6A4F] px-6 py-8 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-[#CCE6D0] shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex items-center justify-center mb-4">
                            <Check className="w-7 h-7 text-[#0F5238]" />
                        </div>
                        <h2 className="text-[22px] leading-[30px] font-semibold text-[#A8E7C5]">
                            {isCompleted
                                ? "Pickup Completed"
                                : "Payment Pending"}
                        </h2>
                        <p className="mt-2 max-w-[280px] text-sm leading-5 text-[#A8E7C5]/90">
                            Thank you for your contribution to a cleaner
                            environment.
                        </p>
                    </section>

                    <section className="space-y-4 px-4 py-4">
                        <div className="rounded-lg border border-[#BFC9C1] bg-white p-6 shadow-[0_4px_12px_rgba(15,82,56,0.04)] space-y-4">
                            <div className="border-b border-[#E1E3E4] pb-4">
                                <p className="text-[#191C1D] text-[20px] font-semibold leading-7 tracking-[-0.025em]">
                                    TRX-{String(item.trans_id).padStart(6, "0")}
                                </p>
                            </div>
                            <div className="pt-2 grid grid-cols-2 gap-4 text-sm">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-[#404943]">
                                        <Calendar className="w-4 h-4" />
                                        <span>Pickup Date</span>
                                    </div>
                                    <p className="text-[#191C1D] font-medium">
                                        {formatDate(item.scheduled_date)}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-[#404943]">
                                        <Clock className="w-4 h-4" />
                                        <span>Time Slot</span>
                                    </div>
                                    <p className="text-[#191C1D] font-medium">
                                        {item.time_slot ?? "—"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-lg border border-[#BFC9C1] bg-white p-6 shadow-[0_4px_12px_rgba(15,82,56,0.04)] space-y-4">
                                <div className="flex items-center gap-2 text-[#404943] text-xs font-semibold tracking-[0.05em]">
                                    <MapPin className="w-4 h-4" />
                                    <span>PICKUP LOCATION</span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold text-[#191C1D]">
                                        {item.address?.label ?? "—"}
                                    </p>
                                    <p className="text-sm text-[#404943] leading-5">
                                        {item.address?.city ?? "—"}
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-lg border border-[#BFC9C1] border-l-4 border-l-[#2D6A4F] bg-white p-6 shadow-[0_4px_12px_rgba(15,82,56,0.04)] space-y-4">
                                <div className="flex items-center gap-2 text-[#404943] text-xs font-semibold tracking-[0.05em]">
                                    <span>MATERIAL</span>
                                </div>
                                <p className="text-base font-semibold text-[#191C1D]">
                                    {catName}
                                </p>
                            </div>
                        </div>

                        <div className="rounded-lg border border-[#BFC9C1] bg-white p-6 shadow-[0_4px_12px_rgba(15,82,56,0.04)] space-y-4">
                            <h3 className="text-[#191C1D] text-[20px] font-semibold leading-7">
                                Payment Summary
                            </h3>

                            {item.payment_fees.map((fee) => (
                                <div
                                    key={fee.fee_id}
                                    className="flex items-center justify-between border-b border-[#E1E3E4] py-2 text-sm"
                                >
                                    <span className="text-[#404943]">
                                        {fee.name}
                                    </span>
                                    <span className="text-[#191C1D]">
                                        {formatRupiah(Number(fee.price))}
                                    </span>
                                </div>
                            ))}

                            <div className="flex items-center justify-between pt-4">
                                <span className="text-[#191C1D] text-base font-semibold">
                                    Total Paid
                                </span>
                                <span className="text-[#191C1D] text-base font-semibold">
                                    {formatRupiah(Number(item.total_paid))}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4">
                            <button
                                type="button"
                                className="w-full rounded-lg bg-[#0F5238] py-4 text-white text-[20px] font-semibold leading-7 flex items-center justify-center gap-2"
                            >
                                <Download className="w-5 h-5" />
                                Download PDF Receipt
                            </button>
                            <button
                                type="button"
                                className="w-full rounded-lg bg-[#CCE6D0] py-4 text-[#0F5238] text-[20px] font-semibold leading-7 flex items-center justify-center gap-2"
                            >
                                <AlertCircle className="w-5 h-5" />
                                Report an Issue
                            </button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}
