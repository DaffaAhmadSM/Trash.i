import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Crosshair, MapPin } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
    type AddressInput,
    type AddressLabel,
    type SavedAddress,
    useProfile,
} from "../context/ProfileContext";

type RegionOption = {
    id: string;
    name: string;
};

const ADDRESS_LABELS: AddressLabel[] = ["Home", "Office", "Other"];

function Field({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1">
            <label className="block text-xs font-semibold tracking-[0.05em] text-[#404943]">
                {label}
            </label>
            {children}
        </div>
    );
}

function formatSelectLabel(options: RegionOption[], id: string) {
    return options.find((option) => option.id === id)?.name ?? "";
}

export default function ManageAddressAddFormPage() {
    const navigate = useNavigate();
    const { addressId } = useParams();
    const { addresses, addAddress, updateAddress } = useProfile();

    const editingAddress = useMemo<SavedAddress | null>(
        () => addresses.find((address) => address.id === addressId) ?? null,
        [addressId, addresses],
    );

    const [label, setLabel] = useState<AddressLabel>(
        editingAddress?.label ?? "Home",
    );
    const [recipientName, setRecipientName] = useState(
        editingAddress?.recipientName ?? "",
    );
    const [phoneNumber, setPhoneNumber] = useState(
        editingAddress?.phoneNumber ?? "",
    );
    const [provinceId, setProvinceId] = useState(
        editingAddress?.provinceId ?? "",
    );
    const [cityId, setCityId] = useState(editingAddress?.cityId ?? "");
    const [districtId, setDistrictId] = useState(
        editingAddress?.districtId ?? "",
    );
    const [fullAddress, setFullAddress] = useState(
        editingAddress?.fullAddress ?? "",
    );
    const [note, setNote] = useState(editingAddress?.note ?? "");
    const [isPrimary, setIsPrimary] = useState(
        editingAddress?.isPrimary ?? false,
    );

    const [provinces, setProvinces] = useState<RegionOption[]>([]);
    const [cities, setCities] = useState<RegionOption[]>([]);
    const [districts, setDistricts] = useState<RegionOption[]>([]);

    const [isLoadingProvinces, setIsLoadingProvinces] = useState(true);
    const [isLoadingCities, setIsLoadingCities] = useState(false);
    const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
    const [regionError, setRegionError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        async function loadProvinces() {
            try {
                setIsLoadingProvinces(true);
                setRegionError(null);

                const response = await fetch(
                    "https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json",
                    { signal: controller.signal },
                );

                if (!response.ok) throw new Error("Failed to load provinces");

                const data = (await response.json()) as RegionOption[];
                setProvinces(data);
            } catch (error) {
                if (
                    error instanceof DOMException &&
                    error.name === "AbortError"
                ) {
                    return;
                }

                setRegionError("Failed to load region data");
            } finally {
                setIsLoadingProvinces(false);
            }
        }

        loadProvinces();

        return () => controller.abort();
    }, []);

    useEffect(() => {
        if (!provinceId) return;

        const controller = new AbortController();

        async function loadCities() {
            try {
                setIsLoadingCities(true);
                setRegionError(null);

                const response = await fetch(
                    `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceId}.json`,
                    { signal: controller.signal },
                );

                if (!response.ok) throw new Error("Failed to load cities");

                const data = (await response.json()) as RegionOption[];
                setCities(data);
            } catch (error) {
                if (
                    error instanceof DOMException &&
                    error.name === "AbortError"
                ) {
                    return;
                }

                setRegionError("Failed to load region data");
            } finally {
                setIsLoadingCities(false);
            }
        }

        loadCities();

        return () => controller.abort();
    }, [provinceId]);

    useEffect(() => {
        if (!cityId) return;

        const controller = new AbortController();

        async function loadDistricts() {
            try {
                setIsLoadingDistricts(true);
                setRegionError(null);

                const response = await fetch(
                    `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${cityId}.json`,
                    { signal: controller.signal },
                );

                if (!response.ok) throw new Error("Failed to load districts");

                const data = (await response.json()) as RegionOption[];
                setDistricts(data);
            } catch (error) {
                if (
                    error instanceof DOMException &&
                    error.name === "AbortError"
                ) {
                    return;
                }

                setRegionError("Failed to load region data");
            } finally {
                setIsLoadingDistricts(false);
            }
        }

        loadDistricts();

        return () => controller.abort();
    }, [cityId]);

    const isFormValid =
        recipientName.trim() &&
        phoneNumber.trim() &&
        provinceId &&
        cityId &&
        districtId &&
        fullAddress.trim();

    function handleProvinceChange(nextProvinceId: string) {
        setProvinceId(nextProvinceId);
        setCityId("");
        setDistrictId("");
        setCities([]);
        setDistricts([]);
    }

    function handleCityChange(nextCityId: string) {
        setCityId(nextCityId);
        setDistrictId("");
        setDistricts([]);
    }

    function handleSave() {
        const provinceName = formatSelectLabel(provinces, provinceId);
        const cityName = formatSelectLabel(cities, cityId);
        const districtName = formatSelectLabel(districts, districtId);

        if (!provinceName || !cityName || !districtName) return;

        const payload: AddressInput = {
            label,
            recipientName: recipientName.trim(),
            phoneNumber: phoneNumber.trim(),
            provinceId,
            provinceName,
            cityId,
            cityName,
            districtId,
            districtName,
            fullAddress: fullAddress.trim(),
            note: note.trim(),
            isPrimary,
        };

        if (editingAddress) {
            updateAddress(editingAddress.id, payload);
        } else {
            addAddress(payload);
        }

        navigate("/manage-addresses");
    }

    return (
        <div className="min-h-screen bg-[#F3F4F5]">
            <div className="min-h-screen bg-[#F8F9FA] border border-[#BFC9C1] shadow-[0_20px_40px_rgba(15,82,56,0.1)] relative flex flex-col">
                <header className="flex items-center justify-between px-4 h-16 border-b border-[#BFC9C1] bg-[#F8F9FA]">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#EDEEEF]"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="w-4 h-4 text-[#0F5238]" />
                    </button>
                    <h1 className="text-[22px] font-bold tracking-[-0.025em] text-[#0F5238]">
                        {editingAddress ? "Edit Address" : "Add New Address"}
                    </h1>
                    <div className="w-10" />
                </header>

                <main className="flex-1 overflow-y-auto pb-24">
                    <section className="relative h-[200px] overflow-hidden bg-[#E1E3E4]">
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{
                                backgroundImage:
                                    "url(/src/assets/map_image.png)",
                            }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <MapPin className="h-10 w-10 fill-[#0F5238] text-[#0F5238] drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)]" />
                        </div>
                        <button
                            type="button"
                            className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#F8F9FA] px-4 py-2 text-xs font-semibold tracking-[0.05em] text-[#0F5238] shadow-[0_4px_12px_rgba(15,82,56,0.15)]"
                        >
                            <Crosshair className="h-4 w-4" />
                            Use Current Location
                        </button>
                    </section>

                    <section className="space-y-6 p-5">
                        <div className="space-y-3">
                            <label className="block text-xs font-semibold tracking-[0.05em] text-[#404943]">
                                ADDRESS LABEL
                            </label>
                            <div className="flex gap-3">
                                {ADDRESS_LABELS.map((item) => {
                                    const active = item === label;

                                    return (
                                        <button
                                            key={item}
                                            type="button"
                                            onClick={() => setLabel(item)}
                                            className={`flex-1 rounded-xl border px-4 py-2 text-sm font-semibold ${
                                                active
                                                    ? "border-[#2D6A4F] bg-[#2D6A4F] text-white"
                                                    : "border-[#BFC9C1] bg-[#F8F9FA] text-[#404943]"
                                            }`}
                                        >
                                            {item}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Field label="Recipient Name">
                                <input
                                    value={recipientName}
                                    onChange={(event) =>
                                        setRecipientName(event.target.value)
                                    }
                                    className="w-full rounded-lg border border-[#BFC9C1] bg-[#F8F9FA] px-4 py-3 text-sm text-[#191C1D] outline-none"
                                />
                            </Field>

                            <Field label="Phone Number">
                                <input
                                    value={phoneNumber}
                                    onChange={(event) =>
                                        setPhoneNumber(event.target.value)
                                    }
                                    className="w-full rounded-lg border border-[#BFC9C1] bg-[#F8F9FA] px-4 py-3 text-sm text-[#191C1D] outline-none"
                                />
                            </Field>

                            <Field label="Province">
                                <select
                                    value={provinceId}
                                    onChange={(event) =>
                                        handleProvinceChange(event.target.value)
                                    }
                                    disabled={isLoadingProvinces}
                                    className="w-full rounded-lg border border-[#BFC9C1] bg-[#F8F9FA] px-4 py-3 text-sm text-[#191C1D] outline-none disabled:text-[#707973]"
                                >
                                    <option value="">
                                        {isLoadingProvinces
                                            ? "Loading provinces..."
                                            : "Select province"}
                                    </option>
                                    {provinces.map((province) => (
                                        <option
                                            key={province.id}
                                            value={province.id}
                                        >
                                            {province.name}
                                        </option>
                                    ))}
                                </select>
                            </Field>

                            <Field label="Kota / Kabupaten">
                                <select
                                    value={cityId}
                                    onChange={(event) =>
                                        handleCityChange(event.target.value)
                                    }
                                    disabled={!provinceId || isLoadingCities}
                                    className="w-full rounded-lg border border-[#BFC9C1] bg-[#F8F9FA] px-4 py-3 text-sm text-[#191C1D] outline-none disabled:text-[#707973]"
                                >
                                    <option value="">
                                        {isLoadingCities
                                            ? "Loading cities..."
                                            : "Select city / regency"}
                                    </option>
                                    {cities.map((city) => (
                                        <option key={city.id} value={city.id}>
                                            {city.name}
                                        </option>
                                    ))}
                                </select>
                            </Field>

                            <Field label="Kecamatan">
                                <select
                                    value={districtId}
                                    onChange={(event) =>
                                        setDistrictId(event.target.value)
                                    }
                                    disabled={!cityId || isLoadingDistricts}
                                    className="w-full rounded-lg border border-[#BFC9C1] bg-[#F8F9FA] px-4 py-3 text-sm text-[#191C1D] outline-none disabled:text-[#707973]"
                                >
                                    <option value="">
                                        {isLoadingDistricts
                                            ? "Loading districts..."
                                            : "Select district"}
                                    </option>
                                    {districts.map((district) => (
                                        <option
                                            key={district.id}
                                            value={district.id}
                                        >
                                            {district.name}
                                        </option>
                                    ))}
                                </select>
                            </Field>

                            <Field label="Full Address">
                                <textarea
                                    value={fullAddress}
                                    onChange={(event) =>
                                        setFullAddress(event.target.value)
                                    }
                                    rows={4}
                                    className="w-full resize-none rounded-lg border border-[#BFC9C1] bg-[#F8F9FA] px-4 py-3 text-sm text-[#191C1D] outline-none"
                                />
                            </Field>

                            <Field label="Note for Collection (Optional)">
                                <input
                                    value={note}
                                    onChange={(event) =>
                                        setNote(event.target.value)
                                    }
                                    className="w-full rounded-lg border border-[#BFC9C1] bg-[#F8F9FA] px-4 py-3 text-sm text-[#191C1D] outline-none"
                                />
                            </Field>
                        </div>

                        <div className="flex items-center justify-between rounded-xl border border-[#BFC9C1] bg-white p-4">
                            <div>
                                <p className="text-base font-semibold text-[#191C1D]">
                                    Set as Primary Address
                                </p>
                                <p className="text-[13px] leading-[19.5px] text-[#404943]">
                                    Make this the default location for pick-ups
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() =>
                                    setIsPrimary((current) => !current)
                                }
                                className={`relative h-6 w-11 rounded-full transition ${
                                    isPrimary ? "bg-[#2D6A4F]" : "bg-[#BFC9C1]"
                                }`}
                                aria-pressed={isPrimary}
                            >
                                <span
                                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
                                        isPrimary ? "left-[22px]" : "left-0.5"
                                    }`}
                                />
                            </button>
                        </div>

                        {regionError ? (
                            <p className="text-sm text-[#BA1A1A]">
                                {regionError}
                            </p>
                        ) : null}
                    </section>
                </main>

                <div className="absolute bottom-0 left-0 right-0 border-t border-[#BFC9C1] bg-[#F8F9FA] p-4">
                    <button
                        type="button"
                        disabled={!isFormValid}
                        onClick={handleSave}
                        className={`w-full rounded-lg py-3 text-base font-semibold shadow-[0_4px_12px_rgba(45,106,79,0.2)] ${
                            isFormValid
                                ? "bg-[#2D6A4F] text-white"
                                : "bg-[#BFC9C1] text-white"
                        }`}
                    >
                        Save Address
                    </button>
                </div>
            </div>
        </div>
    );
}
