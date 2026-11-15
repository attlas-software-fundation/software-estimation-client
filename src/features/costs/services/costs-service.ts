import { apiClient } from "@/lib/api/api-client"
import { adaptProjectCostResponse } from "../adapters/adapt-project-cost-response"
import type { ProjectCostResponse } from "../types/project-cost-response"
import type { ProjectCostSummary } from "../types/project-cost-summary"

export const getProjectCosts = (
  projectId: string,
  signal?: AbortSignal
): Promise<ProjectCostResponse | null | undefined> =>
  apiClient.get<ProjectCostResponse | null | undefined>(
    `/api/v1/project-costs/${encodeURIComponent(projectId)}`,
    { signal }
  )

export const getProjectCostSummary = async (
  projectId: string,
  signal?: AbortSignal
): Promise<ProjectCostSummary> => {
  const response = await getProjectCosts(projectId, signal)

  if (!response) {
    throw new Error(
      "El servidor no devolvió el resumen de costos del proyecto."
    )
  }

  return adaptProjectCostResponse(response)
}

export const costsService = {
  getProjectCosts,
  getProjectCostSummary,
}
