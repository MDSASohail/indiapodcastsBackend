import mongoose from "mongoose";

const guestPitchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    phone: {
      type: String,
      default: "",
    },
    designation: {
      type: String,
      required: [true, "Designation is required"],
      trim: true,
      maxlength: [100, "Designation cannot exceed 100 characters"],
    },
    organization: {
      type: String,
      default: "",
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    topic: {
      type: String,
      required: [true, "Topic is required"],
      maxlength: [200, "Topic cannot exceed 200 characters"],
    },
    bio: {
      type: String,
      required: [true, "Bio is required"],
      maxlength: [2000, "Bio cannot exceed 2000 characters"],
    },
    socialLinks: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "approved", "rejected"],
      default: "pending",
    },
    notes: {
      type: String,
      default: "",
    },
    ipAddress: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const GuestPitch = mongoose.model("GuestPitch", guestPitchSchema);
export default GuestPitch;