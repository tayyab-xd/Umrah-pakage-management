"use client";

import { Input } from "@/components/ui/Input";
import { Section } from "@/components/quotation/Section";
import type { SectionProps } from "@/components/quotation/types";

export function CustomerSection({ form, setForm }: SectionProps) {
  const set = (patch: Partial<SectionProps["form"]["customer"]>) =>
    setForm((f) => ({ ...f, customer: { ...f.customer, ...patch } }));

  return (
    <Section title="Customer" description="Who the quotation is for.">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Customer name"
          name="customerName"
          value={form.customer.name}
          onChange={(e) => set({ name: e.target.value })}
          autoComplete="off"
        />
        <Input
          label="Contact"
          name="customerContact"
          value={form.customer.contact}
          onChange={(e) => set({ contact: e.target.value })}
          autoComplete="off"
        />
        <Input
          label="Address"
          name="customerAddress"
          value={form.customer.address}
          onChange={(e) => set({ address: e.target.value })}
          autoComplete="off"
        />
        <Input
          label="City"
          name="customerCity"
          value={form.customer.city}
          onChange={(e) => set({ city: e.target.value })}
          autoComplete="off"
        />
      </div>
    </Section>
  );
}
