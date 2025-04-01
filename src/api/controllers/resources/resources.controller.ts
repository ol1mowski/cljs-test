import { Resource } from '../../../models/resource.model.js';
import { User } from '../../../models/user.model.js';
import { Request, Response, NextFunction } from 'express';

export const getResources = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, type, difficulty, search, tag } = req.query;
    const query: Record<string, any> = { isPublished: true };
    
    if (category) query.category = category;
    if (type) query.type = type;
    if (difficulty) query.difficulty = difficulty;
    if (tag) query.tags = tag;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }
    
    const user = await User.findById(req.user.userId)
      .select('stats.progress.currentLevel preferences.savedResources')
      .lean();
    
    
    const resources = await Resource.find(query)
      .sort({ likes: -1, createdAt: -1 })
      .lean();
    
    const savedResources = (user.preferences as any)?.savedResources || [];
    
    const formattedResources = resources.map(resource => ({
      id: resource._id,
      title: resource.title,
      description: resource.description,
      url: resource.url,
      type: resource.type,
      category: resource.category,
      difficulty: resource.difficulty,
      tags: resource.tags,
      isRecommended: resource.isRecommended,
      author: resource.author,
      isSaved: savedResources.includes(resource._id),
      createdAt: resource.createdAt
    }));
    
    res.json({
      resources: formattedResources,
      total: formattedResources.length
    });
  } catch (error) {
    next(error);
  }
};
