import { useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut, Settings, MapPin, ChevronRight, Award } from "lucide-react";
import { useProfile } from "../context/ProfileContext";
import { useHistory } from "../context/HistoryContext";
import BottomNavBar from "./BottomNavBar";

const settingsItems = [
    {
        label: "Edit Profile",
        subLabel: "Change your name and personal details",
        icon: <Settings className="w-5 h-5 text-emerald-600" />,
        action: "/edit-profile",
        color: "bg-emerald-100"
    },
    {
        label: "Address Management",
        subLabel: "Manage your pickup locations",
        icon: <MapPin className="w-5 h-5 text-blue-600" />,
        action: "/manage-addresses",
        color: "bg-blue-100"
    },
];

export default function ProfilePage() {
    const navigate = useNavigate();
    const { profile } = useProfile();
    const { historyItems } = useHistory();

    const completedPickups = historyItems.filter(
        (item) => item.status === "completed",
    ).length;

    return (
        <div className="min-h-screen bg-[#F0F2F5] flex justify-center">
            <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative flex flex-col overflow-hidden animate-in fade-in duration-500">
                
                {/* Header dengan Gradient Background */}
                <header className="relative h-48 bg-gradient-to-br from-[#0F5238] to-[#2D6A4F] px-4 pt-8 text-white">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 active:scale-90 transition-all"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-lg font-bold tracking-tight">My Profile</h1>
                        <div className="w-9" />
                    </div>
                </header>

                {/* Profile Card (Floating Effect) */}
                <main className="flex-1 px-5 -mt-16 z-10 space-y-6">
                    <section className="bg-white rounded-3xl p-6 shadow-xl shadow-emerald-900/5 flex flex-col items-center text-center animate-in slide-in-from-bottom-8 duration-700 ease-out">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-emerald-400 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                            <img
                                src="/src/assets/profile_picture.svg"
                                alt="Profile"
                                className="relative w-28 h-28 rounded-full border-4 border-white shadow-md object-cover transform transition-transform group-hover:scale-105"
                            />
                            <button
                                onClick={() => navigate("/edit-profile")}
                                className="absolute bottom-1 right-1 bg-emerald-500 p-2 rounded-full border-2 border-white text-white shadow-lg hover:bg-emerald-600 active:scale-90 transition-all"
                            >
                                <Settings className="w-4 h-4 animate-spin-slow" />
                            </button>
                        </div>

                        <div className="mt-4">
                            <h2 className="text-2xl font-bold text-gray-800">{profile.fullName}</h2>
                            <p className="text-gray-500 text-sm font-medium">{profile.email}</p>
                        </div>

                        {/* Badges/Stats dengan Animasi Pulse Lembut */}
                        <div className="flex gap-4 mt-6 w-full">
                            <div className="flex-1 bg-emerald-50 rounded-2xl p-3 border border-emerald-100 hover:bg-emerald-100 transition-colors">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                    <Award className="w-4 h-4 text-emerald-600" />
                                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">Level</span>
                                </div>
                                <p className="text-xl font-black text-emerald-700">Eco Hero</p>
                            </div>
                            <div className="flex-1 bg-emerald-600 rounded-2xl p-3 shadow-lg shadow-emerald-600/20">
                                <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest mb-1">Total Pickups</p>
                                <p className="text-2xl font-black text-white">{completedPickups}</p>
                            </div>
                        </div>
                    </section>

                    {/* Menu List dengan Efek Friendly */}
                    <section className="space-y-3 animate-in slide-in-from-bottom-12 duration-1000 delay-150 fill-mode-both">
                        <h3 className="px-1 text-sm font-bold text-gray-400 uppercase tracking-widest">Account Settings</h3>
                        <div className="space-y-2">
                            {settingsItems.map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => navigate(item.action)}
                                    className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-emerald-200 hover:bg-emerald-50/30 active:scale-[0.98] transition-all group shadow-sm"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                            {item.icon}
                                        </div>
                                        <div className="text-left">
                                            <p className="text-base font-bold text-gray-800">{item.label}</p>
                                            <p className="text-xs text-gray-400">{item.subLabel}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                                </button>
                            ))}
                        </div>

                        {/* Logout Button dengan warna Red Soft */}
                        <button
                            className="w-full mt-6 flex items-center justify-center gap-3 bg-red-50 text-red-600 font-bold py-4 rounded-2xl border border-red-100 hover:bg-red-100 active:scale-95 transition-all"
                        >
                            <LogOut className="w-5 h-5" />
                            Sign Out
                        </button>
                    </section>
                </main>

                <div className="h-24"></div> {/* Spacer for nav */}
                <BottomNavBar activeTab="profile" />
            </div>
            
            {/* CSS Custom untuk animasi yang tidak ada default di Tailwind standar */}
            <style>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 8s linear infinite;
                }
            `}</style>
        </div>
    );
}