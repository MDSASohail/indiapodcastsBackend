// server/routes/reorderRoutes.js

import express from 'express'
import { reorderEpisodes, reorderVideos, reorderShorts } from '../controllers/reorderController.js'
import { protect } from '../middleware/auth.js'
import { isEditorOrAbove } from '../middleware/roleCheck.js'

const router = express.Router()

router.put('/episodes', protect, isEditorOrAbove, reorderEpisodes)
router.put('/videos',   protect, isEditorOrAbove, reorderVideos)
router.put('/shorts',   protect, isEditorOrAbove, reorderShorts)

export default router