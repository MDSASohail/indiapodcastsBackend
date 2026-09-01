import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, "Please provide email and password", 400);
    }

    // Find user with password
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return errorResponse(res, "Invalid email or password", 401);
    }

    if (!user.isActive) {
      return errorResponse(res, "Your account has been deactivated", 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, "Invalid email or password", 401);
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id, user.role);

    return successResponse(
      res,
      {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          lastLogin: user.lastLogin,
        },
      },
      "Login successful"
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    return successResponse(res, user, "User fetched successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return errorResponse(
        res,
        "Please provide current and new password",
        400
      );
    }

    if (newPassword.length < 8) {
      return errorResponse(
        res,
        "New password must be at least 8 characters",
        400
      );
    }

    const user = await User.findById(req.user._id).select("+password");
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return errorResponse(res, "Current password is incorrect", 400);
    }

    user.password = newPassword;
    user.passwordChangedAt = Date.now();
    await user.save();

    return successResponse(res, null, "Password changed successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Update profile
// @route   PUT /api/auth/update-profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    );

    return successResponse(res, user, "Profile updated successfully");
  } catch (error) {
    next(error);
  }
};