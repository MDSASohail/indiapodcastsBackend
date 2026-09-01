import mongoose from "mongoose";

const siteSettingsSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      default: "IndiaPodcasts",
    },
    siteDescription: {
      type: String,
      default:
        "India's National Audio-Video Podcast Channel. Voices that Influence & Inspire.",
    },
    siteUrl: {
      type: String,
      default: "https://indiapodcasts.in",
    },
    contactEmail: {
      type: String,
      default: "contact@indiapodcasts.in",
    },
    whatsappNumber: {
      type: String,
      default: "919999999999",
    },
    address: {
      type: String,
      default: "New Delhi, India",
    },
    socialLinks: {
      youtube: { type: String, default: "" },
      instagram: { type: String, default: "" },
      twitter: { type: String, default: "" },
      facebook: { type: String, default: "" },
      linkedin: { type: String, default: "" },
    },
    listenOn: [
      {
        id: { type: String },
        label: { type: String },
        url: { type: String },
        color: { type: String },
      },
    ],
    heroVideoId: {
      type: String,
      default: "t0xEXXIbIZ0",
    },
    metaKeywords: {
      type: String,
      default:
        "India Podcasts, IndiaPodcasts, Anku Goyal, Indian podcast",
    },
    googleAnalyticsId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const SiteSettings = mongoose.model("SiteSettings", siteSettingsSchema);
export default SiteSettings;