import Category from "../models/Category.js";
import slugify from "../utils/slugify.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const { active } = req.query;
    const query = active === "true" ? { isActive: true } : {};
    const categories = await Category.find(query).sort({ order: 1 });
    return successResponse(res, categories, "Categories fetched successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
export const getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return errorResponse(res, "Category not found", 404);
    return successResponse(res, category, "Category fetched successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Editor+
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, color, icon, order } = req.body;
    const slug = slugify(name);

    const existing = await Category.findOne({ slug });
    if (existing) return errorResponse(res, "Category already exists", 400);

    const category = await Category.create({
      name,
      slug,
      description,
      color,
      icon,
      order,
    });

    return successResponse(res, category, "Category created successfully", 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Editor+
export const updateCategory = async (req, res, next) => {
  try {
    const { name, description, color, icon, order, isActive } = req.body;
    const updateData = { description, color, icon, order, isActive };

    if (name) {
      updateData.name = name;
      updateData.slug = slugify(name);
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!category) return errorResponse(res, "Category not found", 404);
    return successResponse(res, category, "Category updated successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Superadmin
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return errorResponse(res, "Category not found", 404);
    return successResponse(res, null, "Category deleted successfully");
  } catch (error) {
    next(error);
  }
};