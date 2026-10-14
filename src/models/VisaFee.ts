import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

// One row per pax type. Rate is SAR per person.
const visaFeeSchema = new Schema(
  {
    paxType: {
      type: String,
      enum: ["adult", "child", "infant"],
      required: true,
      unique: true,
    },
    label: { type: String, required: true }, // e.g. "Umrah Visa Processing Charges (Adult 12+)"
    rate: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

export type VisaFeeDoc = InferSchemaType<typeof visaFeeSchema>;

export const VisaFee: Model<VisaFeeDoc> =
  (mongoose.models.VisaFee as Model<VisaFeeDoc>) ||
  mongoose.model<VisaFeeDoc>("VisaFee", visaFeeSchema);
