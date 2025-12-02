import mongoose, { Schema, Document, models } from "mongoose";

export interface IHabit extends Document {
  userId: string;
  name: string;
  description?: string;
  frequency: "daily" | "weekly" | "custom";
  targetPerDay?: number;
  isActive: boolean;
}

const HabitSchema = new Schema<IHabit>(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    description: String,
    frequency: {
      type: String,
      enum: ["daily", "weekly", "custom"],
      default: "daily",
    },
    targetPerDay: Number,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Habit = models.Habit || mongoose.model<IHabit>("Habit", HabitSchema);
