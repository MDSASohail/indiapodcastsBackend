import Founder from "../models/Founder.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

export const getFounder = async (req, res, next) => {
  try {
    const founder = await Founder.findOne();
    if (!founder) return errorResponse(res, "Founder not found", 404);
    return successResponse(res, founder, "Founder fetched successfully");
  } catch (error) {
    next(error);
  }
};

export const updateFounder = async (req, res, next) => {
  try {
    const { name, title, bio, photo, email, linkedin, twitter, instagram, youtube, milestones, pressFeatures, quickFacts } = req.body;

    let founder = await Founder.findOne();

    if (!founder) {
      founder = await Founder.create({
        name, title, bio, photo, email,
        linkedin, twitter, instagram, youtube,
        milestones: milestones || [],
        pressFeatures: pressFeatures || [],
        quickFacts: quickFacts || [],
      });
    } else {
      founder = await Founder.findByIdAndUpdate(
        founder._id,
        { name, title, bio, photo, email, linkedin, twitter, instagram, youtube, milestones, pressFeatures, quickFacts },
        { new: true, runValidators: true }
      );
    }

    return successResponse(res, founder, "Founder updated successfully");
  } catch (error) {
    next(error);
  }
};

export const addMilestone = async (req, res, next) => {
  try {
    const { year, title, description, color } = req.body;
    const founder = await Founder.findOne();
    if (!founder) return errorResponse(res, "Founder not found", 404);

    founder.milestones.push({ year, title, description, color });
    await founder.save();

    return successResponse(res, founder, "Milestone added successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteMilestone = async (req, res, next) => {
  try {
    const founder = await Founder.findOne();
    if (!founder) return errorResponse(res, "Founder not found", 404);

    founder.milestones = founder.milestones.filter(
      (m) => m._id.toString() !== req.params.milestoneId
    );
    await founder.save();

    return successResponse(res, founder, "Milestone deleted successfully");
  } catch (error) {
    next(error);
  }
};