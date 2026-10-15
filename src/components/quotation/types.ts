import type { Dispatch, SetStateAction } from "react";
import type { ReferenceData } from "@/lib/cache";
import type { Computed, QuotationForm } from "@/lib/pricing";

/** What every form section receives. */
export type SectionProps = {
  form: QuotationForm;
  setForm: Dispatch<SetStateAction<QuotationForm>>;
  data: ReferenceData;
  computed: Computed;
};
