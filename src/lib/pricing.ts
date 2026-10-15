// All quotation formulas live here, as pure functions (no React, no storage).
// The form calls computeQuotation() on every change; the same numbers are what
// get saved with the quotation. See the project doc "pricing-spec.md".
//
// Units: hotel, transport and visa rates are SAR. Airfare is typed in PKR.
// PKR = SAR x pkrPerSar. A rate of null means "not available" and counts as 0.

import type { ReferenceData, RoomRates } from "@/lib/cache";

export type PaxType = "adult" | "child" | "infant";
export const PAX_TYPES: PaxType[] = ["adult", "child", "infant"];

export type RoomType = keyof RoomRates;
export const ROOM_TYPES: { value: RoomType; label: string }[] = [
  { value: "double", label: "Double" },
  { value: "triple", label: "Triple" },
  { value: "quad", label: "Quad" },
  { value: "quint", label: "Quint" },
  { value: "sharing", label: "Sharing" },
];

export type StayLine = {
  city: string; // Makkah, Madinah, or anything the agent types
  hotelId: string;
  hotelName: string;
  nights: number;
  checkIn: string; // yyyy-mm-dd; only the first stay's is typed in, the rest chain on
  rate1: number | null; // SAR per person per night, Option 1 room type
  rate2: number | null; // same for Option 2
};

export type TransportLeg = {
  route: string;
  vehicle: string;
  priceSar: number | null; // per vehicle
};

export type QuotationForm = {
  customer: { name: string; contact: string; address: string; city: string };
  pax: { adults: number; children: number; infants: number };
  pkrPerSar: number;
  roomType1: RoomType;
  roomType2: RoomType;
  stays: StayLine[];
  transport: TransportLeg[];
  visaRates: Record<PaxType, number>; // SAR per person
  airfare: {
    airline: string;
    destination: string;
    luggage: string;
    farePkr: Record<PaxType, number>; // PKR per person
  };
};

// ---------- helpers ----------

