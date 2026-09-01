import Episode from "../models/Episode.js";
import slugify from "../utils/slugify.js";
import { successResponse, errorResponse, paginatedResponse } from "../utils/apiResponse.js";
import paginate, { getPaginationData } from "../utils/paginate.js";

// @desc    Get all episodes
// @route   GET /api/episodes
// @access  Public
export const getEpisodes = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 9,
      category,
      featured,
      status = "published",
      sort = "newest",
      search,
    } = req.query;

    const { skip, limit: lim } = paginate(req.query, page, limit);

    const query = {};

    // Public only sees published
    if (!req.user) query.status = "published";
    else if (status) query.status = status;

    if (category) query.category = category;
    if (featured === "true") query.featured = true;
    if (search) query.$text = { $search: search };

    // In getEpisodes, change the sortObj to respect order field for admin:
    const sortObj = req.user
      ? { order: 1 }           // admin sees order-sorted list
      : sort === 'oldest'
        ? { publishedAt: 1 }
        : sort === 'popular'
          ? { views: -1 }
          : { publishedAt: -1 }  // public sees date-sorted

    // const sortObj =
    //   sort === "oldest"
    //     ? { publishedAt: 1 }
    //     : sort === "popular"
    //       ? { views: -1 }
    //       : { publishedAt: -1 };

    const [episodes, total] = await Promise.all([
      Episode.find(query)
        .populate("category", "name slug color icon")
        .populate("guest", "name designation organization photo")
        .populate('podcaster', 'name role photo')
        .skip(skip)
        .limit(lim)
        .sort(sortObj),
      Episode.countDocuments(query),
    ]);

    return paginatedResponse(
      res,
      episodes,
      getPaginationData(total, page, limit),
      "Episodes fetched successfully"
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get single episode
// @route   GET /api/episodes/:slug
// @access  Public
export const getEpisode = async (req, res, next) => {
  try {
    const episode = await Episode.findOne({ slug: req.params.slug })
      .populate("category", "name slug color icon")
      .populate("guest", "name designation organization photo linkedin twitter")
      .populate("createdBy", "name")
      .populate('podcaster', 'name role photo');

    if (!episode) return errorResponse(res, "Episode not found", 404);

    // Increment views
    await Episode.findByIdAndUpdate(episode._id, { $inc: { views: 1 } });

    return successResponse(res, episode, "Episode fetched successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Create episode
// @route   POST /api/episodes
// @access  Editor+

// Extract YouTube ID from URL
const extractYouTubeId = (url) => {
  if (!url) return "";
  const patterns = [
    /youtu\.be\/([^#&?]{11})/,
    /[?&]v=([^#&?]{11})/,
    /embed\/([^#&?]{11})/,
    /shorts\/([^#&?]{11})/,
  ];
  for (const p of patterns) {
    const match = url.match(p);
    if (match) return match[1];
  }
  return "";
};

export const createEpisode = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      guest,
      thumbnail,
      spotifyUrl,
      spreakerUrl,
      youtubeUrl,
      duration,
      tags,
      featured,
      status,
      podcaster,
    } = req.body;

    const slug = slugify(title);
    const existing = await Episode.findOne({ slug });
    if (existing) {
      return errorResponse(res, "Episode with this title already exists", 400);
    }

    const episode = await Episode.create({
      title,
      slug,
      description,
      category,
      guest,
      thumbnail,
      spotifyUrl,
      spreakerUrl,
      youtubeUrl,
      youtubeId: extractYouTubeId(youtubeUrl),
      duration,
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      featured: featured || false,
      status: status || "draft",
      publishedAt: status === "published" ? Date.now() : null,
      createdBy: req.user._id,
      podcaster: podcaster || null,
    });

    const populated = await episode.populate("category", "name slug color");

    return successResponse(res, populated, "Episode created successfully", 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update episode
// @route   PUT /api/episodes/:id
// @access  Editor+
export const updateEpisode = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      guest,
      thumbnail,
      spotifyUrl,
      spreakerUrl,
      youtubeUrl,
      duration,
      tags,
      featured,
      status,
    } = req.body;

    const episode = await Episode.findById(req.params.id);
    console.log("ID", req.params)
    if (!episode) return errorResponse(res, "Episode not found", 404);

    const updateData = {
      description,
      category,
      guest,
      thumbnail,
      spotifyUrl,
      spreakerUrl,
      youtubeUrl,
      duration,
      featured,
      status,
      podcaster: req.body.podcaster || null,
    };

    if (title && title !== episode.title) {
      updateData.title = title;
      updateData.slug = slugify(title);
    }

    if (tags) {
      updateData.tags = tags.split(",").map((t) => t.trim());
    }

    if (status === "published" && !episode.publishedAt) {
      updateData.publishedAt = Date.now();
    }

    const updated = await Episode.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate("category", "name slug color");

    return successResponse(res, updated, "Episode updated successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Delete episode
// @route   DELETE /api/episodes/:id
// @access  Superadmin
export const deleteEpisode = async (req, res, next) => {
  try {
    const episode = await Episode.findByIdAndDelete(req.params.id);
    if (!episode) return errorResponse(res, "Episode not found", 404);
    return successResponse(res, null, "Episode deleted successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle featured
// @route   PUT /api/episodes/:id/featured
// @access  Editor+
export const toggleFeatured = async (req, res, next) => {
  try {
    const episode = await Episode.findById(req.params.id);
    if (!episode) return errorResponse(res, "Episode not found", 404);

    episode.featured = !episode.featured;
    await episode.save();

    return successResponse(
      res,
      { featured: episode.featured },
      `Episode ${episode.featured ? "featured" : "unfeatured"} successfully`
    );
  } catch (error) {
    next(error);
  }
};