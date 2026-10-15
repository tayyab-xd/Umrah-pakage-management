import { PageHeader } from "@/components/ui/PageHeader";
import { QuotationEditor } from "@/components/quotation/QuotationEditor";

export default function NewQuotationPage() {
  return (
    <>
      <PageHeader
        title="New quotation"
        description="Customer, passengers, accommodation, transport, visa and airfare, with live totals in SAR and PKR."
      />
      <QuotationEditor />
    </>
  );
}
