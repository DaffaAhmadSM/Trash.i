import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, MapPin, Navigation } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";

const ADDRESS_LABELS = ["Rumah", "Kantor", "Apartemen"] as const;

export default function ManageAddressAddFormPage() {
    const navigate = useNavigate();
    const { addressId } = useParams();
    const { addresses, addAddress, updateAddress, fetchAddresses } =
        useProfile();

    const editing = useMemo(() => {
        if (!addressId) return null;
        return (
            addresses.find((a) => a.address_id === Number(addressId)) ?? null
        );
    }, [addressId, addresses]);

    const [label, setLabel] = useState(editing?.label ?? "Rumah");
    const [city, setCity] = useState(editing?.city ?? "");
    const [latitude, setLatitude] = useState(editing?.latitude ?? "");
    const [longitude, setLongitude] = useState(editing?.longitude ?? "");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [locating, setLocating] = useState(false);

    useEffect(() => {
        fetchAddresses();
    }, [fetchAddresses]);

    useEffect(() => {
        if (editing) {
            setLabel(editing.label);
            setCity(editing.city);
            setLatitude(editing.latitude);
            setLongitude(editing.longitude);
        }
    }, [editing]);

    const handleLocate = () => {
        if (!navigator.geolocation) {
            setError("Geolocation not supported by your browser");
            return;
        }
        setLocating(true);
        setError(null);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLatitude(pos.coords.latitude.toFixed(6));
                setLongitude(pos.coords.longitude.toFixed(6));
                setLocating(false);
            },
            () => {
                setError(
                    "Unable to get location. Please enter coordinates manually.",
                );
                setLocating(false);
            },
        );
    };

    const isFormValid = label && city && latitude && longitude;

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        try {
            const data = { label, city, latitude, longitude };
            if (editing) {
                await updateAddress(editing.address_id, data);
            } else {
                await addAddress(data);
            }
            navigate("/manage-addresses");
        } catch (err: unknown) {
            const apiErr = err as { message?: string };
            setError(apiErr.message ?? "Failed to save address");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F3F4F5]">
            <div className="min-h-screen bg-[#F8F9FA] shadow-[0_20px_40px_rgba(0,0,0,0.1)] relative flex flex-col">
                <header className="absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-4 bg-[#F8F9FA] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#EDEEEF]"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="w-4 h-4 text-[#0F5238]" />
                    </button>
                    <h1 className="text-[22px] font-bold text-[#0F5238]">
                        {editing ? "Edit Address" : "Add Address"}
                    </h1>
                    <div className="w-10" />
                </header>

                <main className="flex-1 overflow-y-auto pt-20 pb-32 px-5 space-y-6">
                    {error && (
                        <div className="bg-[#FFDAD6] text-[#BA1A1A] text-sm p-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Label */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold tracking-[0.05em] text-[#404943]">
                            Label
                        </label>
                        <div className="flex gap-2">
                            {ADDRESS_LABELS.map((l) => (
                                <button
                                    key={l}
                                    type="button"
                                    onClick={() => setLabel(l)}
                                    className={`flex-1 py-3 rounded-lg text-sm font-semibold border transition-colors ${
                                        l === label
                                            ? "bg-[#0F5238] text-white border-[#0F5238]"
                                            : "bg-[#F8F9FA] text-[#404943] border-[#BFC9C1]"
                                    }`}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* City */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold tracking-[0.05em] text-[#404943]">
                            City
                        </label>
                        <input
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Jakarta Pusat"
                            className="w-full border border-[#BFC9C1] rounded-lg py-3 px-3 bg-[#F8F9FA] text-sm text-[#191C1D]"
                        />
                    </div>

                    {/* Coordinates */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold tracking-[0.05em] text-[#404943]">
                                Coordinates
                            </label>
                            <button
                                type="button"
                                onClick={handleLocate}
                                disabled={locating}
                                className="flex items-center gap-1 text-xs text-[#0F5238] font-semibold disabled:opacity-50"
                            >
                                <Navigation className="w-3.5 h-3.5" />
                                {locating
                                    ? "Locating..."
                                    : "Use Current Location"}
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-[10px] text-[#707973]">
                                    Latitude
                                </label>
                                <div className="relative">
                                    <MapPin className="w-4 h-4 text-[#707973] absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        value={latitude}
                                        onChange={(e) =>
                                            setLatitude(e.target.value)
                                        }
                                        placeholder="-6.2088"
                                        className="w-full border border-[#BFC9C1] rounded-lg py-3 pl-10 pr-3 bg-[#F8F9FA] text-sm text-[#191C1D]"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-[#707973]">
                                    Longitude
                                </label>
                                <div className="relative">
                                    <MapPin className="w-4 h-4 text-[#707973] absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        value={longitude}
                                        onChange={(e) =>
                                            setLongitude(e.target.value)
                                        }
                                        placeholder="106.8456"
                                        className="w-full border border-[#BFC9C1] rounded-lg py-3 pl-10 pr-3 bg-[#F8F9FA] text-sm text-[#191C1D]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <div className="absolute bottom-0 left-0 right-0 bg-[#F8F9FA] border-t border-[#E1E3E4] px-5 py-6">
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex-1 bg-[#E7E8E9] text-[#191C1D] text-xs font-semibold tracking-[0.05em] py-4 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={!isFormValid || saving}
                            className="flex-1 bg-[#0F5238] text-white text-xs font-semibold tracking-[0.05em] py-4 rounded-lg shadow-[0_4px_12px_rgba(15,82,56,0.2)] disabled:opacity-60"
                        >
                            {saving ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