/** Non-negative finite number, otherwise 0. */
export function num(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function paxCount(pax: QuotationForm["pax"], type: PaxType): number {
  const n = type === "adult" ? pax.adults : type === "child" ? pax.children : pax.infants;
  return Math.floor(num(n));
}

export function toPkr(sar: number, pkrPerSar: number): number {
  return Math.round(sar * num(pkrPerSar));
}

// ---------- rate lookups (used when the agent picks something) ----------

export function hotelRate(
  hotel: ReferenceData["hotels"][number] | undefined,
  room: RoomType
): number | null {
  const rate = hotel?.rates?.[room];
  return typeof rate === "number" ? rate : null;
}

export function transportPrice(
  data: Pick<ReferenceData, "transport">,
  route: string,
  vehicle: string
): number | null {
  const row = data.transport.find((t) => t.route === route);
  const price = row?.prices?.[vehicle];
  return typeof price === "number" ? price : null;
}

// ---------- dates ----------

function parseDay(s: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const d = new Date(`${s}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Check-in / check-out per stay. The first check-in is typed; check-out is
 * check-in + nights, and the next stay checks in when the previous one ends.
 * Empty strings when no start date was given.
 */
export function stayDates(stays: StayLine[]): { checkIn: string; checkOut: string }[] {
  let cursor = parseDay(stays[0]?.checkIn ?? "");
  return stays.map((stay) => {
    if (!cursor) return { checkIn: "", checkOut: "" };
    const checkIn = formatDay(cursor);
    const out = new Date(cursor);
    out.setUTCDate(out.getUTCDate() + Math.floor(num(stay.nights)));
    cursor = out;
    return { checkIn, checkOut: formatDay(out) };
  });
}

// ---------- the calculation ----------

export type Computed = {
  paxTotal: number;
  payingPax: number; // adults + children, infants pay no hotel
  nightsTotal: number;
  stays: {
    rate1: number;
    rate2: number;
    total1Sar: number;
    total2Sar: number;
    missing1: boolean; // a hotel is chosen but has no rate for the room type
    missing2: boolean;
  }[];
  transport: { priceSar: number; missing: boolean }[];
  visa: { paxType: PaxType; count: number; rateSar: number; totalSar: number }[];
  airfare: { paxType: PaxType; count: number; farePkr: number; totalPkr: number }[];
  sar: {
    accommodation1: number;
    accommodation2: number;
    transport: number;
    visa: number;
  };
  pkr: {
    accommodation1: number;
    accommodation2: number;
    transport: number;
    visa: number;
    airfare: number;
  };
  grandTotal1Pkr: number;
  grandTotal2Pkr: number;
  perPax1Pkr: number; // per customer, infants included
  perPax2Pkr: number;
};

export function computeQuotation(form: QuotationForm): Computed {
  const rate = num(form.pkrPerSar);
  const adults = paxCount(form.pax, "adult");
  const children = paxCount(form.pax, "child");
  const infants = paxCount(form.pax, "infant");
  const paxTotal = adults + children + infants;
  const payingPax = adults + children;

  const stays = form.stays.map((s) => {
    const nights = Math.floor(num(s.nights));
    const rate1 = num(s.rate1);
    const rate2 = num(s.rate2);
    return {
      rate1,
      rate2,
      total1Sar: round2(rate1 * nights * payingPax),
      total2Sar: round2(rate2 * nights * payingPax),
      missing1: !!s.hotelId && s.rate1 === null,
      missing2: !!s.hotelId && s.rate2 === null,
    };
  });

  const transport = form.transport.map((t) => ({
    priceSar: num(t.priceSar),
    missing: !!t.route && !!t.vehicle && t.priceSar === null,
  }));

  const visa = PAX_TYPES.map((paxType) => {
    const count = paxCount(form.pax, paxType);
    const rateSar = num(form.visaRates[paxType]);
    return { paxType, count, rateSar, totalSar: round2(rateSar * count) };
  });

  const airfare = PAX_TYPES.map((paxType) => {
    const count = paxCount(form.pax, paxType);
    const farePkr = num(form.airfare.farePkr[paxType]);
    return { paxType, count, farePkr, totalPkr: Math.round(farePkr * count) };
  });

  const sum = (xs: number[]) => round2(xs.reduce((a, b) => a + b, 0));
  const sar = {
    accommodation1: sum(stays.map((s) => s.total1Sar)),
    accommodation2: sum(stays.map((s) => s.total2Sar)),
    transport: sum(transport.map((t) => t.priceSar)),
    visa: sum(visa.map((v) => v.totalSar)),
  };
  const airfarePkr = airfare.reduce((a, b) => a + b.totalPkr, 0);
  const pkr = {
    accommodation1: toPkr(sar.accommodation1, rate),
    accommodation2: toPkr(sar.accommodation2, rate),
    transport: toPkr(sar.transport, rate),
    visa: toPkr(sar.visa, rate),
    airfare: airfarePkr,
  };

  const common = pkr.transport + pkr.visa + pkr.airfare;
  const grandTotal1Pkr = pkr.accommodation1 + common;
  const grandTotal2Pkr = pkr.accommodation2 + common;

  return {
    paxTotal,
    payingPax,
    nightsTotal: stays.length
      ? form.stays.reduce((a, s) => a + Math.floor(num(s.nights)), 0)
      : 0,
    stays,
    transport,
    visa,
    airfare,
    sar,
    pkr,
    grandTotal1Pkr,
    grandTotal2Pkr,
    perPax1Pkr: paxTotal > 0 ? Math.round(grandTotal1Pkr / paxTotal) : 0,
    perPax2Pkr: paxTotal > 0 ? Math.round(grandTotal2Pkr / paxTotal) : 0,
  };
}

// ---------- amount in words (PKR, Pakistani numbering) ----------

const ONES = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
  "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen",
  "Eighteen", "Nineteen",
];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function below1000(n: number): string {
  const parts: string[] = [];
  if (n >= 100) {
    parts.push(`${ONES[Math.floor(n / 100)]} Hundred`);
    n %= 100;
  }
  if (n >= 20) {
    parts.push(TENS[Math.floor(n / 10)] + (n % 10 ? `-${ONES[n % 10]}` : ""));
  } else if (n > 0) {
    parts.push(ONES[n]);
  }
  return parts.join(" ");
}

/** 1234567 -> "Twelve Lakh Thirty-Four Thousand Five Hundred Sixty-Seven". */
export function amountInWords(amount: number): string {
  let n = Math.floor(num(amount));
  if (n === 0) return "Zero";
  const units: [number, string][] = [
    [10_000_000, "Crore"],
    [100_000, "Lakh"],
    [1_000, "Thousand"],
  ];
  const parts: string[] = [];
  for (const [size, name] of units) {
    if (n >= size) {
      const q = Math.floor(n / size);
      // Crore can itself be large (100 Crore+), so spell it recursively.
      parts.push(`${size === 10_000_000 ? amountInWords(q) : below1000(q)} ${name}`);
      n %= size;
    }
  }
  if (n > 0) parts.push(below1000(n));
  return parts.join(" ");
}

export function pkrInWords(amount: number): string {
  return `Rupees ${amountInWords(amount)} Only`;
}

// ---------- formatting ----------

export function formatSar(n: number): string {
  return `SAR ${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}

export function formatPkr(n: number): string {
  return `PKR ${Math.round(n).toLocaleString("en-US")}`;
}

// ---------- starting point for a new quotation ----------

export function emptyStay(city = "Makkah"): StayLine {
  return { city, hotelId: "", hotelName: "", nights: 0, checkIn: "", rate1: null, rate2: null };
}

export function newQuotationForm(data: ReferenceData | null): QuotationForm {
  const visaRates = { adult: 0, child: 0, infant: 0 } as Record<PaxType, number>;
  for (const v of data?.visaFees ?? []) visaRates[v.paxType] = v.rate;
  return {
    customer: { name: "", contact: "", address: "", city: "" },
    pax: { adults: 1, children: 0, infants: 0 },
    pkrPerSar: data?.settings.pkrPerSar ?? 78.5,
    roomType1: "quad",
    roomType2: "triple",
    stays: [emptyStay("Makkah"), emptyStay("Madinah")],
    transport: [{ route: "", vehicle: "", priceSar: null }],
    visaRates,
    airfare: {
      airline: "",
      destination: "",
      luggage: "",
      farePkr: { adult: 0, child: 0, infant: 0 },
    },
  };
}
