import { getCookie } from "./cookies";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8001/api";
const STORAGE_URL = import.meta.env.VITE_STORAGE_URL ?? "http://localhost:8001/storage";

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export async function api<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getCookie("token");

  const res = await fetch(`${API_URL}${path}`, {
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

export async function uploadFile<T = unknown>(
  path: string,
  formData: FormData,
): Promise<T> {
  const token = getCookie("token");

  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
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

/** Resolve profile_image to a displayable URL. */
export function imageUrl(path: string | null | undefined): string {
  if (!path) return "/src/assets/profile_picture.svg";
  if (path.startsWith("http")) return path;
  // ponytail: relative path from backend storage
  if (path.startsWith("/")) return `${STORAGE_URL}${path}`;
  return `${STORAGE_URL}/${path}`;
}
