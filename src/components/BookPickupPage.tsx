import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Activity,
    AlertTriangle,
    Bell,
    Box,
    Calendar,
    Clock,
    Home,
    Info,
    Leaf,
    MapPin,
    PlusCircle,
    User,
} from "lucide-react";
import { useProfile } from "../context/ProfileContext";

type Holiday = {
    date: string;
    localName: string;
    name: string;
};

type PickupSlot = {
    value: string;
    label: string;
};

const WEEKDAY_SLOTS: PickupSlot[] = [
    { value: "08:00-10:00", label: "08:00 AM - 10:00 AM" },
    { value: "10:00-12:00", label: "10:00 AM - 12:00 PM" },
    { value: "13:00-15:00", label: "01:00 PM - 03:00 PM" },
    { value: "15:00-17:00", label: "03:00 PM - 05:00 PM" },
];

const SATURDAY_SLOTS: PickupSlot[] = [
    { value: "08:00-10:00", label: "08:00 AM - 10:00 AM" },
    { value: "10:00-12:00", label: "10:00 AM - 12:00 PM" },
    { value: "13:00-15:00", label: "01:00 PM - 03:00 PM" },
];

const HOLIDAY_SLOTS: PickupSlot[] = [
    { value: "10:00-12:00", label: "10:00 AM - 12:00 PM" },
    { value: "13:00-15:00", label: "01:00 PM - 03:00 PM" },
];

function formatAddressLine(address: {
    fullAddress: string;
    districtName: string;
    cityName: string;
    provinceName: string;
}) {
    return `${address.fullAddress}, ${address.districtName}, ${address.cityName}, ${address.provinceName}`;
}

function getDateYear(date: string) {
    return Number(date.slice(0, 4));
}

function getDayOfWeek(date: string) {
    return new Date(`${date}T00:00:00`).getDay();
}

