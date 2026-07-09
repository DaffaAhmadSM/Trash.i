import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, User } from "lucide-react";
import { useProfile } from "../context/ProfileContext";
import { useHistory } from "../context/HistoryContext";
import BottomNavBar from "./BottomNavBar";

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);

export default function HomePage() {
  const navigate = useNavigate();
  const { profile, loading: profileLoading } = useProfile();
  const { items: transactions, loading: txLoading, refetch } = useHistory();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const recentTx = transactions.slice(0, 3);
  const txCount = transactions.length;

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  })();

  return (
    <div className="min-h-screen bg-[#F3F4F5]">
      <div className="w-full bg-[#F8F9FA] shadow-[0_20px_40px_rgba(15,82,56,0.1)] min-h-screen relative flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-4 border-b border-[#BFC9C1]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#0F5238] flex items-center justify-center">
              <Trash2 className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-[#0F5238] font-semibold text-lg">Trash.I</span>
          </div>
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="w-8 h-8 rounded-full bg-[#E7E8E9] flex items-center justify-center"
          >
            <User className="w-4 h-4 text-[#404943]" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto pb-[90px]">
          {/* Greeting */}
          <section className="px-4 pt-6 pb-4">
            {profileLoading ? (
              <div className="space-y-2">
                <div className="h-6 w-48 bg-[#EDEEEF] rounded animate-pulse" />
                <div className="h-4 w-64 bg-[#EDEEEF] rounded animate-pulse" />
              </div>
            ) : (
              <>
                <h2 className="text-[#191C1D] text-xl font-semibold">
                  {greeting}, {profile?.name?.split(" ")[0] ?? "User"}
                </h2>
                <p className="text-sm text-[#404943]">
                  Ready to make a difference today?
                </p>
              </>
            )}
          </section>

          {/* Quick Stats */}
          <section className="px-4 pb-6">
            <div className="grid grid-cols-1">
              <div className="rounded-xl bg-[#2D6A4F] p-4 shadow-[0_8px_8px_rgba(15,82,56,0.04)] text-white">
                <p className="text-xs opacity-80">Total Bookings</p>
                <p className="text-2xl font-semibold mt-2">
                  {txLoading ? "..." : txCount}
                </p>
              </div>
            </div>
          </section>

          {/* Book Pickup CTA */}
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
                <h3 className="text-[#191C1D] text-lg font-semibold">Learn & Grow</h3>
                <p className="text-sm text-[#404943]">Sustainability tips, recycling guides, more.</p>
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

          {/* Recent Activity */}
          <section className="px-4 pb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#191C1D] text-lg font-semibold">Recent Activity</h3>
              {transactions.length > 3 && (
                <button
                  type="button"
                  onClick={() => navigate("/history")}
                  className="text-xs text-[#404943]"
                >
                  View all
                </button>
              )}
            </div>

            {txLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg border border-[#BFC9C1] p-4 animate-pulse">
                    <div className="h-4 w-32 bg-[#EDEEEF] rounded mb-2" />
                    <div className="h-3 w-24 bg-[#EDEEEF] rounded" />
                  </div>
                ))}
              </div>
            ) : recentTx.length === 0 ? (
              <div className="bg-white rounded-lg border border-[#BFC9C1] p-6 text-center">
                <p className="text-sm text-[#404943]">No bookings yet.</p>
                <button
                  type="button"
                  onClick={() => navigate("/book-pickup")}
                  className="mt-2 text-xs font-semibold text-[#0F5238]"
                >
                  Book your first pickup
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTx.map((tx) => {
                  const catName = tx.transaction_details[0]?.waste_category?.name_category ?? "—";
                  const date = tx.scheduled_date
                    ? new Date(tx.scheduled_date).toLocaleDateString("id-ID", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })
                    : "—";

                  return (
                    <button
                      key={tx.trans_id}
                      type="button"
                      onClick={() => navigate(`/receipt/${tx.trans_id}`)}
                      className="w-full bg-white rounded-lg border border-[#BFC9C1] p-4 text-left"
                    >
                      <p className="text-sm font-medium text-[#191C1D]">{catName} Pickup</p>
                      <p className="text-xs text-[#404943] mt-1">
                        {date} · {formatRupiah(Number(tx.total_paid))}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        </main>

        <BottomNavBar activeTab="home" />
      </div>
    </div>
  );
}
