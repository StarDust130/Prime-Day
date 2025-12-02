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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Onboarding = models.Onboarding || model("Onboarding", OnboardingSchema);

export default Onboarding;
