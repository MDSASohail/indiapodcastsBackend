import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema(
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
    subject: {
      type: String,
      required: [true, "Subject is required"],
      enum: [
        "general",
        "collaboration",
        "advertising",
        "feedback",
        "other",
      ],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      maxlength: [2000, "Message cannot exceed 2000 characters"],
    },
    status: {
      type: String,
      enum: ["unread", "read", "replied"],
      default: "unread",
    },
    ipAddress: {
      type: String,
      default: "",
    },
    repliedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema);
export default ContactMessage;