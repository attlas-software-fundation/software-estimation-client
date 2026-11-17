import type { ProjectStatus, ProjectType } from "@/enumeration"

export type ReportCountBucket = {
  status: ProjectStatus
  count: number
  share: number
}

export type ReportTypeBucket = {
  type: ProjectType
  count: number
  share: number
}

export type ReportCostBar = {
  projectName: string
  totalCost: number
  share: number
}

export type SystemReportSummary = {
  projectCount: number
  projectsWithEstimation: number
  totalStoryPoints: number
  totalTimeDays: number
  totalCost: number
  projectsByStatus: ReportCountBucket[]
  projectsByType: ReportTypeBucket[]
  costByProject: ReportCostBar[]
}
