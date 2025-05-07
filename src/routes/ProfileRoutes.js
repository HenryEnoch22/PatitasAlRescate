import { Router } from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/ProfileController.js';
import { verifyToken } from '../utils/VerifyToken.js';
import UpdateProfileValidator from '../validators/profile/UpdateProfileValidator.js';
import upload from '../utils/Upload.js';

const router = Router();

router.get('/get', verifyToken, getUserProfile);
router.patch('/update', verifyToken, upload.single("photo"), UpdateProfileValidator, updateUserProfile); 
export default router;