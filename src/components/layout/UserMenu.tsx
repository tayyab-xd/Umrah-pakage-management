"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { clearSession, type SessionUser } from "@/lib/session";

// Name, role badge and log out. `tone` matches the surface it sits on.
export function UserMenu({
  user,
  tone = "light",
}: {
  user: SessionUser;
  tone?: "light" | "dark";
}) {
  const router = useRouter();

  function logout() {
    clearSession(); // also clears the cached reference data
    router.replace("/login");
  }

  const dark = tone === "dark";
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p
          className={`truncate text-sm font-medium ${dark ? "text-white" : "text-stone-900"}`}
        >
          {user.name}
        </p>
        <p
          className={`truncate text-xs ${dark ? "text-emerald-200/70" : "text-stone-500"}`}
        >
          {user.isAdmin ? "Administrator" : user.email}
        </p>
      </div>
      <button
        type="button"
        onClick={logout}
        className={`inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
          dark
            ? "text-emerald-100 hover:bg-white/10 focus-visible:outline-emerald-300"
            : "border border-stone-300 text-stone-700 hover:bg-stone-50 focus-visible:outline-stone-500"
        }`}
      >
        <LogOut className="size-4" aria-hidden />
        Log out
      </button>
    </div>
  );
}
