import type { ProjectStatus } from "@/enumeration/project-status"
import type { ProjectType } from "@/enumeration/project-type"
import type { ProjectEstimationResponse } from "@/features/projects"

export type ProjectResponse = {
  id: string
  name: string
  description: string
  type: ProjectType
  startDate: string
  plannedDate: string
  responsibleId: string
  status: ProjectStatus
  createdAt: string
  updatedAt: string | null
  estimations: ProjectEstimationResponse[]
}

export type Project = ProjectResponse
