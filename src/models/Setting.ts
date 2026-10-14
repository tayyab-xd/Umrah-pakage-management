import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

// Singleton document (key = "main") holding app-wide settings.
const settingSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "main" },
    pkrPerSar: { type: Number, required: true, default: 78.5, min: 0 },
    validityText: {
      type: String,
      default: "Umrah Services Quotation is just Valid for 2-Days.",
    },
    notes: { type: [String], default: [] },
    documentsRequired: { type: [String], default: [] },
  },
  { timestamps: true }
);

export type SettingDoc = InferSchemaType<typeof settingSchema>;

export const Setting: Model<SettingDoc> =
  (mongoose.models.Setting as Model<SettingDoc>) ||
  mongoose.model<SettingDoc>("Setting", settingSchema);
