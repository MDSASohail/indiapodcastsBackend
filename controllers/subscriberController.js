import Subscriber from "../models/Subscriber.js";
import { sendNewsletterConfirmation } from "../utils/sendEmail.js";
import { successResponse, errorResponse, paginatedResponse } from "../utils/apiResponse.js";
import paginate, { getPaginationData } from "../utils/paginate.js";

export const subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return errorResponse(res, "Email is required", 400);

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      if (existing.status === "unsubscribed") {
        existing.status = "active";
        existing.subscribedAt = Date.now();
        await existing.save();
        await sendNewsletterConfirmation(email);
        return successResponse(res, null, "Welcome back! You have been resubscribed.");
      }
      return errorResponse(res, "This email is already subscribed", 400);
    }

    await Subscriber.create({ email, ipAddress: req.ip });
    await sendNewsletterConfirmation(email);
    return successResponse(res, null, "Successfully subscribed to newsletter!", 201);
  } catch (error) {
    next(error);
  }
};

export const unsubscribe = async (req, res, next) => {
  try {
    const { email } = req.body;
    const subscriber = await Subscriber.findOne({ email });
    if (!subscriber) return errorResponse(res, "Email not found", 404);

    subscriber.status = "unsubscribed";
    subscriber.unsubscribedAt = Date.now();
    await subscriber.save();

    return successResponse(res, null, "Successfully unsubscribed");
  } catch (error) {
    next(error);
  }
};

export const getSubscribers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const { skip, limit: lim } = paginate(req.query, page, limit);

    const query = status ? { status } : {};
    const [subscribers, total] = await Promise.all([
      Subscriber.find(query).skip(skip).limit(lim).sort({ subscribedAt: -1 }),
      Subscriber.countDocuments(query),
    ]);

    return paginatedResponse(res, subscribers, getPaginationData(total, page, limit), "Subscribers fetched successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteSubscriber = async (req, res, next) => {
  try {
    const subscriber = await Subscriber.findByIdAndDelete(req.params.id);
    if (!subscriber) return errorResponse(res, "Subscriber not found", 404);
    return successResponse(res, null, "Subscriber deleted successfully");
  } catch (error) {
    next(error);
  }
};