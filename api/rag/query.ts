import express from "express";
import mongoose from "mongoose";
import fetch from "node-fetch";

const router = express.Router();
const RAG_COLLECTION = process.env.CHUNKS_COLLECTION || "rag_chunks";

router.post("/query", async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: "Missing question" });
  }

  const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";
  const embedModel = process.env.EMBED_MODEL || "nomic-embed-text";

  try {
    // STEP 1: Get embedding for the user's question
    const embedRes = await fetch(`${ollamaUrl}/api/embeddings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: embedModel,
        prompt: question,
      }),
    });

    const embedData = await embedRes.json();
    const queryEmbedding = embedData.embedding;

    if (!queryEmbedding || !Array.isArray(queryEmbedding)) {
      return res
        .status(500)
        .json({ error: "Failed to generate question embedding" });
    }

    // STEP 2: Find similar chunks from rag_chunks collection
    const RagChunks = mongoose.connection.collection(RAG_COLLECTION);

    const allChunks = await RagChunks.find({}).toArray();
    if (!allChunks.length) {
      return res.status(404).json({ error: "No chunks found in database" });
    }

    // Simple cosine similarity function
    function cosineSimilarity(a: number[], b: number[]) {
      const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
      const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
      const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
      return dot / (magA * magB);
    }

    // Compute similarity for each chunk
    const scored = allChunks.map((chunk: any) => ({
      ...chunk,
      similarity: cosineSimilarity(queryEmbedding, chunk.embedding),
    }));

    // Sort by similarity and limit results
    const topMatches = scored
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5)
      .map(({ sectionId, text, similarity }) => ({
        sectionId,
        text,
        similarity,
      }));

    res.json(topMatches);
  } catch (err) {
    console.error("❌ Query error:", err);
    res.status(500).json({ error: "Query failed" });
  }
});

export default router;
