import type { SelectHTMLAttributes } from "react";

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
};

export function Select({ label, id, className = "", children, ...rest }: Props) {
  const selectId = id ?? rest.name;
  return (
    <div>
      <label
        htmlFor={selectId}
        className="mb-1.5 block text-sm font-medium text-stone-700"
      >
        {label}
      </label>
      <select
        id={selectId}
        className={`block w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 focus:border-emerald-700 focus:outline-2 focus:outline-offset-0 focus:outline-emerald-700/25 ${className}`}
        {...rest}
      >
        {children}
      </select>
    </div>
  );
}
