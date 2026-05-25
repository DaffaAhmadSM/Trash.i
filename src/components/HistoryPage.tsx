import {
    AlertTriangle,
    ArrowRight,
    Box,
    Calendar,
    CircleDollarSign,
    Home,
    Leaf,
    User,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNavBar from "./BottomNavBar";
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

type FilterValue = "all" | HistoryCategory;

function getCategoryIcon(category: HistoryCategory) {
    if (category === "organic") return Leaf;
    if (category === "inorganic") return Box;
    return AlertTriangle;
}

function getCategoryLabel(category: HistoryCategory) {
    if (category === "organic") return "Organic";
    if (category === "inorganic") return "Inorganic";
    return "B3";
}

function getCategoryAccent(category: HistoryCategory) {
    if (category === "organic") return "border-l-[#2D6A4F]";
    if (category === "inorganic") return "border-l-[#4A90E2]";
    return "border-l-[#BA1A1A]";
}

function getStatusBadge(item: HistoryItem) {
    if (item.status === "cancelled") {
        return {
            label: "Cancelled",
            className: "bg-[#FFDAD6] text-[#93000A]",
        };
    }

    return {
        label: "Completed",
        className: "bg-[#CCE6D0] text-[#506856]",
    };
}

export default function HistoryPage() {
    const navigate = useNavigate();
    const { historyItems } = useHistory();
    const [activeFilter, setActiveFilter] = useState<FilterValue>("all");

    const filteredItems = useMemo(() => {
        if (activeFilter === "all") return historyItems;
        return historyItems.filter((item) => item.category === activeFilter);
    }, [activeFilter, historyItems]);

    const filterButtons: Array<{ value: FilterValue; label: string }> = [
        { value: "all", label: "All" },
        { value: "organic", label: "Organic" },
        { value: "inorganic", label: "Inorganic" },
        { value: "hazard", label: "B3" },
    ];

    return (
        <div className="min-h-screen bg-[#E1E3E4]">
            <div className="min-h-screen bg-[#F8F9FA] shadow-[0_20px_40px_rgba(15,82,56,0.1)] relative flex flex-col">
                <header className="flex items-center justify-between px-4 py-4 border-b border-[#BFC9C1] bg-[#F8F9FA]">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#0F5238] flex items-center justify-center">
                            <Home className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-[#0F5238] font-bold text-[22px] leading-[30px] tracking-[-0.025em]">
                            Trash.I
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={() => navigate("/profile")}
                        className="w-10 h-10 rounded-full border border-[#BFC9C1] bg-white flex items-center justify-center"
                    >
                        <User className="w-4 h-4 text-[#404943]" />
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto px-4 pt-4 pb-[89px] space-y-4">
                    <section>
                        <h1 className="text-[#191C1D] text-[20px] leading-7 font-semibold">
                            History
                        </h1>
                    </section>

                    <section className="flex gap-2 overflow-x-auto py-2">
                        {filterButtons.map((button) => {
                            const active = activeFilter === button.value;
                            return (
                                <button
                                    key={button.value}
                                    type="button"
                                    onClick={() =>
                                        setActiveFilter(button.value)
                                    }
                                    className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold tracking-[0.05em] border ${
                                        active
                                            ? "bg-[#0F5238] text-white border-[#0F5238]"
                                            : "bg-[#F3F4F5] text-[#404943] border-[#BFC9C1]"
                                    }`}
                                >
                                    {button.label}
                                </button>
                            );
                        })}
                    </section>

                    <section className="space-y-4">
                        {filteredItems.length === 0 ? (
                            <div className="rounded-2xl border border-[#BFC9C1] bg-white p-6 text-center shadow-[0_8px_8px_rgba(15,82,56,0.04)]">
                                <p className="text-base font-semibold text-[#191C1D]">
                                    No history yet
                                </p>
                                <p className="mt-1 text-sm text-[#404943]">
                                    Completed payments will appear here.
                                </p>
                            </div>
                        ) : (
                            filteredItems.map((item) => {
                                const Icon = getCategoryIcon(item.category);
                                const badge = getStatusBadge(item);

                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() =>
                                            navigate(`/receipt/${item.id}`)
                                        }
                                        className={`w-full rounded-2xl border-l-4 ${getCategoryAccent(item.category)} bg-white p-4 text-left shadow-[0_8px_8px_rgba(15,82,56,0.04)]`}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <Icon className="w-4 h-4 text-[#404943]" />
                                                    <h2 className="text-base font-semibold text-[#191C1D]">
                                                        {item.title}
                                                    </h2>
                                                </div>
                                                <p className="text-sm text-[#404943]">
                                                    {item.subtitle}
                                                </p>
                                            </div>
                                            <span
                                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold tracking-[0.05em] ${badge.className}`}
                                            >
                                                {badge.label}
                                            </span>
                                        </div>

                                        <div className="mt-4 flex flex-wrap gap-4 text-sm text-[#404943]">
                                            <div className="inline-flex items-center gap-2 rounded-lg bg-[#EDEEEF] px-2 py-1">
                                                <Calendar className="w-4 h-4" />
                                                <span>
                                                    {item.pickupDateLabel}
                                                </span>
                                            </div>
                                            <div className="inline-flex items-center gap-2 rounded-lg bg-[#EDEEEF] px-2 py-1">
                                                <CircleDollarSign className="w-4 h-4" />
                                                <span>
                                                    {formatRupiah(item.total)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between text-sm">
                                            <p className="text-[#506856] font-semibold tracking-[0.05em]">
                                                {getCategoryLabel(
                                                    item.category,
                                                )}
                                            </p>
                                            <ArrowRight className="w-4 h-4 text-[#404943]" />
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </section>
                </main>

                <BottomNavBar activeTab="history" />
            </div>
        </div>
    );
}
