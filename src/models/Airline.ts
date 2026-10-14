import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const airlineSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    luggage: { type: String, default: "7KG-40KG" },
  },
  { timestamps: true }
);

export type AirlineDoc = InferSchemaType<typeof airlineSchema>;

export const Airline: Model<AirlineDoc> =
  (mongoose.models.Airline as Model<AirlineDoc>) ||
  mongoose.model<AirlineDoc>("Airline", airlineSchema);
