import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { LinkButton } from "@/components/ui/LinkButton";
import { EmptyState } from "@/components/ui/EmptyState";

export default function AdminQuotationsPage() {
  return (
    <>
      <PageHeader
        title="All quotations"
        description="Quotations from every user. Open one to edit it, or delete it."
        action={
          <LinkButton href="/quotations/new" className="w-full sm:w-auto">
            <Plus className="size-4" aria-hidden />
            New quotation
          </LinkButton>
        }
      />
      <EmptyState title="All quotations will be listed here">
        The same table users see, plus an owner column and a filter by user.
      </EmptyState>
    </>
  );
}
