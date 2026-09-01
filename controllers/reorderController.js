// server/controllers/reorderController.js

import Episode from '../models/Episode.js'
import Video   from '../models/Video.js'
import Short   from '../models/Short.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

/**
 * Generic reorder helper.
 * Receives: { orderedIds: ['id1','id2','id3',...] }
 * Writes:   order field (0-based index) to each document in bulk
 */
const reorderDocs = async (Model, orderedIds) => {
  if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
    throw new Error('orderedIds must be a non-empty array')
  }

  const ops = orderedIds.map((id, index) => ({
    updateOne: {
      filter: { _id: id },
      update: { $set: { order: index } },
    },
  }))

  await Model.bulkWrite(ops)
}

// @desc    Reorder episodes
// @route   PUT /api/reorder/episodes
// @access  Editor+
export const reorderEpisodes = async (req, res, next) => {
  try {
    const { orderedIds } = req.body
    if (!orderedIds) return errorResponse(res, 'orderedIds is required', 400)
    await reorderDocs(Episode, orderedIds)
    return successResponse(res, null, 'Episodes reordered successfully')
  } catch (error) {
    next(error)
  }
}

// @desc    Reorder videos
// @route   PUT /api/reorder/videos
// @access  Editor+
export const reorderVideos = async (req, res, next) => {
  try {
    const { orderedIds } = req.body
    if (!orderedIds) return errorResponse(res, 'orderedIds is required', 400)
    await reorderDocs(Video, orderedIds)
    return successResponse(res, null, 'Videos reordered successfully')
  } catch (error) {
    next(error)
  }
}

// @desc    Reorder shorts
// @route   PUT /api/reorder/shorts
// @access  Editor+
export const reorderShorts = async (req, res, next) => {
  try {
    const { orderedIds } = req.body
    if (!orderedIds) return errorResponse(res, 'orderedIds is required',400)
    await reorderDocs(Short, orderedIds)
    return successResponse(res, null, 'Shorts reordered successfully')
  } catch (error) {
    next(error)
  }
}