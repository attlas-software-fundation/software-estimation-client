export interface CreateProjectRequest {
  name: string
  description?: string
  type: string
  startDate: string
  plannedDate: string
  responsibleId: string
}
