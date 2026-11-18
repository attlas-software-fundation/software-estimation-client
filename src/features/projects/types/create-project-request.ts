import type { ProjectType } from "@/enumeration/project-type"

export type CreateProjectRequest = {
  name: string
  description?: string
  type: ProjectType
  startDate: string
  plannedDate: string
  responsibleId: string
}
