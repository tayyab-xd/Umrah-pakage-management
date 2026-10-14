import type { ReactNode } from "react";

// Shared frame for the login and signup pages.
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <main className="grid min-h-screen lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <aside className="hidden flex-col justify-between bg-emerald-950 p-12 text-emerald-50 lg:flex">
        <p className="text-sm font-medium tracking-[0.25em] text-emerald-300/80 uppercase">
          Umrah Services
        </p>
        <div>
          <h2 className="max-w-md text-4xl leading-tight font-semibold">
            Hotels, transport, visas and flights — one quotation.
          </h2>
          <p className="mt-4 max-w-md text-emerald-200/80">
            Build a package, see the total in both Saudi Riyal and Rupees, and
            keep every quotation you have made.
          </p>
        </div>
        <p className="text-xs text-emerald-300/60">Prototype</p>
      </aside>

      <section className="flex items-center justify-center bg-stone-50 px-6 py-12">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold text-stone-900">{title}</h1>
          <p className="mt-1.5 text-sm text-stone-600">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-6 text-sm text-stone-600">{footer}</p>
        </div>
      </section>
    </main>
  );
}
