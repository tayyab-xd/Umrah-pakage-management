// Reference data (hotels, transport, ...) cached in localStorage at login.
// It is only refreshed on the next login, so an admin's price edits reach
// other users then.

export const DATA_KEY = "uq_data";

export type RoomRates = {
  double: number | null;
  triple: number | null;
  quad: number | null;
  quint: number | null;
  sharing: number | null;
};

export type ReferenceData = {
  hotels: {
    _id: string;
    name: string;
    city: "Makkah" | "Madinah";
    location: string;
    distance: string;
    rates: RoomRates;
    needsVerification: boolean;
  }[];
  transport: { _id: string; route: string; prices: Record<string, number> }[];
  vehicles: { _id: string; name: string; capacity: string }[];
  airlines: { _id: string; name: string; luggage: string }[];
  visaFees: {
    _id: string;
    paxType: "adult" | "child" | "infant";
    label: string;
    rate: number;
  }[];
  settings: {
    pkrPerSar: number;
    validityText: string;
    notes: string[];
    documentsRequired: string[];
  };
};

export function saveReferenceData(data: ReferenceData) {
  try {
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
  } catch {
    // storage unavailable or full: the app falls back to fetching again
  }
}

export function getReferenceData(): ReferenceData | null {
  try {
    const raw = localStorage.getItem(DATA_KEY);
    return raw ? (JSON.parse(raw) as ReferenceData) : null;
  } catch {
    return null;
  }
}
