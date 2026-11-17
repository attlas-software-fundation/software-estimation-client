import type {
  ProjectStatus,
  ProjectType,
  RiskLevel,
  SprintUnit,
} from "@/enumeration"
import type { FileAttachmentResponse } from "@/features/auth/types"

export type ReportSnapshotDetailResponse = {
  id: string | null
  projectId: string
  projectName: string
  projectStatus: ProjectStatus
  projectType: ProjectType
  projectOwner: string
  baseEffortPoints: number
  totalSprints: number
  totalEffortHours: number
  storiesTotal: number
  storiesWithPoints: number
  tasksTotal: number
  tasksWithHours: number
  baseTime: number
  timeUnit: SprintUnit
  baseCost: number
  riskLevel: RiskLevel
  contingencyMarginPercentage: number
  contingencyTime: number
  contingencyCost: number
  totalTime: number
  totalCost: number
  createdBy: string | null
  createdAt: string | null
  file: FileAttachmentResponse | null
}

export type ReportSnapshot = ReportSnapshotDetailResponse
