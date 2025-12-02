import mongoose, { Schema, Document, models } from "mongoose";

export interface IHabitTrack extends Document {
  userId: string;
  habitId: string;
  date: Date;
  value?: number; // times completed etc
}

const HabitTrackSchema = new Schema<IHabitTrack>(
  {
    userId: { type: String, required: true, index: true },
    habitId: { type: String, required: true, index: true },
    date: { type: Date, required: true },
    value: { type: Number, default: 1 },
  },
  { timestamps: true }
);

HabitTrackSchema.index({ userId: 1, habitId: 1, date: 1 }, { unique: true });

export const HabitTrack =
  models.HabitTrack || mongoose.model<IHabitTrack>("HabitTrack", HabitTrackSchema);
