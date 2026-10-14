import { connectDB } from "@/lib/db";
import { json, withAuth } from "@/lib/auth";
import { Hotel } from "@/models/Hotel";
import { Transport } from "@/models/Transport";
import { Vehicle } from "@/models/Vehicle";
import { Airline } from "@/models/Airline";
import { VisaFee } from "@/models/VisaFee";
import { Setting } from "@/models/Setting";

// Everything the quotation form needs. The client stores this in localStorage
// right after login.
export const GET = withAuth(async () => {
  await connectDB();

  const [hotels, transport, vehicles, airlines, visaFees, settings] =
    await Promise.all([
      Hotel.find().sort({ city: 1, name: 1 }).lean(),
      Transport.find().sort({ route: 1 }).lean(),
      Vehicle.find().sort({ name: 1 }).lean(),
      Airline.find().sort({ name: 1 }).lean(),
      VisaFee.find().lean(),
      Setting.findOneAndUpdate(
        { key: "main" },
        { $setOnInsert: { key: "main" } },
        { upsert: true, new: true }
      ).lean(),
    ]);

  return json({ hotels, transport, vehicles, airlines, visaFees, settings });
});
