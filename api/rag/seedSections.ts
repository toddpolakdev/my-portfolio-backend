import "dotenv/config";
import mongoose from "mongoose";
import { Section } from "../graphql/models/Section.js";
import { chunkText } from "./chunker.js";
import { embedText } from "./embeddings.js";
import type { RagChunk } from "./types.js";

const DB_URI = process.env.MONGODB_URI!;
const DB_NAME = process.env.DB_NAME || "portfolio";
const CHUNKS_COLLECTION = process.env.CHUNKS_COLLECTION || "rag_chunks";

async function main() {
  await mongoose.connect(DB_URI, { dbName: DB_NAME });
  console.log("✅ Connected to MongoDB");

  const RagChunks = mongoose.connection.collection<RagChunk>(CHUNKS_COLLECTION);
  const sections = await Section.find();
  console.log(`Found ${sections.length} sections`);

  for (const s of sections) {
    // collect all readable text
    const texts: string[] = [];

    if (s.title) texts.push(s.title);
    if (s.description) texts.push(s.description);
    if (Array.isArray(s.content)) texts.push(...s.content);

    if (Array.isArray(s.experience)) {
      for (const exp of s.experience) {
        if (exp.company) texts.push(exp.company);
        if (exp.title) texts.push(exp.title);
        if (Array.isArray(exp.description)) texts.push(...exp.description);
      }
    }

    const combined = texts.join("\n").trim();
    if (!combined) continue;

    const chunks = chunkText(combined);
    console.log(`📄 Section "${s.id}" → ${chunks.length} chunk(s)`);

    for (const text of chunks) {
      const embedding = await embedText(text);
      const doc: RagChunk = {
        sectionId: s.id,
        title: s.title,
        text,
        embedding,
        createdAt: new Date(),
      };
      await RagChunks.insertOne(doc);
    }
  }

  await mongoose.disconnect();
  console.log("✅ Done seeding rag_chunks");
}

main().catch((err) => {
  console.error("❌ Error seeding:", err);
  process.exit(1);
});
