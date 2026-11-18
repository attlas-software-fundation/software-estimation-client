import type { ProjectStatus } from "@/enumeration/project-status"

export type ProjectStatusHistoryResponse = {
  id: string
  previousStatus: ProjectStatus | null
  newStatus: ProjectStatus
  changedAt: string
  changedById: string
  changedByFirstName: string
  changedByLastName: string
  changedByEmail: string
}
