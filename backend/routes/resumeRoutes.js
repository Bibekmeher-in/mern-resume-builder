import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    createResume,
    getResumes,
    getResumeById,
    updateResume,
    deleteResume
} from '../controllers/resumeController.js';

const router = express.Router();

// Create a new resume
router.post('/', protect, createResume);

// Get all resumes for the logged-in user
router.get('/', protect, getResumes);

// Get a single resume by ID
router.get('/:id', protect, getResumeById);

// Update a resume
router.put('/:id', protect, updateResume);

// Delete a resume
router.delete('/:id', protect, deleteResume);

export default router;
