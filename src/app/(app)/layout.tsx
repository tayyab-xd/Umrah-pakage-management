import { Suspense } from "react";
import { AppShell, ShellLoading } from "@/components/layout/AppShell";

// Every signed-in page (user and admin) renders inside this shell.
// The Suspense boundary is required: the shell reads the current path
// (usePathname), which Next only knows at request time on dynamic routes.
export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <Suspense fallback={<ShellLoading />}>
      <AppShell>{children}</AppShell>
    </Suspense>
  );
}
