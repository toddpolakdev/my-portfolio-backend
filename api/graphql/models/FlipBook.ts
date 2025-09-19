import mongoose, { Schema } from "mongoose";

const FlipBookSettingsSchema = new Schema(
  {
    width: { type: Number, default: 400 },
    height: { type: Number, default: 600 },
    size: { type: String, enum: ["fixed", "stretch"], default: "stretch" },
    minWidth: { type: Number, default: 315 },
    maxWidth: { type: Number, default: 1000 },
    minHeight: { type: Number, default: 400 },
    maxHeight: { type: Number, default: 1500 },
    drawShadow: { type: Boolean, default: true },
    flippingTime: { type: Number, default: 600 },
    usePortrait: { type: Boolean, default: true },
    startZIndex: { type: Number, default: 0 },
    autoSize: { type: Boolean, default: true },
    maxShadowOpacity: { type: Number, default: 0.5, min: 0, max: 1 },
    showCover: { type: Boolean, default: true },
    mobileScrollSupport: { type: Boolean, default: true },
    backgroundColor: { type: String, default: "#ffffff" },
    showPageNumbers: { type: Boolean, default: true },
    swipeDistance: { type: Number, default: 30 },
    showPageCorners: { type: Boolean, default: true },
    disableFlipByClick: { type: Boolean, default: false },
    useMouseEvents: { type: Boolean, default: true },
  },
  { _id: false }
);

const FlipBookSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    images: { type: [String], default: [] },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    tags: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    settings: { type: FlipBookSettingsSchema, default: () => ({}) },
    publishedAt: Date,
  },
  { timestamps: true }
);

// Add index for ordering
FlipBookSchema.index({ order: 1 });

export const FlipBook =
  mongoose.models.FlipBook || mongoose.model("FlipBook", FlipBookSchema);
