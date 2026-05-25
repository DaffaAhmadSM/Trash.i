import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Mail, MapPin, Phone, User, Camera } from "lucide-react";
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
        <div className="min-h-screen bg-[#F3F4F5] font-sans selection:bg-[#0F5238] selection:text-white">
            <div className="min-h-screen max-w-md mx-auto bg-white shadow-2xl relative flex flex-col overflow-hidden sm:rounded-3xl sm:my-8 sm:h-[calc(100vh-4rem)]">
                {/* Header - Added glassmorphism effect */}
                <header className="absolute top-0 left-0 right-0 z-10 h-16 flex items-center justify-between px-4 bg-white/80 backdrop-blur-md border-b border-gray-100">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-[#EDEEEF] active:scale-90"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="w-5 h-5 text-[#0F5238]" />
                    </button>
                    <h1 className="text-[20px] font-bold text-[#0F5238] tracking-tight">
                        Edit Profile
                    </h1>
                    <div className="w-10" />
                </header>

                {/* Main Canvas */}
                <main className="flex-1 overflow-y-auto pt-24 pb-32 px-6 space-y-8 animate-[fadeIn_0.3s_ease-out]">
                    {/* Profile Picture Section */}
                    <section className="flex flex-col items-center gap-4">
                        <div className="relative group cursor-pointer">
                            <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden transition-transform duration-300 group-hover:scale-105">
                                <img
                                    src="/src/assets/profile_picture.svg"
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                                {/* Interactive hover overlay */}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <Camera className="w-8 h-8 text-white" />
                                </div>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="bg-[#E8F3EA] text-[#0F5238] hover:bg-[#CCE6D0] hover:shadow-md active:scale-95 transition-all duration-200 text-sm font-bold tracking-wide px-5 py-2 rounded-full"
                        >
                            Change Photo
                        </button>
                    </section>

                    {/* Edit Form */}
                    <section className="space-y-5">
                        {/* Full Name Input */}
                        <div className="space-y-1.5 group">
                            <label className="text-xs font-bold tracking-wider text-gray-500 uppercase ml-1">
                                Full Name
                            </label>
                            <div className="relative transition-all duration-300">
                                <User className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 group-focus-within:text-[#0F5238]" />
                                <input
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full border-2 border-transparent bg-gray-50 rounded-2xl py-3.5 pl-12 pr-4 text-[15px] text-gray-800 outline-none transition-all duration-300 focus:bg-white focus:border-[#0F5238] focus:ring-4 focus:ring-[#0F5238]/10 hover:bg-gray-100 focus:hover:bg-white"
                                />
                            </div>
                        </div>

                        {/* Email Input */}
                        <div className="space-y-1.5 group">
                            <label className="text-xs font-bold tracking-wider text-gray-500 uppercase ml-1">
                                Email Address
                            </label>
                            <div className="relative transition-all duration-300">
                                <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 group-focus-within:text-[#0F5238]" />
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border-2 border-transparent bg-gray-50 rounded-2xl py-3.5 pl-12 pr-4 text-[15px] text-gray-800 outline-none transition-all duration-300 focus:bg-white focus:border-[#0F5238] focus:ring-4 focus:ring-[#0F5238]/10 hover:bg-gray-100 focus:hover:bg-white"
                                />
                            </div>
                        </div>

                        {/* Phone Input */}
                        <div className="space-y-1.5 group">
                            <label className="text-xs font-bold tracking-wider text-gray-500 uppercase ml-1">
                                Phone Number
                            </label>
                            <div className="relative transition-all duration-300">
                                <Phone className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 group-focus-within:text-[#0F5238]" />
                                <input
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full border-2 border-transparent bg-gray-50 rounded-2xl py-3.5 pl-12 pr-4 text-[15px] text-gray-800 outline-none transition-all duration-300 focus:bg-white focus:border-[#0F5238] focus:ring-4 focus:ring-[#0F5238]/10 hover:bg-gray-100 focus:hover:bg-white"
                                />
                            </div>
                        </div>

                        {/* Service Area Select */}
                        <div className="space-y-1.5 group">
                            <label className="text-xs font-bold tracking-wider text-gray-500 uppercase ml-1">
                                Service Area
                            </label>
                            <div className="relative transition-all duration-300">
                                <MapPin className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 group-focus-within:text-[#0F5238]" />
                                <select
                                    value={serviceArea}
                                    onChange={(e) => setServiceArea(e.target.value)}
                                    disabled={isLoadingProvinces}
                                    className="w-full border-2 border-transparent bg-gray-50 rounded-2xl py-3.5 pl-12 pr-8 text-[15px] text-gray-800 outline-none appearance-none transition-all duration-300 focus:bg-white focus:border-[#0F5238] focus:ring-4 focus:ring-[#0F5238]/10 hover:bg-gray-100 focus:hover:bg-white disabled:text-gray-400 disabled:bg-gray-100 cursor-pointer"
                                >
                                    {isLoadingProvinces ? (
                                        <option>Loading provinces...</option>
                                    ) : provinceError ? (
                                        <>
                                            <option value={serviceArea}>{serviceArea}</option>
                                            <option disabled>Failed to load provinces</option>
                                        </>
                                    ) : (
                                        serviceAreaOptions.map((province) => (
                                            <option key={province.id} value={province.name}>
                                                {province.name}
                                            </option>
                                        ))
                                    )}
                                </select>
                                {/* Custom Dropdown Arrow */}
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Bottom Action Area */}
                <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 px-6 py-5 z-10">
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex-1 bg-gray-100 text-gray-700 text-sm font-bold tracking-wide py-4 rounded-2xl transition-all duration-200 hover:bg-gray-200 active:scale-95"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            className="flex-1 bg-[#0F5238] text-white text-sm font-bold tracking-wide py-4 rounded-2xl shadow-[0_8px_20px_rgba(15,82,56,0.25)] transition-all duration-200 hover:bg-[#0c422c] hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(15,82,56,0.3)] active:scale-95 active:translate-y-0"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}