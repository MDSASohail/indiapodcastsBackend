import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Short from "../models/Short.js";
import Category from "../models/Category.js";

const seedShorts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Get categories
    const financeCat = await Category.findOne({ slug: "finance" });
    const healthCat = await Category.findOne({ slug: "health-lifestyle" });
    const politicsCat = await Category.findOne({ slug: "politics" });
    const artCat = await Category.findOne({ slug: "art-entertainment" });

    if (!financeCat) {
      console.log("❌ Categories not found. Run main seed first.");
      process.exit(1);
    }

    // Clear existing shorts
    await Short.deleteMany({});
    console.log("🗑️  Cleared existing shorts");

    const shorts = [
      {
        title: "5 Finance Tips Every Indian Must Know 💰",
        platform: "youtube",
        url: "https://www.youtube.com/shorts/dQw4w9WgXcQ",
        embedId: "dQw4w9WgXcQ",
        thumbnail: {
          url: "https://picsum.photos/seed/short1/400/700",
          publicId: "",
        },
        category: financeCat._id,
        views: "12K",
        status: "published",
        order: 1,
      },
      {
        title: "Morning Routine for a Healthy Life 🌅",
        platform: "instagram",
        url: "https://www.instagram.com/reel/dummy2",
        embedId: "",
        thumbnail: {
          url: "https://picsum.photos/seed/short2/400/700",
          publicId: "",
        },
        category: healthCat._id,
        views: "8.5K",
        status: "published",
        order: 2,
      },
      {
        title: "What is Budget 2024? Explained in 60 Seconds 📊",
        platform: "youtube",
        url: "https://www.youtube.com/shorts/dQw4w9WgXcQ",
        embedId: "dQw4w9WgXcQ",
        thumbnail: {
          url: "https://picsum.photos/seed/short3/400/700",
          publicId: "",
        },
        category: financeCat._id,
        views: "22K",
        status: "published",
        order: 3,
      },
      {
        title: "Bollywood's Best Kept Secret 🎬",
        platform: "facebook",
        url: "https://www.facebook.com/reel/dummy4",
        embedId: "",
        thumbnail: {
          url: "https://picsum.photos/seed/short4/400/700",
          publicId: "",
        },
        category: artCat._id,
        views: "15K",
        status: "published",
        order: 4,
      },
      {
        title: "India's Political Scene in 30 Seconds 🗳️",
        platform: "twitter",
        url: "https://twitter.com/indiapodcasts/status/dummy5",
        embedId: "",
        thumbnail: {
          url: "https://picsum.photos/seed/short5/400/700",
          publicId: "",
        },
        category: politicsCat._id,
        views: "9K",
        status: "published",
        order: 5,
      },
      {
        title: "Yoga Poses for Office Workers 🧘",
        platform: "youtube",
        url: "https://www.youtube.com/shorts/dQw4w9WgXcQ",
        embedId: "dQw4w9WgXcQ",
        thumbnail: {
          url: "https://picsum.photos/seed/short6/400/700",
          publicId: "",
        },
        category: healthCat._id,
        views: "18K",
        status: "published",
        order: 6,
      },
      {
        title: "How to Invest Your First ₹1000 💸",
        platform: "instagram",
        url: "https://www.instagram.com/reel/dummy7",
        embedId: "",
        thumbnail: {
          url: "https://picsum.photos/seed/short7/400/700",
          publicId: "",
        },
        category: financeCat._id,
        views: "31K",
        status: "published",
        order: 7,
      },
      {
        title: "Art That Changed India Forever 🎨",
        platform: "youtube",
        url: "https://www.youtube.com/shorts/dQw4w9WgXcQ",
        embedId: "dQw4w9WgXcQ",
        thumbnail: {
          url: "https://picsum.photos/seed/short8/400/700",
          publicId: "",
        },
        category: artCat._id,
        views: "7K",
        status: "published",
        order: 8,
      },
      {
        title: "3 Signs You Need a Mental Health Break 🧠",
        platform: "instagram",
        url: "https://www.instagram.com/reel/dummy9",
        embedId: "",
        thumbnail: {
          url: "https://picsum.photos/seed/short9/400/700",
          publicId: "",
        },
        category: healthCat._id,
        views: "24K",
        status: "published",
        order: 9,
      },
      {
        title: "Why India's Economy is Growing So Fast 📈",
        platform: "facebook",
        url: "https://www.facebook.com/reel/dummy10",
        embedId: "",
        thumbnail: {
          url: "https://picsum.photos/seed/short10/400/700",
          publicId: "",
        },
        category: financeCat._id,
        views: "19K",
        status: "published",
        order: 10,
      },
    ];

    const created = await Short.insertMany(shorts);
    console.log(`✅ ${created.length} Shorts created successfully!`);

    // Show what was created
    created.forEach((s) => {
      console.log(`  📱 [${s.platform.toUpperCase()}] ${s.title}`);
    });

    console.log("\n🎉 Shorts seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

seedShorts();