import { Router } from 'express';
import { verifyToken } from '../utils/VerifyToken.js';
import { createComment, getCommentsByReportId, updateComment,deleteComment } from '../controllers/CommentController.js';

import CreateCommentValidator from '../validators/comment/CreateCommentValidator.js';
import UpdateCommentValidator from '../validators/comment/UpdateCommentValidator.js';

const router = Router();

router.get('/:reportId', verifyToken, getCommentsByReportId );

router.post('/create', verifyToken, CreateCommentValidator, createComment)

router.patch('/update/:commentId', verifyToken, UpdateCommentValidator, updateComment);

router.delete('/delete/:commentId', verifyToken, deleteComment); 

export default router;