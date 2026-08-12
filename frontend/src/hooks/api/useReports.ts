import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api/api-client';

export interface ReportParams {
  report_type: 'SALES' | 'GST';
  start_date: string;
  end_date: string;
}

export function useReport(params: ReportParams | null) {
  return useQuery({
    queryKey: ['reports', params?.report_type, params?.start_date, params?.end_date],
    queryFn: () => apiClient.get<{ report: any }>(`/reports?report_type=${params!.report_type}&start_date=${params!.start_date}&end_date=${params!.end_date}`),
    enabled: !!params,
  });
}
