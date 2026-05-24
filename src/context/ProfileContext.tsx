/* eslint-disable react-refresh/only-export-components */
import {
    createContext,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react";

export type ProfileData = {
    fullName: string;
    email: string;
    phone: string;
    serviceArea: string;
};

export type AddressLabel = "Home" | "Office" | "Other";

export type SavedAddress = {
    id: string;
    label: AddressLabel;
    recipientName: string;
    phoneNumber: string;
    provinceId: string;
    provinceName: string;
    cityId: string;
    cityName: string;
    districtId: string;
    districtName: string;
    fullAddress: string;
    note: string;
    isPrimary: boolean;
};

export type AddressInput = Omit<SavedAddress, "id">;

type ProfileContextType = {
    profile: ProfileData;
    updateProfile: (data: ProfileData) => void;
    addresses: SavedAddress[];
    primaryAddress: SavedAddress | null;
    addAddress: (address: AddressInput) => void;
    updateAddress: (id: string, address: AddressInput) => void;
    deleteAddress: (id: string) => void;
    setPrimaryAddress: (id: string) => void;
};

const ProfileContext = createContext<ProfileContextType | null>(null);

const DEFAULT_PROFILE: ProfileData = {
    fullName: "Alex Steward",
    email: "alex.steward@example.com",
    phone: "+62 812 3456 7890",
    serviceArea: "DKI JAKARTA",
};

const DEFAULT_ADDRESSES: SavedAddress[] = [
    {
        id: "address-home",
        label: "Home",
        recipientName: "Alex Steward",
        phoneNumber: "+62 812 3456 7890",
        provinceId: "31",
        provinceName: "DKI JAKARTA",
        cityId: "3171",
        cityName: "KOTA JAKARTA SELATAN",
        districtId: "3171090",
        districtName: "TEBET",
        fullAddress: "Jl. Tebet Barat Dalam Raya No. 18, RT 5/RW 3",
        note: "Gate beside mini market",
        isPrimary: true,
    },
];

function normalizePrimary(addresses: SavedAddress[]) {
    if (addresses.length === 0) return addresses;

    const activePrimary = addresses.find((address) => address.isPrimary);
    const primaryId = activePrimary?.id ?? addresses[0].id;

    return addresses.map((address) => ({
        ...address,
        isPrimary: address.id === primaryId,
    }));
}

export function ProfileProvider({ children }: { children: ReactNode }) {
    const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
    const [addresses, setAddresses] =
        useState<SavedAddress[]>(DEFAULT_ADDRESSES);

    const value = useMemo<ProfileContextType>(
        () => ({
            profile,
            updateProfile: setProfile,
            addresses,
            primaryAddress:
                addresses.find((address) => address.isPrimary) ?? null,
            addAddress: (address) => {
                setAddresses((currentAddresses) => {
                    const nextAddress: SavedAddress = {
                        ...address,
                        id: crypto.randomUUID(),
                    };

                    const nextAddresses = address.isPrimary
                        ? [
                              ...currentAddresses.map((item) => ({
                                  ...item,
                                  isPrimary: false,
                              })),
                              { ...nextAddress, isPrimary: true },
                          ]
                        : [
                              ...currentAddresses,
                              {
                                  ...nextAddress,
                                  isPrimary: currentAddresses.length === 0,
                              },
                          ];

                    return normalizePrimary(nextAddresses);
                });
            },
            updateAddress: (id, address) => {
                setAddresses((currentAddresses) => {
                    const nextAddresses = currentAddresses.map((item) => {
                        if (item.id !== id) return item;

                        return {
                            ...address,
                            id,
                        };
                    });

                    const withPrimary = address.isPrimary
                        ? nextAddresses.map((item) => ({
                              ...item,
                              isPrimary: item.id === id,
                          }))
                        : nextAddresses;

                    return normalizePrimary(withPrimary);
                });
            },
            deleteAddress: (id) => {
                setAddresses((currentAddresses) =>
                    normalizePrimary(
                        currentAddresses.filter((address) => address.id !== id),
                    ),
                );
            },
            setPrimaryAddress: (id) => {
                setAddresses((currentAddresses) =>
                    normalizePrimary(
                        currentAddresses.map((address) => ({
                            ...address,
                            isPrimary: address.id === id,
                        })),
                    ),
                );
            },
        }),
        [addresses, profile],
    );

    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    );
}

export function useProfile() {
    const ctx = useContext(ProfileContext);
    if (!ctx) throw new Error("useProfile must be inside ProfileProvider");
    return ctx;
}
