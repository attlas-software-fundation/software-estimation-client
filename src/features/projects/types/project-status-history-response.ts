export interface ProjectStatusHistoryResponse {
  id: string
  previousStatus: string | null
  newStatus: string
  changedAt: string
  changedById: string
  changedByFirstName: string
  changedByLastName: string
  changedByEmail: string
}
