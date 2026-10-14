import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const vehicleSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    capacity: { type: String, default: "" }, // e.g. "5", "40-45"
  },
  { timestamps: true }
);

export type VehicleDoc = InferSchemaType<typeof vehicleSchema>;

export const Vehicle: Model<VehicleDoc> =
  (mongoose.models.Vehicle as Model<VehicleDoc>) ||
  mongoose.model<VehicleDoc>("Vehicle", vehicleSchema);
