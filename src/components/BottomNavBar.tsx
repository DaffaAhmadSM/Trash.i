import { BookOpen, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export type BottomNavTab =
    | "home"
    | "book"
    | "articles"
    | "history"
    | "profile";

type BottomNavBarProps = {
    activeTab: BottomNavTab;
};

const navItems: Array<{
    key: BottomNavTab;
    label: string;
    path: string;
    inactiveIcon?: string;
    activeIcon?: string;
}> = [
    {
        key: "home",
        label: "Home",
        path: "/",
        inactiveIcon: "/src/assets/nav_home_icon.svg",
        activeIcon: "/src/assets/home_active_icon.svg",
    },
    {
        key: "book",
        label: "Book",
        path: "/book-pickup",
        inactiveIcon: "/src/assets/nav_book_icon.svg",
        activeIcon: "/src/assets/book_icon.svg",
    },
    {
        key: "articles",
        label: "Articles",
        path: "/articles",
    },
    {
        key: "history",
        label: "History",
        path: "/history",
        inactiveIcon: "/src/assets/nav_history_icon.svg",
        activeIcon: "/src/assets/history_active_icon.svg",
    },
    {
        key: "profile",
        label: "Profile",
        path: "/profile",
        inactiveIcon: "/src/assets/profile_inactive_icon.svg",
        activeIcon: "/src/assets/nav_profile_active_icon.svg",
    },
];

export default function BottomNavBar({ activeTab }: BottomNavBarProps) {
    const navigate = useNavigate();

    return (
        <nav className="absolute bottom-0 left-0 right-0 bg-[#F8F9FA] shadow-[0_-4px_20px_rgba(15,82,56,0.08)]">
            <div className="flex items-center justify-between gap-1 px-3 py-2">
                {navItems.map((item) => {
                    const isActive = item.key === activeTab;

                    return (
                        <button
                            key={item.key}
                            type="button"
                            onClick={() => navigate(item.path)}
                            className={`min-w-0 flex-1 rounded-xl px-2 py-2 flex flex-col items-center justify-center ${
                                isActive
                                    ? "bg-[#CCE6D0] text-[#506856]"
                                    : "text-[#404943]"
                            }`}
                        >
                            {item.key === "articles" ? (
                                <BookOpen
                                    className={`w-5 h-5 ${
                                        isActive
                                            ? "text-[#506856]"
                                            : "text-[#404943]"
                                    }`}
                                />
                            ) : item.inactiveIcon ? (
                                <img
                                    src={
                                        isActive && item.activeIcon
                                            ? item.activeIcon
                                            : item.inactiveIcon
                                    }
                                    alt=""
                                    className="w-5 h-5"
                                />
                            ) : (
                                <User className="w-5 h-5" />
                            )}
                            <span className="mt-1 text-[11px] font-semibold tracking-[0.05em] leading-4">
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
