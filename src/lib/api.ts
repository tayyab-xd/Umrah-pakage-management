"use client";

import {
  clearSession,
  getToken,
  saveSession,
  type SessionUser,
} from "@/lib/session";
import { saveReferenceData, type ReferenceData } from "@/lib/cache";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch<T>(
  path: string,
  options: { method?: string; body?: unknown } = {}
): Promise<T> {
  const token = getToken();
  const res = await fetch(path, {
    method: options.method ?? "GET",
    headers: {
      ...(options.body !== undefined && { "Content-Type": "application/json" }),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // Expired or invalid token on a protected call: drop the session.
    if (res.status === 401 && token) clearSession();
    throw new ApiError(data?.error ?? "Something went wrong", res.status);
  }
  return data as T;
}

export type AuthResponse = { token: string; user: SessionUser };

/**
 * Store the session, then cache all reference data in localStorage.
 * A failure to fetch the data does not block login.
 */
export async function establishSession(res: AuthResponse): Promise<SessionUser> {
  saveSession(res.token, res.user);
  try {
    const data = await apiFetch<ReferenceData>("/api/data");
    saveReferenceData(data);
  } catch {
    // the app can retry loading data later
  }
  return res.user;
}
