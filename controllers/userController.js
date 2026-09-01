import User from "../models/User.js";
import { successResponse, errorResponse, paginatedResponse } from "../utils/apiResponse.js";
import paginate, { getPaginationData } from "../utils/paginate.js";

// @desc    Get all users
// @route   GET /api/users
// @access  Superadmin
export const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const { skip, limit: lim } = paginate(req.query, page, limit);

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      User.find(query).skip(skip).limit(lim).sort({ createdAt: -1 }),
      User.countDocuments(query),
    ]);

    return paginatedResponse(
      res,
      users,
      getPaginationData(total, page, limit),
      "Users fetched successfully"
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Superadmin
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return errorResponse(res, "User not found", 404);
    return successResponse(res, user, "User fetched successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Create user
// @route   POST /api/users
// @access  Superadmin
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, "Email already exists", 400);
    }

    const user = await User.create({ name, email, password, role });
    return successResponse(res, user, "User created successfully", 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Superadmin
export const updateUser = async (req, res, next) => {
  try {
    const { name, email, role, isActive } = req.body;

    // Prevent updating own role
    if (req.params.id === req.user._id.toString()) {
      return errorResponse(res, "You cannot update your own account here", 400);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, isActive },
      { new: true, runValidators: true }
    );

    if (!user) return errorResponse(res, "User not found", 404);
    return successResponse(res, user, "User updated successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Superadmin
export const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return errorResponse(res, "You cannot delete your own account", 400);
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return errorResponse(res, "User not found", 404);
    return successResponse(res, null, "User deleted successfully");
  } catch (error) {
    next(error);
  }
};