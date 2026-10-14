import {
  Building2,
  Car,
  FileText,
  Plane,
  Plus,
  Settings,
  Stamp,
  Truck,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Custom "is this item active for the current path" rule. */
  match?: (pathname: string) => boolean;
};

export type NavGroup = { title?: string; items: NavItem[] };

// An existing quotation lives at /quotations/<id>; "new" is its own item.
const isExistingQuotation = (p: string) =>
  p.startsWith("/quotations/") && p !== "/quotations/new";

export const userNav: NavItem[] = [
  {
    label: "My quotations",
    href: "/dashboard",
    icon: FileText,
    match: (p) => p === "/dashboard" || isExistingQuotation(p),
  },
  { label: "New quotation", href: "/quotations/new", icon: Plus },
];

// Types handled by /admin/data/[type]
export const dataTypes = [
  { slug: "hotels", label: "Hotels", icon: Building2, blurb: "Makkah and Madinah hotels and their room rates (SAR per person per night)." },
  { slug: "transport", label: "Transport", icon: Car, blurb: "Route prices by vehicle (SAR per vehicle)." },
  { slug: "vehicles", label: "Vehicles", icon: Truck, blurb: "Vehicle types and their capacity." },
  { slug: "airlines", label: "Airlines", icon: Plane, blurb: "Airlines and their luggage allowance." },
  { slug: "visa", label: "Visa fees", icon: Stamp, blurb: "Visa processing fee per passenger type (SAR)." },
] as const;

export const adminNav: NavGroup[] = [
  {
    title: "Quotations",
    items: [
      {
        label: "All quotations",
        href: "/admin",
        icon: FileText,
        match: (p) => p === "/admin" || isExistingQuotation(p),
      },
      { label: "New quotation", href: "/quotations/new", icon: Plus },
    ],
  },
  {
    title: "People",
    items: [{ label: "Users", href: "/admin/users", icon: Users }],
  },
  {
    title: "Price data",
    items: dataTypes.map((t) => ({
      label: t.label,
      href: `/admin/data/${t.slug}`,
      icon: t.icon,
    })),
  },
  {
    title: "System",
    items: [{ label: "Settings", href: "/admin/settings", icon: Settings }],
  },
];

export function isActive(item: NavItem, pathname: string): boolean {
  if (item.match) return item.match(pathname);
  return pathname === item.href || pathname.startsWith(item.href + "/");
}
