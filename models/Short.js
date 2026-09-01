import mongoose from "mongoose";

const shortSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    platform: {
      type: String,
      required: [true, "Platform is required"],
      enum: ["youtube", "instagram", "facebook", "twitter"],
    },
    guest: { type: mongoose.Schema.Types.ObjectId, ref: 'Guest', default: null },
    podcaster: { type: mongoose.Schema.Types.ObjectId, ref: 'TeamMember', default: null },
    url: {
      type: String,
      required: [true, "URL is required"],
    },
    embedId: {
      type: String,
      default: "",
    },
    thumbnail: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    views: {
      type: String,
      default: "0",
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    order: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Short = mongoose.model("Short", shortSchema);
export default Short;