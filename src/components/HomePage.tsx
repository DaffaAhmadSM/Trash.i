import { Bell, Trash2, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNavBar from "./BottomNavBar";

export default function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F3F4F5]">
            <div className="w-full bg-[#F8F9FA] shadow-[0_20px_40px_rgba(15,82,56,0.1)] min-h-screen relative flex flex-col">
                {/* Header - TopAppBar */}
                <header className="flex items-center justify-between px-4 py-4 border-b border-[#BFC9C1]">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#0F5238] flex items-center justify-center">
                            <Trash2 className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-[#0F5238] font-semibold text-lg">
                            Trash.I
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#E7E8E9] flex items-center justify-center">
                            <Bell className="w-4 h-4 text-[#404943]" />
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#E7E8E9] flex items-center justify-center">
                            <User className="w-4 h-4 text-[#404943]" />
                        </div>
                    </div>
                </header>

                {/* Main Content Scrollable Area */}
                <main className="flex-1 overflow-y-auto pb-[90px]">
                    {/* Greeting Section */}
                    <section className="px-4 pt-6 pb-4">
                        <h2 className="text-[#191C1D] text-xl font-semibold">
                            Good Morning, Alex
                        </h2>
                        <p className="text-sm text-[#404943]">
                            Ready to make a difference today?
                        </p>
                    </section>

                    {/* Quick Stats Bento Grid */}
                    <section className="px-4 pb-6">
                        <div className="grid grid-cols-1">
                            <div className="rounded-xl bg-[#2D6A4F] p-4 shadow-[0_8px_8px_rgba(15,82,56,0.04)] text-white">
                                <p className="text-xs opacity-80">
                                    Total Waste
                                </p>
                                <p className="text-2xl font-semibold mt-2">
                                    124kg
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* CTA Section → Button */}
                    <section className="px-4 pb-6">
                        <button
                            onClick={() => navigate("/book-pickup")}
                            className="w-full h-14 rounded-lg bg-[#0F5238] text-white text-lg font-semibold shadow-[0_4px_12px_rgba(15,82,56,0.2)]"
                        >
                            Book Pickup
                        </button>
                    </section>

                    {/* Learn & Grow */}
                    <section className="px-4 pb-6">
                        <div className="rounded-xl border border-[#BFC9C1] bg-white p-4 shadow-[0_4px_12px_rgba(15,82,56,0.04)] flex items-center justify-between gap-4">
                            <div>
                                <h3 className="text-[#191C1D] text-lg font-semibold">
                                    Learn & Grow
                                </h3>
                                <p className="text-sm text-[#404943]">
                                    Sustainability tips, recycling guides, more.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => navigate("/articles")}
                                className="shrink-0 rounded-full bg-[#CCE6D0] px-4 py-2 text-xs font-semibold tracking-[0.05em] text-[#0F5238]"
                            >
                                Open
                            </button>
                        </div>
                    </section>

                    {/* Recent Activities */}
                    <section className="px-4 pb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[#191C1D] text-lg font-semibold">
                                Recent Activity
                            </h3>
                            <button className="text-xs text-[#404943]">
                                View all
                            </button>
                        </div>
                        <div className="space-y-3">
                            {[
                                {
                                    title: "Plastic Collection",
                                    time: "Today • 10:30 AM",
                                },
                                {
                                    title: "Paper Pickup",
                                    time: "Yesterday • 9:10 AM",
                                },
                                {
                                    title: "Glass Drop",
                                    time: "May 22 • 4:20 PM",
                                },
                            ].map((item) => (
                                <div
                                    key={item.title}
                                    className="bg-white rounded-lg border border-[#BFC9C1] p-4"
                                >
                                    <p className="text-sm font-medium text-[#191C1D]">
                                        {item.title}
                                    </p>
                                    <p className="text-xs text-[#404943]">
                                        {item.time}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>

                <BottomNavBar activeTab="home" />
            </div>
        </div>
    );
}
