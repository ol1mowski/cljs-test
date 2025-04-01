import { Response, NextFunction } from 'express';
import { ReportService } from '../../../services/reports/report.service.js';
import { 
  AuthRequest, 
  CreateReportDTO, 
  UpdateReportStatusDTO,
  ReportStatus, 
  ReportCategory
} from '../../../types/reports/index.js';


export const createReport = async (
  req: AuthRequest & { body: CreateReportDTO }, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const reportData = req.body;
    
    const result = await ReportService.createReport(reportData);
    
    res.status(201).json({
      success: true,
      message: 'Zgłoszenie zostało przyjęte',
      report: result.report,
      emailSent: result.emailSent.success,
      emailDetails: result.emailSent.success ? {
        messageId: result.emailSent.messageId,
        previewUrl: result.emailSent.previewUrl 
      } : {
        error: result.emailSent.error
      }
    });
  } catch (error) {
    next(error);
  }
};