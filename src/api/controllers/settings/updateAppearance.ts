import { Response, NextFunction } from 'express';
import { AuthRequest, UpdateAppearanceDTO } from '../../../types/settings/index.js';
import { ValidationError } from '../../../utils/errors.js';
import { SettingsService } from '../../../services/settings/settings.service.js';

export const updateAppearanceController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      throw new ValidationError('Brak autoryzacji');
    }

    const appearanceData: UpdateAppearanceDTO = req.body;
    
    const updatedAppearance = await SettingsService.updateAppearance(userId, appearanceData);

    res.status(200).json({
      success: true,
      message: 'Ustawienia wyglądu zostały zaktualizowane',
      data: updatedAppearance
    });
  } catch (error) {
    next(error);
  }
}; 