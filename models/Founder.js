import mongoose from "mongoose";

const milestoneSchema = new mongoose.Schema(
  {
    year: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    color: {
      type: String,
      default: "#F5C518",
    },
  },
  { _id: true }
);

const pressFeatureSchema = new mongoose.Schema(
  {
    outlet: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      default: "",
    },
    quote: {
      type: String,
      default: "",
    },
    url: {
      type: String,
      default: "",
    },
    year: {
      type: String,
      default: "",
    },
    bgClass: {
      type: String,
      default: "bg-white",
    },
    textClass: {
      type: String,
      default: "text-black",
    },
  },
  { _id: true }
);

const founderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      default: "Anku Goyal",
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      default: "Financial Journalist & Founder, IndiaPodcasts",
    },
    bio: {
      type: String,
      required: [true, "Bio is required"],
      maxlength: [3000, "Bio cannot exceed 3000 characters"],
    },
    photo: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    email: {
      type: String,
      default: "contact@indiapodcasts.in",
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
    youtube: {
      type: String,
      default: "",
    },
    milestones: [milestoneSchema],
    pressFeatures: [pressFeatureSchema],
    quickFacts: [
      {
        label: { type: String },
        value: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const Founder = mongoose.model("Founder", founderSchema);
export default Founder;