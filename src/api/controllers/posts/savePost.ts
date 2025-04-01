import { NextFunction, Request, Response } from 'express';
import { PostService } from '../../../services/post/post.service.js';
import { asyncHandler } from '../../../utils/asyncHandler.js';

export const savePostController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = req.user.id;

  const post = await PostService.savePost(id, userId);

  res.json({
    status: 'success',
    data: post
  });
}); 