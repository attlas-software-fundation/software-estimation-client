import type { ProjectStatus, ProjectType } from "@/enumeration"

export type DashboardStatusBucket = {
  status: ProjectStatus
  count: number
  share: number
}

export type DashboardTypeBucket = {
  type: ProjectType
  count: number
  share: number
}

export type DashboardCostBar = {
  projectName: string
  totalCost: number
  share: number
}

export type DashboardSummary = {
  projectCount: number | null
  projectsWithEstimation: number | null
  totalStoryPoints: number | null
  totalTimeDays: number | null
  totalCost: number | null
  projectsByStatus: DashboardStatusBucket[] | null
  projectsByType: DashboardTypeBucket[] | null
  costByProject: DashboardCostBar[] | null
}
