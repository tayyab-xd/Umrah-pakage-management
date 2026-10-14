import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export default function NewQuotationPage() {
  return (
    <>
      <PageHeader
        title="New quotation"
        description="Customer, passengers, accommodation, transport, visa and airfare, with live totals."
      />
      <EmptyState title="The quotation form comes next">
        This will be one long page with a sticky summary showing totals in SAR
        and PKR.
      </EmptyState>
    </>
  );
}
