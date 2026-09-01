// import Episode from "../models/Episode.js";
// import Video from "../models/Video.js";
// import Blog from "../models/Blog.js";
// import Short from "../models/Short.js";
// import Guest from "../models/Guest.js";
// import { successResponse, errorResponse } from "../utils/apiResponse.js";

// export const search = async (req, res, next) => {
//   try {
//     const { q, limit = 5 } = req.query;
//     if (!q || q.trim().length < 2) {
//       return errorResponse(res, "Search query must be at least 2 characters", 400);
//     }

//     const regex = new RegExp(q.trim(), "i");
//     const lim = parseInt(limit);

//     const [episodes, videos, blogs, shorts, guests] = await Promise.all([
//       Episode.find({
//         status: "published",
//         $or: [
//           { title: regex },
//           { description: regex },
//           { tags: regex },
//         ],
//       })
//         .populate("category", "name slug color")
//         .populate("guest", "name designation")
//         .limit(lim)
//         .select("title slug description thumbnail duration date category guest"),

//       Video.find({
//         status: "published",
//         $or: [{ title: regex }, { description: regex }],
//       })
//         .populate("category", "name slug color")
//         .limit(lim)
//         .select("title slug description thumbnail youtubeId views date category"),

//       Blog.find({
//         status: "published",
//         $or: [{ title: regex }, { excerpt: regex }, { tags: regex }],
//       })
//         .populate("category", "name slug color")
//         .limit(lim)
//         .select("title slug excerpt thumbnail readTime date category"),

//       Short.find({
//         status: "published",
//         $or: [{ title: regex }],
//       })
//         .populate("category", "name slug color")
//         .limit(lim)
//         .select("title platform url thumbnail category"),

//       Guest.find({
//         isActive: true,
//         $or: [
//           { name: regex },
//           { designation: regex },
//           { organization: regex },
//         ],
//       })
//         .populate("category", "name slug color")
//         .limit(lim)
//         .select("name designation organization photo category"),
//     ]);

//     const total =
//       episodes.length +
//       videos.length +
//       blogs.length +
//       shorts.length +
//       guests.length;

//     return successResponse(
//       res,
//       { episodes, videos, blogs, shorts, guests, total },
//       `Found ${total} results for "${q}"`
//     );
//   } catch (error) {
//     next(error);
//   }
// };


import Episode from "../models/Episode.js";
import Video from "../models/Video.js";
import Blog from "../models/Blog.js";
import Short from "../models/Short.js";
import Guest from "../models/Guest.js";
import TeamMember from "../models/TeamMember.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

export const search = async (req, res, next) => {
  try {
    const { q, limit = 5 } = req.query;

    if (!q || q.trim().length < 2) {
      return errorResponse(res, "Search query must be at least 2 characters", 400);
    }

    const regex = new RegExp(q.trim(), "i");
    const lim = parseInt(limit);

    const [
      episodes,
      videos,
      blogs,
      shorts,
      guests,
      team,
    ] = await Promise.all([

      // Episodes
      Episode.find({
        status: "published",
        $or: [
          { title: regex },
          { description: regex },
          { tags: regex },
        ],
      })
        .populate("category", "name slug color")
        .populate("guest", "name designation photo")
        .limit(lim)
        .select("title slug description thumbnail duration publishedAt category guest tags"),

      // Videos
      Video.find({
        status: "published",
        $or: [
          { title: regex },
          { description: regex },
        ],
      })
        .populate("category", "name slug color")
        .limit(lim)
        .select("title slug description thumbnail youtubeId views publishedAt category"),

      // Blogs
      Blog.find({
        status: "published",
        $or: [
          { title: regex },
          { excerpt: regex },
          { tags: regex },
        ],
      })
        .populate("category", "name slug color")
        .populate("author", "name avatar")
        .limit(lim)
        .select("title slug excerpt thumbnail readTime publishedAt category author tags"),

      // Shorts
      Short.find({
        status: "published",
        $or: [
          { title: regex },
        ],
      })
        .populate("category", "name slug color")
        .limit(lim)
        .select("title platform url embedId thumbnail views category"),

      // Guests
      Guest.find({
        isActive: true,
        $or: [
          { name: regex },
          { designation: regex },
          { organization: regex },
          { bio: regex },
        ],
      })
        .populate("category", "name slug color")
        .populate("episode", "title slug")
        .limit(lim)
        .select("name designation organization photo bio category episode linkedin twitter"),

      // Team Members
      TeamMember.find({
        isActive: true,
        $or: [
          { name: regex },
          { role: regex },
          { bio: regex },
        ],
      })
        .limit(lim)
        .select("name role photo bio linkedin twitter instagram"),
    ]);

    const total =
      episodes.length +
      videos.length +
      blogs.length +
      shorts.length +
      guests.length +
      team.length;

    return successResponse(
      res,
      {
        episodes,
        videos,
        blogs,
        shorts,
        guests,
        team,
        total,
      },
      `Found ${total} results for "${q.trim()}"`
    );
  } catch (error) {
    next(error);
  }
};