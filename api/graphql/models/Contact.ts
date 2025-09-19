import mongoose, { Schema, Document } from "mongoose";

export interface ContactDocument extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
}

const ContactSchema = new Schema<ContactDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Contact =
  mongoose.models.Contact ||
  mongoose.model<ContactDocument>("Contact", ContactSchema);
