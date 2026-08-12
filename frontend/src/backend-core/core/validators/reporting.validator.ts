import type { ReportParams } from '../types/reporting.types.js';

export interface ValidationResult<T> { success: boolean; data?: T; errors?: string[]; }

const VALID_TYPES = ['SALES', 'PURCHASES', 'GST'];

export function validateReportParams(query: URLSearchParams): ValidationResult<ReportParams> {
  const errors: string[] = [];
  const start_date = query.get('start_date');
  const end_date = query.get('end_date');
  const report_type = query.get('report_type');

  if (!start_date) errors.push('start_date is required (YYYY-MM-DD)');
  if (!end_date) errors.push('end_date is required (YYYY-MM-DD)');
  if (!report_type || !VALID_TYPES.includes(report_type)) {
    errors.push(`report_type must be one of: ${VALID_TYPES.join(', ')}`);
  }

  if (errors.length > 0) return { success: false, errors };

  return {
    success: true,
    data: {
      start_date: start_date!,
      end_date: end_date!,
      report_type: report_type as 'SALES' | 'PURCHASES' | 'GST'
    }
  };
}
