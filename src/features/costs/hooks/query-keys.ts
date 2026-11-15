import type { QueryClient } from "@tanstack/react-query"

export const PROJECT_COSTS_QUERY_KEY = ["project-costs"] as const

export const projectCostsQueryKey = (projectId: string) =>
  [...PROJECT_COSTS_QUERY_KEY, projectId] as const

export const invalidateProjectCosts = (
  queryClient: QueryClient,
  projectId?: string
) =>
  queryClient.invalidateQueries({
    queryKey: projectId
      ? projectCostsQueryKey(projectId)
      : PROJECT_COSTS_QUERY_KEY,
  })
