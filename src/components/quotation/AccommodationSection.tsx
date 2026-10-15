"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { NumberField } from "@/components/ui/NumberField";
import { Select } from "@/components/ui/Select";
import { ReadOnlyField, RowCard, Section, Warning } from "@/components/quotation/Section";
import type { SectionProps } from "@/components/quotation/types";
import type { ReferenceData } from "@/lib/cache";
import {
  ROOM_TYPES,
  emptyStay,
  formatPkr,
  formatSar,
  hotelRate,
  stayDates,
  toPkr,
  type RoomType,
  type StayLine,
} from "@/lib/pricing";

const CITY_SUGGESTIONS = ["Makkah", "Madinah", "Jeddah"];

type Hotel = ReferenceData["hotels"][number];

/** Makkah / Madinah rows list that city's hotels; any other city lists all. */
function hotelsForCity(hotels: Hotel[], city: string): Hotel[] {
  const c = city.trim().toLowerCase();
  return c === "makkah" || c === "madinah"
    ? hotels.filter((h) => h.city.toLowerCase() === c)
    : hotels;
}

function formatDay(s: string): string {
  if (!s) return "";
  return new Date(`${s}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function AccommodationSection({ form, setForm, data, computed }: SectionProps) {
  const dates = stayDates(form.stays);

  const updateStay = (i: number, patch: Partial<StayLine>) =>
    setForm((f) => ({
      ...f,
      stays: f.stays.map((s, j) => (j === i ? { ...s, ...patch } : s)),
    }));

  const changeRoomType = (which: 1 | 2, room: RoomType) =>
    setForm((f) => {
      const stays = f.stays.map((s) => {
        const hotel = data.hotels.find((h) => h._id === s.hotelId);
        if (!hotel) return s;
        return which === 1
          ? { ...s, rate1: hotelRate(hotel, room) }
          : { ...s, rate2: hotelRate(hotel, room) };
      });
      return which === 1
        ? { ...f, roomType1: room, stays }
        : { ...f, roomType2: room, stays };
    });

  const changeCity = (i: number, city: string) => {
    const stay = form.stays[i];
    const stillListed = hotelsForCity(data.hotels, city).some(
      (h) => h._id === stay.hotelId
    );
    updateStay(
      i,
      stillListed || !stay.hotelId
        ? { city }
        : { city, hotelId: "", hotelName: "", rate1: null, rate2: null }
    );
  };

  const changeHotel = (i: number, hotelId: string) => {
    const hotel = data.hotels.find((h) => h._id === hotelId);
    updateStay(
      i,
      hotel
        ? {
            hotelId,
            hotelName: hotel.name,
            rate1: hotelRate(hotel, form.roomType1),
            rate2: hotelRate(hotel, form.roomType2),
          }
        : { hotelId: "", hotelName: "", rate1: null, rate2: null }
    );
  };

  const removeStay = (i: number) =>
    setForm((f) => ({ ...f, stays: f.stays.filter((_, j) => j !== i) }));

  const addStay = () =>
    setForm((f) => ({ ...f, stays: [...f.stays, emptyStay("")] }));

  return (
    <Section
      title="Accommodation"
      description="Two options for the same stays, priced by room type. Rates are SAR per person per night and can be adjusted."
      action={
        <Button variant="secondary" type="button" onClick={addStay}>
          <Plus className="mr-1.5 size-4" aria-hidden />
          Add stay
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Option 1 room type"
          name="roomType1"
          value={form.roomType1}
          onChange={(e) => changeRoomType(1, e.target.value as RoomType)}
        >
          {ROOM_TYPES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </Select>
        <Select
          label="Option 2 room type"
          name="roomType2"
          value={form.roomType2}
          onChange={(e) => changeRoomType(2, e.target.value as RoomType)}
        >
          {ROOM_TYPES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </Select>
      </div>

      <datalist id="city-suggestions">
        {CITY_SUGGESTIONS.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>

      <div className="mt-5 space-y-4">
        {form.stays.length === 0 && (
          <p className="text-sm text-stone-600">
            No stays yet. Use “Add stay” to add one.
          </p>
        )}
        {form.stays.map((stay, i) => {
          const line = computed.stays[i];
          const hotels = hotelsForCity(data.hotels, stay.city);
          const selected = data.hotels.find((h) => h._id === stay.hotelId);
          return (
            <RowCard key={i}>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-stone-800">
                  Stay {i + 1}
                </h3>
                <button
                  type="button"
                  onClick={() => removeStay(i)}
                  aria-label={`Remove stay ${i + 1}`}
                  className="rounded-md p-1.5 text-stone-500 hover:bg-stone-200 hover:text-stone-800 focus-visible:outline-2 focus-visible:outline-stone-500"
                >
                  <Trash2 className="size-4" aria-hidden />
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="City"
                  name={`stay-${i}-city`}
                  list="city-suggestions"
                  value={stay.city}
                  onChange={(e) => changeCity(i, e.target.value)}
                  autoComplete="off"
                />
                <Select
                  label="Hotel"
                  name={`stay-${i}-hotel`}
                  value={stay.hotelId}
                  onChange={(e) => changeHotel(i, e.target.value)}
                >
                  <option value="">Select a hotel…</option>
                  {hotels.map((h) => {
                    const none =
                      hotelRate(h, form.roomType1) === null &&
                      hotelRate(h, form.roomType2) === null;
                    return (
                      <option key={h._id} value={h._id} disabled={none}>
                        {h.name}
                        {none ? " (no rate for these room types)" : ""}
                      </option>
                    );
                  })}
                </Select>
              </div>

              {selected && (
                <p className="mt-2 text-xs text-stone-600">
                  {[selected.location, selected.distance].filter(Boolean).join(" · ")}
                  {selected.needsVerification &&
                    " · Rate still to be confirmed with the agency"}
                </p>
              )}

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <NumberField
                  label="Nights"
                  name={`stay-${i}-nights`}
                  step={1}
                  value={stay.nights}
                  onChange={(v) =>
                    updateStay(i, { nights: Math.max(0, Math.floor(v ?? 0)) })
                  }
                />
                {i === 0 ? (
                  <Input
                    label="Check-in"
                    name={`stay-${i}-checkin`}
                    type="date"
                    value={stay.checkIn}
                    onChange={(e) => updateStay(i, { checkIn: e.target.value })}
                  />
                ) : (
                  <ReadOnlyField label="Check-in" value={formatDay(dates[i].checkIn)} />
                )}
                <ReadOnlyField label="Check-out" value={formatDay(dates[i].checkOut)} />
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <NumberField
                    label="Option 1 rate (SAR / person / night)"
                    name={`stay-${i}-rate1`}
                    step={0.01}
                    value={stay.rate1}
                    onChange={(v) => updateStay(i, { rate1: v })}
                  />
                  <p className="mt-1.5 text-xs text-stone-600">
                    {formatSar(line.total1Sar)} · {formatPkr(toPkr(line.total1Sar, form.pkrPerSar))}
                  </p>
                  {line.missing1 && (
                    <Warning>
                      This hotel has no {form.roomType1} rate. It counts as 0
                      until you type one.
                    </Warning>
                  )}
                </div>
                <div>
                  <NumberField
                    label="Option 2 rate (SAR / person / night)"
                    name={`stay-${i}-rate2`}
                    step={0.01}
                    value={stay.rate2}
                    onChange={(v) => updateStay(i, { rate2: v })}
                  />
                  <p className="mt-1.5 text-xs text-stone-600">
                    {formatSar(line.total2Sar)} · {formatPkr(toPkr(line.total2Sar, form.pkrPerSar))}
                  </p>
                  {line.missing2 && (
                    <Warning>
                      This hotel has no {form.roomType2} rate. It counts as 0
                      until you type one.
                    </Warning>
                  )}
                </div>
              </div>
            </RowCard>
          );
        })}
      </div>
    </Section>
  );
}
