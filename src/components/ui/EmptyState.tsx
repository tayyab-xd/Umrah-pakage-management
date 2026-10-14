// Placeholder block shown where a screen's real content will go.
export function EmptyState({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
      <p className="text-base font-medium text-stone-900">{title}</p>
      {children && <p className="mx-auto mt-1.5 max-w-md text-sm text-stone-600">{children}</p>}
    </div>
  );
}
