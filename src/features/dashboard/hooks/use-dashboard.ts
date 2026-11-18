import { useQuery } from "@tanstack/react-query"
import type { QueryRequest } from "@/types/api"
import { dashboardService } from "../services/dashboard-service"

export const useDashboardSummary = (query: QueryRequest) => {
  return useQuery({
    queryKey: ["dashboard", "summary", query] as const,
    queryFn: () => dashboardService.getSummary(query),
  })
}
