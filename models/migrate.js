// migrate.js - ONE TIME USE to move friends to MongoDB
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Simple schema for migration
export const FriendSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    default:
      () => Math.random().toString(36).substring(2, 7)  },
  name: String,
  message: String,
  viewed: Boolean,
  viewCount: Number,
  firstViewed: Date,
  lastViewed: Date,
  from: String,
  createdAt: { type: Date, default: Date.now },
});

export const Friend = mongoose.model("Friend", FriendSchema, "friends");

