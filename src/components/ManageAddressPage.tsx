import {
    BriefcaseBusiness,
    Home,
    MapPin,
    Pencil,
    PlusCircle,
    Trash2,
    User,
    Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
    type AddressLabel,
    type SavedAddress,
    useProfile,
} from "../context/ProfileContext";

function getAddressIcon(label: AddressLabel) {
    if (label === "Home") return Home;
    if (label === "Office") return BriefcaseBusiness;
    return MapPin;
}

function formatAddressLine(address: SavedAddress) {
    return `${address.districtName}, ${address.cityName}, ${address.provinceName}`;
}

export default function ManageAddressPage() {
    const navigate = useNavigate();
    const { addresses, deleteAddress, setPrimaryAddress } = useProfile();

    return (
        <div className="min-h-screen bg-[#E7E8E9]">
            <div className="min-h-screen bg-[#F8F9FA] shadow-[0_20px_40px_rgba(15,82,56,0.1)] relative flex flex-col">
                <header className="absolute top-0 left-0 right-0 h-16 px-4 flex items-center justify-between bg-[#F8F9FA] shadow-[0_1px_2px_rgba(0,0,0,0.05)] z-10">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#0F5238] flex items-center justify-center">
                            <Home className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-[#0F5238] font-bold text-[22px] leading-[30px] tracking-[-0.025em]">
                            Trash.I
                        </span>
                    </div>
                    <div className="w-10" />
                </header>

                <main className="flex-1 overflow-y-auto px-4 pt-20 pb-[108px] space-y-4">
                    <section className="space-y-1 py-2">
                        <h1 className="text-[22px] font-semibold leading-[30px] text-[#191C1D]">
                            Addresses
                        </h1>
                        <p className="text-sm leading-5 text-[#404943]">
                            Manage locations for pick-ups and services.
                        </p>
                    </section>

                    {addresses.length === 0 ? (
                        <section className="rounded-xl border border-[#BFC9C1] bg-white p-6 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                            <p className="text-base font-semibold text-[#191C1D]">
                                No saved addresses yet
                            </p>
                            <p className="mt-1 text-sm text-[#404943]">
                                Add address for faster pickup booking.
                            </p>
                        </section>
                    ) : (
                        addresses.map((address) => {
                            const AddressIcon = getAddressIcon(address.label);

                            return (
                                <section
                                    key={address.id}
                                    className="overflow-hidden rounded-xl border border-[#BFC9C1] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                                >
                                    <div className="relative h-[100px] overflow-hidden bg-[#EDEEEF]">
                                        <div
                                            className="absolute inset-0 bg-cover bg-center opacity-80"
                                            style={{
                                                backgroundImage:
                                                    "url(/src/assets/map_image.png)",
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
                                        {address.isPrimary ? (
                                            <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-[#CCE6D0] px-3 py-1 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                                                <MapPin className="h-3 w-3 text-[#506856]" />
                                                <span className="text-[10px] leading-5 text-[#506856]">
                                                    Primary
                                                </span>
                                            </div>
                                        ) : null}
                                    </div>

                                    <div className="flex items-start justify-between gap-4 p-4">
                                        <div className="flex gap-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#CEE9D3]">
                                                <AddressIcon className="h-4 w-4 text-[#0F5238]" />
                                            </div>
                                            <div className="space-y-1">
                                                <div>
                                                    <h2 className="text-base font-semibold text-[#191C1D]">
                                                        {address.label}
                                                    </h2>
                                                    <p className="text-sm text-[#404943]">
                                                        {address.recipientName}
                                                    </p>
                                                </div>
                                                <p className="max-w-[210px] text-sm leading-5 text-[#404943]">
                                                    {address.fullAddress}
                                                </p>
                                                <p className="text-xs font-semibold tracking-[0.05em] text-[#506856]">
                                                    {formatAddressLine(address)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(
                                                        `/manage-addresses/${address.id}/edit`,
                                                    )
                                                }
                                                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#BFC9C1] text-[#404943]"
                                                aria-label={`Edit ${address.label} address`}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    deleteAddress(address.id)
                                                }
                                                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#FFDAD6] text-[#BA1A1A]"
                                                aria-label={`Delete ${address.label} address`}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {!address.isPrimary ? (
                                        <div className="px-4 pb-4">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setPrimaryAddress(
                                                        address.id,
                                                    )
                                                }
                                                className="w-full rounded-lg border border-[#BFC9C1] bg-[#F8F9FA] px-4 py-3 text-xs font-semibold tracking-[0.05em] text-[#0F5238]"
                                            >
                                                Make Primary
                                            </button>
                                        </div>
                                    ) : null}
                                </section>
                            );
                        })
                    )}

                    <section className="pt-2">
                        <button
                            type="button"
                            onClick={() => navigate("/manage-addresses/new")}
                            className="flex h-14 w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#BFC9C1] text-[#0F5238]"
                        >
                            <PlusCircle className="h-4 w-4" />
                            <span className="text-xs font-semibold tracking-[0.05em]">
                                Add New Address
                            </span>
                        </button>
                    </section>
                </main>

                <nav className="absolute bottom-0 left-0 right-0 bg-[#F8F9FA] shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center justify-between px-[22.75px] py-2 pb-4">
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="flex w-16 flex-col items-center px-1 py-1 text-[#404943]"
                        >
                            <img
                                src="/src/assets/nav_home_icon.svg"
                                alt=""
                                className="h-5 w-5"
                            />
                            <span className="pt-1 text-xs font-semibold tracking-[0.05em]">
                                Home
                            </span>
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/book-pickup")}
                            className="flex w-16 flex-col items-center px-1 py-1 text-[#404943]"
                        >
                            <img
                                src="/src/assets/nav_book_icon.svg"
                                alt=""
                                className="h-5 w-5"
                            />
                            <span className="pt-1 text-xs font-semibold tracking-[0.05em]">
                                Book
                            </span>
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/history")}
                            className="flex w-16 flex-col items-center px-1 py-1 text-[#404943]"
                        >
                            <Activity className="h-5 w-5" />
                            <span className="pt-1 text-xs font-semibold tracking-[0.05em]">
                                History
                            </span>
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/profile")}
                            className="flex w-16 flex-col items-center rounded-full bg-[#CCE6D0] px-4 py-1 text-[#506856]"
                        >
                            <User className="h-4 w-4" />
                            <span className="pt-1 text-xs font-semibold tracking-[0.05em]">
                                Profile
                            </span>
                        </button>
                    </div>
                </nav>
            </div>
        </div>
    );
}
