import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Setting } from "@/models/Setting";
import {
  collections,
  SETTINGS_FILTER,
  validateSeed,
  type SeedData,
} from "./seed-lib";

// Usage:
//   npm run seed             add whatever is missing (never overwrites existing rows)
//   npm run seed -- --reset  delete all price data first, then load it fresh
//
// Only the price-data collections are touched. Users and quotations never are.
// If scripts/seed-data.local.json exists (gitignored) it is used instead of the
// sample scripts/seed-data.json, so real rates can stay out of the repo.

const reset = process.argv.includes("--reset");
const dir = __dirname;
const localFile = path.join(dir, "seed-data.local.json");
const file = fs.existsSync(localFile) ? localFile : path.join(dir, "seed-data.json");

async function main() {
  console.log(`Seed file: ${path.relative(process.cwd(), file)}`);
  const data = JSON.parse(fs.readFileSync(file, "utf8")) as SeedData;

  const errors = await validateSeed(data);
  if (errors.length) {
    console.error("Seed data is invalid, nothing was written:");
    for (const e of errors) console.error("  -", e);
    process.exit(1);
  }

  await connectDB();
  const { host, name } = mongoose.connection;
  console.log(`Database: ${name} on ${host}`);

  if (reset) {
    console.log("--reset: deleting existing price data (users and quotations are kept)");
    for (const { key, model } of collections) {
      const r = await model.deleteMany({});
      console.log(`  ${key}: removed ${r.deletedCount}`);
    }
    const r = await Setting.deleteMany({});
    console.log(`  settings: removed ${r.deletedCount}`);
  }

  // $setOnInsert: a row that already exists is left exactly as it is.
  for (const { key, model, naturalKey } of collections) {
    const res = await model.bulkWrite(
      data[key].map((doc) => ({
        updateOne: {
          filter: naturalKey(doc),
          update: { $setOnInsert: doc },
          upsert: true,
        },
      }))
    );
    const added = res.upsertedCount;
    console.log(`${key}: ${added} added, ${data[key].length - added} already there`);
  }

  const s = await Setting.updateOne(
    SETTINGS_FILTER,
    { $setOnInsert: { ...SETTINGS_FILTER, ...data.settings } },
    { upsert: true }
  );
  console.log(`settings: ${s.upsertedCount ? "created" : "already there"}`);

  console.log("Done.");
}

main()
  .catch((err) => {
    console.error("Seeding failed:", err instanceof Error ? err.message : err);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
