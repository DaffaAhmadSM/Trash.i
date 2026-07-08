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

export type HistoryCategory = "organic" | "inorganic" | "hazard";

export type PaymentMethod = "wallet" | "card" | "bank";

// API transaction shape from GET /api/transactions
export type TransactionItem = {
    trans_id: number;
    status: string;
    payment_status: string;
    total_paid: string;
    time_slot: string | null;
    scheduled_date: string | null;
    transaction_details: Array<{
        detail_id: number;
        category_id: number;
        actual_weight: number | null;
        waste_category: {
            category_id: number;
            name_category: string;
        };
    }>;
};

// API transaction detail from GET /api/transactions/:id
export type TransactionDetail = TransactionItem & {
    user_id: number;
    address_id: number;
    date: string;
    payment_proof: string | null;
    payment_fees: Array<{
        fee_id: number;
        name: string;
        category: string;
        price: string;
        currency: string;
    }>;
    address: {
        address_id: number;
        label: string;
        city: string;
        latitude: string;
        longitude: string;
    };
};

function mapApiCategory(name: string): HistoryCategory {
    const lowered = name.toLowerCase();
    if (lowered === "organik") return "organic";
    if (lowered === "anorganik") return "inorganic";
    return "hazard";
}

type HistoryContextType = {
    items: TransactionItem[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
    getDetail: (transId: number) => Promise<TransactionDetail>;
    addHistoryItem: () => void; // ponytail: no-op until CheckoutPage wired
};

const HistoryContext = createContext<HistoryContextType | null>(null);

export function HistoryProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<TransactionItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchItems = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api<{ data: TransactionItem[] }>(
                "/transactions",
            );
            setItems(data.data);
        } catch {
            setError("Failed to load history");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const getDetail = useCallback(
        async (transId: number): Promise<TransactionDetail> => {
            return api<TransactionDetail>(`/transactions/${transId}`);
        },
        [],
    );

    const value = useMemo<HistoryContextType>(
        () => ({
            items,
            loading,
            error,
            refetch: fetchItems,
            getDetail,
            addHistoryItem: () => {},
        }),
        [items, loading, error, fetchItems, getDetail],
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

export { mapApiCategory };
