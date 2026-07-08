/* eslint-disable react-refresh/only-export-components */
import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    useCallback,
    type ReactNode,
} from "react";
import { api } from "../lib/api";

export type UserProfile = {
    id: number;
    name: string;
    email: string;
    profile_image: string | null;
};

export type ApiAddress = {
    address_id: number;
    user_id: number;
    label: string;
    city: string;
    latitude: string;
    longitude: string;
};

type AddressInput = {
    label: string;
    city: string;
    latitude: string;
    longitude: string;
};

type ProfileContextType = {
    profile: UserProfile | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
    updateProfile: (
        data: Partial<Pick<UserProfile, "name" | "email">>,
    ) => Promise<void>;
    addresses: ApiAddress[];
    addressesLoading: boolean;
    primaryAddress: ApiAddress | null;
    fetchAddresses: () => Promise<void>;
    addAddress: (data: AddressInput) => Promise<void>;
    updateAddress: (id: number, data: AddressInput) => Promise<void>;
    deleteAddress: (id: number) => Promise<void>;
};

const ProfileContext = createContext<ProfileContextType | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [addresses, setAddresses] = useState<ApiAddress[]>([]);
    const [addressesLoading, setAddressesLoading] = useState(false);

    const fetchProfile = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api<UserProfile>("/auth/user");
            setProfile(data);
        } catch {
            setError("Failed to load profile");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const fetchAddresses = useCallback(async () => {
        setAddressesLoading(true);
        try {
            const data = await api<ApiAddress[]>("/addresses");
            setAddresses(data);
        } finally {
            setAddressesLoading(false);
        }
    }, []);

    const updateProfile = useCallback(
        async (data: Partial<Pick<UserProfile, "name" | "email">>) => {
            const res = await api<{ user: UserProfile }>("/auth/update", {
                method: "POST",
                body: JSON.stringify(data),
            });
            setProfile(res.user);
        },
        [],
    );

    const addAddress = useCallback(
        async (data: AddressInput) => {
            await api("/addresses", {
                method: "POST",
                body: JSON.stringify(data),
            });
            await fetchAddresses();
        },
        [fetchAddresses],
    );

    const updateAddress = useCallback(
        async (id: number, data: AddressInput) => {
            await api(`/addresses/${id}`, {
                method: "POST",
                body: JSON.stringify(data),
            });
            await fetchAddresses();
        },
        [fetchAddresses],
    );

    const deleteAddress = useCallback(
        async (id: number) => {
            await api(`/addresses/${id}`, { method: "DELETE" });
            await fetchAddresses();
        },
        [fetchAddresses],
    );

    const primaryAddress = addresses[0] ?? null;

    const value = useMemo<ProfileContextType>(
        () => ({
            profile,
            loading,
            error,
            refetch: fetchProfile,
            updateProfile,
            addresses,
            addressesLoading,
            primaryAddress,
            fetchAddresses,
            addAddress,
            updateAddress,
            deleteAddress,
        }),
        [
            profile,
            loading,
            error,
            fetchProfile,
            updateProfile,
            addresses,
            addressesLoading,
            primaryAddress,
            fetchAddresses,
            addAddress,
            updateAddress,
            deleteAddress,
        ],
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
