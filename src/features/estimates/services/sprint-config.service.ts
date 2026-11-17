import { apiClient } from "@/lib/api"
import { requireProjectAction } from "@/features/projects/utils/require-project-action"
import type { SprintConfig } from "../types"

type SprintConfigApiResponse = {
  velocity: number
  duration: number
  unit: "DAYS" | "WEEKS"
}

const configPath = (projectId: string) =>
  `/api/v1/projects/${projectId}/sprint-config`

const toConfig = (response: SprintConfigApiResponse): SprintConfig => ({
  velocity: response.velocity,
  duration: response.duration,
  unit: response.unit === "WEEKS" ? "semanas" : "dias",
})

export const sprintConfigService = {
  async get(projectId: string): Promise<SprintConfig> {
    const response = await apiClient.get<SprintConfigApiResponse>(
      configPath(projectId)
    )
    return toConfig(response)
  },

  async save(projectId: string, config: SprintConfig): Promise<SprintConfig> {
    await requireProjectAction(projectId, "editEstimation")
    const response = await apiClient.put<SprintConfigApiResponse>(
      configPath(projectId),
      {
        velocity: config.velocity,
        duration: config.duration,
        unit: config.unit === "semanas" ? "WEEKS" : "DAYS",
      }
    )
    return toConfig(response)
  },
}
