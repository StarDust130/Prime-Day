import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    trim: true,
    unique: true, // <--- CRITICAL FIX: Ensures unique usernames
  },
  birthday: {
    type: Date,
    required: [true, "Please provide a birthday"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = models.User || model("User", UserSchema);

export default User;
