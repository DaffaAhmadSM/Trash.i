import { useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut } from "lucide-react";
import { useProfile } from "../context/ProfileContext";

const settingsItems = [
    {
        label: "Edit Profile",
        icon: "/src/assets/settings_icon_edit.svg",
        action: "/edit-profile",
    },
    {
        label: "Address Management",
        icon: "/src/assets/settings_icon_address.svg",
        action: null,
    },
];

export default function ProfilePage() {
    const navigate = useNavigate();
    const { profile } = useProfile();

    return (
        <div className="min-h-screen bg-[#EDEEEF]">
            <div className="min-h-screen bg-[#F8F9FA] shadow-[0_20px_40px_rgba(15,82,56,0.1)] relative flex flex-col">
                {/* Header */}
                <header className="flex items-center justify-between px-4 py-4 border-b border-[#BFC9C1]">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#EDEEEF]"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="w-4 h-4 text-[#0F5238]" />
                    </button>
                    <h1 className="text-[22px] font-bold tracking-[-0.025em] text-[#0F5238]">
                        My Profile
                    </h1>
                    <div className="w-10" />
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto px-4 pt-6 pb-[92px] space-y-8">
                    {/* Profile Info */}
                    <section className="flex flex-col items-center text-center space-y-2">
                        <div className="relative w-24 h-24">
                            <img
                                src="/src/assets/profile_picture.svg"
                                alt="Profile"
                                className="w-24 h-24 rounded-full shadow-[0_8px_16px_rgba(15,82,56,0.08)] object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => navigate("/edit-profile")}
                                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#0F5238] border-2 border-[#F8F9FA] flex items-center justify-center"
                                aria-label="Edit profile"
                            >
                                <img
                                    src="/src/assets/edit_profile_btn.svg"
                                    alt="Edit"
                                    className="w-4 h-4"
                                />
                            </button>
                        </div>
                        <h2 className="text-[20px] font-semibold text-[#191C1D]">
                            {profile.fullName}
                        </h2>
                        <p className="text-sm text-[#404943]">
                            {profile.email}
                        </p>

                        {/* Stats Banner */}
                        <div className="w-full bg-[#CCE6D0] rounded-xl p-4 shadow-[0_4px_12px_rgba(15,82,56,0.04)] flex mt-4">
                            <div className="flex-1 flex flex-col items-center">
                                <p className="text-[32px] font-bold leading-10 tracking-[-0.02em] text-[#0F5238]">
                                    12
                                </p>
                                <p className="text-xs font-semibold tracking-[0.05em] text-[#506856]">
                                    Pickups
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Settings List */}
                    <section className="space-y-4">
                        <div className="bg-[#F8F9FA] border border-[#BFC9C1] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] divide-y divide-[#BFC9C1]">
                            {settingsItems.map((item) => (
                                <button
                                    key={item.label}
                                    type="button"
                                    onClick={() =>
                                        item.action && navigate(item.action)
                                    }
                                    className="w-full flex items-center justify-between p-4"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-[#EDEEEF] flex items-center justify-center">
                                            <img
                                                src={item.icon}
                                                alt=""
                                                className="w-5 h-5"
                                            />
                                        </div>
                                        <span className="text-base text-[#191C1D]">
                                            {item.label}
                                        </span>
                                    </div>
                                    <img
                                        src="/src/assets/arrow_forward.svg"
                                        alt=""
                                        className="w-3 h-3"
                                    />
                                </button>
                            ))}
                        </div>

                        <button
                            type="button"
                            className="w-full flex items-center justify-center gap-4 bg-[#FFDAD6] text-[#BA1A1A] font-semibold text-base py-4 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </section>
                </main>

                {/* Bottom Navigation */}
                <nav className="absolute bottom-0 left-0 right-0 bg-[#F8F9FA] shadow-[0_-4px_20px_rgba(15,82,56,0.08)]">
                    <div className="flex items-center justify-between px-[22.6px] py-2">
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="flex flex-col items-center text-[#404943] px-4 py-2"
                        >
                            <img
                                src="/src/assets/nav_home_icon.svg"
                                alt=""
                                className="w-5 h-5"
                            />
                            <span className="text-xs font-semibold tracking-[0.05em]">
                                Home
                            </span>
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/book-pickup")}
                            className="flex flex-col items-center text-[#404943] px-4 py-2"
                        >
                            <img
                                src="/src/assets/nav_book_icon.svg"
                                alt=""
                                className="w-5 h-5"
                            />
                            <span className="text-xs font-semibold tracking-[0.05em]">
                                Book
                            </span>
                        </button>
                        <button
                            type="button"
                            className="flex flex-col items-center text-[#404943] px-4 py-2"
                        >
                            <img
                                src="/src/assets/nav_history_icon.svg"
                                alt=""
                                className="w-5 h-5"
                            />
                            <span className="text-xs font-semibold tracking-[0.05em]">
                                History
                            </span>
                        </button>
                        <button
                            type="button"
                            className="rounded-xl bg-[#CCE6D0] px-4 py-2 flex flex-col items-center text-[#506856]"
                        >
                            <img
                                src="/src/assets/nav_profile_active_icon.svg"
                                alt=""
                                className="w-5 h-5"
                            />
                            <span className="text-xs font-semibold tracking-[0.05em]">
                                Profile
                            </span>
                        </button>
                    </div>
                </nav>
            </div>
        </div>
    );
}
