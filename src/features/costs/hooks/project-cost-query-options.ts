import { queryOptions } from "@tanstack/react-query"
import { ApiError } from "@/lib/api/api-error"
import { adaptProjectCostResponse } from "../adapters/adapt-project-cost-response"
import { getProjectCosts } from "../services/costs-service"
import { projectCostsQueryKey } from "./query-keys"

export const projectCostQueryOptions = (projectId: string) =>
  queryOptions({
    queryKey: projectCostsQueryKey(projectId),
    queryFn: async ({ signal }) =>
      (await getProjectCosts(projectId, signal)) ?? null,
    select: (response) =>
      response ? adaptProjectCostResponse(response) : null,
    enabled: Boolean(projectId.trim()),
    staleTime: 30_000,
    refetchOnWindowFocus: "always",
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status < 500) {
        return false
      }

      return failureCount < 1
    },
  })
