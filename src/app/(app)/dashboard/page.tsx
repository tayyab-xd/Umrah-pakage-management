import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { LinkButton } from "@/components/ui/LinkButton";
import { EmptyState } from "@/components/ui/EmptyState";

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="My quotations"
        description="Every quotation you have made."
        action={
          <LinkButton href="/quotations/new" className="w-full sm:w-auto">
            <Plus className="size-4" aria-hidden />
            New quotation
          </LinkButton>
        }
      />
      <EmptyState title="Your quotations will be listed here">
        Number, customer, passengers, total and dates, with search.
      </EmptyState>
    </>
  );
}
