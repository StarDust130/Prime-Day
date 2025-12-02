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
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

// Force recompilation if schema changed (simple check: if followers path missing)
if (models.User && !models.User.schema.paths.followers) {
  delete models.User;
}

const User = models.User || model("User", UserSchema);

export default User;
