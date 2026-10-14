import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export default function AdminUsersPage() {
  return (
    <>
      <PageHeader
        title="Users"
        description="View all users. Deleting a user also deletes all of their quotations."
      />
      <EmptyState title="The users list comes later">
        Name, email, phone, role and joined date, with a delete action.
      </EmptyState>
    </>
  );
}
