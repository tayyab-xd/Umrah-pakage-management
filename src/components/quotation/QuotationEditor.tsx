"use client";

import { useMemo, useState } from "react";
import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { AccommodationSection } from "@/components/quotation/AccommodationSection";
import { AirfareSection } from "@/components/quotation/AirfareSection";
import { CustomerSection } from "@/components/quotation/CustomerSection";
import { TotalsSummary } from "@/components/quotation/TotalsSummary";
import { TransportSection } from "@/components/quotation/TransportSection";
import { TripSection } from "@/components/quotation/TripSection";
import { VisaSection } from "@/components/quotation/VisaSection";
import type { ReferenceData } from "@/lib/cache";
import {
  computeQuotation,
  formatPkr,
  newQuotationForm,
  type QuotationForm,
} from "@/lib/pricing";
import { useReferenceData } from "@/lib/useReferenceData";

/** Loads the cached price data, then shows the form. */
export function QuotationEditor() {
  const { loading, data } = useReferenceData();

  if (loading) {
    return <p className="text-sm text-stone-600">Loading price data…</p>;
  }
  if (!data) {
    return (
      <EmptyState title="Price data could not be loaded">
        Check your connection, then log out and log in again.
      </EmptyState>
    );
  }
  return <QuotationFormView data={data} />;
}

function QuotationFormView({
  data,
  initial,
}: {
  data: ReferenceData;
  initial?: QuotationForm;
}) {
  const [form, setForm] = useState<QuotationForm>(
    () => initial ?? newQuotationForm(data)
  );
  const [detailsOpen, setDetailsOpen] = useState(false);
  const computed = useMemo(() => computeQuotation(form), [form]);

  const sectionProps = { form, setForm, data, computed };

  return (
    <div className="pb-24 lg:pb-0">
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="min-w-0 space-y-6">
          <CustomerSection {...sectionProps} />
          <TripSection {...sectionProps} />
          <AccommodationSection {...sectionProps} />
          <TransportSection {...sectionProps} />
          <VisaSection {...sectionProps} />
          <AirfareSection {...sectionProps} />
          <div>
            <Button
              variant="secondary"
              type="button"
              onClick={() => {
                if (window.confirm("Clear the form and start again?")) {
                  setForm(newQuotationForm(data));
                }
              }}
            >
              Clear form
            </Button>
          </div>
        </div>

        {/* Desktop: sticky column beside the form */}
        <aside className="hidden lg:sticky lg:top-20 lg:block">
          <TotalsSummary form={form} computed={computed} />
        </aside>
      </div>

      {/* Phone and tablet: totals bar pinned to the bottom, expandable */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-stone-200 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.06)] lg:hidden">
        {detailsOpen && (
          <div className="max-h-[60vh] overflow-y-auto border-b border-stone-200 p-3">
            <TotalsSummary form={form} computed={computed} />
          </div>
        )}
        <button
          type="button"
          onClick={() => setDetailsOpen((o) => !o)}
          aria-expanded={detailsOpen}
          className="flex w-full items-center gap-3 px-4 py-3 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-emerald-800"
        >
          <span className="grid min-w-0 flex-1 grid-cols-2 gap-3">
            <span className="min-w-0">
              <span className="block text-xs text-stone-600">Option 1</span>
              <span className="block truncate text-sm font-semibold tabular-nums text-stone-900">
                {formatPkr(computed.grandTotal1Pkr)}
              </span>
            </span>
            <span className="min-w-0">
              <span className="block text-xs text-stone-600">Option 2</span>
              <span className="block truncate text-sm font-semibold tabular-nums text-stone-900">
                {formatPkr(computed.grandTotal2Pkr)}
              </span>
            </span>
          </span>
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-800">
            {detailsOpen ? "Hide" : "Details"}
            <ChevronUp
              className={`size-4 transition-transform ${detailsOpen ? "rotate-180" : ""}`}
              aria-hidden
            />
          </span>
        </button>
      </div>
    </div>
  );
}
