"use client";

import { NumberField } from "@/components/ui/NumberField";
import { Section } from "@/components/quotation/Section";
import type { SectionProps } from "@/components/quotation/types";
import { formatPkr, formatSar, toPkr, type PaxType } from "@/lib/pricing";

const FALLBACK_LABEL: Record<PaxType, string> = {
  adult: "Adult",
  child: "Child",
  infant: "Infant",
};

export function VisaSection({ form, setForm, data, computed }: SectionProps) {
  return (
    <Section
      title="Visa"
      description="Fee per person by passenger type, in SAR. The count comes from the passengers above."
    >
      <div className="space-y-4">
        {computed.visa.map((line) => {
          const label =
            data.visaFees.find((v) => v.paxType === line.paxType)?.label ??
            FALLBACK_LABEL[line.paxType];
          return (
            <div
              key={line.paxType}
              className="grid items-end gap-3 sm:grid-cols-[1fr_6rem_1fr]"
            >
              <NumberField
                label={`${label} fee (SAR / person)`}
                name={`visa-${line.paxType}`}
                step={0.01}
                value={form.visaRates[line.paxType] || null}
                onChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    visaRates: { ...f.visaRates, [line.paxType]: v ?? 0 },
                  }))
                }
              />
              <p className="pb-2.5 text-sm text-stone-700">× {line.count}</p>
              <p className="pb-2.5 text-sm font-medium text-stone-900">
                {formatSar(line.totalSar)}
                <span className="font-normal text-stone-600">
                  {" "}
                  · {formatPkr(toPkr(line.totalSar, form.pkrPerSar))}
                </span>
              </p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
