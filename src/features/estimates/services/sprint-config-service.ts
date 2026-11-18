import { apiClient } from "@/lib/api"
import type { SprintConfigResponse, UpdateSprintConfigPayload } from "../types"

export const sprintConfigService = {
  getSprintConfig: (projectId: string) =>
    apiClient.get<SprintConfigResponse>(
      `/api/v1/projects/${projectId}/sprint-config`
    ),

  updateSprintConfig: ({ projectId, ...body }: UpdateSprintConfigPayload) =>
    apiClient.put<SprintConfigResponse>(
      `/api/v1/projects/${projectId}/sprint-config`,
      body
    ),
}
