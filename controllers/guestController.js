import Guest from "../models/Guest.js";
import { successResponse, errorResponse, paginatedResponse } from "../utils/apiResponse.js";
import paginate, { getPaginationData } from "../utils/paginate.js";

export const getGuests = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, category, featured, all } = req.query
    const { skip, limit: lim } = paginate(req.query, page, limit)

    // Admin passes ?all=true to get inactive guests too
    const query = all === 'true' ? {} : { isActive: true }
    if (category) query.category = category
    if (featured === 'true') query.featured = true

    const [guests, total] = await Promise.all([
      Guest.find(query)
        .populate('category', 'name slug color')
        .populate('episode', 'title slug')
        .skip(skip)
        .limit(lim)
        .sort({ createdAt: -1 }),
      Guest.countDocuments(query),
    ])

    return paginatedResponse(res, guests, getPaginationData(total, page, limit), 'Guests fetched successfully')
  } catch (error) {
    next(error)
  }
}

export const getGuest = async (req, res, next) => {
  try {
    const guest = await Guest.findById(req.params.id)
      .populate("category", "name slug color")
      .populate("episode", "title slug thumbnail");
    if (!guest) return errorResponse(res, "Guest not found", 404);
    return successResponse(res, guest, "Guest fetched successfully");
  } catch (error) {
    next(error);
  }
};

export const createGuest = async (req, res, next) => {
  try {
    const { name, designation, organization, photo, bio, category, episode, linkedin, twitter, instagram, website, featured } = req.body;

    const guest = await Guest.create({
      name, designation, organization,
      photo: photo || { url: "", publicId: "" },
      bio, category, episode,
      linkedin, twitter, instagram, website,
      featured: featured || false,
      createdBy: req.user._id,
    });

    return successResponse(res, guest, "Guest created successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const updateGuest = async (req, res, next) => {
  try {
    const { name, designation, organization, photo, bio, category, episode, linkedin, twitter, instagram, website, featured, isActive } = req.body;

    const guest = await Guest.findByIdAndUpdate(
      req.params.id,
      { name, designation, organization, photo, bio, category, episode, linkedin, twitter, instagram, website, featured, isActive },
      { new: true, runValidators: true }
    ).populate("category", "name slug color");

    if (!guest) return errorResponse(res, "Guest not found", 404);
    return successResponse(res, guest, "Guest updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteGuest = async (req, res, next) => {
  try {
    const guest = await Guest.findByIdAndDelete(req.params.id);
    if (!guest) return errorResponse(res, "Guest not found", 404);
    return successResponse(res, null, "Guest deleted successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Get guest with all their content
// @route   GET /api/guests/:id/content
// @access  Public
export const getGuestContent = async (req, res, next) => {
  
  try {
    const guest = await Guest.findById(req.params.id)
      .populate("category", "name slug color icon")
      .populate("episode", "title slug thumbnail duration description publishedAt spotifyUrl spreakerUrl youtubeUrl");

    if (!guest) return errorResponse(res, "Guest not found", 404);

    console.log("Guest", req.params, guest)

    // Find all episodes featuring this guest
    const Episode = (await import("../models/Episode.js")).default;
    const Video = (await import("../models/Video.js")).default;
    const Short = (await import("../models/Short.js")).default;

    const episodes = await Episode.find({
      guest: guest._id,
      status: "published",
    })
      .populate("category", "name slug color")
      .sort({ publishedAt: -1 });

    // For videos and shorts, search by title similarity with guest name
    const nameRegex = new RegExp(guest.name, "i");

    const videos = await Video.find({
      status: "published",
      guest: guest._id,
    })
      .populate("category", "name slug color")
      .sort({ publishedAt: -1 })
      .limit(6);

    const shorts = await Short.find({
      status: "published",
      guest: guest._id,
    })
      .populate("category", "name slug color")
      .sort({ createdAt: -1 })
      .limit(6);

    return successResponse(
      res,
      {
        guest,
        content: {
          episodes,
          videos,
          shorts,
          total: episodes.length + videos.length + shorts.length,
        },
      },
      "Guest content fetched successfully"
    );
  } catch (error) {
    next(error);
  }
};