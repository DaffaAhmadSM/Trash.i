import { getCookie } from "./cookies";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8001/api";

export interface ApiError {
    message: string;
    errors?: Record<string, string[]>;
}

export async function api<T = unknown>(
    path: string,
    options: RequestInit = {},
): Promise<T> {
    const token = getCookie("token");

    const res = await fetch(`${BASE_URL}${path}`, {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        ...options,
    });

    const data = await res.json();

    if (!res.ok) {
        const error: ApiError & { status: number } = {
            status: res.status,
            message: data.message ?? "Request failed",
            errors: data.errors,
        };
        throw error;
    }

    return data as T;
}
