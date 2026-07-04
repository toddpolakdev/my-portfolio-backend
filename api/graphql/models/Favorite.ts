import mongoose, { Schema, Document } from "mongoose";

export interface FavoriteDocument extends Document {
  userEmail: string;
  videoId: string;
  videoUrl: string;
  createdAt: Date;
}

const FavoriteSchema = new Schema<FavoriteDocument>(
  {
    userEmail: { type: String, required: true, index: true },
    videoId: { type: String, required: true },
    videoUrl: { type: String, required: true },
  },
  { timestamps: true }
);

// One favorite per (user, video). Also makes addFavorite upserts idempotent.
FavoriteSchema.index({ userEmail: 1, videoId: 1 }, { unique: true });

export const Favorite =
  mongoose.models.Favorite ||
  mongoose.model<FavoriteDocument>("Favorite", FavoriteSchema);
