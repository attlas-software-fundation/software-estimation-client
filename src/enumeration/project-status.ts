export type ProjectStatusDefinition = {
  value: string
  label: string
  variant:
    | "default"
    | "secondary"
    | "destructive"
    | "muted"
    | "success"
    | "warning"
    | "info"
}

export const ProjectStatusEnum = {
  DRAFT: {
    value: "borrador",
    label: "Borrador",
    variant: "muted",
  },
  UNDER_REVIEW: {
    value: "en_evaluacion",
    label: "En evaluación",
    variant: "warning",
  },
  ESTIMATED: {
    value: "estimado",
    label: "Estimado",
    variant: "info",
  },
  APPROVED: {
    value: "aprobado",
    label: "Aprobado",
    variant: "success",
  },
  REJECTED: {
    value: "rechazado",
    label: "Rechazado",
    variant: "destructive",
  },
  IN_PROGRESS: {
    value: "en_ejecucion",
    label: "En ejecución",
    variant: "default",
  },
  COMPLETED: {
    value: "finalizado",
    label: "Finalizado",
    variant: "secondary",
  },
} as const satisfies Record<string, ProjectStatusDefinition>

export const PROJECT_STATUSES = [
  ProjectStatusEnum.DRAFT.value,
  ProjectStatusEnum.UNDER_REVIEW.value,
  ProjectStatusEnum.ESTIMATED.value,
  ProjectStatusEnum.APPROVED.value,
  ProjectStatusEnum.REJECTED.value,
  ProjectStatusEnum.IN_PROGRESS.value,
  ProjectStatusEnum.COMPLETED.value,
] as const

export type ProjectStatus = (typeof PROJECT_STATUSES)[number]

export type ProjectStatusBadgeVariant = ProjectStatusDefinition["variant"]

export const PROJECT_STATUS_LABELS = {
  [ProjectStatusEnum.DRAFT.value]: ProjectStatusEnum.DRAFT.label,
  [ProjectStatusEnum.UNDER_REVIEW.value]: ProjectStatusEnum.UNDER_REVIEW.label,
  [ProjectStatusEnum.ESTIMATED.value]: ProjectStatusEnum.ESTIMATED.label,
  [ProjectStatusEnum.APPROVED.value]: ProjectStatusEnum.APPROVED.label,
  [ProjectStatusEnum.REJECTED.value]: ProjectStatusEnum.REJECTED.label,
  [ProjectStatusEnum.IN_PROGRESS.value]: ProjectStatusEnum.IN_PROGRESS.label,
  [ProjectStatusEnum.COMPLETED.value]: ProjectStatusEnum.COMPLETED.label,
} as const satisfies Record<ProjectStatus, string>

export const PROJECT_STATUS_VARIANTS = {
  [ProjectStatusEnum.DRAFT.value]: ProjectStatusEnum.DRAFT.variant,
  [ProjectStatusEnum.UNDER_REVIEW.value]:
    ProjectStatusEnum.UNDER_REVIEW.variant,
  [ProjectStatusEnum.ESTIMATED.value]: ProjectStatusEnum.ESTIMATED.variant,
  [ProjectStatusEnum.APPROVED.value]: ProjectStatusEnum.APPROVED.variant,
  [ProjectStatusEnum.REJECTED.value]: ProjectStatusEnum.REJECTED.variant,
  [ProjectStatusEnum.IN_PROGRESS.value]: ProjectStatusEnum.IN_PROGRESS.variant,
  [ProjectStatusEnum.COMPLETED.value]: ProjectStatusEnum.COMPLETED.variant,
} as const satisfies Record<ProjectStatus, ProjectStatusBadgeVariant>

export const ProjectStatusApiMap: Record<string, ProjectStatus> = {
  DRAFT: "borrador",
  UNDER_REVIEW: "en_evaluacion",
  ESTIMATED: "estimado",
  APPROVED: "aprobado",
  REJECTED: "rechazado",
  IN_PROGRESS: "en_ejecucion",
  COMPLETED: "finalizado",
}

export const isProjectStatus = (value: string): value is ProjectStatus =>
  PROJECT_STATUSES.some((status) => status === value)

export const toProjectStatus = (value: string): ProjectStatus => {
  if (isProjectStatus(value)) {
    return value
  }
  const fromApi = ProjectStatusApiMap[(value || "").toUpperCase()]
  if (fromApi) {
    return fromApi
  }
  return ProjectStatusEnum.DRAFT.value
}
