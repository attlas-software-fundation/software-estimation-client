import {
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_VARIANTS,
  PROJECT_TYPE_LABELS,
  RISK_LEVEL_BY_VALUE,
  RISK_LEVEL_LABELS,
  type ProjectStatus,
  type ProjectStatusBadgeVariant,
  type ProjectType,
  type RiskLevel,
} from "@/enumeration"

export type ReportBadgeVariant = ProjectStatusBadgeVariant | "outline"

export const riskLevelLabel = (level: RiskLevel) => RISK_LEVEL_LABELS[level]

export const riskLevelVariant = (level: RiskLevel): ReportBadgeVariant =>
  RISK_LEVEL_BY_VALUE[level].variant

export const projectStatusLabel = (status: ProjectStatus) =>
  PROJECT_STATUS_LABELS[status]

export const projectStatusVariant = (
  status: ProjectStatus
): ReportBadgeVariant => PROJECT_STATUS_VARIANTS[status]

export const projectTypeLabel = (type: ProjectType) => PROJECT_TYPE_LABELS[type]
