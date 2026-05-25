/* eslint-disable react-refresh/only-export-components */
import {
    createContext,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react";

export type HistoryCategory = "organic" | "inorganic" | "hazard";
export type HistoryStatus = "completed" | "cancelled";
export type PaymentMethod = "wallet" | "card" | "bank";

export type HistoryItem = {
    id: string;
    receiptNumber: string;
    status: HistoryStatus;
    category: HistoryCategory;
    title: string;
    subtitle: string;
    pickupDate: string;
    pickupDateLabel: string;
    timeWindow: string;
    addressLine1: string;
    addressLine2: string;
    materialHandled: string;
    paymentMethod: PaymentMethod;
    paymentMethodLabel: string;
    baseFee: number;
    estimatedWeightFee: number;
    discount: number;
    total: number;
    createdAt: string;
};

export type HistoryItemInput = Omit<HistoryItem, "id" | "createdAt">;

type HistoryContextType = {
    historyItems: HistoryItem[];
    addHistoryItem: (item: HistoryItemInput) => HistoryItem;
    getHistoryItem: (id: string) => HistoryItem | null;
};

const HistoryContext = createContext<HistoryContextType | null>(null);

export function HistoryProvider({ children }: { children: ReactNode }) {
    const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

    const value = useMemo<HistoryContextType>(
        () => ({
            historyItems,
            addHistoryItem: (item) => {
                const nextItem: HistoryItem = {
                    ...item,
                    id: crypto.randomUUID(),
                    createdAt: new Date().toISOString(),
                };

                setHistoryItems((current) => [nextItem, ...current]);
                return nextItem;
            },
            getHistoryItem: (id) =>
                historyItems.find((item) => item.id === id) ?? null,
        }),
        [historyItems],
    );

    return (
        <HistoryContext.Provider value={value}>
            {children}
        </HistoryContext.Provider>
    );
}

export function useHistory() {
    const ctx = useContext(HistoryContext);
    if (!ctx) throw new Error("useHistory must be inside HistoryProvider");
    return ctx;
}
