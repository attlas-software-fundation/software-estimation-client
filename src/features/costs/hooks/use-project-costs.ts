"use client"

import { useQuery } from "@tanstack/react-query"
import { projectCostQueryOptions } from "./project-cost-query-options"

export { PROJECT_COSTS_QUERY_KEY } from "./query-keys"

export const useProjectCosts = (projectId: string) => {
  return useQuery(projectCostQueryOptions(projectId))
}
