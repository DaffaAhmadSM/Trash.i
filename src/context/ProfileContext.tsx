/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

export type ProfileData = {
    fullName: string;
    email: string;
    phone: string;
    serviceArea: string;
};

type ProfileContextType = {
    profile: ProfileData;
    updateProfile: (data: ProfileData) => void;
};

const ProfileContext = createContext<ProfileContextType | null>(null);

const DEFAULT_PROFILE: ProfileData = {
    fullName: "Alex Steward",
    email: "alex.steward@example.com",
    phone: "+62 812 3456 7890",
    serviceArea: "DKI JAKARTA",
};

export function ProfileProvider({ children }: { children: React.ReactNode }) {
    const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
    return (
        <ProfileContext.Provider value={{ profile, updateProfile: setProfile }}>
            {children}
        </ProfileContext.Provider>
    );
}

export function useProfile() {
    const ctx = useContext(ProfileContext);
    if (!ctx) throw new Error("useProfile must be inside ProfileProvider");
    return ctx;
}
