import GuestPitch from "../models/GuestPitch.js";
import { sendGuestPitchConfirmation } from "../utils/sendEmail.js";
import { successResponse, errorResponse, paginatedResponse } from "../utils/apiResponse.js";
import paginate, { getPaginationData } from "../utils/paginate.js";

export const createPitch = async (req, res, next) => {
  try {
    const { name, email, phone, designation, organization, category, topic, bio, socialLinks } = req.body;

    const pitch = await GuestPitch.create({
      name, email, phone, designation, organization,
      category, topic, bio, socialLinks,
      ipAddress: req.ip,
    });

    await sendGuestPitchConfirmation(name, email);
    return successResponse(res, null, "Pitch submitted successfully! We will review and get back to you.", 201);
  } catch (error) {
    next(error);
  }
};

export const getPitches = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const { skip, limit: lim } = paginate(req.query, page, limit);

    const query = status ? { status } : {};
    const [pitches, total] = await Promise.all([
      GuestPitch.find(query)
        .populate("category", "name slug")
        .skip(skip)
        .limit(lim)
        .sort({ createdAt: -1 }),
      GuestPitch.countDocuments(query),
    ]);

    return paginatedResponse(res, pitches, getPaginationData(total, page, limit), "Pitches fetched successfully");
  } catch (error) {
    next(error);
  }
};

export const updatePitchStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const pitch = await GuestPitch.findByIdAndUpdate(
      req.params.id,
      { status, notes },
      { new: true }
    );
    if (!pitch) return errorResponse(res, "Pitch not found", 404);
    return successResponse(res, pitch, "Pitch status updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deletePitch = async (req, res, next) => {
  try {
    const pitch = await GuestPitch.findByIdAndDelete(req.params.id);
    if (!pitch) return errorResponse(res, "Pitch not found", 404);
    return successResponse(res, null, "Pitch deleted successfully");
  } catch (error) {
    next(error);
  }
};