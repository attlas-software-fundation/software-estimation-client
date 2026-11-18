import {
  Calculator,
  CheckCircle,
  Eye,
  FileText,
  Flag,
  PlayCircle,
  XCircle,
  type LucideIcon,
} from "lucide-react"

export type ProjectStatus =
  | "DRAFT"
  | "UNDER_REVIEW"
  | "ESTIMATED"
  | "APPROVED"
  | "REJECTED"
  | "IN_PROGRESS"
  | "COMPLETED"

export type ProjectStatusBadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "muted"
  | "success"
  | "warning"
  | "info"

export type ProjectStatusDefinition = {
  value: ProjectStatus
  label: string
  variant: ProjectStatusBadgeVariant
  icon: LucideIcon
  color: string
}

export const ProjectStatusEnum = {
  DRAFT: {
    value: "DRAFT",
    label: "Borrador",
    variant: "muted",
    icon: FileText,
    color: "text-muted-foreground",
  },
  UNDER_REVIEW: {
    value: "UNDER_REVIEW",
    label: "En evaluación",
    variant: "warning",
    icon: Eye,
    color: "text-amber-500",
  },
  ESTIMATED: {
    value: "ESTIMATED",
    label: "Estimado",
    variant: "info",
    icon: Calculator,
    color: "text-blue-500",
  },
  APPROVED: {
    value: "APPROVED",
    label: "Aprobado",
    variant: "success",
    icon: CheckCircle,
    color: "text-emerald-500",
  },
  REJECTED: {
    value: "REJECTED",
    label: "Rechazado",
    variant: "destructive",
    icon: XCircle,
    color: "text-red-500",
  },
  IN_PROGRESS: {
    value: "IN_PROGRESS",
    label: "En ejecución",
    variant: "default",
    icon: PlayCircle,
    color: "text-cyan-500",
  },
  COMPLETED: {
    value: "COMPLETED",
    label: "Finalizado",
    variant: "secondary",
    icon: Flag,
    color: "text-purple-500",
  },
} as const satisfies Record<ProjectStatus, ProjectStatusDefinition>

export const PROJECT_STATUSES: readonly [ProjectStatus, ...ProjectStatus[]] = [
  ProjectStatusEnum.DRAFT.value,
  ProjectStatusEnum.UNDER_REVIEW.value,
  ProjectStatusEnum.ESTIMATED.value,
  ProjectStatusEnum.APPROVED.value,
  ProjectStatusEnum.REJECTED.value,
  ProjectStatusEnum.IN_PROGRESS.value,
  ProjectStatusEnum.COMPLETED.value,
]

export const PROJECT_STATUS_OPTIONS: ProjectStatusDefinition[] = [
  ProjectStatusEnum.DRAFT,
  ProjectStatusEnum.UNDER_REVIEW,
  ProjectStatusEnum.ESTIMATED,
  ProjectStatusEnum.APPROVED,
  ProjectStatusEnum.REJECTED,
  ProjectStatusEnum.IN_PROGRESS,
  ProjectStatusEnum.COMPLETED,
]

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  DRAFT: ProjectStatusEnum.DRAFT.label,
  UNDER_REVIEW: ProjectStatusEnum.UNDER_REVIEW.label,
  ESTIMATED: ProjectStatusEnum.ESTIMATED.label,
  APPROVED: ProjectStatusEnum.APPROVED.label,
  REJECTED: ProjectStatusEnum.REJECTED.label,
  IN_PROGRESS: ProjectStatusEnum.IN_PROGRESS.label,
  COMPLETED: ProjectStatusEnum.COMPLETED.label,
}

export const PROJECT_STATUS_VARIANTS: Record<
  ProjectStatus,
  ProjectStatusBadgeVariant
> = {
  DRAFT: ProjectStatusEnum.DRAFT.variant,
  UNDER_REVIEW: ProjectStatusEnum.UNDER_REVIEW.variant,
  ESTIMATED: ProjectStatusEnum.ESTIMATED.variant,
  APPROVED: ProjectStatusEnum.APPROVED.variant,
  REJECTED: ProjectStatusEnum.REJECTED.variant,
  IN_PROGRESS: ProjectStatusEnum.IN_PROGRESS.variant,
  COMPLETED: ProjectStatusEnum.COMPLETED.variant,
}

export const isProjectStatus = (value: string): value is ProjectStatus =>
  PROJECT_STATUSES.some((status) => status === value)
