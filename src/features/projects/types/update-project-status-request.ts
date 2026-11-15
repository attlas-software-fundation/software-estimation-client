export interface UpdateProjectStatusRequest {
  status: string
}

export type UpdateProjectStatusPayload = {
  projectId: string
  status: string
}
