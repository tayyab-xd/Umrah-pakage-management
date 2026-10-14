import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export default function EditQuotationPage() {
  return (
    <>
      <PageHeader
        title="Edit quotation"
        description="Open an existing quotation to change it. Created and updated dates are shown here."
      />
      <EmptyState title="The edit view comes with the quotation form">
        It will use the same single-page form as a new quotation.
      </EmptyState>
    </>
  );
}
