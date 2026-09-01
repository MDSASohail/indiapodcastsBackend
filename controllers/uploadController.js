import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

const uploadToCloudinary = (buffer, folder, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `indiapodcasts/${folder}`,
        resource_type: "image",
        transformation: [
          { width: 1200, height: 675, crop: "fill", quality: "auto" },
        ],
        ...options,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

// @desc    Upload single image
// @route   POST /api/upload
// @access  Editor+
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) return errorResponse(res, "Please upload an image", 400);

    const folder = req.query.folder || "general";
    const result = await uploadToCloudinary(req.file.buffer, folder);

    return successResponse(
      res,
      {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        size: result.bytes,
      },
      "Image uploaded successfully"
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Delete image from Cloudinary
// @route   DELETE /api/upload/:publicId
// @access  Editor+
export const deleteImage = async (req, res, next) => {
  try {
    const publicId = decodeURIComponent(req.params.publicId);
    await cloudinary.uploader.destroy(publicId);
    return successResponse(res, null, "Image deleted successfully");
  } catch (error) {
    next(error);
  }
};