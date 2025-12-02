import mongoose, { Schema, models, model } from "mongoose";

const FriendRequestSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent duplicate pending requests
FriendRequestSchema.index({ sender: 1, receiver: 1 }, { unique: true });

const FriendRequest =
  models.FriendRequest || model("FriendRequest", FriendRequestSchema);

export default FriendRequest;
