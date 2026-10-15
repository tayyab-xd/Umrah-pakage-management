import type { Computed, QuotationForm } from "@/lib/pricing";
import { formatPkr, formatSar, pkrInWords } from "@/lib/pricing";

function paxLine(pax: QuotationForm["pax"]): string {
  const parts: string[] = [];
  if (pax.adults > 0) parts.push(`${pax.adults} adult${pax.adults === 1 ? "" : "s"}`);
  if (pax.children > 0) parts.push(`${pax.children} child${pax.children === 1 ? "" : "ren"}`);
  if (pax.infants > 0) parts.push(`${pax.infants} infant${pax.infants === 1 ? "" : "s"}`);
  return parts.join(" · ") || "No passengers yet";
}

export function hasMissingRates(c: Computed): boolean {
  return (
    c.stays.some((s) => s.missing1 || s.missing2) || c.transport.some((t) => t.missing)
  );
}

function Row({ label, sar, pkr }: { label: string; sar?: number; pkr: number }) {
  return (
    <tr className="border-t border-stone-100">
      <th scope="row" className="py-2 pr-2 text-left font-normal text-stone-700">
        {label}
      </th>
      <td className="py-2 pr-2 text-right tabular-nums text-stone-600">
        {sar === undefined ? "—" : formatSar(sar).replace("SAR ", "")}
      </td>
      <td className="py-2 text-right tabular-nums text-stone-900">
        {formatPkr(pkr).replace("PKR ", "")}
      </td>
    </tr>
  );
}

function OptionTotal({
  title,
  total,
  perPax,
}: {
  title: string;
  total: number;
  perPax: number;
}) {
  return (
    <div className="rounded-md bg-emerald-50 p-3">
      <div className="text-xs font-medium uppercase tracking-wide text-emerald-900">
        {title}
      </div>
      <div className="mt-0.5 text-xl font-semibold tabular-nums text-emerald-950">
        {formatPkr(total)}
      </div>
      <div className="text-sm text-emerald-900">
        {formatPkr(perPax)} per customer
      </div>
      <div className="mt-1.5 text-xs text-emerald-900/80">{pkrInWords(total)}</div>
    </div>
  );
}

export function TotalsSummary({
  form,
  computed: c,
}: {
  form: QuotationForm;
  computed: Computed;
}) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4">
      <h2 className="text-base font-semibold text-stone-900">Live totals</h2>
      <p className="mt-0.5 text-xs text-stone-600">
        {paxLine(form.pax)} · {c.nightsTotal} night{c.nightsTotal === 1 ? "" : "s"}
      </p>
      <p className="text-xs text-stone-600">
        1 SAR = PKR {form.pkrPerSar || 0}
      </p>

      <table className="mt-3 w-full text-sm">
        <thead>
          <tr className="text-xs text-stone-500">
            <th className="pb-1 text-left font-medium">Item</th>
            <th className="pb-1 pr-2 text-right font-medium">SAR</th>
            <th className="pb-1 text-right font-medium">PKR</th>
          </tr>
        </thead>
        <tbody>
          <Row label="Hotels, option 1" sar={c.sar.accommodation1} pkr={c.pkr.accommodation1} />
          <Row label="Hotels, option 2" sar={c.sar.accommodation2} pkr={c.pkr.accommodation2} />
          <Row label="Transport" sar={c.sar.transport} pkr={c.pkr.transport} />
          <Row label="Visa" sar={c.sar.visa} pkr={c.pkr.visa} />
          <Row label="Airfare" pkr={c.pkr.airfare} />
        </tbody>
      </table>

      {hasMissingRates(c) && (
        <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-900">
          Some selected items have no rate and count as 0.
        </p>
      )}

      <div className="mt-4 space-y-3">
        <OptionTotal title="Option 1 total" total={c.grandTotal1Pkr} perPax={c.perPax1Pkr} />
        <OptionTotal title="Option 2 total" total={c.grandTotal2Pkr} perPax={c.perPax2Pkr} />
      </div>
    </div>
  );
}
