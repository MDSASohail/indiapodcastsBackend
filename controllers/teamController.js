import TeamMember from "../models/TeamMember.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

export const getTeam = async (req, res, next) => {
  try {
    // Admin can pass ?all=true to get inactive members too
    const query = req.query.all === 'true' ? {} : { isActive: true }
    const team  = await TeamMember.find(query).sort({ order: 1 })
    return successResponse(res, team, 'Team fetched successfully')
  } catch (error) {
    next(error)
  }
}

export const getTeamMember = async (req, res, next) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) return errorResponse(res, "Team member not found", 404);
    return successResponse(res, member, "Team member fetched successfully");
  } catch (error) {
    next(error);
  }
};

export const createTeamMember = async (req, res, next) => {
  try {
    const { name, role, photo, bio, linkedin, twitter, instagram, order } = req.body;

    const member = await TeamMember.create({
      name, role,
      photo: photo || { url: "", publicId: "" },
      bio, linkedin, twitter, instagram,
      order: order || 0,
      createdBy: req.user._id,
    });

    return successResponse(res, member, "Team member created successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const updateTeamMember = async (req, res, next) => {
  try {
    const { name, role, photo, bio, linkedin, twitter, instagram, order, isActive } = req.body;

    const member = await TeamMember.findByIdAndUpdate(
      req.params.id,
      { name, role, photo, bio, linkedin, twitter, instagram, order, isActive },
      { new: true, runValidators: true }
    );

    if (!member) return errorResponse(res, "Team member not found", 404);
    return successResponse(res, member, "Team member updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteTeamMember = async (req, res, next) => {
  try {
    const member = await TeamMember.findByIdAndDelete(req.params.id);
    if (!member) return errorResponse(res, "Team member not found", 404);
    return successResponse(res, null, "Team member deleted successfully");
  } catch (error) {
    next(error);
  }
};