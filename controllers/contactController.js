import ContactMessage from "../models/ContactMessage.js";
import { sendContactConfirmation } from "../utils/sendEmail.js";
import { successResponse, errorResponse, paginatedResponse } from "../utils/apiResponse.js";
import paginate, { getPaginationData } from "../utils/paginate.js";

export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const contact = await ContactMessage.create({
      name, email, phone, subject, message,
      ipAddress: req.ip,
    });

    await sendContactConfirmation(name, email);
    return successResponse(res, null, "Message sent successfully! We will get back to you soon.", 201);
  } catch (error) {
    next(error);
  }
};

export const getContacts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const { skip, limit: lim } = paginate(req.query, page, limit);

    const query = status ? { status } : {};
    const [contacts, total] = await Promise.all([
      ContactMessage.find(query).skip(skip).limit(lim).sort({ createdAt: -1 }),
      ContactMessage.countDocuments(query),
    ]);

    return paginatedResponse(res, contacts, getPaginationData(total, page, limit), "Messages fetched successfully");
  } catch (error) {
    next(error);
  }
};

export const updateContactStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const contact = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status, ...(status === "replied" ? { repliedAt: Date.now() } : {}) },
      { new: true }
    );
    if (!contact) return errorResponse(res, "Message not found", 404);
    return successResponse(res, contact, "Status updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const contact = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!contact) return errorResponse(res, "Message not found", 404);
    return successResponse(res, null, "Message deleted successfully");
  } catch (error) {
    next(error);
  }
};