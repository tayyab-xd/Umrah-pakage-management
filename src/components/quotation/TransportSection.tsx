"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { NumberField } from "@/components/ui/NumberField";
import { Select } from "@/components/ui/Select";
import { RowCard, Section, Warning } from "@/components/quotation/Section";
import type { SectionProps } from "@/components/quotation/types";
import {
  formatPkr,
  formatSar,
  toPkr,
  transportPrice,
  type TransportLeg,
} from "@/lib/pricing";

export function TransportSection({ form, setForm, data, computed }: SectionProps) {
  const updateLeg = (i: number, patch: Partial<TransportLeg>) =>
    setForm((f) => ({
      ...f,
      transport: f.transport.map((t, j) => (j === i ? { ...t, ...patch } : t)),
    }));

  // Picking a route or vehicle looks the price up; the price can still be edited.
  const pick = (i: number, route: string, vehicle: string) =>
    updateLeg(i, {
      route,
      vehicle,
      priceSar: route && vehicle ? transportPrice(data, route, vehicle) : null,
    });

  const removeLeg = (i: number) =>
    setForm((f) => ({ ...f, transport: f.transport.filter((_, j) => j !== i) }));

  const addLeg = () =>
    setForm((f) => ({
      ...f,
      transport: [...f.transport, { route: "", vehicle: "", priceSar: null }],
    }));

  return (
    <Section
      title="Private transport"
      description="Each leg is a route and a vehicle. The price is per vehicle, not per person."
      action={
        <Button variant="secondary" type="button" onClick={addLeg}>
          <Plus className="mr-1.5 size-4" aria-hidden />
          Add leg
        </Button>
      }
    >
      <div className="space-y-4">
        {form.transport.length === 0 && (
          <p className="text-sm text-stone-600">
            No transport. Use “Add leg” to add a route.
          </p>
        )}
        {form.transport.map((leg, i) => {
          const line = computed.transport[i];
          const routeRow = data.transport.find((t) => t.route === leg.route);
          return (
            <RowCard key={i}>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-stone-800">
                  Leg {i + 1}
                </h3>
                <button
                  type="button"
                  onClick={() => removeLeg(i)}
                  aria-label={`Remove leg ${i + 1}`}
                  className="rounded-md p-1.5 text-stone-500 hover:bg-stone-200 hover:text-stone-800 focus-visible:outline-2 focus-visible:outline-stone-500"
                >
                  <Trash2 className="size-4" aria-hidden />
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <Select
                  label="Route"
                  name={`leg-${i}-route`}
                  value={leg.route}
                  onChange={(e) => pick(i, e.target.value, leg.vehicle)}
                >
                  <option value="">Select a route…</option>
                  {data.transport.map((t) => (
                    <option key={t._id} value={t.route}>
                      {t.route}
                    </option>
                  ))}
                </Select>
                <Select
                  label="Vehicle"
                  name={`leg-${i}-vehicle`}
                  value={leg.vehicle}
                  onChange={(e) => pick(i, leg.route, e.target.value)}
                >
                  <option value="">Select a vehicle…</option>
                  {data.vehicles.map((v) => {
                    const noPrice =
                      !!routeRow && typeof routeRow.prices?.[v.name] !== "number";
                    return (
                      <option key={v._id} value={v.name} disabled={noPrice}>
                        {v.name}
                        {v.capacity ? ` (${v.capacity})` : ""}
                        {noPrice ? " (no price on this route)" : ""}
                      </option>
                    );
                  })}
                </Select>
                <div>
                  <NumberField
                    label="Price (SAR)"
                    name={`leg-${i}-price`}
                    step={0.01}
                    value={leg.priceSar}
                    onChange={(v) => updateLeg(i, { priceSar: v })}
                  />
                  <p className="mt-1.5 text-xs text-stone-600">
                    {formatSar(line.priceSar)} · {formatPkr(toPkr(line.priceSar, form.pkrPerSar))}
                  </p>
                </div>
              </div>
              {line.missing && (
                <Warning>
                  No price is listed for this route and vehicle. It counts as 0
                  until you type one.
                </Warning>
              )}
            </RowCard>
          );
        })}
      </div>
    </Section>
  );
}
