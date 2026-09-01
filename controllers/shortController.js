import Short from "../models/Short.js";
import { successResponse, errorResponse, paginatedResponse } from "../utils/apiResponse.js";
import paginate, { getPaginationData } from "../utils/paginate.js";

// @desc    Get all shorts
// @route   GET /api/shorts
// @access  Public
export const getShorts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, category, platform, status = "published" } = req.query;
    const { skip, limit: lim } = paginate(req.query, page, limit);

    const query = {};
    if (!req.user) query.status = "published";
    else if (status) query.status = status;
    if (category) query.category = category;
    if (platform) query.platform = platform;

    const [shorts, total] = await Promise.all([
      Short.find(query)
        .populate("category", "name slug color")
        .populate('guest', 'name designation organization photo')
        .populate('podcaster', 'name role photo')
        .skip(skip)
        .limit(lim)
        .sort({ order: 1, createdAt: -1 }),
      Short.countDocuments(query),
    ]);

    return paginatedResponse(
      res,
      shorts,
      getPaginationData(total, page, limit),
      "Shorts fetched successfully"
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get single short
// @route   GET /api/shorts/:id
// @access  Public
export const getShort = async (req, res, next) => {
  try {
    const short = await Short.findById(req.params.id).populate("category", "name slug color").populate('guest', 'name designation organization photo')
      .populate('podcaster', 'name role photo');
    if (!short) return errorResponse(res, "Short not found", 404);
    return successResponse(res, short, "Short fetched successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Create short
// @route   POST /api/shorts
// @access  Editor+
// export const createShort = async (req, res, next) => {
//   try {
//     const { title, platform, url, embedId, thumbnail, category, views, status, order } = req.body;

//     const short = await Short.create({
//       title,
//       platform,
//       url,
//       embedId: embedId || "",
//       thumbnail: thumbnail || { url: "", publicId: "" },
//       category,
//       views: views || "0",
//       status: status || "draft",
//       order: order || 0,
//       createdBy: req.user._id,
//     });

//     return successResponse(res, short, "Short created successfully", 201);
//   } catch (error) {
//     next(error);
//   }
// };

export const createShort = async (req, res, next) => {
  try {
    const {
      title, platform, url, embedId, thumbnail,
      category, views, status, order,
      guest, podcaster,                          // ← add
    } = req.body

    const short = await Short.create({
      title, platform, url,
      embedId: embedId || '',
      thumbnail: thumbnail || { url: '', publicId: '' },
      category,
      views: views || '0',
      status: status || 'draft',
      order: order || 0,
      guest: guest || null,              // ← add
      podcaster: podcaster || null,              // ← add
      createdBy: req.user._id,
    })

    return successResponse(res, short, 'Short created successfully', 201)
  } catch (error) {
    next(error)
  }
}

// @desc    Update short
// @route   PUT /api/shorts/:id
// @access  Editor+
export const updateShort = async (req, res, next) => {
  try {
    const { title, platform, url, embedId, thumbnail, category, views, status, order } = req.body;

    // const short = await Short.findByIdAndUpdate(
    //   req.params.id,
    //   { title, platform, url, embedId, thumbnail, category, views, status, order },
    //   { new: true, runValidators: true }
    // ).populate("category", "name slug color");

    const short = await Short.findByIdAndUpdate(
      req.params.id,
      {
        title, platform, url, embedId, thumbnail,
        category, views, status, order,
        guest: req.body.guest || null,
        podcaster: req.body.podcaster || null,
      },
      { new: true, runValidators: true }
    )
      .populate('category', 'name slug color')
      .populate('guest', 'name designation organization photo')
      .populate('podcaster', 'name role photo')

    if (!short) return errorResponse(res, "Short not found", 404);
    return successResponse(res, short, "Short updated successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Delete short
// @route   DELETE /api/shorts/:id
// @access  Superadmin
export const deleteShort = async (req, res, next) => {
  try {
    const short = await Short.findByIdAndDelete(req.params.id);
    if (!short) return errorResponse(res, "Short not found", 404);
    return successResponse(res, null, "Short deleted successfully");
  } catch (error) {
    next(error);
  }
};