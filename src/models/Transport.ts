import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

// One row per route. `prices` maps vehicle name -> price in SAR (per vehicle),
// e.g. { "CAMRY/SONATA": 275, "HIACE": 375 }.
const transportSchema = new Schema(
  {
    route: { type: String, required: true, unique: true, trim: true },
    prices: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, minimize: false }
);

export type TransportDoc = InferSchemaType<typeof transportSchema>;

export const Transport: Model<TransportDoc> =
  (mongoose.models.Transport as Model<TransportDoc>) ||
  mongoose.model<TransportDoc>("Transport", transportSchema);
