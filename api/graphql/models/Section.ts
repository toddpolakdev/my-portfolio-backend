import mongoose, { Schema, Document } from "mongoose";

interface SkillTag {
  name: string;
  url: string;
}

interface SkillCategory {
  category: string;
  tags: SkillTag[];
}

interface JobEntry {
  title: string;
  company: string;
  duration: string;
  description: string[];
}

interface EducationEntry {
  degree: string;
  institution: string;
  duration: string;
  description: string[];
}

export interface SectionDocument extends Document {
  id: string;
  title: string;
  type: string;
  subtitle?: string;
  description?: string;
  content?: string[];
  skills?: SkillCategory[];
  experience?: JobEntry[];
  education?: EducationEntry[];
  background?: string;
}

const SectionSchema = new Schema<SectionDocument>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    type: { type: String, required: true },
    subtitle: String,
    description: String,
    content: [String],
    skills: [
      {
        category: { type: String, required: true },
        tags: [
          {
            name: { type: String, required: true },
            url: { type: String, required: true },
          },
        ],
      },
    ],
    experience: [
      {
        title: String,
        company: String,
        duration: String,
        description: [String],
      },
    ],
    education: [
      {
        degree: String,
        institution: String,
        duration: String,
        description: [String],
      },
    ],
    background: String,
  },
  { timestamps: true }
);

export const Section =
  mongoose.models.Section ||
  mongoose.model<SectionDocument>("Section", SectionSchema, "section");
