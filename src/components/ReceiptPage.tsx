import {
    AlertCircle,
    AlertTriangle,
    ArrowLeft,
    Box,
    Calendar,
    Check,
    Download,
    Leaf,
    MapPin,
    ReceiptText,
    Wallet,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
    type HistoryCategory,
    type HistoryItem,
    useHistory,
} from "../context/HistoryContext";

const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value);

function getCategoryLabel(category: HistoryCategory) {
    if (category === "organic") return "Organic";
    if (category === "inorganic") return "Inorganic";
    return "B3";
}

function renderCategoryIcon(category: HistoryCategory, className: string) {
    if (category === "organic") return <Leaf className={className} />;
    if (category === "inorganic") return <Box className={className} />;
    return <AlertTriangle className={className} />;
}

function getPaymentLabel(item: HistoryItem) {
    return item.paymentMethodLabel;
}

export default function ReceiptPage() {
    const navigate = useNavigate();
    const { historyId } = useParams();
    const { getHistoryItem } = useHistory();

    const item = historyId ? getHistoryItem(historyId) : null;

    if (!item) {
        return (
            <div className="min-h-screen bg-[#E1E3E4] p-4">
                <div className="min-h-screen bg-[#F8F9FA] rounded-[24px] p-6 flex flex-col items-center justify-center gap-4 text-center shadow-[0_20px_40px_rgba(15,82,56,0.1)]">
                    <ReceiptText className="w-10 h-10 text-[#0F5238]" />
                    <div>
                        <h1 className="text-xl font-semibold text-[#191C1D]">
                            Receipt not found
                        </h1>
                        <p className="mt-1 text-sm text-[#404943]">
                            This receipt may have expired from current session
                            state.
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
                            Pickup Completed
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
                                    {item.receiptNumber}
                                </p>
                            </div>
                            <div className="pt-2 grid grid-cols-2 gap-4 text-sm">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-[#404943]">
                                        <Calendar className="w-4 h-4" />
                                        <span>Pickup Date</span>
                                    </div>
                                    <p className="text-[#191C1D] font-medium">
                                        {item.pickupDateLabel}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-[#404943]">
                                        <Wallet className="w-4 h-4" />
                                        <span>Payment Method</span>
                                    </div>
                                    <p className="text-[#191C1D] font-medium">
                                        {getPaymentLabel(item)}
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
                                        {item.addressLine1}
                                    </p>
                                    <p className="text-sm text-[#404943] leading-5">
                                        {item.addressLine2}
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-lg border border-[#BFC9C1] border-l-4 border-l-[#2D6A4F] bg-white p-6 shadow-[0_4px_12px_rgba(15,82,56,0.04)] space-y-4">
                                <div className="flex items-center gap-2 text-[#404943] text-xs font-semibold tracking-[0.05em]">
                                    {renderCategoryIcon(
                                        item.category,
                                        "w-4 h-4",
                                    )}
                                    <span>MATERIAL HANDLED</span>
                                </div>
                                <div className="space-y-6">
                                    <div className="inline-flex items-center rounded-full bg-[#CCE6D0] p-2">
                                        {renderCategoryIcon(
                                            item.category,
                                            "w-5 h-5 text-[#0F5238]",
                                        )}
                                    </div>
                                    <p className="text-base font-semibold text-[#191C1D]">
                                        {getCategoryLabel(item.category)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-[#BFC9C1] bg-white p-6 shadow-[0_4px_12px_rgba(15,82,56,0.04)] space-y-4">
                            <h3 className="text-[#191C1D] text-[20px] font-semibold leading-7">
                                Payment Summary
                            </h3>

                            <div className="flex items-center justify-between border-b border-[#E1E3E4] py-2 text-sm">
                                <span className="text-[#404943]">
                                    Base Service Fee
                                </span>
                                <span className="text-[#191C1D]">
                                    {formatRupiah(item.baseFee)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between border-b border-[#E1E3E4] py-2 text-sm">
                                <span className="text-[#404943]">
                                    Estimated Weight Fee
                                </span>
                                <span className="text-[#191C1D]">
                                    {formatRupiah(item.estimatedWeightFee)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between border-b border-[#E1E3E4] py-2 text-sm">
                                <span className="text-[#4C6452]">
                                    Eco-Warrior Discount
                                </span>
                                <span className="text-[#4C6452]">
                                    -{formatRupiah(item.discount)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between pt-4">
                                <span className="text-[#191C1D] text-base font-semibold">
                                    Total Paid
                                </span>
                                <span className="text-[#191C1D] text-base font-semibold">
                                    {formatRupiah(item.total)}
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
