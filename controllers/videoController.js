import Video from "../models/Video.js";
import slugify from "../utils/slugify.js";
import { successResponse, errorResponse, paginatedResponse } from "../utils/apiResponse.js";
import paginate, { getPaginationData } from "../utils/paginate.js";

const extractYouTubeId = (url) => {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : "";
};

// @desc    Get all videos
// @route   GET /api/videos
// @access  Public
export const getVideos = async (req, res, next) => {
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

    if (!req.user) query.status = "published";
    else if (status) query.status = status;

    if (category) query.category = category;
    if (featured === "true") query.featured = true;
    if (search) query.$text = { $search: search };

    // const sortObj =
    //   sort === "oldest"
    //     ? { publishedAt: 1 }
    //     : sort === "popular"
    //       ? { views: -1 }
    //       : { publishedAt: -1 };

    const sortObj = req.user
      ? { order: 1 }
      : sort === 'oldest'
        ? { publishedAt: 1 }
        : sort === 'popular'
          ? { views: -1 }
          : { publishedAt: -1 }

    const [videos, total] = await Promise.all([
      Video.find(query)
        .populate("category", "name slug color icon")
        .populate('guest', 'name designation organization photo')
        .populate('podcaster', 'name role photo')
        .skip(skip)
        .limit(lim)
        .sort(sortObj),
      Video.countDocuments(query),
    ]);

    return paginatedResponse(
      res,
      videos,
      getPaginationData(total, page, limit),
      "Videos fetched successfully"
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get single video
// @route   GET /api/videos/:slug
// @access  Public
export const getVideo = async (req, res, next) => {

  
  try {
    const video = await Video.findOne({ _id: req.params.id }).populate(
      "category",
      "name slug color"
    ).populate('guest', 'name designation organization photo linkedin twitter')
      .populate('podcaster', 'name role photo');

    if (!video) return errorResponse(res, "Video not found", 404);
    return successResponse(res, video, "Video fetched successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Create video
// @route   POST /api/videos
// @access  Editor+
// export const createVideo = async (req, res, next) => {
//   try {
//     const {
//       title,
//       description,
//       category,
//       youtubeUrl,
//       thumbnail,
//       views,
//       featured,
//       status,
//       guest, podcaster,
//     } = req.body;

//     const slug = slugify(title);
//     const existing = await Video.findOne({ slug });
//     if (existing) return errorResponse(res, "Video with this title already exists", 400);

//     const youtubeId = extractYouTubeId(youtubeUrl);
//     if (!youtubeId) return errorResponse(res, "Invalid YouTube URL", 400);

//     const video = await Video.create({
//       title,
//       slug,
//       description,
//       category,
//       youtubeUrl: `https://www.youtube.com/embed/${youtubeId}`,
//       youtubeId,
//       thumbnail: thumbnail || {
//         url: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
//         publicId: "",
//       },
//       views: views || "0",
//       featured: featured || false,
//       status: status || "draft",
//       publishedAt: status === "published" ? Date.now() : null,
//       createdBy: req.user._id,
//     });

//     return successResponse(res, video, "Video created successfully", 201);
//   } catch (error) {
//     next(error);
//   }
// };

export const createVideo = async (req, res, next) => {
  try {
    const {
      title, description, category, youtubeUrl,
      thumbnail, views, featured, status,
      guest, podcaster,                          // ← add these
    } = req.body

    const slug = slugify(title)
    const existing = await Video.findOne({ slug })
    if (existing) return errorResponse(res, 'Video with this title already exists', 400)

    const youtubeId = extractYouTubeId(youtubeUrl)
    if (!youtubeId) return errorResponse(res, 'Invalid YouTube URL', 400)

    const video = await Video.create({
      title, slug, description, category,
      youtubeUrl: `https://www.youtube.com/embed/${youtubeId}`,
      youtubeId,
      thumbnail: thumbnail || {
        url: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
        publicId: '',
      },
      views: views || '0',
      featured: featured || false,
      status: status || 'draft',
      publishedAt: status === 'published' ? Date.now() : null,
      guest: guest || null,              // ← add
      podcaster: podcaster || null,              // ← add
      createdBy: req.user._id,
    })

    return successResponse(res, video, 'Video created successfully', 201)
  } catch (error) {
    next(error)
  }
}

// @desc    Update video
// @route   PUT /api/videos/:id
// @access  Editor+
export const updateVideo = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      youtubeUrl,
      thumbnail,
      views,
      featured,
      status,
    } = req.body;

    const video = await Video.findById(req.params.id);
    if (!video) return errorResponse(res, "Video not found", 404);

    const updateData = {
      description,
      category,
      thumbnail,
      views,
      featured,
      status,
      guest: req.body.guest || null,
      podcaster: req.body.podcaster || null,
    };

    if (title && title !== video.title) {
      updateData.title = title;
      updateData.slug = slugify(title);
    }

    if (youtubeUrl) {
      const youtubeId = extractYouTubeId(youtubeUrl);
      if (!youtubeId) return errorResponse(res, "Invalid YouTube URL", 400);
      updateData.youtubeId = youtubeId;
      updateData.youtubeUrl = `https://www.youtube.com/embed/${youtubeId}`;
    }

    if (status === "published" && !video.publishedAt) {
      updateData.publishedAt = Date.now();
    }

    const updated = await Video.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate("category", "name slug color");

    return successResponse(res, updated, "Video updated successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Delete video
// @route   DELETE /api/videos/:id
// @access  Superadmin
export const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) return errorResponse(res, "Video not found", 404);
    return successResponse(res, null, "Video deleted successfully");
  } catch (error) {
    next(error);
  }
};