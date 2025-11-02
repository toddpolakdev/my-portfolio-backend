import "dotenv/config";
import mongoose from "mongoose";
import { Section } from "../graphql/models/Section";

async function main() {
  await mongoose.connect(process.env.MONGODB_URI || "", {
    dbName: process.env.DB_NAME,
  });
  console.log("✅ Connected to MongoDB");

  const count = await Section.countDocuments();
  console.log(`📊 Section count: ${count}`);

  const sample = await Section.findOne();
  console.log("Sample section:", sample?.id || "none");

  await mongoose.disconnect();
}

main().catch(console.error);
