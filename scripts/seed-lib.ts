/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Model } from "mongoose";
import { Hotel } from "@/models/Hotel";
import { Transport } from "@/models/Transport";
import { Vehicle } from "@/models/Vehicle";
import { Airline } from "@/models/Airline";
import { VisaFee } from "@/models/VisaFee";
import { Setting } from "@/models/Setting";

export type SeedData = {
  hotels: any[];
  transport: any[];
  vehicles: any[];
  airlines: any[];
  visaFees: any[];
  settings: any;
};

// The reference-data collections. Users and quotations are never touched here.
export const collections: {
  key: keyof Omit<SeedData, "settings">;
  model: Model<any>;
  naturalKey: (doc: any) => Record<string, unknown>;
}[] = [
  { key: "hotels", model: Hotel, naturalKey: (d) => ({ name: d.name, city: d.city }) },
  { key: "transport", model: Transport, naturalKey: (d) => ({ route: d.route }) },
  { key: "vehicles", model: Vehicle, naturalKey: (d) => ({ name: d.name }) },
  { key: "airlines", model: Airline, naturalKey: (d) => ({ name: d.name }) },
  { key: "visaFees", model: VisaFee, naturalKey: (d) => ({ paxType: d.paxType }) },
];

export const SETTINGS_FILTER = { key: "main" };

/** Checks the seed data against the real schemas without touching a database. */
export async function validateSeed(data: SeedData): Promise<string[]> {
  const errors: string[] = [];

  for (const { key, model, naturalKey } of collections) {
    const docs = data[key];
    if (!Array.isArray(docs) || docs.length === 0) {
      errors.push(`${key}: must be a non-empty array`);
      continue;
    }
    const seen = new Set<string>();
    for (const [i, doc] of docs.entries()) {
      const label = `${key}[${i}]`;
      const err = await new model(doc).validate().then(() => null, (e: any) => e);
      if (err?.errors) {
        for (const [path, e] of Object.entries(err.errors)) {
          errors.push(`${label}.${path}: ${(e as Error).message}`);
        }
      }
      const id = JSON.stringify(naturalKey(doc));
      if (seen.has(id)) errors.push(`${label}: duplicate ${id}`);
      seen.add(id);
    }
  }

  // Transport prices must refer to known vehicles and be numbers.
  const vehicleNames = new Set((data.vehicles ?? []).map((v) => v.name));
  (data.transport ?? []).forEach((t, i) => {
    for (const [vehicle, price] of Object.entries(t.prices ?? {})) {
      if (!vehicleNames.has(vehicle)) {
        errors.push(`transport[${i}] (${t.route}): unknown vehicle "${vehicle}"`);
      }
      if (typeof price !== "number" || !(price >= 0)) {
        errors.push(`transport[${i}] (${t.route}): bad price for "${vehicle}"`);
      }
    }
  });

  // Hotel rates: numbers or null, never negative.
  (data.hotels ?? []).forEach((h, i) => {
    for (const [room, rate] of Object.entries(h.rates ?? {})) {
      if (rate !== null && (typeof rate !== "number" || rate < 0)) {
        errors.push(`hotels[${i}] (${h.name}): bad ${room} rate`);
      }
    }
  });

  // One visa fee per passenger type.
  const types = new Set((data.visaFees ?? []).map((v) => v.paxType));
  for (const t of ["adult", "child", "infant"]) {
    if (!types.has(t)) errors.push(`visaFees: missing "${t}"`);
  }

  if (!data.settings || typeof data.settings !== "object") {
    errors.push("settings: must be an object");
  } else {
    const err = await new Setting({ ...data.settings, key: "main" })
      .validate()
      .then(() => null, (e: any) => e);
    if (err?.errors) {
      for (const [path, e] of Object.entries(err.errors)) {
        errors.push(`settings.${path}: ${(e as Error).message}`);
      }
    }
  }

  return errors;
}
