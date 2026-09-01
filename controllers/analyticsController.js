import Episode from "../models/Episode.js";
import Video from "../models/Video.js";
import Blog from "../models/Blog.js";
import Short from "../models/Short.js";
import Guest from "../models/Guest.js";
import Subscriber from "../models/Subscriber.js";
import ContactMessage from "../models/ContactMessage.js";
import GuestPitch from "../models/GuestPitch.js";
import Comment from "../models/Comment.js";
import { successResponse } from "../utils/apiResponse.js";

export const getAnalytics = async (req, res, next) => {
  try {
    const [
      totalEpisodes,
      publishedEpisodes,
      totalVideos,
      publishedVideos,
      totalBlogs,
      publishedBlogs,
      totalShorts,
      totalGuests,
      totalSubscribers,
      activeSubscribers,
      totalMessages,
      unreadMessages,
      totalPitches,
      pendingPitches,
      totalComments,
      pendingComments,
      recentEpisodes,
      recentBlogs,
    ] = await Promise.all([
      Episode.countDocuments(),
      Episode.countDocuments({ status: "published" }),
      Video.countDocuments(),
      Video.countDocuments({ status: "published" }),
      Blog.countDocuments(),
      Blog.countDocuments({ status: "published" }),
      Short.countDocuments({ status: "published" }),
      Guest.countDocuments({ isActive: true }),
      Subscriber.countDocuments(),
      Subscriber.countDocuments({ status: "active" }),
      ContactMessage.countDocuments(),
      ContactMessage.countDocuments({ status: "unread" }),
      GuestPitch.countDocuments(),
      GuestPitch.countDocuments({ status: "pending" }),
      Comment.countDocuments(),
      Comment.countDocuments({ status: "pending" }),
      Episode.find({ status: "published" })
        .sort({ publishedAt: -1 })
        .limit(5)
        .select("title slug thumbnail publishedAt views"),
      Blog.find({ status: "published" })
        .sort({ publishedAt: -1 })
        .limit(5)
        .select("title slug thumbnail publishedAt views"),
    ]);

    return successResponse(
      res,
      {
        content: {
          episodes: { total: totalEpisodes, published: publishedEpisodes, draft: totalEpisodes - publishedEpisodes },
          videos: { total: totalVideos, published: publishedVideos, draft: totalVideos - publishedVideos },
          blogs: { total: totalBlogs, published: publishedBlogs, draft: totalBlogs - publishedBlogs },
          shorts: { total: totalShorts },
          guests: { total: totalGuests },
        },
        engagement: {
          subscribers: { total: totalSubscribers, active: activeSubscribers },
          messages: { total: totalMessages, unread: unreadMessages },
          pitches: { total: totalPitches, pending: pendingPitches },
          comments: { total: totalComments, pending: pendingComments },
        },
        recent: {
          episodes: recentEpisodes,
          blogs: recentBlogs,
        },
      },
      "Analytics fetched successfully"
    );
  } catch (error) {
    next(error);
  }
};