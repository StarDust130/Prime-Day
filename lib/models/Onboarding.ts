import mongoose, { Schema, models, model } from "mongoose";

const OnboardingSchema = new Schema({
  // --- NEW: Link to the User Model ---
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // -----------------------------------
  focus: {
    type: [String],
    required: true,
  },
  sleep: {
    type: String,
    required: true,
  },
  obstacles: {
    type: [String],
    required: true,
  },
  longTermVision: {
    type: String,
    required: false,
  },
  dailyRoutine: {
    type: String,
    required: false,
  },
  specificStruggles: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Onboarding = models.Onboarding || model("Onboarding", OnboardingSchema);

export default Onboarding;
