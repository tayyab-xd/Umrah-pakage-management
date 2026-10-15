"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { apiFetch } from "@/lib/api";
import {
  DATA_EVENT,
  DATA_KEY,
  saveReferenceData,
  type ReferenceData,
} from "@/lib/cache";

function subscribe(callback: () => void) {
  window.addEventListener(DATA_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(DATA_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

// The snapshot is the raw stored string, so it stays stable between renders.
function getSnapshot(): string | null {
  try {
    return localStorage.getItem(DATA_KEY);
  } catch {
    return null;
  }
}

// undefined = still on the server / hydrating
function getServerSnapshot(): string | null | undefined {
  return undefined;
}

/**
 * The cached reference data (hotels, transport, ...). `data` is null while
 * loading or if it could not be loaded. When nothing is cached (login could not
 * fetch it), one fetch is attempted here; if that also fails, `loading` ends and
 * `data` stays null so the page can say so.
 */
export function useReferenceData(): {
  loading: boolean;
  data: ReferenceData | null;
} {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (raw !== null) return;
    let cancelled = false;
    apiFetch<ReferenceData>("/api/data")
      .then((d) => {
        if (!cancelled) saveReferenceData(d);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [raw]);

  return useMemo(() => {
    if (raw === undefined) return { loading: true, data: null };
    if (raw === null) return { loading: !failed, data: null };
    try {
      return { loading: false, data: JSON.parse(raw) as ReferenceData };
    } catch {
      return { loading: false, data: null };
    }
  }, [raw, failed]);
}
