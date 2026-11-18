import { ApiError, apiClient } from "@/lib/api"
import type {
  AiAssignmentResponse,
  AiModelMetricsResponse,
  AiRiskPredictionResponse,
  ProjectContingencyPayload,
  ProjectContingencyResponse,
  RiskConfigResponse,
  UpdateRiskConfigPayload,
} from "../types"

export const riskService = {
  getConfig: async (projectId: string) => {
    try {
      return await apiClient.get<RiskConfigResponse>(
        `/api/v1/projects/${projectId}/risk-config`
      )
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null
      }
      throw error
    }
  },

  updateConfig: ({ projectId, ...body }: UpdateRiskConfigPayload) =>
    apiClient.put<RiskConfigResponse>(
      `/api/v1/projects/${projectId}/risk-config`,
      body
    ),

  calculateContingency: ({ projectId, ...body }: ProjectContingencyPayload) =>
    apiClient.post<ProjectContingencyResponse>(
      `/api/v1/projects/${projectId}/contingency`,
      body
    ),

  predictRisk: (projectId: string) =>
    apiClient.get<AiRiskPredictionResponse>(
      `/api/v1/projects/${projectId}/ai/risk-prediction`
    ),

  getModelMetrics: () =>
    apiClient.get<AiModelMetricsResponse>("/api/v1/ai/models/metrics"),

  optimizeAssignments: (projectId: string) =>
    apiClient.post<AiAssignmentResponse>(
      `/api/v1/projects/${projectId}/ai/optimize-assignments`
    ),
}