export default function BookPickupPage() {
    const navigate = useNavigate();
    const { primaryAddress } = useProfile();
    const [category, setCategory] = useState("organic");
    const [date, setDate] = useState("");
    const [timeWindow, setTimeWindow] = useState("");
    const [holidaysByYear, setHolidaysByYear] = useState<
        Record<number, Holiday[]>
    >({});
    const [loadingHolidayYear, setLoadingHolidayYear] = useState<number | null>(
        null,
    );
    const [holidayError, setHolidayError] = useState<string | null>(null);

    const selectedYear = date ? getDateYear(date) : null;

    useEffect(() => {
        if (!selectedYear || holidaysByYear[selectedYear]) return;

        const year = selectedYear;
        const controller = new AbortController();

        async function loadHolidays() {
            try {
                setLoadingHolidayYear(year);
                setHolidayError(null);

                const response = await fetch(
                    `https://date.nager.at/api/v3/PublicHolidays/${year}/ID`,
                    { signal: controller.signal },
                );

                if (!response.ok) {
                    throw new Error("Failed to load public holidays");
                }

                const data = (await response.json()) as Holiday[];
                setHolidaysByYear((current) => ({
                    ...current,
                    [year]: data,
                }));
            } catch (error) {
                if (
                    error instanceof DOMException &&
                    error.name === "AbortError"
                ) {
                    return;
                }

                setHolidayError("Could not verify public holiday calendar.");
            } finally {
                setLoadingHolidayYear((current) =>
                    current === year ? null : current,
                );
            }
        }

        loadHolidays();

        return () => controller.abort();
    }, [holidaysByYear, selectedYear]);

    const selectedHoliday = useMemo(() => {
        if (!date || !selectedYear) return null;

        return (
            holidaysByYear[selectedYear]?.find(
                (holiday) => holiday.date === date,
            ) ?? null
        );
    }, [date, holidaysByYear, selectedYear]);

    const isCheckingHoliday =
        Boolean(date) &&
        selectedYear !== null &&
        loadingHolidayYear === selectedYear &&
        !holidaysByYear[selectedYear];

    const availableSlots = useMemo(() => {
        if (!date || isCheckingHoliday) return [];

        const dayOfWeek = getDayOfWeek(date);

        if (selectedHoliday) return HOLIDAY_SLOTS;
        if (dayOfWeek === 0) return [];
        if (dayOfWeek === 6) return SATURDAY_SLOTS;

        return WEEKDAY_SLOTS;
    }, [date, isCheckingHoliday, selectedHoliday]);

    const selectedTimeWindow = availableSlots.some(
        (slot) => slot.value === timeWindow,
    )
        ? timeWindow
        : "";

    const scheduleMessage = useMemo(() => {
        if (!date) return "Pick a date to see available pickup slots.";
        if (isCheckingHoliday)
            return "Checking Indonesia public holiday calendar...";
        if (selectedHoliday) {
            return `Limited holiday service for ${selectedHoliday.localName}. Only reduced pickup slots available.`;
        }
        if (holidayError) {
            return `${holidayError} Standard schedule shown.`;
        }

        const dayOfWeek = getDayOfWeek(date);

        if (dayOfWeek === 0) {
            return "No pickups available on Sundays. Please choose another date.";
        }
        if (dayOfWeek === 6) {
            return "Saturday schedule active. Late afternoon slot unavailable.";
        }

        return "Regular weekday pickup slots available.";
    }, [date, holidayError, isCheckingHoliday, selectedHoliday]);

    const canConfirm = Boolean(
        category &&
        date &&
        selectedTimeWindow &&
        primaryAddress &&
        availableSlots.length,
    );

    return (
        <div className="min-h-screen bg-[#F3F4F5]">
            <div className="min-h-screen bg-[#F8F9FA] border border-[#BFC9C1] shadow-[0_20px_40px_rgba(15,82,56,0.1)] relative flex flex-col">
                {/* Header - TopAppBar */}
                <header className="flex items-center justify-between px-4 py-4 border-b border-[#BFC9C1]">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#0F5238] flex items-center justify-center">
                            <Home className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-[#0F5238] font-semibold text-lg">
                            Trash.I
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#E7E8E9] flex items-center justify-center">
                            <Bell className="w-4 h-4 text-[#404943]" />
                        </div>
                        <button
                            type="button"
                            onClick={() => navigate("/profile")}
                            className="w-8 h-8 rounded-full border border-[#BFC9C1] bg-white flex items-center justify-center"
                        >
                            <User className="w-4 h-4 text-[#404943]" />
                        </button>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto px-4 pt-6 pb-[220px] space-y-6">
                    {/* Title */}
                    <section className="space-y-2">
                        <h2 className="text-[#191C1D] text-xl font-semibold">
                            Book a Pickup
                        </h2>
                        <p className="text-sm text-[#404943]">
                            Select waste type and location for collection.
                        </p>
                    </section>

                    {/* Category Section */}
                    <section className="space-y-4">
                        <h3 className="text-[#191C1D] text-base font-semibold">
                            Category
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                onClick={() => setCategory("organic")}
                                className={`rounded-xl border p-4 flex flex-col items-center gap-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition ${
                                    category === "organic"
                                        ? "bg-[#CCE6D0] border-[#2D6A4F] text-[#506856]"
                                        : "bg-[#F8F9FA] border-[#BFC9C1] text-[#191C1D]"
                                }`}
                            >
                                <Leaf className="w-5 h-5" />
                                <span className="text-xs font-semibold tracking-[0.05em]">
                                    Organic
                                </span>
                            </button>
                            <button
                                onClick={() => setCategory("inorganic")}
                                className={`rounded-xl border p-4 flex flex-col items-center gap-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition ${
                                    category === "inorganic"
                                        ? "bg-[#CCE6D0] border-[#2D6A4F] text-[#506856]"
                                        : "bg-[#F8F9FA] border-[#BFC9C1] text-[#191C1D]"
                                }`}
                            >
                                <Box className="w-5 h-5" />
                                <span className="text-xs font-semibold tracking-[0.05em]">
                                    Inorganic
                                </span>
                            </button>
                            <button
                                onClick={() => setCategory("hazard")}
                                className={`rounded-xl border p-4 flex flex-col items-center gap-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition ${
                                    category === "hazard"
                                        ? "bg-[#CCE6D0] border-[#2D6A4F] text-[#506856]"
                                        : "bg-[#F8F9FA] border-[#BFC9C1] text-[#191C1D]"
                                }`}
                            >
                                <AlertTriangle className="w-5 h-5" />
                                <span className="text-xs font-semibold tracking-[0.05em]">
                                    B3
                                </span>
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={() => navigate("/waste-categories")}
                            className="w-full flex items-center gap-2 bg-[rgba(45,106,79,0.1)] border border-[rgba(45,106,79,0.2)] text-[#2D6A4F] rounded-lg px-3 py-3 text-xs font-semibold"
                        >
                            <Info className="w-4 h-4" />
                            Learn more about waste categories
                            <span className="ml-auto">→</span>
                        </button>
                    </section>

                    {/* Location Section */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="text-[#191C1D] text-base font-semibold">
                                Location
                            </h3>
                            <button
                                type="button"
                                onClick={() => navigate("/manage-addresses")}
                                className="text-xs font-semibold tracking-[0.05em] text-[#0F5238]"
                            >
                                Manage Address
                            </button>
                        </div>

                        {primaryAddress ? (
                            <div className="relative h-[180px] rounded-xl border border-[#BFC9C1] overflow-hidden shadow-[0_8px_20px_rgba(15,82,56,0.04)]">
                                <div
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{
                                        backgroundImage:
                                            "url(/src/assets/map_image.png)",
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(248,249,250,0.95)] via-[rgba(248,249,250,0.7)] to-transparent" />
                                <div className="absolute right-4 top-4 rounded-full bg-[#CCE6D0] px-3 py-1 text-[10px] font-semibold tracking-[0.05em] text-[#506856]">
                                    {primaryAddress.label} • Primary
                                </div>
                                <div className="absolute bottom-4 left-4 right-4 bg-[rgba(248,249,250,0.96)] border border-[#BFC9C1] rounded-lg px-3 py-3 backdrop-blur space-y-2">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-4 h-4 text-[#404943] mt-0.5" />
                                        <div>
                                            <p className="text-sm font-semibold text-[#191C1D]">
                                                {primaryAddress.recipientName}
                                            </p>
                                            <p className="text-xs text-[#404943] leading-5">
                                                {formatAddressLine(
                                                    primaryAddress,
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/manage-addresses/new")
                                }
                                className="w-full rounded-xl border-2 border-dashed border-[#BFC9C1] px-4 py-8 text-center text-[#0F5238]"
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <PlusCircle className="w-5 h-5" />
                                    <span className="text-sm font-semibold">
                                        Add pickup address first
                                    </span>
                                </div>
                            </button>
                        )}
                    </section>

                    {/* Schedule Section */}
                    <section className="space-y-4">
                        <h3 className="text-[#191C1D] text-base font-semibold">
                            Schedule
                        </h3>
                        <div className="space-y-4">
                            <div className="relative">
                                <label className="absolute -top-2 left-3 bg-[#F8F9FA] px-1 text-xs font-semibold text-[#404943] tracking-[0.05em]">
                                    Date
                                </label>
                                <div className="flex items-center gap-2 border border-[#BFC9C1] rounded-xl px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                                    <Calendar className="w-4 h-4 text-[#404943]" />
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) =>
                                            setDate(e.target.value)
                                        }
                                        className="w-full bg-transparent text-sm text-[#191C1D] outline-none"
                                    />
                                </div>
                            </div>

                            <div className="rounded-xl border border-[#BFC9C1] bg-[#F3F4F5] px-3 py-2">
                                <p className="text-xs text-[#404943] leading-5">
                                    {scheduleMessage}
                                </p>
                            </div>

                            <div className="relative">
                                <label className="absolute -top-2 left-3 bg-[#F8F9FA] px-1 text-xs font-semibold text-[#404943] tracking-[0.05em]">
                                    Time Window
                                </label>
                                <div className="flex items-center gap-2 border border-[#BFC9C1] rounded-xl px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                                    <Clock className="w-4 h-4 text-[#404943]" />
                                    <select
                                        value={selectedTimeWindow}
                                        onChange={(e) =>
                                            setTimeWindow(e.target.value)
                                        }
                                        disabled={
                                            !date ||
                                            isCheckingHoliday ||
                                            availableSlots.length === 0
                                        }
                                        className="w-full bg-transparent text-sm text-[#191C1D] outline-none disabled:text-[#707973]"
                                    >
                                        <option value="">
                                            {!date
                                                ? "Select date first"
                                                : isCheckingHoliday
                                                  ? "Checking holiday schedule..."
                                                  : availableSlots.length === 0
                                                    ? "No slots available"
                                                    : "Select time"}
                                        </option>
                                        {availableSlots.map((slot) => (
                                            <option
                                                key={slot.value}
                                                value={slot.value}
                                            >
                                                {slot.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Bottom Action / FAB Area */}
                <div className="absolute inset-x-0 bottom-[73px] px-4 pb-4 pt-6 bg-gradient-to-t from-[#F8F9FA] via-[#F8F9FA] to-transparent">
                    <button
                        disabled={!canConfirm}
                        onClick={() => {
                            if (canConfirm) {
                                navigate("/checkout");
                            }
                        }}
                        className={`w-full py-3.5 rounded-xl text-lg font-semibold shadow-[0_8px_20px_rgba(15,82,56,0.2)] transition ${
                            canConfirm
                                ? "bg-[#0F5238] text-white"
                                : "bg-[#BFC9C1] text-white cursor-not-allowed"
                        }`}
                    >
                        Confirm Booking
                    </button>
                </div>

                {/* Bottom Navigation */}
                <nav className="absolute bottom-0 left-0 right-0 bg-[#F8F9FA] border-t border-[#BFC9C1] shadow-[0_-4px_20px_rgba(15,82,56,0.08)]">
                    <div className="flex items-center justify-between px-[19px] py-2">
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="flex flex-col items-center text-[#404943] px-4 py-2"
                        >
                            <Home className="w-5 h-5" />
                            <span className="text-xs">Home</span>
                        </button>
                        <button className="rounded-xl bg-[#CCE6D0] px-4 py-2 flex flex-col items-center text-[#506856]">
                            <PlusCircle className="w-5 h-5" />
                            <span className="text-xs font-semibold">Book</span>
                        </button>
                        <button className="flex flex-col items-center text-[#404943] px-4 py-2">
                            <Activity className="w-5 h-5" />
                            <span className="text-xs">History</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/profile")}
                            className="flex flex-col items-center text-[#404943] px-4 py-2"
                        >
                            <User className="w-5 h-5" />
                            <span className="text-xs">Profile</span>
                        </button>
                    </div>
                </nav>
            </div>
        </div>
    );
}
