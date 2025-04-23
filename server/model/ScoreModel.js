// models/Score.js
import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  game: {
    type: String,
    enum: ["fruits", "roman-number", "word-spelling"],
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

scoreSchema.index({ userId: 1, game: 1 }, { unique: true }); // 1 user -> 1 score per game

export default mongoose.model("Score", scoreSchema);
