"use client"

import { useQuery } from "@tanstack/react-query"
import { ApiError } from "@/lib/api/api-error"
import { adaptProjectCostResponse } from "../adapters/adapt-project-cost-response"
import { getProjectCosts } from "../services/costs-service"

export const PROJECT_COSTS_QUERY_KEY = ["project-costs"] as const

export const useProjectCosts = (projectId: string) => {
  return useQuery({
    queryKey: [...PROJECT_COSTS_QUERY_KEY, projectId],
    queryFn: async ({ signal }) =>
      (await getProjectCosts(projectId, signal)) ?? null,
    select: (response) =>
      response ? adaptProjectCostResponse(response) : null,
    enabled: Boolean(projectId.trim()),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status < 500) {
        return false
      }

      return failureCount < 1
    },
  })
}
