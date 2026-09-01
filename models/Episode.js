import mongoose from "mongoose";

const episodeSchema = new mongoose.Schema(
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
      required: [true, "Description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    order: { type: Number, default: 0 },
    podcaster: { type: mongoose.Schema.Types.ObjectId, ref: 'TeamMember', default: null },
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guest",
      default: null,
    },
    thumbnail: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    youtubeUrl: { type: String, default: "" },
    youtubeId: { type: String, default: "" },
    spotifyUrl: { type: String, default: "" },
    applePodcastsUrl: { type: String, default: "" },
    jioSaavnUrl: { type: String, default: "" },
    spreakerUrl: { type: String, default: "" },
    googlePodcastsUrl: { type: String, default: "" },
    castboxUrl: { type: String, default: "" },
    duration: {
      type: String,
      default: "",
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
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
    views: {
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

// Index for search
episodeSchema.index({ title: "text", description: "text", tags: "text" });

const Episode = mongoose.model("Episode", episodeSchema);
export default Episode;