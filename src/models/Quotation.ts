import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

/**
 * A quotation stores the prices exactly as they were when it was made
 * (snapshot), plus the exchange rate used. Later price changes never alter it.
 * Totals are computed in the browser and saved as sent.
 */

const stay = new Schema(
  {
    city: { type: String, required: true }, // Makkah / Madinah / ...
    hotelName: { type: String, default: "" },
    nights: { type: Number, default: 0, min: 0 },
    checkIn: { type: Date },
    checkOut: { type: Date },
    rateOption1: { type: Number, default: 0 }, // SAR per person per night
    rateOption2: { type: Number, default: 0 },
  },
  { _id: false }
);

const transportLeg = new Schema(
  {
    route: { type: String, default: "" },
    vehicle: { type: String, default: "" },
    priceSar: { type: Number, default: 0 },
  },
  { _id: false }
);

const visaLine = new Schema(
  {
    paxType: { type: String, enum: ["adult", "child", "infant"], required: true },
    label: { type: String, default: "" },
    count: { type: Number, default: 0 },
    rateSar: { type: Number, default: 0 },
  },
  { _id: false }
);

const airfareLine = new Schema(
  {
    paxType: { type: String, enum: ["adult", "child", "infant"], required: true },
    airline: { type: String, default: "" },
    destination: { type: String, default: "" },
    luggage: { type: String, default: "" },
    count: { type: Number, default: 0 },
    farePkr: { type: Number, default: 0 }, // typed in by hand, PKR per person
  },
  { _id: false }
);

const quotationSchema = new Schema(
  {
    number: { type: String, required: true, unique: true }, // e.g. Q-0001
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },

    preparedBy: {
      name: { type: String, default: "" },
      phone: { type: String, default: "" },
    },
    customer: {
      name: { type: String, default: "" },
      contact: { type: String, default: "" },
      address: { type: String, default: "" },
      city: { type: String, default: "" },
    },

    pax: {
      adults: { type: Number, default: 0, min: 0 },
      children: { type: Number, default: 0, min: 0 },
      infants: { type: Number, default: 0, min: 0 },
    },

    pkrPerSar: { type: Number, required: true }, // rate used at the time

    roomTypeOption1: { type: String, default: "" },
    roomTypeOption2: { type: String, default: "" },
    stays: { type: [stay], default: [] },
    transport: { type: [transportLeg], default: [] },
    visa: { type: [visaLine], default: [] },
    airfare: { type: [airfareLine], default: [] },

    totals: {
      accommodationOption1Sar: { type: Number, default: 0 },
      accommodationOption2Sar: { type: Number, default: 0 },
      transportSar: { type: Number, default: 0 },
      visaSar: { type: Number, default: 0 },
      airfarePkr: { type: Number, default: 0 },
      grandTotalOption1Pkr: { type: Number, default: 0 },
      grandTotalOption2Pkr: { type: Number, default: 0 },
      perPaxOption1Pkr: { type: Number, default: 0 },
      perPaxOption2Pkr: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export type QuotationDoc = InferSchemaType<typeof quotationSchema>;

export const Quotation: Model<QuotationDoc> =
  (mongoose.models.Quotation as Model<QuotationDoc>) ||
  mongoose.model<QuotationDoc>("Quotation", quotationSchema);
