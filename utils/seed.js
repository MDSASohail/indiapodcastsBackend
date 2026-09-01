import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import User from "../models/User.js";
import Category from "../models/Category.js";
import SiteSettings from "../models/SiteSettings.js";
import Founder from "../models/Founder.js";

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // ── Super Admin ──────────────────────────────────────────
    const existingAdmin = await User.findOne({ role: "superadmin" });
    if (!existingAdmin) {
      await User.create({
        name: "Super Admin",
        email: process.env.ADMIN_EMAIL || "admin@indiapodcasts.in",
        password: process.env.ADMIN_PASSWORD || "Admin@123456",
        role: "superadmin",
        isActive: true,
      });
      console.log("✅ Super Admin created");
    } else {
      console.log("ℹ️  Super Admin already exists");
    }

    // ── Categories ───────────────────────────────────────────
    const categories = [
      {
        name: "Health & Lifestyle",
        slug: "health-lifestyle",
        description: "Wellness, fitness & mindful living",
        color: "#10B981",
        icon: "FiHeart",
        order: 1,
      },
      {
        name: "Finance",
        slug: "finance",
        description: "Money, investing & economy",
        color: "#F5C518",
        icon: "FiTrendingUp",
        order: 2,
      },
      {
        name: "Politics",
        slug: "politics",
        description: "Governance, policy & current affairs",
        color: "#EF4444",
        icon: "FiFlag",
        order: 3,
      },
      {
        name: "Art & Entertainment",
        slug: "art-entertainment",
        description: "Culture, cinema & creativity",
        color: "#8B5CF6",
        icon: "FiFilm",
        order: 4,
      },
    ];

    for (const cat of categories) {
      const existing = await Category.findOne({ slug: cat.slug });
      if (!existing) {
        await Category.create(cat);
        console.log(`✅ Category created: ${cat.name}`);
      } else {
        console.log(`ℹ️  Category already exists: ${cat.name}`);
      }
    }

    // ── Site Settings ────────────────────────────────────────
    const existingSettings = await SiteSettings.findOne();
    if (!existingSettings) {
      await SiteSettings.create({
        siteName: "IndiaPodcasts",
        siteDescription:
          "India's National Audio-Video Podcast Channel. Voices that Influence & Inspire.",
        siteUrl: "https://indiapodcasts.in",
        contactEmail: "contact@indiapodcasts.in",
        whatsappNumber: "919999999999",
        address: "New Delhi, India",
        socialLinks: {
          youtube: "https://www.youtube.com/@IndiaPodcasts",
          instagram: "https://www.instagram.com/indiapodcasts",
          twitter: "https://twitter.com/indiapodcasts",
          facebook: "https://www.facebook.com/indiapodcasts",
          linkedin: "https://www.linkedin.com/company/indiapodcasts",
        },
        listenOn: [
          { id: "spotify", label: "Spotify", url: "https://open.spotify.com", color: "#1DB954" },
          { id: "jiosaavn", label: "JioSaavn", url: "https://www.jiosaavn.com", color: "#2BC5B4" },
          { id: "apple", label: "Apple Podcasts", url: "https://podcasts.apple.com", color: "#B150E2" },
          { id: "spreaker", label: "Spreaker", url: "https://www.spreaker.com", color: "#F5A623" },
          { id: "google", label: "Google Podcasts", url: "https://podcasts.google.com", color: "#4285F4" },
          { id: "castbox", label: "Castbox", url: "https://castbox.fm", color: "#F84F39" },
        ],
        heroVideoId: "t0xEXXIbIZ0",
      });
      console.log("✅ Site Settings created");
    } else {
      console.log("ℹ️  Site Settings already exist");
    }

    // ── Founder ──────────────────────────────────────────────
    const existingFounder = await Founder.findOne();
    if (!existingFounder) {
      await Founder.create({
        name: "Anku Goyal",
        title: "Financial Journalist & Founder, IndiaPodcasts",
        bio: "Anku Goyal is a Financial Journalist who founded IndiaPodcasts in 2020 with a single vision — to give every voice a platform. With a background in financial journalism and a passion for authentic storytelling, she has built India's premier independent podcast network from the ground up.",
        email: "contact@indiapodcasts.in",
        milestones: [
          {
            year: "2020",
            title: "Founded IndiaPodcasts",
            description: "Launched IndiaPodcasts as a National Audio-Video Podcast Channel.",
            color: "#F5C518",
          },
          {
            year: "2021",
            title: "First 50 Episodes",
            description: "Crossed the 50-episode milestone with diverse guests.",
            color: "#10B981",
          },
          {
            year: "2022",
            title: "Featured on Moneycontrol & Brut.",
            description: "Featured on two of India's most respected media platforms.",
            color: "#8B5CF6",
          },
          {
            year: "2023",
            title: "Crossed 50,000 Listeners",
            description: "The community grew to over 50,000 active listeners.",
            color: "#EF4444",
          },
          {
            year: "2024",
            title: "Multi-Platform Expansion",
            description: "Expanded to 6 major podcast platforms.",
            color: "#F5C518",
          },
        ],
        pressFeatures: [
          {
            outlet: "Moneycontrol",
            logo: "moneycontrol",
            quote: "IndiaPodcasts is pioneering independent podcast journalism in India.",
            url: "https://www.moneycontrol.com",
            year: "2022",
            bgClass: "bg-white",
            textClass: "text-black",
          },
          {
            outlet: "Brut. India",
            logo: "Brut.",
            quote: "Anku Goyal is giving a platform to voices that rarely get heard in mainstream media.",
            url: "https://www.brut.media/in",
            year: "2022",
            bgClass: "bg-black border border-white/20",
            textClass: "text-white",
          },
        ],
        quickFacts: [
          { label: "Role", value: "Financial Journalist" },
          { label: "Founded", value: "2020" },
          { label: "Episodes", value: "100+" },
          { label: "Listeners", value: "50,000+" },
          { label: "Platforms", value: "6 Platforms" },
        ],
      });
      console.log("✅ Founder created");
    } else {
      console.log("ℹ️  Founder already exists");
    }

    console.log("\n🎉 Database seeded successfully!");
    console.log(`📧 Admin Email: ${process.env.ADMIN_EMAIL || "admin@indiapodcasts.in"}`);
    console.log(`🔑 Admin Password: ${process.env.ADMIN_PASSWORD || "Admin@123456"}`);

    // Get category IDs
    const healthCat = await Category.findOne({ slug: "health-lifestyle" });
    const financeCat = await Category.findOne({ slug: "finance" });
    const politicsCat = await Category.findOne({ slug: "politics" });
    const artCat = await Category.findOne({ slug: "art-entertainment" });
    const adminUser = await User.findOne({ role: "superadmin" });

    // ── Guests ───────────────────────────────────────────────────
    const guestData = [
      {
        name: "Rakesh Sharma",
        designation: "Financial Advisor",
        organization: "WealthWise India",
        photo: { url: "https://randomuser.me/api/portraits/men/32.jpg" },
        bio: "Rakesh Sharma is a SEBI-registered financial advisor with over 15 years of experience helping Indians achieve financial freedom.",
        category: financeCat._id,
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
        featured: true,
        createdBy: adminUser._id,
      },
      {
        name: "Dr. Priya Singh",
        designation: "Psychiatrist",
        organization: "AIIMS Delhi",
        photo: { url: "https://randomuser.me/api/portraits/women/44.jpg" },
        bio: "Dr. Priya Singh is a leading psychiatrist and mental health advocate working to break stigmas around mental health in India.",
        category: healthCat._id,
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
        featured: true,
        createdBy: adminUser._id,
      },
      {
        name: "Arun Mehta",
        designation: "Senior Political Journalist",
        organization: "The National Herald",
        photo: { url: "https://randomuser.me/api/portraits/men/55.jpg" },
        bio: "Arun Mehta has been covering Indian politics for over 20 years and is known for his sharp, unbiased analysis.",
        category: politicsCat._id,
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
        featured: false,
        createdBy: adminUser._id,
      },
      {
        name: "Neha Kapoor",
        designation: "Bollywood Actress",
        organization: "Independent",
        photo: { url: "https://randomuser.me/api/portraits/women/68.jpg" },
        bio: "Neha Kapoor is a Bollywood actress known for her roles in critically acclaimed films.",
        category: artCat._id,
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
        featured: true,
        createdBy: adminUser._id,
      },
      {
        name: "Vikram Nair",
        designation: "Serial Entrepreneur",
        organization: "TechVentures India",
        photo: { url: "https://randomuser.me/api/portraits/men/77.jpg" },
        bio: "Vikram Nair has founded 3 successful startups and is a prominent voice in India's startup ecosystem.",
        category: financeCat._id,
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
        featured: false,
        createdBy: adminUser._id,
      },
      {
        name: "Ritu Sharma",
        designation: "Yoga Instructor & Wellness Coach",
        organization: "Prana Wellness",
        photo: { url: "https://randomuser.me/api/portraits/women/22.jpg" },
        bio: "Ritu Sharma is a certified yoga instructor who has helped thousands of Indians rediscover balance.",
        category: healthCat._id,
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
        featured: false,
        createdBy: adminUser._id,
      },
    ];

    const Guest = (await import("../models/Guest.js")).default;
    const existingGuests = await Guest.countDocuments();
    if (existingGuests === 0) {
      const createdGuests = await Guest.insertMany(guestData);
      console.log(`✅ ${createdGuests.length} Guests created`);
    } else {
      console.log("ℹ️  Guests already exist");
    }

    const guestDocs = await Guest.find();
    const guestMap = {};
    guestDocs.forEach(g => { guestMap[g.name] = g._id; });

    // ── Episodes ─────────────────────────────────────────────────
    const Episode = (await import("../models/Episode.js")).default;
    const existingEpisodes = await Episode.countDocuments();
    if (existingEpisodes === 0) {
      const episodes = [
        {
          title: "Financial Freedom with Rakesh Sharma",
          slug: "financial-freedom-with-rakesh-sharma",
          description: "In this episode, we talk to Rakesh Sharma about achieving financial freedom in your 30s and the importance of early investing.",
          category: financeCat._id,
          guest: guestMap["Rakesh Sharma"],
          thumbnail: { url: "https://picsum.photos/seed/ep1/800/450" },
          youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          duration: "48 min",
          tags: ["finance", "investing", "freedom"],
          featured: true,
          status: "published",
          publishedAt: new Date("2024-03-10"),
          createdBy: adminUser._id,
          youtubeId: "dQw4w9WgXcQ",
          spotifyUrl: "https://open.spotify.com/show/indiapodcasts",
          applePodcastsUrl: "https://podcasts.apple.com/indiapodcasts",
          jioSaavnUrl: "https://www.jiosaavn.com/indiapodcasts",
          spreakerUrl: "https://www.spreaker.com/indiapodcasts",
          googlePodcastsUrl: "https://podcasts.google.com/indiapodcasts",
          castboxUrl: "https://castbox.fm/indiapodcasts",
        },
        {
          title: "Mental Health Awareness with Dr. Priya Singh",
          slug: "mental-health-awareness-dr-priya",
          description: "Dr. Priya Singh discusses the growing mental health crisis in India, breaking stigmas, and practical tips for everyday wellness.",
          category: healthCat._id,
          guest: guestMap["Dr. Priya Singh"],
          thumbnail: { url: "https://picsum.photos/seed/ep2/800/450" },
          youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          duration: "52 min",
          tags: ["health", "mental health", "wellness"],
          featured: true,
          status: "published",
          publishedAt: new Date("2024-03-05"),
          createdBy: adminUser._id,
          youtubeId: "dQw4w9WgXcQ",
          spotifyUrl: "https://open.spotify.com/show/indiapodcasts",
          applePodcastsUrl: "https://podcasts.apple.com/indiapodcasts",
          jioSaavnUrl: "https://www.jiosaavn.com/indiapodcasts",
          spreakerUrl: "https://www.spreaker.com/indiapodcasts",
          googlePodcastsUrl: "https://podcasts.google.com/indiapodcasts",
          castboxUrl: "https://castbox.fm/indiapodcasts",
        },
        {
          title: "India's Political Landscape in 2024",
          slug: "political-landscape-2024",
          description: "Senior journalist Arun Mehta breaks down the current political scenario in India.",
          category: politicsCat._id,
          guest: guestMap["Arun Mehta"],
          thumbnail: { url: "https://picsum.photos/seed/ep3/800/450" },
          youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          duration: "61 min",
          tags: ["politics", "elections", "india"],
          featured: false,
          status: "published",
          publishedAt: new Date("2024-02-28"),
          createdBy: adminUser._id,
          youtubeId: "dQw4w9WgXcQ",
          spotifyUrl: "https://open.spotify.com/show/indiapodcasts",
          applePodcastsUrl: "https://podcasts.apple.com/indiapodcasts",
          jioSaavnUrl: "https://www.jiosaavn.com/indiapodcasts",
          spreakerUrl: "https://www.spreaker.com/indiapodcasts",
          googlePodcastsUrl: "https://podcasts.google.com/indiapodcasts",
          castboxUrl: "https://castbox.fm/indiapodcasts",
        },
        {
          title: "Bollywood: Behind The Scenes with Neha Kapoor",
          slug: "bollywood-behind-the-scenes",
          description: "Actress Neha Kapoor shares her journey from a small town to Bollywood.",
          category: artCat._id,
          guest: guestMap["Neha Kapoor"],
          thumbnail: { url: "https://picsum.photos/seed/ep4/800/450" },
          youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          duration: "45 min",
          tags: ["bollywood", "entertainment", "acting"],
          featured: true,
          status: "published",
          publishedAt: new Date("2024-02-20"),
          createdBy: adminUser._id,
          youtubeId: "dQw4w9WgXcQ",
          spotifyUrl: "https://open.spotify.com/show/indiapodcasts",
          applePodcastsUrl: "https://podcasts.apple.com/indiapodcasts",
          jioSaavnUrl: "https://www.jiosaavn.com/indiapodcasts",
          spreakerUrl: "https://www.spreaker.com/indiapodcasts",
          googlePodcastsUrl: "https://podcasts.google.com/indiapodcasts",
          castboxUrl: "https://castbox.fm/indiapodcasts",
        },
        {
          title: "India's Startup Ecosystem with Vikram Nair",
          slug: "startup-ecosystem-india",
          description: "Vikram Nair talks about building startups in India, funding challenges, and the future of Indian tech.",
          category: financeCat._id,
          guest: guestMap["Vikram Nair"],
          thumbnail: { url: "https://picsum.photos/seed/ep5/800/450" },
          youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          duration: "55 min",
          tags: ["startup", "entrepreneurship", "tech"],
          featured: false,
          status: "published",
          publishedAt: new Date("2024-02-15"),
          createdBy: adminUser._id,
          youtubeId: "dQw4w9WgXcQ",
          spotifyUrl: "https://open.spotify.com/show/indiapodcasts",
          applePodcastsUrl: "https://podcasts.apple.com/indiapodcasts",
          jioSaavnUrl: "https://www.jiosaavn.com/indiapodcasts",
          spreakerUrl: "https://www.spreaker.com/indiapodcasts",
          googlePodcastsUrl: "https://podcasts.google.com/indiapodcasts",
          castboxUrl: "https://castbox.fm/indiapodcasts",
        },
        {
          title: "Yoga & Modern Life with Ritu Sharma",
          slug: "yoga-and-modern-life",
          description: "Yoga instructor Ritu Sharma talks about integrating ancient yoga practices into the chaos of modern urban life.",
          category: healthCat._id,
          guest: guestMap["Ritu Sharma"],
          thumbnail: { url: "https://picsum.photos/seed/ep6/800/450" },

          youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          duration: "42 min",
          tags: ["yoga", "wellness", "lifestyle"],
          featured: false,
          status: "published",
          publishedAt: new Date("2024-02-10"),
          createdBy: adminUser._id,
          youtubeId: "dQw4w9WgXcQ",
          spotifyUrl: "https://open.spotify.com/show/indiapodcasts",
          applePodcastsUrl: "https://podcasts.apple.com/indiapodcasts",
          jioSaavnUrl: "https://www.jiosaavn.com/indiapodcasts",
          spreakerUrl: "https://www.spreaker.com/indiapodcasts",
          googlePodcastsUrl: "https://podcasts.google.com/indiapodcasts",
          castboxUrl: "https://castbox.fm/indiapodcasts",
        },
      ];
      await Episode.insertMany(episodes);
      console.log(`✅ ${episodes.length} Episodes created`);

      // Link episodes back to guests
      const episodeDocs = await Episode.find();
      for (const ep of episodeDocs) {
        const guest = await Guest.findById(ep.guest);
        if (guest) {
          guest.episode = ep._id;
          await guest.save();
        }
      }
      console.log("✅ Guest-Episode links updated");
    } else {
      console.log("ℹ️  Episodes already exist");
    }

    // ── Videos ───────────────────────────────────────────────────
    const Video = (await import("../models/Video.js")).default;
    const existingVideos = await Video.countDocuments();
    if (existingVideos === 0) {
      const videos = [
        {
          title: "Financial Freedom with Rakesh Sharma | IndiaPodcasts",
          slug: "financial-freedom-video",
          description: "Full video episode on achieving financial freedom.",
          category: financeCat._id,
          youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          youtubeId: "dQw4w9WgXcQ",
          thumbnail: { url: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg" },
          views: "12K",
          featured: true,
          status: "published",
          publishedAt: new Date("2024-03-10"),
          createdBy: adminUser._id,
        },
        {
          title: "Mental Health Awareness | Dr. Priya Singh | IndiaPodcasts",
          slug: "mental-health-video",
          description: "Full video episode on mental health in India.",
          category: healthCat._id,
          youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          youtubeId: "dQw4w9WgXcQ",
          thumbnail: { url: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg" },
          views: "8.5K",
          featured: true,
          status: "published",
          publishedAt: new Date("2024-03-05"),
          createdBy: adminUser._id,
        },
        {
          title: "India's Political Landscape 2024 | IndiaPodcasts",
          slug: "political-landscape-video",
          description: "Full video episode on Indian politics.",
          category: politicsCat._id,
          youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          youtubeId: "dQw4w9WgXcQ",
          thumbnail: { url: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg" },
          views: "15K",
          featured: false,
          status: "published",
          publishedAt: new Date("2024-02-28"),
          createdBy: adminUser._id,
        },
        {
          title: "Bollywood Behind The Scenes | Neha Kapoor | IndiaPodcasts",
          slug: "bollywood-video",
          description: "Full video episode with Bollywood actress Neha Kapoor.",
          category: artCat._id,
          youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          youtubeId: "dQw4w9WgXcQ",
          thumbnail: { url: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg" },
          views: "20K",
          featured: true,
          status: "published",
          publishedAt: new Date("2024-02-20"),
          createdBy: adminUser._id,
        },
      ];
      await Video.insertMany(videos);
      console.log(`✅ ${videos.length} Videos created`);
    } else {
      console.log("ℹ️  Videos already exist");
    }

    // ── Shorts ───────────────────────────────────────────────────
    const Short = (await import("../models/Short.js")).default;
    const existingShorts = await Short.countDocuments();
    if (existingShorts === 0) {
      const shorts = [
        {
          title: "5 Finance Tips Every Indian Must Know",
          platform: "youtube",
          url: "https://www.youtube.com/shorts/dQw4w9WgXcQ",
          embedId: "dQw4w9WgXcQ",
          thumbnail: { url: "https://picsum.photos/seed/short1/400/700" },
          category: financeCat._id,
          views: "12K",
          status: "published",
          order: 1,
        },
        {
          title: "Morning Routine for a Healthy Life",
          platform: "instagram",
          url: "https://www.instagram.com/reel/dummy2",
          embedId: "",
          thumbnail: { url: "https://picsum.photos/seed/short2/400/700" },
          category: healthCat._id,
          views: "8.5K",
          status: "published",
          order: 2,
        },
        {
          title: "What is Budget 2024? Explained in 60 Seconds",
          platform: "youtube",
          url: "https://www.youtube.com/shorts/dQw4w9WgXcQ",
          embedId: "dQw4w9WgXcQ",
          thumbnail: { url: "https://picsum.photos/seed/short3/400/700" },
          category: financeCat._id,
          views: "22K",
          status: "published",
          order: 3,
        },
        {
          title: "Bollywood's Best Kept Secret",
          platform: "facebook",
          url: "https://www.facebook.com/reel/dummy4",
          embedId: "",
          thumbnail: { url: "https://picsum.photos/seed/short4/400/700" },
          category: artCat._id,
          views: "15K",
          status: "published",
          order: 4,
        },
        {
          title: "India's Political Scene in 30 Seconds",
          platform: "twitter",
          url: "https://twitter.com/indiapodcasts/status/dummy5",
          embedId: "",
          thumbnail: { url: "https://picsum.photos/seed/short5/400/700" },
          category: politicsCat._id,
          views: "9K",
          status: "published",
          order: 5,
        },
      ];
      await Short.insertMany(shorts);
      console.log(`✅ ${shorts.length} Shorts created`);
    } else {
      console.log("ℹ️  Shorts already exist");
    }

    // ── Blogs ────────────────────────────────────────────────────
    const Blog = (await import("../models/Blog.js")).default;
    const existingBlogs = await Blog.countDocuments();
    if (existingBlogs === 0) {
      const blogs = [
        {
          title: "Why Every Indian Should Start Investing Early",
          slug: "why-every-indian-should-invest-early",
          excerpt: "Starting your investment journey early is one of the most powerful financial decisions you can make.",
          content: [
            { type: "paragraph", text: "Investing early is the single most powerful financial habit you can build. When you start investing in your 20s, you give your money decades to grow through compound interest." },
            { type: "heading", text: "Why Start Early?", level: 2 },
            { type: "paragraph", text: "Even small amounts — ₹500 or ₹1000 a month — can grow into significant wealth over 30 years. The key is consistency and patience." },
            { type: "list", style: "bullet", items: ["Start a SIP in a mutual fund", "Build an emergency fund", "Gradually diversify into stocks", "Stay consistent for the long term"] },
            { type: "quote", text: "Compound interest is the eighth wonder of the world.", author: "Albert Einstein" },
            { type: "paragraph", text: "Start with a SIP in a mutual fund, build an emergency fund, and gradually diversify into stocks, real estate, and other assets." },
          ],
          category: financeCat._id,
          author: adminUser._id,
          thumbnail: { url: "https://picsum.photos/seed/blog1/800/450" },
          tags: ["finance", "investing", "money"],
          readTime: "5 min read",
          featured: true,
          status: "published",
          publishedAt: new Date("2024-03-12"),
        },
        {
          title: "Breaking the Mental Health Stigma in India",
          slug: "mental-health-stigma-india",
          excerpt: "Mental health remains a taboo topic in many Indian households. It's time we change the conversation.",
          content: [
            { type: "paragraph", text: "India is facing a silent mental health crisis. With over 200 million people affected by mental health conditions, the stigma around seeking help remains a major barrier." },
            { type: "heading", text: "The Stigma Problem", level: 2 },
            { type: "paragraph", text: "Cultural attitudes, lack of awareness, and limited access to professional help make this a complex challenge. But change is happening." },
            { type: "paragraph", text: "More young Indians are speaking up, seeking therapy, and advocating for mental health awareness. This is a conversation we must keep having." },
          ],
          category: healthCat._id,
          author: adminUser._id,
          thumbnail: { url: "https://picsum.photos/seed/blog2/800/450" },
          tags: ["health", "mental health", "awareness"],
          readTime: "4 min read",
          featured: true,
          status: "published",
          publishedAt: new Date("2024-03-08"),
        },
        {
          title: "How Indian Cinema is Conquering the Global Stage",
          slug: "indian-cinema-global-stage",
          excerpt: "From RRR to The Elephant Whisperers, Indian content is finding a massive global audience.",
          content: [
            { type: "paragraph", text: "Indian cinema has always been a powerhouse domestically, but recent years have seen a remarkable shift — Indian stories are resonating globally." },
            { type: "heading", text: "The Streaming Revolution", level: 2 },
            { type: "paragraph", text: "Streaming platforms have played a huge role in this, giving Indian filmmakers direct access to international audiences." },
            { type: "paragraph", text: "This is creating new opportunities for writers, directors, and actors who can now think beyond the domestic box office." },
          ],
          category: artCat._id,
          author: adminUser._id,
          thumbnail: { url: "https://picsum.photos/seed/blog3/800/450" },
          tags: ["cinema", "entertainment", "india"],
          readTime: "6 min read",
          featured: false,
          status: "published",
          publishedAt: new Date("2024-03-01"),
        },
        {
          title: "India Elections 2024: What Every Citizen Should Know",
          slug: "india-elections-what-to-expect",
          excerpt: "The 2024 general elections are a defining moment for India. Here's everything you need to understand.",
          content: [
            { type: "paragraph", text: "The 2024 Indian general elections will be one of the largest democratic exercises in human history. With over 900 million eligible voters, the stakes could not be higher." },
            { type: "heading", text: "Key Issues", level: 2 },
            { type: "list", style: "bullet", items: ["Economic growth and unemployment", "Inflation and cost of living", "National security", "Social justice and equality"] },
            { type: "paragraph", text: "As citizens, it is our responsibility to be informed, to question, and to participate actively in the democratic process." },
          ],
          category: politicsCat._id,
          author: adminUser._id,
          thumbnail: { url: "https://picsum.photos/seed/blog4/800/450" },
          tags: ["politics", "elections", "democracy"],
          readTime: "7 min read",
          featured: true,
          status: "published",
          publishedAt: new Date("2024-02-25"),
        },
      ];
      await Blog.insertMany(blogs);
      console.log(`✅ ${blogs.length} Blogs created`);
    } else {
      console.log("ℹ️  Blogs already exist");
    }

    // ── Team Members ─────────────────────────────────────────────
    const TeamMember = (await import("../models/TeamMember.js")).default;
    const existingTeam = await TeamMember.countDocuments();
    if (existingTeam === 0) {
      const teamMembers = [
        { name: "Chetna Chauhan", role: "Content Producer", photo: { url: "https://randomuser.me/api/portraits/women/31.jpg" }, bio: "Chetna handles content production and ensures every episode is polished.", order: 1, isActive: true, createdBy: adminUser._id },
        { name: "Manish Kushalka", role: "Video Editor", photo: { url: "https://randomuser.me/api/portraits/men/41.jpg" }, bio: "Manish brings the visual storytelling of IndiaPodcasts to life.", order: 2, isActive: true, createdBy: adminUser._id },
        { name: "Shreya Tiwari", role: "Social Media Manager", photo: { url: "https://randomuser.me/api/portraits/women/53.jpg" }, bio: "Shreya manages IndiaPodcasts' presence across all social media platforms.", order: 3, isActive: true, createdBy: adminUser._id },
        { name: "Karan Kapoor", role: "Audio Engineer", photo: { url: "https://randomuser.me/api/portraits/men/62.jpg" }, bio: "Karan ensures every episode sounds crystal clear.", order: 4, isActive: true, createdBy: adminUser._id },
        { name: "Shamik Mukhrji", role: "Research Analyst", photo: { url: "https://randomuser.me/api/portraits/men/71.jpg" }, bio: "Shamik dives deep into research to bring credibility to every episode.", order: 5, isActive: true, createdBy: adminUser._id },
        { name: "Rajesh Sonar", role: "Operations Manager", photo: { url: "https://randomuser.me/api/portraits/men/83.jpg" }, bio: "Rajesh keeps the IndiaPodcasts machine running smoothly.", order: 6, isActive: true, createdBy: adminUser._id },
        { name: "Ashish Tripathi", role: "Web Developer", photo: { url: "https://randomuser.me/api/portraits/men/91.jpg" }, bio: "Ashish manages the technical infrastructure.", order: 7, isActive: true, createdBy: adminUser._id },
      ];
      await TeamMember.insertMany(teamMembers);
      console.log(`✅ ${teamMembers.length} Team Members created`);
    } else {
      console.log("ℹ️  Team Members already exist");
    }
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

seed();