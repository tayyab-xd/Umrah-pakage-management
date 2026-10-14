import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

// All rates are SAR, per person per night. null = not offered for that room type.
const rateField = { type: Number, default: null };

const hotelSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    city: { type: String, enum: ["Makkah", "Madinah"], required: true },
    location: { type: String, default: "" },
    distance: { type: String, default: "" },
    rates: {
      double: rateField,
      triple: rateField,
      quad: rateField,
      quint: rateField,
      sharing: rateField,
    },
    // Set when seeded data looks suspicious and the agency should confirm it.
    needsVerification: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export type HotelDoc = InferSchemaType<typeof hotelSchema>;

export const Hotel: Model<HotelDoc> =
  (mongoose.models.Hotel as Model<HotelDoc>) ||
  mongoose.model<HotelDoc>("Hotel", hotelSchema);
