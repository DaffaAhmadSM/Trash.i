import { AlertTriangle, ArrowLeft, Box, Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";

const chipClass =
    "bg-[#EDEEEF] text-[#191C1D] text-xs font-semibold tracking-[0.05em] px-3 py-1 rounded-full";

export default function DetailWasteCategoryPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F3F4F5] p-4">
            <div className="min-h-screen bg-[#F8F9FA] border border-[#BFC9C1] rounded-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.1)] p-4 space-y-4">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="w-9 h-9 rounded-full border border-[#BFC9C1] bg-white flex items-center justify-center text-[#404943] hover:bg-[#F3F4F5]"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <h1 className="text-[#191C1D] text-lg font-semibold">
                        Waste Categories
                    </h1>
                </div>
                {/* Intro */}
                <section className="text-[#404943] text-[16px] leading-[24px]">
                    Proper sorting ensures valuable materials are recovered and
                    harmful substances don't leak into the environment. Learn
                    the three main categories below.
                </section>

                {/* Organic */}
                <section className="bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.04)] p-4 border-l-4 border-[#0F5238] space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#CCE6D0] flex items-center justify-center">
                            <Leaf className="w-5 h-5 text-[#0F5238]" />
                        </div>
                        <h2 className="text-[#0F5238] text-[20px] font-semibold">
                            Organic
                        </h2>
                    </div>
                    <p className="text-[#404943] text-[16px] leading-[24px]">
                        Biodegradable waste that comes from plants or animals.
                        This is naturally broken down and turned into compost.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <span className={chipClass}>Food Scraps</span>
                        <span className={chipClass}>Leaves &amp; Twigs</span>
                        <span className={chipClass}>Coffee Grounds</span>
                    </div>
                </section>

                {/* Inorganic */}
                <section className="bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.04)] p-4 border-l-4 border-[#707973] space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#E1E3E4] flex items-center justify-center">
                            <Box className="w-5 h-5 text-[#191C1D]" />
                        </div>
                        <h2 className="text-[#191C1D] text-[20px] font-semibold">
                            Inorganic
                        </h2>
                    </div>
                    <p className="text-[#404943] text-[16px] leading-[24px]">
                        Dry materials that do not decompose easily. Many of
                        these can be processed and recycled into new products.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <span className={chipClass}>Plastic Bottles</span>
                        <span className={chipClass}>Glass Jars</span>
                        <span className={chipClass}>Clean Paper</span>
                    </div>
                </section>

                {/* Hazardous */}
                <section className="bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.04)] p-4 border-l-4 border-[#BA1A1A] space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#FFDAD6] flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-[#BA1A1A]" />
                        </div>
                        <h2 className="text-[#BA1A1A] text-[20px] font-semibold">
                            Hazardous (B3)
                        </h2>
                    </div>
                    <p className="text-[#404943] text-[16px] leading-[24px]">
                        Toxic, corrosive, or flammable materials. Requires
                        special handling to prevent severe environmental damage.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <span className={chipClass}>Batteries</span>
                        <span className={chipClass}>
                            Paints &amp; Chemicals
                        </span>
                        <span className={chipClass}>E-Waste</span>
                    </div>
                </section>
            </div>
        </div>
    );
}
