export interface UpdateProjectRequest {
  name: string
  description?: string
  type: string
  startDate: string
  plannedDate: string
  responsibleId: string
}

export type UpdateProjectPayload = {
  projectId: string
  data: UpdateProjectRequest
}
