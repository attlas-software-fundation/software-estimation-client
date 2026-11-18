import { apiClient } from "@/lib/api"
import type { QueryRequest } from "@/types/api"
import type { DashboardSummary } from "../types/dashboard-summary"

export const dashboardService = {
  getSummary: (query: QueryRequest) =>
    apiClient.post<DashboardSummary>("/api/v1/dashboard/summary", query),
}
