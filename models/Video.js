import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
      default: "",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    order: { type: Number, default: 0 },
    youtubeUrl: {
      type: String,
      required: [true, "YouTube URL is required"],
    },
    guest: { type: mongoose.Schema.Types.ObjectId, ref: 'Guest', default: null },
    podcaster: { type: mongoose.Schema.Types.ObjectId, ref: 'TeamMember', default: null },
    youtubeId: {
      type: String,
      required: [true, "YouTube ID is required"],
    },
    thumbnail: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    views: {
      type: String,
      default: "0",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    publishedAt: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

videoSchema.index({ title: "text", description: "text" });

const Video = mongoose.model("Video", videoSchema);
export default Video;