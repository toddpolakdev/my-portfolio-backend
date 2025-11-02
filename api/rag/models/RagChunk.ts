import mongoose, { Schema, Document } from "mongoose";

export interface IRagChunk extends Document {
  section: string;
  text: string;
  embedding: number[];
}

const RagChunkSchema = new Schema<IRagChunk>({
  section: { type: String, required: true },
  text: { type: String, required: true },
  embedding: { type: [Number], required: true },
});

export default mongoose.models.RagChunk ||
  mongoose.model<IRagChunk>("RagChunk", RagChunkSchema);
