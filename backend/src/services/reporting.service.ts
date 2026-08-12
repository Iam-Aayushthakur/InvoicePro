import { ReportingRepository } from '../repositories/reporting.repository.js';
import { UserContext, assertPermission } from '../core/permissions.js';
import type { ReportParams } from '../core/types/reporting.types.js';
import { AppError } from '../core/errors/index.js';

interface Env { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string; }

export const ReportingService = {
  async generateReport(params: ReportParams, user: UserContext, env: Env) {
    assertPermission(user, 'reporting.read');
    
    if (params.report_type === 'SALES') {
      return ReportingRepository.getSalesReport(user.companyId, params, env);
    } else if (params.report_type === 'GST') {
      return ReportingRepository.getGSTReport(user.companyId, params, env);
    } else {
      throw new AppError('Report type not fully implemented yet', 501, 'NOT_IMPLEMENTED');
    }
  }
};
