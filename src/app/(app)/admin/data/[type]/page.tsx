import { notFound } from "next/navigation";
import { dataTypes } from "@/components/layout/nav";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export function generateStaticParams() {
  return dataTypes.map((t) => ({ type: t.slug }));
}

export default async function AdminDataPage({
  params,
}: PageProps<"/admin/data/[type]">) {
  const { type } = await params;
  const entry = dataTypes.find((t) => t.slug === type);
  if (!entry) notFound();

  return (
    <>
      <PageHeader title={entry.label} description={entry.blurb} />
      <EmptyState title={`${entry.label} list comes later`}>
        A table with add, edit and delete.
      </EmptyState>
    </>
  );
}
