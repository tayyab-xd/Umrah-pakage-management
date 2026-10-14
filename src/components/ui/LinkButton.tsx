import Link from "next/link";
import type { ComponentProps } from "react";

// A link that looks like the primary Button.
export function LinkButton({
  className = "",
  ...rest
}: ComponentProps<typeof Link>) {
  return (
    <Link
      className={`inline-flex items-center justify-center gap-2 rounded-md bg-emerald-800 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800 ${className}`}
      {...rest}
    />
  );
}
