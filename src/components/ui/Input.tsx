import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function Input({ label, id, className = "", ...rest }: Props) {
  const inputId = id ?? rest.name;
  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-sm font-medium text-stone-700"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={`block w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-emerald-700 focus:outline-2 focus:outline-offset-0 focus:outline-emerald-700/25 ${className}`}
        {...rest}
      />
    </div>
  );
}
