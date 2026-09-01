import mongoose from "mongoose";

const guestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    designation: {
      type: String,
      required: [true, "Designation is required"],
      trim: true,
      maxlength: [100, "Designation cannot exceed 100 characters"],
    },
    organization: {
      type: String,
      trim: true,
      maxlength: [100, "Organization cannot exceed 100 characters"],
      default: "",
    },
    photo: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    bio: {
      type: String,
      maxlength: [1000, "Bio cannot exceed 1000 characters"],
      default: "",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    episode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Episode",
      default: null,
    },
    linkedin: {
      type: String,
      default: "",
    },
    twitter: {
      type: String,
      default: "",
    },
    instagram: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

guestSchema.index({ name: "text", designation: "text", organization: "text" });

const Guest = mongoose.model("Guest", guestSchema);
export default Guest;