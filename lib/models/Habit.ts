import mongoose, { Schema, models, model } from "mongoose";

const HabitSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: "⚡",
  },
  color: {
    type: String,
    default: "bg-[#38BDF8]", // Default to blue if not specified
  },
  // Store dates as simple strings "YYYY-MM-DD" to avoid timezone headaches
  // or as Date objects. Date objects are usually better for queries.
  completedDates: {
    type: [Date],
    default: [],
  },
  streak: {
    type: Number,
    default: 0,
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Habit = models.Habit || model("Habit", HabitSchema);

export default Habit;
