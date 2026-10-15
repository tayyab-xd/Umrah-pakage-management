import type { ComponentProps } from "react";
import { Input } from "@/components/ui/Input";

type Props = Omit<
  ComponentProps<typeof Input>,
  "type" | "value" | "onChange" | "inputMode"
> & {
  value: number | null;
  /** null means the field was cleared. */
  onChange: (value: number | null) => void;
};

export function NumberField({ value, onChange, min = 0, ...rest }: Props) {
  return (
    <Input
      type="number"
      inputMode="decimal"
      min={min}
      value={value ?? ""}
      onChange={(e) => {
        const raw = e.target.value;
        if (raw === "") return onChange(null);
        const n = Number(raw);
        onChange(Number.isFinite(n) ? n : null);
      }}
      {...rest}
    />
  );
}
