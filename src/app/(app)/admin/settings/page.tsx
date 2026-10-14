import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export default function AdminSettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="The PKR/SAR rate and the fixed text shown on every quotation."
      />
      <EmptyState title="Settings come later">
        Exchange rate, validity text, notes and the required-documents list.
      </EmptyState>
    </>
  );
}
