import {
  PROJECT_STATUS_LABELS,
  type ProjectAction,
  type ProjectStatus,
} from "../types/project-status"

const TRANSITIONS: Record<ProjectStatus, ProjectStatus[]> = {
  DRAFT: ["UNDER_REVIEW"],
  UNDER_REVIEW: ["DRAFT", "ESTIMATED"],
  ESTIMATED: ["UNDER_REVIEW", "APPROVED", "REJECTED"],
  APPROVED: ["IN_PROGRESS"],
  REJECTED: ["DRAFT", "UNDER_REVIEW"],
  IN_PROGRESS: ["COMPLETED"],
  COMPLETED: [],
}

const HINTS: Record<ProjectStatus, string> = {
  DRAFT:
    "Puedes editar los datos generales y el backlog. Pásalo a evaluación para estimar.",
  UNDER_REVIEW:
    "Puedes estimar, ajustar horas, riesgos y guardar reportes. El alcance aún se puede corregir.",
  ESTIMATED:
    "La estimación quedó cerrada. Aprueba o rechaza el proyecto, o vuelve a evaluación.",
  APPROVED:
    "El proyecto fue aprobado. Puedes pasarlo a ejecución y consultar reportes.",
  REJECTED:
    "El proyecto fue rechazado. Vuelve a borrador o evaluación para corregirlo.",
  IN_PROGRESS:
    "El proyecto está en ejecución. Solo consulta y reportes. Al terminar, ciérralo.",
  COMPLETED: "El proyecto está cerrado. Solo se puede consultar.",
}

export const getAllowedTransitions = (status: ProjectStatus): ProjectStatus[] =>
  TRANSITIONS[status]

export const canTransitionStatus = (
  from: ProjectStatus,
  to: ProjectStatus
): boolean => from === to || TRANSITIONS[from].includes(to)

export const canEditGeneral = (status: ProjectStatus) =>
  status === "DRAFT" || status === "REJECTED"

export const canEditBacklog = (status: ProjectStatus) =>
  status === "DRAFT" || status === "UNDER_REVIEW" || status === "REJECTED"

export const canEditEstimation = (status: ProjectStatus) =>
  status === "UNDER_REVIEW"

export const canEditRisks = (status: ProjectStatus) => status === "UNDER_REVIEW"

export const canSaveReport = (status: ProjectStatus) =>
  status === "UNDER_REVIEW" ||
  status === "ESTIMATED" ||
  status === "APPROVED" ||
  status === "IN_PROGRESS"

export const canDeleteProject = (status: ProjectStatus) =>
  status === "DRAFT" || status === "REJECTED"

export const canPerformProjectAction = (
  status: ProjectStatus,
  action: ProjectAction
): boolean => {
  if (action === "editGeneral") {
    return canEditGeneral(status)
  }
  if (action === "editBacklog") {
    return canEditBacklog(status)
  }
  if (action === "editEstimation") {
    return canEditEstimation(status)
  }
  if (action === "editRisks") {
    return canEditRisks(status)
  }
  if (action === "saveReport") {
    return canSaveReport(status)
  }
  return canDeleteProject(status)
}

export const getProjectStatusHint = (status: ProjectStatus) => HINTS[status]

export const getBlockedActionMessage = (
  status: ProjectStatus,
  action: ProjectAction
) => {
  const labels: Record<ProjectAction, string> = {
    editGeneral: "editar los datos del proyecto",
    editBacklog: "modificar historias y tareas",
    editEstimation: "modificar la estimación",
    editRisks: "modificar el riesgo",
    saveReport: "guardar el reporte",
    deleteProject: "eliminar el proyecto",
  }

  return `No puedes ${labels[action]} en estado ${PROJECT_STATUS_LABELS[status]}.`
}

export const getInvalidTransitionMessage = (
  from: ProjectStatus,
  to: ProjectStatus
) =>
  `No puedes pasar de ${PROJECT_STATUS_LABELS[from]} a ${PROJECT_STATUS_LABELS[to]}.`
