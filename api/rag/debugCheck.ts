import mongoose from "mongoose";
import dotenv from "dotenv";
import RagChunk from "./models/RagChunk";

dotenv.config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "", {
      dbName: process.env.DB_NAME,
    });
    console.log("✅ Connected to MongoDB");

    const one = await RagChunk.findOne(
      {},
      { section: 1, text: 1, embedding: { $slice: 3 } }
    );
    console.log("Sample document:\n", JSON.stringify(one, null, 2));

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
})();
