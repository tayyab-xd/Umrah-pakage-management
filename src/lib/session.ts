"use client";

import { useMemo, useSyncExternalStore } from "react";
import { DATA_KEY } from "@/lib/cache";

export const TOKEN_KEY = "uq_token";
export const USER_KEY = "uq_user";
const EVENT = "uq-session";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  isAdmin: boolean;
};

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function notify() {
  window.dispatchEvent(new Event(EVENT));
}

export function saveSession(token: string, user: SessionUser) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    // storage blocked: user will have to log in again on reload
  }
  notify();
}

export function clearSession() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(DATA_KEY);
  } catch {
    // ignore
  }
  notify();
}

export function getToken(): string | null {
  return read(TOKEN_KEY);
}

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

// The snapshot is the raw stored string, so it is stable between renders.
function getSnapshot(): string | null {
  return read(TOKEN_KEY) ? read(USER_KEY) : null;
}

// undefined = still on the server / hydrating (we don't know yet)
function getServerSnapshot(): string | null | undefined {
  return undefined;
}

export function useSession(): { ready: boolean; user: SessionUser | null } {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return useMemo(() => {
    if (raw === undefined) return { ready: false, user: null };
    if (raw === null) return { ready: true, user: null };
    try {
      return { ready: true, user: JSON.parse(raw) as SessionUser };
    } catch {
      return { ready: true, user: null };
    }
  }, [raw]);
}

export function homePathFor(user: SessionUser): string {
  return user.isAdmin ? "/admin" : "/dashboard";
}
