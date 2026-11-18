import type { CreateProjectRequest } from "./create-project-request"

export type UpdateProjectRequest = CreateProjectRequest

export type UpdateProjectPayload = UpdateProjectRequest & {
  projectId: string
}
