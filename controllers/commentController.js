import Comment from "../models/Comment.js";
import { successResponse, errorResponse, paginatedResponse } from "../utils/apiResponse.js";
import paginate, { getPaginationData } from "../utils/paginate.js";

export const getComments = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, contentId, contentType, status } = req.query;
    const { skip, limit: lim } = paginate(req.query, page, limit);

    const query = {};
    if (contentId) query.contentId = contentId;
    if (contentType) query.contentType = contentType;

    // Public only sees approved
    if (!req.user) query.status = "approved";
    else if (status) query.status = status;

    const [comments, total] = await Promise.all([
      Comment.find(query).skip(skip).limit(lim).sort({ createdAt: -1 }),
      Comment.countDocuments(query),
    ]);

    return paginatedResponse(res, comments, getPaginationData(total, page, limit), "Comments fetched successfully");
  } catch (error) {
    next(error);
  }
};

export const createComment = async (req, res, next) => {
  try {
    const { name, email, content, contentType, contentId, contentModel } = req.body;

    const comment = await Comment.create({
      name, email, content, contentType, contentId, contentModel,
      status: "pending",
      ipAddress: req.ip,
    });

    return successResponse(res, comment, "Comment submitted for review", 201);
  } catch (error) {
    next(error);
  }
};

export const updateCommentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!comment) return errorResponse(res, "Comment not found", 404);
    return successResponse(res, comment, `Comment ${status} successfully`);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) return errorResponse(res, "Comment not found", 404);
    return successResponse(res, null, "Comment deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!comment) return errorResponse(res, "Comment not found", 404);
    return successResponse(res, { likes: comment.likes }, "Comment liked");
  } catch (error) {
    next(error);
  }
};