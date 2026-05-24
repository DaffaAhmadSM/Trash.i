import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Mail, MapPin, Phone, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";

type Province = {
    id: string;
    name: string;
};

export default function EditProfilePage() {
    const navigate = useNavigate();
    const { profile, updateProfile } = useProfile();

    const [fullName, setFullName] = useState(profile.fullName);
    const [email, setEmail] = useState(profile.email);
    const [phone, setPhone] = useState(profile.phone);
    const [serviceArea, setServiceArea] = useState(profile.serviceArea);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [isLoadingProvinces, setIsLoadingProvinces] = useState(true);
    const [provinceError, setProvinceError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        async function loadProvinces() {
            try {
                setIsLoadingProvinces(true);
                setProvinceError(null);

                const response = await fetch(
                    "https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json",
                    { signal: controller.signal },
                );

                if (!response.ok) {
                    throw new Error("Failed to load provinces");
                }

                const data = (await response.json()) as Province[];
                setProvinces(data);
            } catch (error) {
                if (
                    error instanceof DOMException &&
                    error.name === "AbortError"
                ) {
                    return;
                }

                setProvinceError("Failed to load provinces");
            } finally {
                setIsLoadingProvinces(false);
            }
        }

        loadProvinces();

        return () => controller.abort();
    }, []);

    const serviceAreaOptions = useMemo(() => {
        if (!serviceArea) return provinces;

        const hasCurrentValue = provinces.some(
            (province) => province.name === serviceArea,
        );

        if (hasCurrentValue) return provinces;

        return [
            { id: "current-service-area", name: serviceArea },
            ...provinces,
        ];
    }, [provinces, serviceArea]);

    function handleSave() {
        updateProfile({ fullName, email, phone, serviceArea });
        navigate(-1);
    }

    return (
        <div className="min-h-screen bg-[#F3F4F5]">
            <div className="min-h-screen bg-[#F8F9FA] shadow-[0_20px_40px_rgba(0,0,0,0.1)] relative flex flex-col">
                {/* Header */}
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
                        Edit Profile
                    </h1>
                    <div className="w-10" />
                </header>

                {/* Main Canvas */}
                <main className="flex-1 overflow-y-auto pt-20 pb-32 px-5 space-y-8">
                    {/* Profile Picture Section */}
                    <section className="flex flex-col items-center gap-3">
                        <div className="w-28 h-28 rounded-full border-4 border-[#F8F9FA] shadow-[0_8px_16px_rgba(15,82,56,0.08)] overflow-hidden">
                            <img
                                src="/src/assets/profile_picture.svg"
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <button
                            type="button"
                            className="bg-[#CCE6D0] text-[#0F5238] text-xs font-semibold tracking-[0.05em] px-3 py-1 rounded-full"
                        >
                            Change Photo
                        </button>
                    </section>

                    {/* Edit Form */}
                    <section className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold tracking-[0.05em] text-[#404943]">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="w-4 h-4 text-[#707973] absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    value={fullName}
                                    onChange={(e) =>
                                        setFullName(e.target.value)
                                    }
                                    className="w-full border border-[#BFC9C1] rounded-lg py-3 pl-10 pr-3 bg-[#F8F9FA] text-sm text-[#191C1D]"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold tracking-[0.05em] text-[#404943]">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-[#707973] absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border border-[#BFC9C1] rounded-lg py-3 pl-10 pr-3 bg-[#F8F9FA] text-sm text-[#191C1D]"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold tracking-[0.05em] text-[#404943]">
                                Phone Number
                            </label>
                            <div className="relative">
                                <Phone className="w-4 h-4 text-[#707973] absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full border border-[#BFC9C1] rounded-lg py-3 pl-10 pr-3 bg-[#F8F9FA] text-sm text-[#191C1D]"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold tracking-[0.05em] text-[#404943]">
                                Service Area
                            </label>
                            <div className="relative">
                                <MapPin className="w-4 h-4 text-[#707973] absolute left-3 top-1/2 -translate-y-1/2" />
                                <select
                                    value={serviceArea}
                                    onChange={(e) =>
                                        setServiceArea(e.target.value)
                                    }
                                    disabled={isLoadingProvinces}
                                    className="w-full border border-[#BFC9C1] rounded-lg py-3 pl-10 pr-8 bg-[#F8F9FA] text-sm text-[#191C1D] disabled:text-[#707973]"
                                >
                                    {isLoadingProvinces ? (
                                        <option>Loading provinces...</option>
                                    ) : provinceError ? (
                                        <>
                                            <option value={serviceArea}>
                                                {serviceArea}
                                            </option>
                                            <option disabled>
                                                Failed to load provinces
                                            </option>
                                        </>
                                    ) : (
                                        serviceAreaOptions.map((province) => (
                                            <option
                                                key={province.id}
                                                value={province.name}
                                            >
                                                {province.name}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Bottom Action Area */}
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
                            className="flex-1 bg-[#0F5238] text-white text-xs font-semibold tracking-[0.05em] py-4 rounded-lg shadow-[0_4px_12px_rgba(15,82,56,0.2)]"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
