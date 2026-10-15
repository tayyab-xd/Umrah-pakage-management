"use client";

import { NumberField } from "@/components/ui/NumberField";
import { Section } from "@/components/quotation/Section";
import type { SectionProps } from "@/components/quotation/types";

export function TripSection({ form, setForm, computed }: SectionProps) {
  const setPax = (key: "adults" | "children" | "infants", v: number | null) =>
    setForm((f) => ({
      ...f,
      pax: { ...f.pax, [key]: Math.max(0, Math.floor(v ?? 0)) },
    }));

  return (
    <Section
      title="Passengers and rate"
      description="Infants pay no hotel. Per-customer totals count every passenger."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <NumberField
          label="Adults"
          name="adults"
          step={1}
          value={form.pax.adults}
          onChange={(v) => setPax("adults", v)}
        />
        <NumberField
          label="Children (2-11)"
          name="children"
          step={1}
          value={form.pax.children}
          onChange={(v) => setPax("children", v)}
        />
        <NumberField
          label="Infants (under 2)"
          name="infants"
          step={1}
          value={form.pax.infants}
          onChange={(v) => setPax("infants", v)}
        />
      </div>
      <div className="mt-4 grid items-end gap-4 sm:grid-cols-3">
        <NumberField
          label="PKR per 1 SAR"
          name="pkrPerSar"
          step={0.01}
          value={form.pkrPerSar || null}
          onChange={(v) => setForm((f) => ({ ...f, pkrPerSar: v ?? 0 }))}
        />
        <p className="text-sm text-stone-600 sm:col-span-2">
          {computed.paxTotal} passenger{computed.paxTotal === 1 ? "" : "s"} in
          total, {computed.payingPax} paying for hotels. The rate is saved with
          the quotation.
        </p>
      </div>
    </Section>
  );
}
