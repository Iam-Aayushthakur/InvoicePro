import { ReportingService } from '../../services/reporting.service.js';
import { successResponse, errorResponse } from '../../core/responses/index.js';
import { validateReportParams } from '../../core/validators/reporting.validator.js';
import { UserContext } from '../../core/permissions.js';
import { AppError } from '../../core/errors/index.js';

interface Env { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string; }

export const ReportingController = {
  async generate(request: Request, user: UserContext, env: Env): Promise<Response> {
    try {
      const url = new URL(request.url);
      const val = validateReportParams(url.searchParams);
      if (!val.success) return errorResponse('Validation failed', 400, 'VALIDATION_ERROR', val.errors);
      
      const reportData = await ReportingService.generateReport(val.data!, user, env);
      return successResponse({ report: reportData, params: val.data });
    } catch (e) { 
      return e instanceof AppError ? errorResponse(e.message, e.statusCode, e.code) : errorResponse('Server error', 500, 'SERVER_ERROR');
    }
  }
};
