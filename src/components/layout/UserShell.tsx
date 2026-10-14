"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { UserMenu } from "@/components/layout/UserMenu";
import { isActive, userNav } from "@/components/layout/nav";
import type { SessionUser } from "@/lib/session";

// Layout for normal users: a top bar. On small screens the links collapse
// into a menu button.
export function UserShell({
  user,
  children,
}: {
  user: SessionUser;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="sticky top-0 z-20 border-b border-stone-200 bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-8">
            <Link
              href="/dashboard"
              className="text-sm font-semibold tracking-wide text-emerald-900"
            >
              Umrah Quotation
            </Link>
            <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
              {userNav.map((item) => {
                const active = isActive(item, pathname);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-emerald-50 text-emerald-900"
                        : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                    }`}
                  >
                    <item.icon className="size-4" aria-hidden />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="hidden w-72 md:block">
            <UserMenu user={user} />
          </div>

          <button
            type="button"
            className="-mr-2 inline-flex size-10 items-center justify-center rounded-md text-stone-700 hover:bg-stone-100 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {open && (
          <div
            id="mobile-menu"
            className="border-t border-stone-200 bg-white px-4 pt-2 pb-4 md:hidden"
          >
            <nav aria-label="Main" className="flex flex-col gap-1">
              {userNav.map((item) => {
                const active = isActive(item, pathname);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium ${
                      active
                        ? "bg-emerald-50 text-emerald-900"
                        : "text-stone-700 hover:bg-stone-100"
                    }`}
                  >
                    <item.icon className="size-4" aria-hidden />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-3 border-t border-stone-200 pt-3">
              <UserMenu user={user} />
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
