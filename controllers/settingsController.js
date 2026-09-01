import SiteSettings from "../models/SiteSettings.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

export const getSettings = async (req, res, next) => {
  try {
    const settings = await SiteSettings.findOne();
    if (!settings) return errorResponse(res, "Settings not found", 404);
    return successResponse(res, settings, "Settings fetched successfully");
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const {
      siteName, siteDescription, siteUrl, contactEmail,
      whatsappNumber, address, socialLinks, listenOn,
      heroVideoId, metaKeywords, googleAnalyticsId,
    } = req.body;

    let settings = await SiteSettings.findOne();

    if (!settings) {
      settings = await SiteSettings.create({
        siteName, siteDescription, siteUrl, contactEmail,
        whatsappNumber, address, socialLinks, listenOn,
        heroVideoId, metaKeywords, googleAnalyticsId,
      });
    } else {
      settings = await SiteSettings.findByIdAndUpdate(
        settings._id,
        {
          siteName, siteDescription, siteUrl, contactEmail,
          whatsappNumber, address, socialLinks, listenOn,
          heroVideoId, metaKeywords, googleAnalyticsId,
        },
        { new: true, runValidators: true }
      );
    }

    return successResponse(res, settings, "Settings updated successfully");
  } catch (error) {
    next(error);
  }
};