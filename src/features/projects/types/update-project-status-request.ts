import type { ProjectStatus } from "@/enumeration/project-status"

export type UpdateProjectStatusRequest = {
  status: ProjectStatus
}

export type UpdateProjectStatusPayload = UpdateProjectStatusRequest & {
  projectId: string
}
