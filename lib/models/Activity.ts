import mongoose, { Schema, Document, models } from "mongoose";

export type ActivityType = "gym" | "meditation" | "study" | "work" | "other";

export interface IActivity extends Document {
  userId: string;
  type: ActivityType;
  title?: string;
  startTime: Date;
  endTime?: Date;
  durationMinutes?: number;
  notes?: string;
}

const ActivitySchema = new Schema<IActivity>(
  {
    userId: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: ["gym", "meditation", "study", "work", "other"],
      required: true,
    },
    title: String,
    startTime: { type: Date, required: true },
    endTime: Date,
    durationMinutes: Number,
    notes: String,
  },
  { timestamps: true }
);

export const Activity =
  models.Activity || mongoose.model<IActivity>("Activity", ActivitySchema);
