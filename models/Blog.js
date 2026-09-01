import mongoose from "mongoose";

// Individual content block schema
const contentBlockSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        "paragraph",
        "heading",
        "image",
        "video",
        "quote",
        "list",
        "divider",
        "code",
      ],
    },
    // paragraph
    text: { type: String, default: "" },
    // heading
    level: { type: Number, default: 2 },
    // image
    url: { type: String, default: "" },
    publicId: { type: String, default: "" },
    caption: { type: String, default: "" },
    alt: { type: String, default: "" },
    // video
    videoUrl: { type: String, default: "" },
    // quote
    author: { type: String, default: "" },
    // list
    style: {
      type: String,
      enum: ["bullet", "numbered"],
      default: "bullet",
    },
    items: [{ type: String }],
    // code
    language: { type: String, default: "javascript" },
    code: { type: String, default: "" },
  },
  { _id: true }
);

const blogSchema = new mongoose.Schema(
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
    excerpt: {
      type: String,
      required: [true, "Excerpt is required"],
      maxlength: [500, "Excerpt cannot exceed 500 characters"],
    },
    content: [contentBlockSchema],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    thumbnail: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    readTime: {
      type: String,
      default: "5 min read",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["draft", "published", "scheduled"],
      default: "draft",
    },
    publishedAt: {
      type: Date,
    },
    scheduledAt: {
      type: Date,
    },
    views: {
      type: Number,
      default: 0,
    },
    commentsEnabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

blogSchema.index({ title: "text", excerpt: "text", tags: "text" });

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;