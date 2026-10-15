import type { ReactNode } from "react";

export function Section({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-stone-900">{title}</h2>
          {description && (
            <p className="mt-0.5 text-sm text-stone-600">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children}
    </section>
  );
}

/** A repeated row (a stay, a transport leg) inside a section. */
export function RowCard({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-md border border-stone-200 bg-stone-50/60 p-3 sm:p-4">
      {children}
    </div>
  );
}

export function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-1.5 text-sm font-medium text-stone-700">{label}</div>
      <div className="rounded-md border border-stone-200 bg-stone-100 px-3 py-2.5 text-sm text-stone-700">
        {value || "—"}
      </div>
    </div>
  );
}

export function Warning({ children }: { children: ReactNode }) {
  return (
    <p className="mt-2 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-900">
      {children}
    </p>
  );
}
