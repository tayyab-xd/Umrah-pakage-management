"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminShell } from "@/components/layout/AdminShell";
import { UserShell } from "@/components/layout/UserShell";
import { useSession } from "@/lib/session";

export function ShellLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center text-sm text-stone-500">
      Loading…
    </div>
  );
}

// Wraps every signed-in page. It does two jobs:
//  1. Page guard: where a visitor may be. (The API enforces access for real;
//     the JWT is in localStorage so the server can't check it before render.)
//  2. Picks the layout: sidebar for admins, top bar for everyone else.
export function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { ready, user } = useSession();

  let redirectTo: string | null = null;
  if (ready) {
    if (!user) redirectTo = "/login";
    else if (pathname.startsWith("/admin") && !user.isAdmin) redirectTo = "/dashboard";
    else if (user.isAdmin && pathname === "/dashboard") redirectTo = "/admin";
  }

  useEffect(() => {
    if (redirectTo) router.replace(redirectTo);
  }, [redirectTo, router]);

  if (!ready || !user || redirectTo) return <ShellLoading />;

  return user.isAdmin ? (
    <AdminShell user={user}>{children}</AdminShell>
  ) : (
    <UserShell user={user}>{children}</UserShell>
  );
}
