import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Check,
  Clock,
  CreditCard,
  MapPin,
  Wallet,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { api, type ApiError } from "../lib/api";
import { type PaymentMethod } from "../context/HistoryContext";

type TransactionDetail = {
  trans_id: number;
  total_paid: string;
  time_slot: string | null;
  scheduled_date: string | null;
  payment_fees: Array<{
    fee_id: number;
    name: string;
    price: string;
    currency: string;
  }>;
  transaction_details: Array<{
    waste_category: { name_category: string };
  }>;
  address: {
    label: string;
    city: string;
  } | null;
};

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(iso));
}

function formatTimeSlot(slot: string | null): string {
  if (!slot) return "—";
  const map: Record<string, string> = {
    "8AM-10AM": "08:00 - 10:00",
    "10AM-12PM": "10:00 - 12:00",
    "1PM-3PM": "13:00 - 15:00",
    "3PM-5PM": "15:00 - 17:00",
  };
  return map[slot] ?? slot;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const transId = (location.state as { transId?: number } | null)?.transId;

  const [tx, setTx] = useState<TransactionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("wallet");
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  useEffect(() => {
    if (!transId) {
      setLoading(false);
      setFetchError("No booking data found.");
      return;
    }
    api<TransactionDetail>(`/transactions/${transId}`)
      .then(setTx)
      .catch((err: ApiError) => setFetchError(err.message))
      .finally(() => setLoading(false));
  }, [transId]);

  const total = tx ? Number(tx.total_paid) : 0;
  const catName = tx?.transaction_details[0]?.waste_category?.name_category ?? "—";
  const fees = tx?.payment_fees ?? [];

  const handlePayment = async () => {
    if (!transId) return;
    setPaying(true);
    setPayError(null);
    try {
      await api(`/checkout/${transId}`, { method: "POST" });
      navigate(`/receipt/${transId}`);
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setPayError(apiErr.message ?? "Payment failed");
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F4F5] flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full px-8">
          <div className="h-6 w-48 bg-[#EDEEEF] rounded mx-auto" />
          <div className="h-40 bg-[#EDEEEF] rounded-xl" />
          <div className="h-20 bg-[#EDEEEF] rounded-xl" />
        </div>
      </div>
    );
  }

  if (fetchError || !tx) {
    return (
      <div className="min-h-screen bg-[#F3F4F5] flex flex-col items-center justify-center gap-4 px-8">
        <p className="text-[#191C1D] font-semibold">{fetchError ?? "Booking not found"}</p>
        <button
          type="button"
          onClick={() => navigate("/book-pickup")}
          className="bg-[#0F5238] text-white px-4 py-2 rounded-lg"
        >
          Back to Booking
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F5]">
      <div className="min-h-screen bg-[#F8F9FA] shadow-[0_20px_40px_rgba(15,82,56,0.1)] relative flex flex-col">
        <header className="flex items-center justify-between px-4 py-4 border-b border-[#E1E3E4]">
          <button
            type="button"
            onClick={() => navigate("/book-pickup")}
            className="p-2 rounded-full hover:bg-[#F3F4F5]"
          >
            <ArrowLeft className="w-4 h-4 text-[#404943]" />
          </button>
          <h1 className="text-[#191C1D] text-lg font-bold">Checkout</h1>
          <div className="w-8" />
        </header>

        <main className="flex-1 overflow-y-auto pb-[150px]">
          <div className="px-4 py-6 space-y-6">
            {/* Booking Summary */}
            <section className="space-y-2">
              <h2 className="text-xs font-semibold tracking-[0.05em] text-[#707973]">
                BOOKING SUMMARY
              </h2>
              <div className="bg-white border border-[#E1E3E4] rounded-xl shadow-[0_8px_24px_rgba(15,82,56,0.04)] overflow-hidden">
                <div className="flex items-center gap-3 p-4 border-b border-[#E1E3E4]">
                  <div className="w-10 h-10 rounded-full bg-[#CCE6D0] flex items-center justify-center">
                    <span className="text-xs font-bold text-[#0F5238]">
                      {catName.slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#191C1D]">{catName} Pickup</p>
                    <p className="text-xs text-[#404943]">TRX-{String(tx.trans_id).padStart(6, "0")}</p>
                  </div>
                </div>
                <div className="p-4 space-y-4 text-sm">
                  <div className="flex gap-3">
                    <Calendar className="w-4 h-4 text-[#707973] mt-0.5" />
                    <div>
                      <p className="font-medium text-[#191C1D]">{formatDate(tx.scheduled_date)}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Clock className="w-4 h-4 text-[#707973] mt-0.5" />
                    <div>
                      <p className="font-medium text-[#191C1D]">{formatTimeSlot(tx.time_slot)}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <MapPin className="w-4 h-4 text-[#707973] mt-0.5" />
                    <div>
                      <p className="font-medium text-[#191C1D]">{tx.address?.label ?? "—"}</p>
                      <p className="text-xs text-[#404943]">{tx.address?.city ?? "—"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Pricing from API */}
            <section className="space-y-2">
              <h2 className="text-xs font-semibold tracking-[0.05em] text-[#707973]">
                PAYMENT BREAKDOWN
              </h2>
              <div className="bg-[#0F5238] rounded-xl p-4 text-white shadow-[0_12px_30px_rgba(15,82,56,0.15)]">
                <div className="space-y-3">
                  {fees.map((fee) => (
                    <div key={fee.fee_id} className="flex justify-between text-sm">
                      <span className="opacity-90">{fee.name}</span>
                      <span>{formatRupiah(Number(fee.price))}</span>
                    </div>
                  ))}
                  <div className="border-t border-[#2D6A4F] pt-3 flex justify-between items-center">
                    <span className="font-medium">Total</span>
                    <span className="text-3xl font-semibold text-[#B1F0CE]">
                      {formatRupiah(total)}
                    </span>
                  </div>
                </div>
                <p className="text-[10px] opacity-70 text-center mt-3">
                  Final price may change after weighing.
                </p>
              </div>
            </section>

            {/* Payment Method */}
            <section className="space-y-2">
              <h2 className="text-xs font-semibold tracking-[0.05em] text-[#707973]">
                PAYMENT METHOD
              </h2>
              <div className="space-y-3">
                {(["wallet", "card", "bank"] as PaymentMethod[]).map((method) => {
                  const icons = {
                    wallet: Wallet,
                    card: CreditCard,
                    bank: Building2,
                  };
                  const labels = {
                    wallet: "Trash.I Wallet",
                    card: "Credit / Debit Card",
                    bank: "Bank Transfer",
                  };
                  const subtitles = {
                    wallet: "Balance: Rp 45.000",
                    card: "Link new card",
                    bank: "Virtual Account",
                  };
                  const Icon = icons[method];
                  return (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`w-full text-left p-4 rounded-xl border transition flex items-center justify-between ${
                        paymentMethod === method
                          ? "border-[#0F5238] bg-[#F3F4F5]"
                          : "border-[#E1E3E4] bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#E1E3E4] flex items-center justify-center">
                          <Icon className="w-5 h-5 text-[#404943]" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#191C1D]">{labels[method]}</p>
                          <p className="text-xs text-[#404943]">{subtitles[method]}</p>
                        </div>
                      </div>
                      {paymentMethod === method ? (
                        <Check className="w-5 h-5 text-[#0F5238]" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        </main>

        <div className="absolute bottom-0 left-0 right-0 bg-[#F8F9FA] border-t border-[#E1E3E4] shadow-[0_-8px_24px_rgba(15,82,56,0.05)] px-4 pb-8 pt-4">
          {payError && <p className="text-red-500 text-xs mb-2">{payError}</p>}
          <button
            type="button"
            onClick={handlePayment}
            disabled={paying}
            className="w-full bg-[#0F5238] text-white rounded-lg py-4 text-base font-semibold shadow-[0_4px_12px_rgba(15,82,56,0.2)] disabled:opacity-60"
          >
            {paying ? "Processing..." : `Pay & Confirm ${formatRupiah(total)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
