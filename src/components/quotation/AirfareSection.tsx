"use client";

import { Input } from "@/components/ui/Input";
import { NumberField } from "@/components/ui/NumberField";
import { Select } from "@/components/ui/Select";
import { Section } from "@/components/quotation/Section";
import type { SectionProps } from "@/components/quotation/types";
import { formatPkr, type PaxType } from "@/lib/pricing";

const LABEL: Record<PaxType, string> = {
  adult: "Adult",
  child: "Child",
  infant: "Infant",
};

export function AirfareSection({ form, setForm, data, computed }: SectionProps) {
  const setAirfare = (patch: Partial<SectionProps["form"]["airfare"]>) =>
    setForm((f) => ({ ...f, airfare: { ...f.airfare, ...patch } }));

  const pickAirline = (name: string) => {
    const airline = data.airlines.find((a) => a.name === name);
    setAirfare({ airline: name, luggage: airline?.luggage ?? "" });
  };

  return (
    <Section
      title="Airfare"
      description="Fares are typed in PKR per person, including tax."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Select
          label="Airline"
          name="airline"
          value={form.airfare.airline}
          onChange={(e) => pickAirline(e.target.value)}
        >
          <option value="">Select an airline…</option>
          {data.airlines.map((a) => (
            <option key={a._id} value={a.name}>
              {a.name}
            </option>
          ))}
        </Select>
        <Input
          label="Destination"
          name="destination"
          value={form.airfare.destination}
          onChange={(e) => setAirfare({ destination: e.target.value })}
          autoComplete="off"
        />
        <Input
          label="Luggage"
          name="luggage"
          value={form.airfare.luggage}
          onChange={(e) => setAirfare({ luggage: e.target.value })}
          autoComplete="off"
        />
      </div>

      <div className="mt-5 space-y-4">
        {computed.airfare.map((line) => (
          <div
            key={line.paxType}
            className="grid items-end gap-3 sm:grid-cols-[1fr_6rem_1fr]"
          >
            <NumberField
              label={`${LABEL[line.paxType]} fare (PKR / person)`}
              name={`fare-${line.paxType}`}
              step={1}
              value={form.airfare.farePkr[line.paxType] || null}
              onChange={(v) =>
                setAirfare({
                  farePkr: { ...form.airfare.farePkr, [line.paxType]: v ?? 0 },
                })
              }
            />
            <p className="pb-2.5 text-sm text-stone-700">× {line.count}</p>
            <p className="pb-2.5 text-sm font-medium text-stone-900">
              {formatPkr(line.totalPkr)}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
